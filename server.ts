import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/zohoverify/verifyforzoho.html", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send("zb10745607");
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Mohamed Soliman Interactive Chat Endpoint using Gemini
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is missing. Please configure it in your secrets." });
      }

      const { message, context } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message string is required." });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemPrompt = `You are AI Mohamed Soliman — the digital alter-ego of Mohamed Soliman, a Digital Creator, Senior Creative Developer, AI Strategist, and Social Media Architect.
Your personal traits:
- Confident, charismatic, sharp, visionary, and technically sound.
- Core tagline: "I Don't Just Build Websites. I Build Digital Experiences."
- Expertise: Modern Web Architectures (React, TypeScript, Three.js, WebGL Shaders, Tailwind CSS), AI Integration (Gemini, Generative Art, LLMs), Social Media Automation, Brand Growth & Content Strategy.
- Aesthetic: Cinematic Noir Tech, High-contrast, minimal obsidian & cyan glow, precision layout.

Respond as Mohamed himself — direct, articulate, enthusiastic about high-end digital experiences, creative coding, and AI workflows. Keep your responses concise, highly engaging, formatted nicely with markdown bullet points if helpful.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nContext: ${context || 'General inquiry'}\nUser Message: ${message}` }]
          }
        ]
      });

      res.json({
        reply: response.text || "I am currently processing digital workflows. Let's create something extraordinary together."
      });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      res.status(500).json({ error: err?.message || "Failed to communicate with AI engine." });
    }
  });

  // Contact form submission
  app.post("/api/contact", (req, res) => {
    const { name, email, projectType, message } = req.body;
    console.log(`[Contact Form Received] Name: ${name}, Email: ${email}, Type: ${projectType}`);
    res.json({
      success: true,
      message: `Message received! Thank you, ${name}. Mohamed Soliman will get back to you shortly.`
    });
  });

  // Cloudinary Proxy Migration / Upload Endpoint
  app.post("/api/cloudinary/migrate-image", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl || typeof imageUrl !== 'string') {
        return res.status(400).json({ error: "imageUrl is required" });
      }

      const cloudName = "qazdrpcx";
      const uploadPreset = "images_soliman";
      const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      // If already a Cloudinary URL
      if (imageUrl.includes("res.cloudinary.com") || imageUrl.includes("cloudinary.com")) {
        return res.json({
          secure_url: imageUrl,
          status: "already_cloudinary"
        });
      }

      // Send to Cloudinary using unsigned preset
      let cloudRes: Response;
      try {
        const formData = new FormData();
        formData.append("file", imageUrl);
        formData.append("upload_preset", uploadPreset);

        cloudRes = await fetch(cloudinaryEndpoint, {
          method: "POST",
          body: formData,
        });
      } catch (directErr) {
        console.warn("Direct Cloudinary form POST failed, fetching image stream first:", directErr);
        // Fallback: Fetch buffer and send to Cloudinary
        const imgFetch = await fetch(imageUrl);
        if (!imgFetch.ok) {
          throw new Error(`Failed to fetch source image: ${imgFetch.statusText}`);
        }
        const arrayBuffer = await imgFetch.arrayBuffer();
        const blob = new Blob([arrayBuffer]);
        const formData = new FormData();
        formData.append("file", blob);
        formData.append("upload_preset", uploadPreset);
        cloudRes = await fetch(cloudinaryEndpoint, {
          method: "POST",
          body: formData,
        });
      }

      if (!cloudRes.ok) {
        // Try fallback: Fetch buffer and send as blob
        try {
          const imgFetch = await fetch(imageUrl);
          if (imgFetch.ok) {
            const arrayBuffer = await imgFetch.arrayBuffer();
            const blob = new Blob([arrayBuffer]);
            const formData = new FormData();
            formData.append("file", blob);
            formData.append("upload_preset", uploadPreset);
            const retryRes = await fetch(cloudinaryEndpoint, {
              method: "POST",
              body: formData,
            });
            if (retryRes.ok) {
              const retryData = await retryRes.json();
              return res.json({
                success: true,
                secure_url: retryData.secure_url,
                public_id: retryData.public_id,
                format: retryData.format,
                width: retryData.width,
                height: retryData.height,
                bytes: retryData.bytes,
              });
            }
          }
        } catch (retryErr) {
          console.error("Binary fallback also failed:", retryErr);
        }

        const errBody = await cloudRes.text();
        console.error("Cloudinary upload failed:", errBody);
        return res.status(cloudRes.status).json({ error: `Cloudinary error: ${errBody}` });
      }

      const cloudData = await cloudRes.json();
      return res.json({
        success: true,
        secure_url: cloudData.secure_url,
        public_id: cloudData.public_id,
        format: cloudData.format,
        width: cloudData.width,
        height: cloudData.height,
        bytes: cloudData.bytes,
      });
    } catch (err: any) {
      console.error("Server Cloudinary Migration Error:", err);
      return res.status(500).json({ error: err?.message || "Internal server error during Cloudinary upload" });
    }
  });

  // Vite middleware or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
