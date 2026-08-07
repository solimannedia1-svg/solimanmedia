import React from 'react';
import { SiteSettings } from '../types';
import { DEFAULT_SITE_SETTINGS } from '../data/portfolioData';

interface AboutProps {
  siteSettings?: SiteSettings;
}

export const About: React.FC<AboutProps> = ({ siteSettings = DEFAULT_SITE_SETTINGS }) => {
  return (
    <section id="about" className="py-28 px-6 md:px-16 max-w-[1440px] mx-auto border-t border-white/5 relative z-20">
      <div className="grid md:grid-cols-12 gap-12 items-start">
        {/* Section Label */}
        <div className="md:col-span-4 flex flex-col gap-2">
          <span className="font-mono-code text-xs text-[#00daf3] uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00daf3]" />
            ABOUT ME
          </span>
          <h2 className="font-space text-3xl font-bold text-[#e1e3e4] tracking-tight uppercase">
            {siteSettings.aboutHeading || 'ARCHITECTING NEXT-GEN DIGITAL EXPERIENCES'}
          </h2>
        </div>

        {/* Content */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <h3 className="font-space text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e1e3e4] leading-tight">
            I Don't Just Build Websites.<br />
            <span className="text-[#00daf3]">I Build Digital Engines.</span>
          </h3>

          <p className="font-body text-lg text-[#c7c6ca] max-w-2xl leading-relaxed">
            {siteSettings.aboutBio || 'Bridging the gap between engineering and artistry. As a Coder, AI Creative Developer, and Social Media Manager, I craft digital ecosystems that are not only functional but visually striking and highly engaging.'}
          </p>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
            <div className="p-4 rounded-xl bg-[#1d2021] border border-white/10 font-mono-code">
              <span className="text-[#00daf3] text-2xl md:text-3xl font-bold font-space block">
                {siteSettings.yearsExp || '5+'}
              </span>
              <span className="text-[#79797e] text-[10px] uppercase tracking-wider block mt-1">
                YEARS EXPERIENCE
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#1d2021] border border-white/10 font-mono-code">
              <span className="text-[#00daf3] text-2xl md:text-3xl font-bold font-space block">
                {siteSettings.projectsCount || '40+'}
              </span>
              <span className="text-[#79797e] text-[10px] uppercase tracking-wider block mt-1">
                PROJECTS DELIVERED
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#1d2021] border border-white/10 font-mono-code">
              <span className="text-[#00daf3] text-2xl md:text-3xl font-bold font-space block">
                {siteSettings.impressions || '3.5M+'}
              </span>
              <span className="text-[#79797e] text-[10px] uppercase tracking-wider block mt-1">
                MEDIA REACH
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#1d2021] border border-white/10 font-mono-code">
              <span className="text-[#00daf3] text-2xl md:text-3xl font-bold font-space block">
                {siteSettings.clientSatisfaction || '100%'}
              </span>
              <span className="text-[#79797e] text-[10px] uppercase tracking-wider block mt-1">
                CLIENT SUCCESS
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10 glass-card p-6 rounded-xl">
            <div className="flex flex-col gap-1">
              <span className="font-mono-code text-[10px] text-[#79797e] uppercase tracking-wider">
                Name
              </span>
              <span className="font-mono-code text-sm text-[#e1e3e4] font-medium">
                {siteSettings.name}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono-code text-[10px] text-[#79797e] uppercase tracking-wider">
                Role
              </span>
              <span className="font-mono-code text-sm text-[#e1e3e4] font-medium truncate">
                {siteSettings.title}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono-code text-[10px] text-[#79797e] uppercase tracking-wider">
                Location
              </span>
              <span className="font-mono-code text-sm text-[#e1e3e4] font-medium truncate">
                {siteSettings.location}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-mono-code text-[10px] text-[#79797e] uppercase tracking-wider">
                Status
              </span>
              <span className="font-mono-code text-sm text-[#00daf3] flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-pulse" />
                {siteSettings.availability || 'Available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
