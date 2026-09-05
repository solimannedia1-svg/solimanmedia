import { Project, SkillCategory, JourneyMilestone, SystemMetric, SiteSettings, GalleryItem } from '../types';

export const PORTRAIT_IMAGE_URL = "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786134/hymqmoufv5bf1vtpp6lo.png";

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    "description": "A memorable meeting with Egyptian actor Mohamed Kilany in 2025. An inspiring encounter filled with positive energy, meaningful conversations, and creative exchange — a moment to remember and a great opportunity to connect with one of Egypt’s talented public figures.",
    "id": "gal_1786227698980",
    "date": "2025",
    "title": "An Inspiring Meeting with Mohamed Kilany",
    "featured": false,
    "videoUrl": "",
    "category": "celebrity",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786144/nrmmphvn1pwzngfoxbmd.png",
    "mediaType": "image",
    "personName": "MOHAMED KELANY",
    "personRole": "Actor"
  },
  {
    "image": "https://youtu.be/RSi2NAPv4qo",
    "mediaType": "video",
    "date": "2024",
    "personRole": " Professional Football Player",
    "featured": false,
    "id": "gal_1786228465272",
    "personName": "Mahmoud abdelhakim",
    "category": "testimonial",
    "videoUrl": "https://youtu.be/RSi2NAPv4qo",
    "description": " A memorable moment featuring Egyptian footballer Mahmoud Abdel Hakim expressing his appreciation and thanks on television. A meaningful recognition that reflects the value of our professional relationship and the impact of our work together.",
    "title": "A Special Appreciation from Mahmoud Abdel Hakim"
  },
  {
    "mediaType": "video",
    "videoUrl": "https://youtube.com/shorts/AnEHT2tA7ZM?feature=share",
    "category": "testimonial",
    "featured": false,
    "personName": "Ahmed El Shenawy",
    "date": "2026",
    "personRole": "Egyptian National Team & Pyramids FC Goalkeeper",
    "title": "A Special Appreciation from Ahmed El Shenawy",
    "image": "https://youtube.com/shorts/AnEHT2tA7ZM?feature=share",
    "id": "gal_1786229352449",
    "description": "A memorable moment featuring Ahmed El Shenawy, goalkeeper of Pyramids FC and the Egyptian National Team, expressing his appreciation and thanks on television. A proud and meaningful recognition that reflects the value of our professional connection and the impact of our work together."
  },
  {
    "mediaType": "video",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786158/cc26zypbaj36jq3dvbm5.jpg",
    "description": "A memorable moment featuring Omar Gaber, captain of Zamalek SC and a distinguished Egyptian international footballer, expressing his appreciation and thanks. A meaningful recognition that reflects a valued professional connection and a memorable moment of mutual respect.",
    "personRole": "Zamalek SC Captain & Egyptian National Team Player",
    "date": "2025",
    "featured": true,
    "title": "A Special Appreciation from Omar Gaber",
    "category": "testimonial",
    "videoUrl": "https://youtube.com/shorts/dONHA0v4svQ?feature=share",
    "id": "gal_1786230635064",
    "personName": "Omar Gaber"
  }
];

export const DEFAULT_BUDGET_OPTIONS = [
  '< $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+'
];

