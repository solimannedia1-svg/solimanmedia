import { Project, SkillCategory, JourneyMilestone, SystemMetric, SiteSettings } from '../types';

export const PORTRAIT_IMAGE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuC0VKUCVZPv-ajubaAy4cV7l2zeUL2bDaLwd8YCyDhtSmMKZwZxL7xvQyHtDbUMQgZHAMPIURkEcysSTYj71PHcXiCSspB9d7T39ALUO60C04v9AIt9rJ6Fsr7yuRFEphGs8KOJz4x1qmK0R7wG9nS8cJqWXKKGR55mSTCirmHW_ltMl010XqMHpqggOMfChrjtS57zrpL9nMyMPuDHUS838HcPboOZvtvpQ8vEud5zbwMkqoEzs3pm6zh2CyTJQ_eHdl0";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: 'MOHAMED SOLIMAN',
  title: 'FULL-STACK ENGINEER & AI CREATIVE STRATEGIST',
  tagline: 'I Build Digital Experiences Where Code, AI & Creativity Meet.',
  bio: 'Bridging the gap between engineering, generative AI, and high-converting social media architecture.',
  portraitUrl: PORTRAIT_IMAGE_URL,
  location: 'Cairo, Egypt / Remote Worldwide',
  availability: 'AVAILABLE FOR SELECT PROJECTS',
  contactEmail: 'soliman@aistudio.dev',
  contactPhone: '+20 100 234 5678',
  adminPassword: 'admin', // Default secure password, editable in Admin Panel Settings
  aboutHeading: 'ARCHITECTING NEXT-GEN DIGITAL EXPERIENCES',
  aboutBio: 'With 5+ years specializing in full-stack engineering, WebGL GLSL shader systems, Gemini AI integration, and digital brand scaling, I engineer platforms that captivate audiences and drive exponential social growth.',
  yearsExp: '5+',
  projectsCount: '40+',
  impressions: '3.5M+',
  clientSatisfaction: '100%',
  socialPlatforms: [
    { id: 'youtube', name: 'YouTube', url: 'https://youtube.com', icon: 'smart_display', color: '#FF0000' },
    { id: 'instagram', name: 'Instagram', url: 'https://instagram.com', icon: 'photo_camera', color: '#E1306C' },
    { id: 'tiktok', name: 'TikTok', url: 'https://tiktok.com', icon: 'movie_edit', color: '#00F2FE' },
    { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com', icon: 'work', color: '#0077B5' },
    { id: 'x', name: 'X / Twitter', url: 'https://x.com', icon: 'tag', color: '#E1E3E4' },
    { id: 'github', name: 'GitHub', url: 'https://github.com', icon: 'terminal', color: '#FFFFFF' }
  ]
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'aura-mind',
    title: 'AURA MIND PLATFORM',
    subtitle: 'Generative Canvas & AI Spatial Intelligence Engine',
    category: 'web-app',
    description: 'An AI-powered spatial web application combining real-time Gemini multimodal vision, generative canvas nodes, and natural audio synthesis for creative directors and UI architects.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['React 19', 'Gemini 3.6 API', 'Three.js', 'Tailwind v4', 'Web App'],
    featured: true,
    metrics: [
      { label: 'Latency', value: '< 120ms' },
      { label: 'Active Users', value: '45,000+' },
      { label: 'AI Engine', value: 'Gemini Multimodal' }
    ],
    liveUrl: 'https://ais-dev-yg337ldzll4ehlsx7jr5zw-250945921547.europe-west1.run.app',
    codeSnippet: `// Gemini 3.6 Multimodal Visual Stream Initialization
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeCanvasFrame(imageBuffer: ArrayBuffer) {
  const result = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      "Analyze spatial arrangement & suggest cinematic color palettes:",
      { inlineData: { data: Buffer.from(imageBuffer).toString("base64"), mimeType: "image/png" } }
    ]
  });
  return result.text;
}`,
    demoType: 'ai-prompt'
  },
  {
    id: 'cybernoir-app',
    title: 'CYBERNOIR ARCHITECTURE',
    subtitle: 'High-Performance WebGL & Fullstack Dashboard',
    category: 'web-app',
    description: 'A full-stack WebGL web application with custom GLSL shaders, telemetry real-time monitoring, and modular dark mode React components.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    tags: ['React 19', 'TypeScript', 'WebGL GLSL', 'Express.js', 'Tailwind v4'],
    featured: true,
    metrics: [
      { label: 'FPS Target', value: '120 FPS' },
      { label: 'Performance', value: '100 / 100' },
      { label: 'Security', value: 'AES-256' }
    ],
    liveUrl: 'https://ais-dev-yg337ldzll4ehlsx7jr5zw-250945921547.europe-west1.run.app',
    codeSnippet: `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec3 black = vec3(0.01, 0.01, 0.02);
    vec3 accent = vec3(0.0, 0.88, 0.99); // Cyan Glow
    float flow = sin(uv.x * 5.0 + u_time * 0.5) * 0.5 + 0.5;
    gl_FragColor = vec4(mix(black, accent, flow * 0.25), 1.0);
}`,
    demoType: 'shader'
  },
  {
    id: 'nexus-brand',
    title: 'NEXUS BRAND & MEDIA SYSTEM',
    subtitle: 'AI Social Media Architecture & Audience Engine',
    category: 'brand-media',
    description: 'An end-to-end automated social media brand strategy platform that parses trending technical topics, generates video scripts, creates visual thumbnails, and schedules multi-channel publishing.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Brand Strategy', 'Social Automation', 'Media Pipelines', 'Analytics'],
    featured: true,
    metrics: [
      { label: 'Engagement Boost', value: '+320%' },
      { label: 'Monthly Reach', value: '1.2M+' },
      { label: 'Channels', value: 'X / LinkedIn / Insta' }
    ],
    liveUrl: '#',
    demoType: 'ui-preview'
  },
  {
    id: 'soliman-media-kit',
    title: 'SOLIMAN CREATIVE IDENTITY',
    subtitle: 'Cinematic Visual Identity & Social Strategy',
    category: 'brand-media',
    description: 'Complete brand positioning and digital creative direction for modern tech influencers, including typography systems, motion identity, and high-converting creative messaging.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    tags: ['Creative Direction', 'Brand Identity', 'Typography', 'Visual Strategy'],
    featured: false,
    metrics: [
      { label: 'Conversion', value: '4.8x' },
      { label: 'Brand Value', value: 'Enterprise' }
    ],
    liveUrl: '#',
    demoType: 'ui-preview'
  },
  {
    id: 'neural-cinema-video',
    title: 'NEURAL CINEMA: AI VIDEO SYNTHESIS',
    subtitle: 'Generative AI Video & Motion Showcase',
    category: 'ai-videos',
    mediaType: 'video',
    aspectRatio: 'reel',
    description: 'Cinematic AI generated video production utilizing advanced text-to-video models, camera motion controls, neural voiceover synthesis, and frame-by-frame upscale enhancement.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['AI Video Generation', 'Sora & Runway', 'Neural Motion', 'Cinematic AI'],
    featured: true,
    metrics: [
      { label: 'Resolution', value: '4K Cinematic' },
      { label: 'Generation Time', value: 'Sub-30s' },
      { label: 'FPS', value: '60 FPS Smooth' }
    ],
    demoType: 'video'
  },
  {
    id: 'cybernetic-realms-video',
    title: 'CYBERNETIC REALMS: AI COMMERCIAL',
    subtitle: 'Futuristic Sci-Fi Generative Commercial',
    category: 'ai-videos',
    mediaType: 'video',
    aspectRatio: 'reel',
    description: 'A concept AI trailer showcasing high-budget sci-fi aesthetics, procedural 3D elements, sound design, and generative AI visual effects created entirely with AI tools.',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tags: ['AI Commercial', 'Gen-2 Video', '3D Neural VFX', 'Generative Audio'],
    featured: true,
    metrics: [
      { label: 'Views', value: '250K+' },
      { label: 'Style', value: 'Cinematic Noir' }
    ],
    demoType: 'video'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    number: '01',
    icon: 'code',
    title: 'DEVELOPMENT & ARCHITECTURE',
    subtitle: 'Frontend Engineering & WebGL Mechanics',
    description: 'Building ultra-fast, responsive web architectures using React 19, TypeScript, Express, Vite, and Three.js. Focused on smooth 120fps interactions and zero layout shift.',
    techs: ['React 19', 'TypeScript', 'Three.js / WebGL', 'Express.js', 'Tailwind CSS', 'Vite / ESBuild'],
    metrics: '120 FPS Rendering • Modular Scalability'
  },
  {
    number: '02',
    icon: 'memory',
    title: 'AI & CREATIVE TECH',
    subtitle: 'Generative AI & Multimodal Workflows',
    description: 'Integrating Google Gemini API, generative visual canvases, prompt engineering, agentic automation, and neural text-to-speech engines into client applications.',
    techs: ['Gemini 3.6 Flash', 'Multimodal Vision', 'Agentic Workflows', 'Prompt Optimization', 'Custom AI Tooling'],
    metrics: 'Sub-150ms Responses • Smart Reasoning'
  },
  {
    number: '03',
    icon: 'campaign',
    title: 'SOCIAL MEDIA & BRAND STRATEGY',
    subtitle: 'Audience Engineering & Content Growth',
    description: 'Crafting viral content architectures, data-driven brand positioning, automated media distribution, and high-converting creative messaging for tech products.',
    techs: ['Social Media Automation', 'Brand Storytelling', 'Viral Mechanics', 'Content Analytics', 'Community Engineering'],
    metrics: '3.5M+ Total Impressions Built'
  },
  {
    number: '04',
    icon: 'palette',
    title: 'CREATIVE DIRECTION & SPATIAL DESIGN',
    subtitle: 'Cinematic Noir UI & Motion Design',
    description: 'Creating dark-mode luxury aesthetics, mathematical typographic hierarchies, glassmorphic elevation, custom WebGL GLSL shaders, and tactile micro-interactions.',
    techs: ['Space Grotesk & Typography', 'GLSL Fragment Shaders', 'Glassmorphic Systems', 'Motion / Animation', 'Design System Architecture'],
    metrics: 'Pixel-Perfect Craftsmanship'
  }
];

