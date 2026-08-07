import React, { useState } from 'react';
import { SYSTEM_METRICS } from '../data/portfolioData';

export const StatusDashboard: React.FC = () => {
  const [shaderDensity, setShaderDensity] = useState(80);
  const [aiOptimizationMode, setAiOptimizationMode] = useState(true);

  return (
    <section id="status" className="py-28 px-6 md:px-16 max-w-[1440px] mx-auto relative z-20 border-t border-white/5">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="font-mono-code text-xs text-[#00daf3] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-pulse" />
            TELEMETRY &amp; LIVE METRICS
          </span>
          <h2 className="font-space text-4xl md:text-5xl font-bold text-[#e1e3e4]">
            SYSTEM STATUS &amp; ENGINE
          </h2>
        </div>
        <div className="font-mono-code text-xs text-[#79797e]">
          LIVE CONTAINER STATUS: <span className="text-[#00daf3]">OPTIMAL (0 ERRORS)</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {SYSTEM_METRICS.map((metric, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="font-mono-code text-[11px] text-[#79797e] uppercase mb-1">
                {metric.label}
              </div>
              <div className="font-space text-4xl font-bold text-[#e1e3e4] my-2 glow-text">
                {metric.value}
              </div>
            </div>
            <div className="pt-4 border-t border-white/5 font-mono-code text-xs text-[#919094] flex items-center justify-between">
              <span>{metric.description}</span>
              <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Graphics Control Panel */}
      <div className="glass-card p-8 rounded-2xl border border-[#00daf3]/30 grid md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 flex flex-col gap-2">
          <h3 className="font-space text-2xl font-bold text-[#e1e3e4]">
            GRAPHICS ENGINE PARAMETERS
          </h3>
          <p className="font-body text-sm text-[#c7c6ca]">
            Adjust real-time WebGL shader rendering density and AI multimodal pipeline caching.
          </p>
        </div>

        <div className="md:col-span-6 flex flex-col gap-6 font-mono-code text-xs">
          <div>
            <div className="flex justify-between mb-2 text-[#e1e3e4]">
              <span>SHADER PARTICLE DENSITY</span>
              <span className="text-[#00daf3]">{shaderDensity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={shaderDensity}
              onChange={(e) => setShaderDensity(Number(e.target.value))}
              className="w-full accent-[#00daf3] bg-[#1d2021] h-2 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-[#1d2021] rounded-xl border border-white/5">
            <div>
              <div className="text-[#e1e3e4] font-bold">GEMINI 2.5 STREAM CACHING</div>
              <div className="text-[10px] text-[#79797e]">Sub-100ms response optimization</div>
            </div>
            <button
              onClick={() => setAiOptimizationMode(!aiOptimizationMode)}
              className={`px-4 py-2 rounded font-bold transition-all ${
                aiOptimizationMode
                  ? 'bg-[#00daf3] text-[#001f24] shadow-[0_0_10px_#00daf3]'
                  : 'bg-white/10 text-[#c7c6ca]'
              }`}
            >
              {aiOptimizationMode ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
