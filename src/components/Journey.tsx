import React from 'react';
import { JOURNEY_MILESTONES } from '../data/portfolioData';

export const Journey: React.FC = () => {
  return (
    <section id="journey" className="py-28 px-6 md:px-16 max-w-[1440px] mx-auto relative z-20 border-t border-white/5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="font-mono-code text-xs text-[#00daf3] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00daf3]" />
            TIMELINE &amp; EVOLUTION
          </span>
          <h2 className="font-space text-4xl md:text-5xl font-bold text-[#e1e3e4]">
            THE CREATIVE JOURNEY
          </h2>
        </div>
        <p className="font-body text-base text-[#919094] max-w-md">
          A continuous evolution through code craft, 3D graphics, generative intelligence, and media strategy.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative border-l border-white/10 ml-4 md:ml-8 pl-6 md:pl-12 space-y-12">
        {JOURNEY_MILESTONES.map((milestone, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-[31px] md:-left-[55px] top-1.5 w-4 h-4 rounded-full bg-[#111415] border-2 border-[#00daf3] group-hover:bg-[#00daf3] transition-colors shadow-[0_0_10px_#00daf3]" />

            <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-[#00daf3]/30 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <span className="font-mono-code text-xs text-[#00daf3] font-bold px-3 py-1 bg-[#00daf3]/10 rounded border border-[#00daf3]/20">
                  {milestone.year}
                </span>
                <span className="font-mono-code text-xs text-[#79797e] uppercase">
                  {milestone.companyOrProject}
                </span>
              </div>

              <h3 className="font-space text-2xl font-bold text-[#e1e3e4] mb-2">
                {milestone.role}
              </h3>

              <p className="font-body text-base text-[#c7c6ca] mb-6 leading-relaxed">
                {milestone.description}
              </p>

              {/* Highlights List */}
              <ul className="space-y-2 mb-6">
                {milestone.highlights.map((item, hIdx) => (
                  <li key={hIdx} className="font-body text-sm text-[#919094] flex items-start gap-2">
                    <span className="text-[#00daf3] font-mono-code text-xs">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {milestone.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono-code text-[11px] px-2.5 py-1 rounded bg-[#1d2021] text-[#c7c6ca]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