export const JOURNEY_MILESTONES: JourneyMilestone[] = [
  {
    year: '2024 - PRESENT',
    role: 'Lead AI Creative Developer & Strategist',
    companyOrProject: 'Independent / Global Consultancies',
    description: 'Architecting next-generation WebGL digital platforms, integrating Gemini API workflows, and leading high-impact social media growth strategies for tech creators.',
    highlights: [
      'Pioneered AI-assisted spatial canvas engines with real-time vision capabilities.',
      'Designed high-contrast Cinematic Noir UI component systems adopted by 10k+ developers.',
      'Grew tech brand social reach by over 300% through automated content distribution pipelines.'
    ],
    tags: ['AI Integration', 'WebGL', 'Brand Growth', 'React 19']
  },
  {
    year: '2022 - 2024',
    role: 'Senior Full-Stack & WebGL Engineer',
    companyOrProject: 'Digital Experience Studios',
    description: 'Engineered high-performance web applications, interactive 3D web experiences using Three.js, and scalable Express backend APIs for international clients.',
    highlights: [
      'Built custom GLSL shader pipelines delivering smooth 120 FPS visual effects.',
      'Reduced initial page payload sizes by 45% using modular ESBuild & Vite bundling.',
      'Mentored frontend engineers on TypeScript best practices and state management.'
    ],
    tags: ['Three.js', 'TypeScript', 'Node.js', 'Performance']
  },
  {
    year: '2020 - 2022',
    role: 'Digital Content Creator & Social Media Manager',
    companyOrProject: 'Tech Creator Ecosystem',
    description: 'Directed digital content production, managed multi-channel brand presence, and engineered viral tech tutorials and creative coding showcases.',
    highlights: [
      'Built a community of over 100,000+ tech enthusiasts across social channels.',
      'Developed automated media workflows for video editing, script generation, and analytics tracking.'
    ],
    tags: ['Social Strategy', 'Video Production', 'Community', 'Analytics']
  }
];

export const SYSTEM_METRICS: SystemMetric[] = [
  {
    label: 'SERVER RUNTIME',
    value: '99.99%',
    status: 'optimal',
    description: 'Cloud Run Container Engine'
  },
  {
    label: 'AI PIPELINE LATENCY',
    value: '84 ms',
    unit: 'ms',
    status: 'optimal',
    description: 'Gemini 3.6 Flash Server Proxy'
  },
  {
    label: 'GRAPHICS RENDER ENGINE',
    value: '120 FPS',
    status: 'active',
    description: 'WebGL 2.0 / Three.js Shaders'
  },
  {
    label: 'PROJECT AVAILABILITY',
    value: 'OPEN',
    status: 'active',
    description: 'Available for Select Creative Collaborations'
  }
];

export const QUICK_PROMPTS = [
  "What is Mohamed Soliman's tech stack and expertise?",
  "How does Mohamed integrate AI into web interfaces?",
  "Tell me about Mohamed's Social Media Management approach.",
  "What project collaboration options are available?",
  "Show me a quick code snippet for a WebGL Shader or Gemini API call."
];
