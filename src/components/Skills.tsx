import React, { useState } from 'react';
import { Code2, Cpu, Megaphone, Palette, Layers } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';

const getSkillIcon = (iconName: string) => {
  switch (iconName) {
    case 'code':
      return <Code2 className="w-8 h-8 text-[#c7c6ca] group-hover:text-[#00daf3] transition-colors" />;
    case 'memory':
      return <Cpu className="w-8 h-8 text-[#c7c6ca] group-hover:text-[#00daf3] transition-colors" />;
    case 'campaign':
      return <Megaphone className="w-8 h-8 text-[#c7c6ca] group-hover:text-[#00daf3] transition-colors" />;
    case 'palette':
      return <Palette className="w-8 h-8 text-[#c7c6ca] group-hover:text-[#00daf3] transition-colors" />;
    default:
      return <Layers className="w-8 h-8 text-[#c7c6ca] group-hover:text-[#00daf3] transition-colors" />;
  }
};

export const Skills: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section id="skills" className="py-28 px-6 md:px-16 max-w-[1440px] mx-auto relative z-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="font-mono-code text-xs text-[#00daf3] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00daf3]" />
            CORE COMPETENCIES
          </span>
          <h2 className="font-space text-4xl md:text-5xl font-bold text-[#e1e3e4]">
            SPECIALIZED SKILLSETS
          </h2>
        </div>
        <p className="font-body text-base text-[#919094] max-w-md">
          A unique synthesis of full-stack development, WebGL 3D graphics, generative AI tools, and audience growth strategy.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {SKILL_CATEGORIES.map((skill) => {
          const isActive = activeCard === skill.number;

          return (
            <div
              key={skill.number}
              onMouseEnter={() => setActiveCard(skill.number)}
              onMouseLeave={() => setActiveCard(null)}
              className={`glass-card p-8 md:p-12 rounded-2xl transition-all duration-500 interactive border border-white/5 hover:border-[#00daf3]/40 group ${
                isActive ? 'bg-[#191c1d]/90 shadow-[0_0_30px_rgba(0,227,253,0.15)]' : ''
              }`}
            >
              {/* Top row */}
              <div className="flex justify-between items-start mb-10">
                <span className="font-mono-code text-sm font-bold text-[#00daf3] tracking-widest px-3 py-1 bg-[#00daf3]/10 rounded border border-[#00daf3]/30">
                  {skill.number}
                </span>
                {getSkillIcon(skill.icon)}
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-space text-2xl md:text-3xl font-bold text-[#e1e3e4] mb-2">
                {skill.title}
              </h3>
              <div className="font-mono-code text-xs text-[#00daf3] mb-4 uppercase tracking-wider">
                {skill.subtitle}
              </div>

              <p className="font-body text-base text-[#c7c6ca] mb-8 leading-relaxed">
                {skill.description}
              </p>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10">
                {skill.techs.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono-code text-xs px-3 py-1.5 rounded bg-[#1d2021] border border-white/10 text-[#e1e3e4] hover:border-[#00daf3]/40 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Metric Footer */}
              <div className="mt-6 pt-4 flex items-center justify-between text-xs font-mono-code text-[#79797e]">
                <span>BENCHMARK</span>
                <span className="text-[#00daf3] font-semibold">{skill.metrics}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
