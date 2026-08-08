import { Project, SkillCategory, JourneyMilestone, SystemMetric, SiteSettings } from '../types';

export const PORTRAIT_IMAGE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuC0VKUCVZPv-ajubaAy4cV7l2zeUL2bDaLwd8YCyDhtSmMKZwZxL7xvQyHtDbUMQgZHAMPIURkEcysSTYj71PHcXiCSspB9d7T39ALUO60C04v9AIt9rJ6Fsr7yuRFEphGs8KOJz4x1qmK0R7wG9nS8cJqWXKKGR55mSTCirmHW_ltMl010XqMHpqggOMfChrjtS57zrpL9nMyMPuDHUS838HcPboOZvtvpQ8vEud5zbwMkqoEzs3pm6zh2CyTJQ_eHdl0";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: 'MOHAMED SOLIMAN',
  title: 'FULL-STACK ENGINEER & AI CREATIVE STRATEGIST',
  tagline: 'I Build Digital Experiences Where Code, AI & Creativity Meet.',
  bio: 'Bridging the gap between engineering, generative AI, and high-converting social media architecture.',
  portraitUrl: PORTRAIT_IMAGE_URL,
  location: 'Portsaid, Egypt / Remote Worldwide',
  availability: 'AVAILABLE FOR SELECT PROJECTS',
  contactEmail: 'soliman@solimanmedia.site',
  contactPhone: '+201099313523',
  adminPassword: '!@#12Bad', // Default secure password, editable in Admin Panel Settings
  aboutHeading: 'ARCHITECTING NEXT-GEN DIGITAL EXPERIENCES',
  aboutBio: 'With 5+ years specializing in full-stack engineering, WebGL GLSL shader systems, Gemini AI integration, and digital brand scaling, I engineer platforms that captivate audiences and drive exponential social growth.',
  yearsExp: '5+',
  projectsCount: '40+',
  impressions: '3.5M+',
  clientSatisfaction: '100%',
  socialPlatforms: [
    { id: 'facebook', name: 'Facebook', url: 'https://facebook.com/solimanmediaofficial', icon: 'facebook', color: '#1877F2' },
    { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/solimanmedia', icon: 'instagram', color: '#E1306C' },
    { id: 'tiktok', name: 'TikTok', url: 'https://tiktok.com/@solimanmedia', icon: 'tiktok', color: '#00F2FE' },
    { id: 'youtube', name: 'YouTube', url: 'https://youtube.com/@solimanmedia', icon: 'youtube', color: '#FF0000' }
  ]
};

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj_1786176852784',
    title: 'CELESTE — Social Media Creative Design',
    subtitle: 'Premium Social Media Visuals for a Modern Café & Restaurant.',
    category: 'brand-media',
    mediaType: 'image',
    aspectRatio: 'landscape',
    description: 'I developed a premium social media design direction for CELESTE, a modern café and restaurant brand. The project focused on creating visually engaging content that reflects the brand’s atmosphere, elevates its digital presence, and maintains a consistent visual language across social media platforms.\n\nThe designs combine elegant typography, refined compositions, carefully selected color palettes, and high-quality visual elements to create a sophisticated and memorable brand presence. Each design was crafted to capture attention, communicate the brand’s offerings clearly, and create a cohesive experience across the entire social media feed.\n',
    image: 'https://i.ibb.co/qYxqGLbz/image.png',
    videoUrl: '',
    tags: ['React', 'AI', 'WebGL'],
    featured: true,
    liveUrl: '#',
    codeSnippet: '',
    metrics: [
      { label: 'Status', value: 'Live' },
      { label: 'Quality', value: 'High Definition' }
    ]
  },
  {
    id: 'proj_1786142543936',
    title: 'MOLOTO — AI-Powered Digital Experience',
    subtitle: 'AI',
    category: 'ai-videos',
    mediaType: 'video',
    aspectRatio: 'reel',
    description: 'A modern digital project created with the power of Artificial Intelligence, combining creative direction, intelligent development, and a refined user experience.\n\nThe project explores how AI can accelerate the creative and development process while maintaining a premium visual identity, intuitive UX, responsive layouts, smooth interactions, and engaging animations.\n\nFrom concept and visual direction to implementation and optimization, MOLOTO was built around a modern AI-first workflow, transforming ideas into a polished and interactive digital experience.\n\nKey Highlights:• AI-Assisted Design & Development• Modern UI/UX• Responsive Experience• Smooth Animations & Transitions• Interactive Micro-Interactions• Creative Visual Direction• AI-Powered Workflow• Performance & Usability Optimization• Desktop & Mobile Experience',
    image: 'https://i.ibb.co/4Z7xY6fx/image.png',
    videoUrl: 'https://youtube.com/shorts/RQEN_d4-tTQ',
    tags: ['React', 'AI', 'WebGL'],
    featured: true,
    liveUrl: '#',
    codeSnippet: '',
    metrics: [
      { label: 'Status', value: 'Live' },
      { label: 'Quality', value: 'High Definition' }
    ]
  },
  {
    id: 'aura-mind',
    title: 'DODO DESIGN - WEBSITE',
    subtitle: 'Custom Web Design & Development',
    category: 'web-app',
    mediaType: 'image',
    aspectRatio: 'landscape',
    description: 'A fully custom website designed and developed from the ground up with a strong focus on UI/UX, modern interactions, and performance.\n\nThe project features a clean and intuitive user experience, responsive layouts, smooth page transitions, interactive elements, hover effects, scroll-based animations, micro-interactions, and dynamic visual components.\n\nEvery detail was carefully designed to create a seamless experience across desktop, tablet, and mobile devices, combining **creative design, advanced frontend development, smooth animations, and strong visual storytelling**.\n\n**Key Highlights:**\n• Custom UI/UX Design\n• Responsive Web Development\n• Smooth Scroll Animations\n• Interactive Hover Effects\n• Micro-Interactions\n• Page Transitions\n• Dynamic Visual Elements\n• Mobile & Desktop Optimization\n• Performance-Focused Development\n• Modern & Clean Interface\n',
    image: 'https://scontent.fcai11-1.fna.fbcdn.net/v/t39.30808-6/759849901_122113594689379413_5411630161315505762_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x2048&ctp=s2048x2048&_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEbpPx7Xf6D8qdBsJG1tcI-Z-31sD0RDkNn7fWwPREOQ21qSPKyZGSAb5SeCfuEBTF6CXH2Jpr37r9dyIqhwJYw&_nc_ohc=4pYxeTK6GCEQ7kNvwFRR9oI&_nc_oc=Adpv37Kyh4upZqJm-pQfu-ifY-dqpoAglP9IeBF7Zy81kV0msqoBI6nMU2o_G4q31g44cawvcAzTjbbfwNQggNmV&_nc_zt=23&_nc_ht=scontent.fcai11-1.fna&_nc_gid=PbAt7qpJN78aZCbDt6WdMw&_nc_ss=782a8&oh=00_AQHuB_RenXtOJKV4QK8EUhVwvBLIk7_ciqSg03d7GNZsMg&oe=6A7C25C0',
    videoUrl: '',
    tags: ['React 19', 'Gemini 3.6 API', 'Three.js', 'Tailwind v4', 'Web App'],
    featured: true,
    liveUrl: 'https://dododesign.shop',
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
    metrics: [
      { label: 'Latency', value: '< 120ms' },
      { label: 'Active Users', value: '45,000+' },
      { label: 'AI Engine', value: 'Gemini Multimodal' }
    ]
  },
  {
    id: 'cybernoir-app',
    title: 'GLOW PRETTY - WEBSITE',
    subtitle: 'High-Performance WebGL & Fullstack Dashboard',
    category: 'web-app',
    mediaType: 'image',
    aspectRatio: 'landscape',
    description: 'A full-stack WebGL web application with custom GLSL shaders, telemetry real-time monitoring, and modular dark mode React components.',
    image: 'https://scontent.fcai11-1.fna.fbcdn.net/v/t39.30808-6/761597576_122114110821379413_5963439306426916378_n.jpg?stp=dst-jpg_tt6&cstp=mx1024x1024&ctp=s1024x1024&_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG01_iymdmnnD96DSu-EXR1uYpSQVM7PEm5ilJBUzs8SYhIBHo-V-_DBCAOgt96wghivXRpGSQr62rSz41SrTPS&_nc_ohc=trllpfql-SMQ7kNvwG17mIi&_nc_oc=AdrFigqsvN0DKNWrhqAW0QpwsZ54gMrYoknnF6cqt9ajpdjfdEcfFkd7jPO_R2udBOqz_l-rjdobtrFHDHd35x-7&_nc_zt=23&_nc_ht=scontent.fcai11-1.fna&_nc_gid=5gkIF8YwuulK-zJM-faYiQ&_nc_ss=782a8&oh=00_AQFlDe4OJjUS2gf_2okJA-jIHcwp7HumcKedv_MVKgRiSA&oe=6A7C2E63',
    videoUrl: '',
    tags: ['React 19', 'TypeScript', 'WebGL GLSL', 'Express.js', 'Tailwind v4'],
    featured: true,
    liveUrl: 'https://glowpretty.site',
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
    metrics: [
      { label: 'FPS Target', value: '120 FPS' },
      { label: 'Performance', value: '100 / 100' },
      { label: 'Security', value: 'AES-256' }
    ]
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
