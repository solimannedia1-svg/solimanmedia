import React from 'react';

interface AITool {
  name: string;
  category: string;
  icon: string;
  color: string;
}

export const Marquee: React.FC = () => {
  const aiTools: AITool[] = [
    { name: 'GEMINI 3.6 FLASH', category: 'Google GenAI', icon: 'auto_awesome', color: '#00daf3' },
    { name: 'MIDJOURNEY V6', category: 'Generative Art', icon: 'palette', color: '#a855f7' },
    { name: 'SORA OPENAI', category: 'AI Video', icon: 'movie', color: '#10b981' },
    { name: 'RUNWAY GEN-3', category: 'Motion Video', icon: 'video_settings', color: '#f59e0b' },
    { name: 'ELEVENLABS', category: 'Voice Synthesis', icon: 'graphic_eq', color: '#ec4899' },
    { name: 'CLAUDE 3.5 SONNET', category: 'AI Architect', icon: 'psychology', color: '#fb923c' },
    { name: 'CHATGPT 4o', category: 'Multimodal', icon: 'chat', color: '#10b981' },
    { name: 'STABLE DIFFUSION', category: 'Neural Canvas', icon: 'brush', color: '#3b82f6' },
    { name: 'PHOTOSHOP AI', category: 'Generative Fill', icon: 'edit_square', color: '#00daf3' },
    { name: 'COMFYUI PIPELINES', category: 'AI Workflows', icon: 'account_tree', color: '#8b5cf6' },
  ];

  return (
    <div className="w-full py-6 overflow-hidden bg-[#0c0f10]/90 border-y border-white/10 relative z-20 backdrop-blur-md">
      {/* Side Fades */}
      <div className="absolute left-0 top-0 w-24 sm:w-36 h-full bg-gradient-to-r from-[#0c0f10] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-24 sm:w-36 h-full bg-gradient-to-l from-[#0c0f10] to-transparent z-10 pointer-events-none" />

      {/* Label Badge */}
      <div className="absolute left-4 top-2 z-20 hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#111415]/90 border border-[#00daf3]/40 text-[#00daf3] font-mono-code text-[10px] tracking-wider uppercase font-bold shadow-[0_0_10px_rgba(0,218,243,0.2)]">
        <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-ping" />
        AI POWER TOOLS &amp; STACK
      </div>

      <div className="marquee-container pt-4 md:pt-0">
        <div className="marquee-content font-mono-code text-xs uppercase flex gap-6 items-center">
          {Array.from({ length: 3 }).map((_, idx) => (
            <React.Fragment key={idx}>
              {aiTools.map((tool, tIdx) => (
                <div
                  key={tIdx}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#171a1b] border border-white/10 hover:border-[#00daf3]/50 transition-all duration-300 group cursor-default shadow-md hover:shadow-[0_0_15px_rgba(0,218,243,0.15)] flex-shrink-0"
                >
                  <span
                    className="material-symbols-outlined text-base transition-transform group-hover:scale-125 duration-300"
                    style={{ color: tool.color }}
                  >
                    {tool.icon}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-space text-xs font-bold text-[#e1e3e4] group-hover:text-[#00daf3] transition-colors">
                      {tool.name}
                    </span>
                    <span className="text-[9px] text-[#79797e] tracking-tight">
                      {tool.category}
                    </span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