export const DEFAULT_SERVICE_OPTIONS = [
  'Web & AI Architecture',
  '3D WebGL / Interactive Experience',
  'Social Media & Audience Strategy',
  'Full Creative Direction & Consulting'
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  "name": "MOHAMED SOLIMAN",
  "title": "FULL-STACK ENGINEER & AI CREATIVE STRATEGIST",
  "tagline": "I Build Digital Experiences Where Code, AI & Creativity Meet.",
  "bio": "Bridging the gap between engineering, generative AI, and high-converting social media architecture.",
  "portraitUrl": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786134/hymqmoufv5bf1vtpp6lo.png",
  "location": "Portsaid, Egypt / Remote Worldwide",
  "availability": "AVAILABLE FOR SELECT PROJECTS",
  "contactEmail": "soliman@solimanmedia.site",
  "contactPhone": "+201099313523",
  "budgetOptions": [
    "< $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000+"
  ],
  "serviceOptions": [
    "Web & AI Architecture",
    "3D WebGL / Interactive Experience",
    "Social Media & Audience Strategy",
    "Full Creative Direction & Consulting"
  ],
  "adminPassword": "!@#12Bad",
  "aboutHeading": "ARCHITECTING NEXT-GEN DIGITAL EXPERIENCES",
  "aboutBio": "With 5+ years specializing in full-stack engineering, WebGL GLSL shader systems, Gemini AI integration, and digital brand scaling, I engineer platforms that captivate audiences and drive exponential social growth.",
  "yearsExp": "5+",
  "projectsCount": "45+",
  "impressions": "3.5M+",
  "clientSatisfaction": "100%",
  "socialPlatforms": [
    {
      "icon": "facebook",
      "color": "#1877F2",
      "id": "facebook",
      "name": "Facebook",
      "url": "https://facebook.com/solimanmediaofficial"
    },
    {
      "id": "instagram",
      "name": "Instagram",
      "url": "https://instagram.com/solimanmedia",
      "color": "#E1306C",
      "icon": "instagram"
    }
  ],
  "galleryItems": [
    {
      "description": "A memorable meeting with Egyptian actor Mohamed Kilany in 2025. An inspiring encounter filled with positive energy, meaningful conversations, and creative exchange — a moment to remember and a great opportunity to connect with one of Egypt’s talented public figures.",
      "id": "gal_1786227698980",
      "date": "2025",
      "title": "An Inspiring Meeting with Mohamed Kilany",
      "featured": false,
      "videoUrl": "",
      "category": "celebrity",
      "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786144/nrmmphvn1pwzngfoxbmd.png",
      "mediaType": "image",
      "personName": "MOHAMED KELANY",
      "personRole": "Actor"
    },
    {
      "image": "https://youtu.be/RSi2NAPv4qo",
      "mediaType": "video",
      "date": "2024",
      "personRole": " Professional Football Player",
      "featured": false,
      "id": "gal_1786228465272",
      "personName": "Mahmoud abdelhakim",
      "category": "testimonial",
      "videoUrl": "https://youtu.be/RSi2NAPv4qo",
      "description": " A memorable moment featuring Egyptian footballer Mahmoud Abdel Hakim expressing his appreciation and thanks on television. A meaningful recognition that reflects the value of our professional relationship and the impact of our work together.",
      "title": "A Special Appreciation from Mahmoud Abdel Hakim"
    },
    {
      "mediaType": "video",
      "videoUrl": "https://youtube.com/shorts/AnEHT2tA7ZM?feature=share",
      "category": "testimonial",
      "featured": false,
      "personName": "Ahmed El Shenawy",
      "date": "2026",
      "personRole": "Egyptian National Team & Pyramids FC Goalkeeper",
      "title": "A Special Appreciation from Ahmed El Shenawy",
      "image": "https://youtube.com/shorts/AnEHT2tA7ZM?feature=share",
      "id": "gal_1786229352449",
      "description": "A memorable moment featuring Ahmed El Shenawy, goalkeeper of Pyramids FC and the Egyptian National Team, expressing his appreciation and thanks on television. A proud and meaningful recognition that reflects the value of our professional connection and the impact of our work together."
    },
    {
      "mediaType": "video",
      "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786158/cc26zypbaj36jq3dvbm5.jpg",
      "description": "A memorable moment featuring Omar Gaber, captain of Zamalek SC and a distinguished Egyptian international footballer, expressing his appreciation and thanks. A meaningful recognition that reflects a valued professional connection and a memorable moment of mutual respect.",
      "personRole": "Zamalek SC Captain & Egyptian National Team Player",
      "date": "2025",
      "featured": true,
      "title": "A Special Appreciation from Omar Gaber",
      "category": "testimonial",
      "videoUrl": "https://youtube.com/shorts/dONHA0v4svQ?feature=share",
      "id": "gal_1786230635064",
      "personName": "Omar Gaber"
    }
  ]
};

