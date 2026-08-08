export interface SocialPlatform {
  id: string;
  name: string;
  url: string;
  icon: string;
  color?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  personName?: string;
  personRole?: string;
  category: 'celebrity' | 'testimonial' | 'event' | 'press';
  mediaType: 'image' | 'video';
  image: string;
  videoUrl?: string;
  description: string;
  date?: string;
  featured?: boolean;
}

export interface SiteSettings {
  // Personal & Hero Info
  name: string;
  title: string;
  tagline: string;
  bio: string;
  portraitUrl: string;
  location: string;
  availability: string;
  
  // Direct Contact
  contactEmail: string;
  contactPhone: string;
  
  // Security
  adminPassword: string;

  // About Section CMS
  aboutHeading?: string;
  aboutBio?: string;
  yearsExp?: string;
  projectsCount?: string;
  impressions?: string;
  clientSatisfaction?: string;

  // Platforms & Skills & Journey & Gallery CMS Data
  socialPlatforms: SocialPlatform[];
  skillCategories?: SkillCategory[];
  journeyMilestones?: JourneyMilestone[];
  galleryItems?: GalleryItem[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'web-app' | 'brand-media' | 'ai-videos';
  description: string;
  image: string;
  videoUrl?: string;
  mediaType?: 'image' | 'video';
  tags: string[];
  featured?: boolean;
  metrics?: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl?: string;
  codeSnippet?: string;
  demoType?: 'video' | 'shader' | '3d-mesh' | 'ui-preview' | 'ai-prompt';
  aspectRatio?: 'reel' | 'landscape';
}

export interface SkillCategory {
  number: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  techs: string[];
  metrics: string;
}

export interface JourneyMilestone {
  year: string;
  role: string;
  companyOrProject: string;
  description: string;
  highlights: string[];
  tags: string[];
}

export interface SystemMetric {
  label: string;
  value: string;
  unit?: string;
  status: 'optimal' | 'warning' | 'active';
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}
