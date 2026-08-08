import React from 'react';

interface AITool {
  name: string;
  category: string;
  icon: string;
  color: string;
}

export const Marquee: React.FC = () => {
  const row1Tools: AITool[] = [
    { name: 'GEMINI 3.6 FLASH', category: 'Google GenAI', icon: 'auto_awesome', color: '#00daf3' },
    { name: 'MIDJOURNEY V6', category: 'Generative Art', icon: 'palette', color: '#a855f7' },
    { name: 'SORA OPENAI', category: 'AI Video', icon: 'movie', color: '#10b981' },
    { name: 'RUNWAY GEN-3', category: 'Motion Video', icon: 'video_settings', color: '#f59e0b' },
    { name: 'ELEVENLABS', category: 'Voice Synthesis', icon: 'graphic_eq', color: '#ec4899' },
    { name: 'CLAUDE 3.5 SONNET', category: 'AI Architect', icon: 'psychology', color: '#fb923c' },
  ];

  const row2Tools: AITool[] = [
    { name: 'CHATGPT 4o', category: 'Multimodal', icon: 'chat', color: '#10b981' },
    { name: 'STABLE DIFFUSION', category: 'Neural Canvas', icon: 'brush', color: '#3b82f6' },
    { name: 'PHOTOSHOP AI', category: 'Generative Fill', icon: 'edit_square', color: '#00daf3' },
    { name: 'COMFYUI PIPELINES', category: 'AI Workflows', icon: 'account_tree', color: '#8b5cf6' },
    { name: 'FLUX.1 DEV', category: 'Image Synthesis', icon: 'auto_fix_high', color: '#e11d48' },
    { name: 'LUMA DREAM MACHINE', category: '3D & Motion', icon: '3d_rotation', color: '#06b6d4' },
  ];

  const renderToolCard = (tool: AITool, key: string | number) => (
    <div
      key={key}
      className="group relative flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#0f1315]/90 border border-white/10 hover:border-[#00daf3]/60 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,218,243,0.25)] flex-shrink-0 cursor-pointer overflow-hidden"
    >
      {/* Background Subtle Gradient Halo on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${tool.color} 0%, transparent 70%)`
        }}
      />

      {/* Shimmer Line Overlay */}
      <div className="absolute -inset-x-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shimmer pointer-events-none" />

      {/* Glowing Icon Container */}
      <div
        className="relative w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all duration-300 shadow-inner flex-shrink-0"
        style={{
          backgroundColor: `${tool.color}15`,
        }}
      >
        <span
          className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          style={{ color: tool.color }}
        >
          {tool.icon}
        </span>
        <span
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-40 blur-md transition-opacity duration-300"
          style={{ backgroundColor: tool.color }}
        />
      </div>

      {/* Text Details */}
      <div className="flex flex-col">
        <span className="font-space text-xs font-bold text-[#e1e3e4] group-hover:text-white transition-colors tracking-wide flex items-center gap-1.5">
          {tool.name}
          <span className="w-1 h-1 rounded-full bg-[#00daf3] opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
        <span className="font-mono-code text-[10px] text-[#79797e] group-hover:text-[#00daf3] transition-colors tracking-wider uppercase">
          {tool.category}
        </span>
      </div>
    </div>
  );

  return (
    <section className="w-full py-10 overflow-hidden bg-[#080a0b] border-y border-white/10 relative z-20 backdrop-blur-xl">
      {/* Ambient Side Gradient Fades for Smooth Edges */}
      <div className="absolute left-0 top-0 w-28 sm:w-48 h-full bg-gradient-to-r from-[#080a0b] via-[#080a0b]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-28 sm:w-48 h-full bg-gradient-to-l from-[#080a0b] via-[#080a0b]/80 to-transparent z-10 pointer-events-none" />

      {/* Top Header Badge */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111517] border border-[#00daf3]/40 text-[#00daf3] font-mono-code text-[11px] tracking-widest uppercase font-bold shadow-[0_0_15px_rgba(0,218,243,0.25)]">
          <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-ping" />
          <span>INTELLIGENCE &amp; AI CREATIVE STACK</span>
        </div>
        <span className="hidden sm:block font-mono-code text-[10px] text-[#79797e] tracking-widest uppercase">
          [ AUTONOMOUS WORKFLOWS • HIGH PRECISION ]
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {/* ROW 1: Scrolling Left */}
        <div className="marquee-container py-1">
          <div className="animate-marquee-left flex gap-5 items-center">
            {Array.from({ length: 4 }).map((_, loopIdx) => (
              <React.Fragment key={`r1-${loopIdx}`}>
                {row1Tools.map((tool, tIdx) => renderToolCard(tool, `r1-${loopIdx}-${tIdx}`))}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ROW 2: Scrolling Right */}
        <div className="marquee-container py-1">
          <div className="animate-marquee-right flex gap-5 items-center">
            {Array.from({ length: 4 }).map((_, loopIdx) => (
              <React.Fragment key={`r2-${loopIdx}`}>
                {row2Tools.map((tool, tIdx) => renderToolCard(tool, `r2-${loopIdx}-${tIdx}`))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