export const PROJECTS_DATA: Project[] = [
  {
    "description": "🚀 A Next-Level Digital Portfolio for Osama Azab.\n\nWhere football legacy meets premium digital experience. ⚽✨\nDesigned with a modern, powerful, and fully responsive vision.\n",
    "aspectRatio": "landscape",
    "featured": true,
    "mediaType": "image",
    "subtitle": "Profile",
    "title": "Osama Azab - Digital Portfolio",
    "category": "web-app",
    "videoUrl": "",
    "codeSnippet": "",
    "tags": [
      "React",
      "AI",
      "WebGL"
    ],
    "id": "proj_1788602329816",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1788602413/kubmq4gc5l8aj9rwx22k.jpg",
    "liveUrl": "https://osamaazab.site",
    "metrics": [
      {
        "value": "120 FPS",
        "label": "FPS TARGET"
      },
      {
        "value": "100 / 100",
        "label": "PERFORMANCE"
      },
      {
        "value": "AES-256",
        "label": "SECURITY"
      }
    ]
  },
  {
    "codeSnippet": "",
    "title": "DIGITAL PASSPORT — One QR. Everything connected. ✦",
    "tags": [
      "React",
      "AI",
      "WebGL"
    ],
    "id": "proj_1788602208025",
    "aspectRatio": "landscape",
    "description": "A smart digital passport designed to bring everything together in one seamless experience.\n\nWith a single QR code, users can instantly access essential information, social media profiles, contact details, and digital links — all from one beautifully designed and easy-to-use platform.\n\nA modern solution that transforms a simple QR code into a complete digital identity.\n",
    "mediaType": "image",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1788602294/dg6mvyxtylvw7y9xpy2p.jpg",
    "liveUrl": "https://daby-psi.vercel.app/",
    "videoUrl": "",
    "category": "brand-media",
    "featured": true,
    "metrics": [
      {
        "value": "120 FPS",
        "label": "FPS TARGET"
      },
      {
        "value": "100 / 100",
        "label": "PERFORMANCE"
      },
      {
        "value": "AES-256",
        "label": "SECURITY"
      }
    ],
    "subtitle": "one QrCode"
  },
  {
    "codeSnippet": "",
    "category": "web-app",
    "videoUrl": "",
    "featured": true,
    "subtitle": "A Modern Digital Experience, Crafted with Precision",
    "id": "proj_1788602033133",
    "aspectRatio": "landscape",
    "description": "A professionally designed and developed digital experience, crafted from scratch with a strong focus on modern UI/UX, performance, responsiveness, and a seamless user experience across all devices.\n\nThe project combines a clean visual identity with practical functionality, creating a polished and engaging online presence tailored to the brand's needs.\n\nDesigned & Developed by Soliman Media.\n",
    "title": "DABY SHOES - WEBSITE",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1788602155/qshttzdblke51gpzx3m0.jpg",
    "tags": [
      "React",
      "AI",
      "WebGL"
    ],
    "liveUrl": "https://daby.shop",
    "metrics": [
      {
        "value": "120 FPS",
        "label": "FPS TARGET"
      },
      {
        "value": "100 / 100",
        "label": "PERFORMANCE"
      },
      {
        "value": "AES-256",
        "label": "SECURITY"
      }
    ],
    "mediaType": "image"
  },
  {
    "featured": true,
    "subtitle": "",
    "category": "web-app",
    "videoUrl": "",
    "liveUrl": "https://touza.shop",
    "title": "TOUZA STORE - WEBSITE",
    "metrics": [
      {
        "value": "120 FPS",
        "label": "FPS TARGET"
      },
      {
        "value": "100 / 100",
        "label": "PERFORMANCE"
      },
      {
        "value": "AES-256",
        "label": "SECURITY"
      }
    ],
    "codeSnippet": "",
    "id": "proj_1787047088837",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1787047217/jwppvtuwznxrpadzyjrp.jpg",
    "tags": [
      "React",
      "AI",
      "WebGL"
    ],
    "aspectRatio": "landscape",
    "description": "TOUZA — E-Commerce Website\n\nA complete e-commerce experience built for TOUZA Men’s Wear, combining premium aesthetics with a smooth, modern shopping experience.\nFrom a powerful visual identity to a fully responsive shopping interface, every detail was designed to make the brand feel premium, confident, and built to sell.\n\nWhat’s included:\n•⁠  ⁠Modern & responsive design\n•⁠  ⁠Arabic & English experience\n•⁠  ⁠Product catalog & categories\n•⁠  ⁠Smart navigation & filtering\n•⁠  ⁠Secure checkout experience\n•⁠  ⁠Order management & tracking\n•⁠  ⁠Mobile-first shopping experience\n•⁠  ⁠Professional admin dashboard\n",
    "mediaType": "image"
  },
  {
    "featured": true,
    "tags": [
      "React",
      "AI",
      "WebGL"
    ],
    "subtitle": "Creative Video Content for a Modern Café & Restaurant",
    "id": "proj_1786227330673",
    "codeSnippet": "",
    "category": "ai-videos",
    "videoUrl": "https://www.youtube.com/shorts/4lICZTAv6zU",
    "description": "A creative social media video project developed for BOKHAREST, focusing on creating engaging visual content that reflects the brand’s bold and premium identity.\n\nThe video was designed to capture attention, showcase the café and restaurant experience, and communicate the brand’s atmosphere through dynamic visuals, creative editing, typography, motion, and carefully crafted visual storytelling.\n\nThe project combines creative direction, cinematic visuals, smooth transitions, motion graphics, and social-media-focused editing to create a compelling digital experience that strengthens BOKHAREST’s presence across social platforms.\n",
    "aspectRatio": "reel",
    "mediaType": "video",
    "title": "BOKHAREST — Social Media Video",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786136/zi8jt9mbswp7elpg5d8t.jpg",
    "liveUrl": "#",
    "metrics": [
      {
        "label": "FPS TARGET",
        "value": "120 FPS"
      },
      {
        "value": "100 / 100",
        "label": "PERFORMANCE"
      },
      {
        "label": "SECURITY",
        "value": "AES-256"
      }
    ]
  },
  {
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786137/ouglcebbzx797ob6bwdb.png",
    "featured": true,
    "subtitle": "Premium Social Media Visuals for a Modern Café & Restaurant",
    "id": "proj_1786227099263",
    "tags": [
      "React",
      "AI",
      "WebGL"
    ],
    "category": "brand-media",
    "videoUrl": "",
    "liveUrl": "#",
    "codeSnippet": "",
    "metrics": [
      {
        "label": "FPS TARGET",
        "value": "120 FPS"
      },
      {
        "value": "100 / 100",
        "label": "PERFORMANCE"
      },
      {
        "label": "SECURITY",
        "value": "AES-256"
      }
    ],
    "title": "BOKHAREST — Social Media Design",
    "aspectRatio": "landscape",
    "description": "A complete social media design project created for BOKHAREST, focusing on building a bold, premium, and visually consistent digital presence for the café and restaurant.\nThe project includes creative social media visuals designed to showcase the brand’s atmosphere, products, offers, and special occasions while maintaining a strong and recognizable visual identity across the content.\nThe designs combine creative art direction, sophisticated compositions, typography, color treatment, and high-quality visual elements to create engaging content that captures attention and strengthens the brand’s presence across social media platforms.",
    "mediaType": "image"
  },
  {
    "aspectRatio": "landscape",
    "description": "I developed a premium social media design direction for CELESTE, a modern café and restaurant brand. The project focused on creating visually engaging content that reflects the brand’s atmosphere, elevates its digital presence, and maintains a consistent visual language across social media platforms.\n\nThe designs combine elegant typography, refined compositions, carefully selected color palettes, and high-quality visual elements to create a sophisticated and memorable brand presence. Each design was crafted to capture attention, communicate the brand’s offerings clearly, and create a cohesive experience across the entire social media feed.\n",
    "mediaType": "image",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786138/jdkp7znqi7hs4ivol5u8.png",
    "codeSnippet": "",
    "category": "brand-media",
    "videoUrl": "",
    "subtitle": "Premium Social Media Visuals for a Modern Café & Restaurant.",
    "featured": true,
    "tags": [
      "React",
      "AI",
      "WebGL"
    ],
    "title": "CELESTE — Social Media Creative Design",
    "id": "proj_1786176852784",
    "metrics": [
      {
        "value": "Live",
        "label": "Status"
      },
      {
        "label": "Quality",
        "value": "High Definition"
      }
    ],
    "liveUrl": "#"
  },
  {
    "id": "proj_1786142543936",
    "aspectRatio": "reel",
    "description": "A modern digital project created with the power of Artificial Intelligence, combining creative direction, intelligent development, and a refined user experience.\n\nThe project explores how AI can accelerate the creative and development process while maintaining a premium visual identity, intuitive UX, responsive layouts, smooth interactions, and engaging animations.\n\nFrom concept and visual direction to implementation and optimization, MOLOTO was built around a modern AI-first workflow, transforming ideas into a polished and interactive digital experience.\n\nKey Highlights:• AI-Assisted Design & Development• Modern UI/UX• Responsive Experience• Smooth Animations & Transitions• Interactive Micro-Interactions• Creative Visual Direction• AI-Powered Workflow• Performance & Usability Optimization• Desktop & Mobile Experience",
    "featured": true,
    "liveUrl": "#",
    "subtitle": "AI",
    "metrics": [
      {
        "label": "Status",
        "value": "Live"
      },
      {
        "value": "High Definition",
        "label": "Quality"
      }
    ],
    "videoUrl": "https://youtube.com/shorts/RQEN_d4-tTQ",
    "category": "ai-videos",
    "title": "MOLOTO — AI-Powered Digital Experience",
    "mediaType": "video",
    "codeSnippet": "",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786139/kr8cde9vmc9n3nq5qoyl.png",
    "tags": [
      "React",
      "AI",
      "WebGL"
    ]
  },
  {
    "liveUrl": "https://dododesign.shop",
    "metrics": [
      {
        "label": "Latency",
        "value": "< 120ms"
      },
      {
        "label": "Active Users",
        "value": "45,000+"
      },
      {
        "label": "AI Engine",
        "value": "Multimodal"
      }
    ],
    "codeSnippet": "// Gemini 3.6 Multimodal Visual Stream Initialization\nconst ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });\n\nasync function analyzeCanvasFrame(imageBuffer: ArrayBuffer) {\n  const result = await ai.models.generateContent({\n    model: \"gemini-3.6-flash\",\n    contents: [\n      \"Analyze spatial arrangement & suggest cinematic color palettes:\",\n      { inlineData: { data: Buffer.from(imageBuffer).toString(\"base64\"), mimeType: \"image/png\" } }\n    ]\n  });\n  return result.text;\n}",
    "mediaType": "image",
    "category": "web-app",
    "videoUrl": "",
    "featured": true,
    "title": "DODO DESIGN - WEBSITE",
    "description": "A fully custom website designed and developed from the ground up with a strong focus on UI/UX, modern interactions, and performance.\n\nThe project features a clean and intuitive user experience, responsive layouts, smooth page transitions, interactive elements, hover effects, scroll-based animations, micro-interactions, and dynamic visual components.\n\nEvery detail was carefully designed to create a seamless experience across desktop, tablet, and mobile devices, combining **creative design, advanced frontend development, smooth animations, and strong visual storytelling**.\n\n**Key Highlights:**\n• Custom UI/UX Design\n• Responsive Web Development\n• Smooth Scroll Animations\n• Interactive Hover Effects\n• Micro-Interactions\n• Page Transitions\n• Dynamic Visual Elements\n• Mobile & Desktop Optimization\n• Performance-Focused Development\n• Modern & Clean Interface\n",
    "aspectRatio": "landscape",
    "subtitle": "Custom Web Design & Development",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786143/t0fl4q39nkxk7hlhpaeb.jpg",
    "tags": [
      "React 19",
      "Gemini 3.6 API",
      "Three.js",
      "Tailwind v4",
      "Web App"
    ],
    "id": "aura-mind"
  },
  {
    "title": "GLOW PRETTY - WEBSITE",
    "description": "A full-stack WebGL web application with custom GLSL shaders, telemetry real-time monitoring, and modular dark mode React components.",
    "aspectRatio": "landscape",
    "subtitle": "High-Performance WebGL & Fullstack Dashboard",
    "codeSnippet": "precision highp float;\nuniform float u_time;\nuniform vec2 u_resolution;\n\nvoid main() {\n    vec2 uv = gl_FragCoord.xy / u_resolution;\n    vec3 black = vec3(0.01, 0.01, 0.02);\n    vec3 accent = vec3(0.0, 0.88, 0.99); // Cyan Glow\n    float flow = sin(uv.x * 5.0 + u_time * 0.5) * 0.5 + 0.5;\n    gl_FragColor = vec4(mix(black, accent, flow * 0.25), 1.0);\n}",
    "tags": [
      "React 19",
      "TypeScript",
      "WebGL GLSL",
      "Express.js",
      "Tailwind v4"
    ],
    "featured": true,
    "category": "web-app",
    "videoUrl": "",
    "id": "cybernoir-app",
    "mediaType": "image",
    "metrics": [
      {
        "value": "120 FPS",
        "label": "FPS Target"
      },
      {
        "label": "Performance",
        "value": "100 / 100"
      },
      {
        "value": "AES-256",
        "label": "Security"
      }
    ],
    "liveUrl": "https://glowpretty.site",
    "image": "https://res.cloudinary.com/qazdrpcx/image/upload/v1786786141/l2ltu9eirc5fb4wpfly0.jpg"
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
