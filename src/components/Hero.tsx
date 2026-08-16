import React, { useState } from 'react';
import { Mail, Phone, ArrowUpRight, ArrowRight, Bot, CheckCircle2, Copy, Check } from 'lucide-react';
import { TechEcosystem3D } from './TechEcosystem3D';
import { SocialIcon } from './SocialIcon';
import { PORTRAIT_IMAGE_URL, DEFAULT_SITE_SETTINGS } from '../data/portfolioData';
import { SiteSettings } from '../types';
import { getOptimizedCloudinaryUrl } from '../utils/cloudinary';

interface HeroProps {
  onAiTalkClick: () => void;
  siteSettings?: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({ onAiTalkClick, siteSettings = DEFAULT_SITE_SETTINGS }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <header className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#111415]/70 to-[#111415] pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 md:px-16 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Bio */}
        <div className="lg:col-span-7 flex flex-col gap-6 pt-8 lg:pt-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e3fd] animate-pulse shadow-[0_0_10px_#00e3fd]" />
            <span className="font-mono-code text-xs text-[#00e3fd] tracking-[0.2em] uppercase font-semibold">
              {siteSettings.title}
            </span>
          </div>

          <h1 className="font-space text-5xl sm:text-7xl lg:text-8xl font-bold text-[#e1e3e4] uppercase leading-[0.95] tracking-tight glow-text">
            {siteSettings.name.split(' ')[0]}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e1e3e4] via-[#00daf3] to-[#e1e3e4]">
              {siteSettings.name.split(' ').slice(1).join(' ') || ''}
            </span>
          </h1>

          <p className="font-space text-xl md:text-2xl text-[#c7c6ca] max-w-xl font-medium leading-relaxed">
            {siteSettings.tagline}
          </p>

          <p className="font-body text-sm md:text-base text-[#919094] max-w-xl leading-relaxed">
            {siteSettings.bio}
          </p>

          {/* Quick Direct Contact Cards (Email & Phone) */}
          <div className="flex flex-wrap items-center gap-3 py-2">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1d2021] border border-[#00daf3]/30 text-xs font-mono-code shadow-md hover:border-[#00daf3] transition-all">
              <Mail className="w-4 h-4 text-[#00daf3] shrink-0" />
              <a href={`mailto:${siteSettings.contactEmail}`} className="text-[#e1e3e4] hover:text-[#00daf3] transition-colors font-semibold">
                {siteSettings.contactEmail}
              </a>
              <button
                onClick={() => handleCopy(siteSettings.contactEmail, 'Email')}
                className="ml-1 text-[10px] text-[#79797e] hover:text-[#00daf3] transition-colors uppercase font-bold"
                title="Copy Email Address"
              >
                {copied === 'Email' ? 'COPIED!' : 'COPY'}
              </button>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1d2021] border border-[#00daf3]/30 text-xs font-mono-code shadow-md hover:border-[#00daf3] transition-all">
              <Phone className="w-4 h-4 text-green-400 shrink-0" />
              <a href={`tel:${siteSettings.contactPhone.replace(/\s+/g, '')}`} className="text-[#e1e3e4] hover:text-[#00daf3] transition-colors font-semibold">
                {siteSettings.contactPhone}
              </a>
              <button
                onClick={() => handleCopy(siteSettings.contactPhone, 'Phone')}
                className="ml-1 text-[10px] text-[#79797e] hover:text-[#00daf3] transition-colors uppercase font-bold"
                title="Copy Phone Number"
              >
                {copied === 'Phone' ? 'COPIED!' : 'COPY'}
              </button>
            </div>
          </div>

          {/* Social Platforms Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-code text-[11px] text-[#79797e] uppercase font-bold mr-1">SOCIAL:</span>
            {siteSettings.socialPlatforms.map((platform) => (
              <a
                key={platform.id}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171a1b] border border-white/10 hover:border-[#00daf3] transition-all text-xs font-mono-code text-[#c7c6ca] hover:text-white group shadow-sm"
                title={`Visit Mohamed Soliman on ${platform.name}`}
              >
                <SocialIcon platform={platform} className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">{platform.name}</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a
              href="#work"
              className="btn-primary px-8 py-4 font-mono-code text-xs tracking-wider uppercase rounded interactive font-bold flex items-center gap-2 group"
            >
              <span>VIEW MY WORK</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <button
              onClick={onAiTalkClick}
              className="px-8 py-4 font-mono-code text-xs tracking-wider text-[#00daf3] border border-[#00daf3]/50 hover:bg-[#00daf3]/10 transition-colors rounded uppercase interactive flex items-center gap-2 font-bold glass-card"
            >
              <Bot className="w-4 h-4 animate-pulse text-[#00daf3]" />
              <span>TALK TO AI MOHAMED</span>
            </button>

            <a
              href="#contact"
              className="px-6 py-4 font-mono-code text-xs tracking-wider text-[#c7c6ca] border border-white/10 hover:border-[#00daf3]/50 hover:text-[#00daf3] transition-colors rounded uppercase interactive"
            >
              LET'S CONNECT
            </a>
          </div>

          {/* Quick Stats Pill */}
          <div className="pt-6 flex flex-wrap gap-8 border-t border-white/5 font-mono-code text-xs">
            <div>
              <div className="text-[#79797e] uppercase">FOCUS</div>
              <div className="text-[#e1e3e4] font-semibold mt-0.5">3D WebGL &amp; AI Agents</div>
            </div>
            <div>
              <div className="text-[#79797e] uppercase">AVAILABILITY</div>
              <div className="text-[#00e3fd] font-semibold mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e3fd]" />
                {siteSettings.availability || 'Select Collaborations'}
              </div>
            </div>
            <div>
              <div className="text-[#79797e] uppercase">LOCATION</div>
              <div className="text-[#e1e3e4] font-semibold mt-0.5">{siteSettings.location}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Canvas & Portrait Card */}
        <div className="lg:col-span-5 relative h-[500px] lg:h-[680px] flex items-center justify-center">
          {/* 3D Tech Nodes Scene in Background */}
          <div className="absolute inset-0 w-full h-full opacity-60 pointer-events-auto">
            <TechEcosystem3D nodeCount={24} rotationSpeed={0.0025} />
          </div>

          {/* Portrait Glass Card Container */}
          <div className="relative z-10 w-full max-w-sm aspect-[3/4] glass-card rounded-2xl overflow-hidden group border border-white/10 hover:border-[#00daf3]/40 transition-all duration-700 shadow-2xl interactive">
            {/* Hotlinked Image matching specs */}
            <img
              src={getOptimizedCloudinaryUrl(siteSettings.portraitUrl || PORTRAIT_IMAGE_URL, { width: 800, quality: 'auto' })}
              alt={`${siteSettings.name} Portrait`}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-active:grayscale-0 group-active:opacity-100 group-focus:grayscale-0 group-focus:opacity-100 scale-100 group-hover:scale-105 transition-all duration-700"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111415] via-[#111415]/30 to-transparent" />

            {/* Bottom Floating Info Badge */}
            <div className="absolute bottom-6 left-6 right-6 p-4 glass-card rounded-xl border border-white/10 backdrop-blur-md flex items-center justify-between">
              <div>
                <div className="font-space text-sm font-bold text-[#e1e3e4]">Mohamed Soliman</div>
                <div className="font-mono-code text-[11px] text-[#00daf3]">Digital Creator • Developer</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#00daf3]/10 border border-[#00daf3]/40 flex items-center justify-center text-[#00daf3]">
                <CheckCircle2 className="w-4 h-4 text-[#00daf3]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
