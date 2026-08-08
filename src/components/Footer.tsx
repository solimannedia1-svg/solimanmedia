import React from 'react';
import { SocialIcon } from './SocialIcon';
import { DEFAULT_SITE_SETTINGS } from '../data/portfolioData';
import { SiteSettings } from '../types';

interface FooterProps {
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ siteSettings = DEFAULT_SITE_SETTINGS }) => {
  return (
    <footer className="w-full py-16 bg-[#111415] border-t border-white/10 relative z-20 before:absolute before:top-0 before:left-0 before:w-1/3 before:h-[1px] before:bg-[#00daf3] before:animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 gap-8 max-w-[1440px] mx-auto">
        <a href="#" className="font-space text-2xl font-bold text-[#e1e3e4] tracking-tighter hover:text-[#00daf3] transition-colors flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00daf3] animate-pulse" />
          MS.
        </a>

        <p className="font-mono-code text-xs text-[#79797e] text-center md:text-left tracking-wider">
          © {new Date().getFullYear()} MOHAMED SOLIMAN. ENGINEERED FOR EXCELLENCE.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 font-mono-code text-xs uppercase tracking-wider">
          {siteSettings.socialPlatforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#919094] hover:text-[#00daf3] transition-colors interactive flex items-center gap-1"
            >
              <SocialIcon platform={platform} className="w-4 h-4 flex-shrink-0" />
              <span>{platform.name}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
