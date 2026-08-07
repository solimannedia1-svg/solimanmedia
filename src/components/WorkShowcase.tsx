import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data/portfolioData';

const LOCAL_STORAGE_KEY = 'mohamed_soliman_portfolio_projects_v2';

interface WorkShowcaseProps {
  projects?: Project[];
  onSaveProjects?: (projects: Project[]) => void;
  onResetDefaults?: () => void;
}

export const WorkShowcase: React.FC<WorkShowcaseProps> = ({
  projects: propsProjects,
  onSaveProjects: propsSaveProjects,
  onResetDefaults: propsResetDefaults,
}) => {
  const [internalProjects, setInternalProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved portfolio projects', e);
    }
    return PROJECTS_DATA;
  });

  const projects = propsProjects || internalProjects;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [previewIframeUrl, setPreviewIframeUrl] = useState<string | null>(null);

  const handleOpenAdmin = () => {
    window.dispatchEvent(new CustomEvent('open-admin'));
  };

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'all') return true;
    return project.category === activeCategory;
  });

  return (
    <section id="work" className="py-28 px-6 md:px-16 max-w-[1440px] mx-auto relative z-20 border-t border-white/5">
      {/* Header & Category Selection */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="font-mono-code text-xs text-[#00daf3] uppercase tracking-[0.2em] font-semibold flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00daf3] animate-pulse" />
            FEATURED CREATIVE LABS &amp; PRODUCTION
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="font-space text-4xl md:text-5xl font-bold text-[#e1e3e4]">
              SELECTED PROJECTS
            </h2>
          </div>
        </div>

        {/* 3 Categories requested by user */}
        <div className="flex flex-wrap gap-2 font-mono-code text-xs uppercase">
          {[
            { id: 'all', label: 'ALL WORKS' },
            { id: 'web-app', label: 'WEB APPLICATION' },
            { id: 'brand-media', label: 'BRAND & MEDIA' },
            { id: 'ai-videos', label: 'AI VIDEOS' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-3 rounded-xl transition-all interactive font-bold ${
                activeCategory === cat.id
                  ? 'bg-[#00daf3] text-[#001f24] shadow-[0_0_20px_rgba(0,227,253,0.4)]'
                  : 'bg-[#1d2021] text-[#c7c6ca] hover:text-[#e1e3e4] border border-white/5 hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredProjects.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-[#1d2021]/50 rounded-2xl border border-white/5 font-mono-code text-[#79797e]">
            No projects found in this category. Click "ADMIN PANEL" to add projects.
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/10 group flex flex-col justify-between transition-all duration-300"
            >
              {/* Media Preview (Video or Image) */}
              <div className={`relative overflow-hidden bg-[#0c0f10] flex items-center justify-center ${
                project.category === 'ai-videos' || project.aspectRatio === 'reel' 
                  ? 'h-[440px] md:h-[500px]' 
                  : 'h-64 md:h-80'
              }`}>
                {project.videoUrl || project.category === 'ai-videos' ? (
                  <div className={`w-full h-full relative group/video flex items-center justify-center bg-[#07090a] ${
                    project.aspectRatio === 'reel' || project.category === 'ai-videos' ? 'py-3' : ''
                  }`}>
                    {/* If Reel aspect ratio, wrap in stylized 9:16 vertical frame */}
                    <div className={`relative overflow-hidden shadow-2xl rounded-xl border border-[#00daf3]/30 ${
                      project.aspectRatio === 'reel' || project.category === 'ai-videos'
                        ? 'h-full aspect-[9/16] bg-black max-w-[280px] sm:max-w-[320px]'
                        : 'w-full h-full'
                    }`}>
                      <video
                        src={project.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                        poster={project.image}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono-code text-[#00daf3] border border-[#00daf3]/40 flex items-center gap-1.5 pointer-events-none">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>{project.category === 'ai-videos' ? 'AI REEL 9:16' : 'AI VIDEO'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111415] via-[#111415]/20 to-transparent" />
                  </>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4 flex gap-2 pointer-events-none z-10">
                  <span className="font-mono-code text-[11px] px-3 py-1 rounded-lg bg-[#111415]/90 backdrop-blur-md border border-[#00daf3]/40 text-[#00daf3] font-bold uppercase shadow-lg">
                    {project.category === 'web-app'
                      ? 'WEB APPLICATION'
                      : project.category === 'brand-media'
                      ? 'BRAND & MEDIA'
                      : 'AI REEL / VIDEO'}
                  </span>
                  {project.featured && (
                    <span className="font-mono-code text-[11px] px-3 py-1 rounded-lg bg-[#00daf3] text-[#001f24] font-bold shadow-lg">
                      FEATURED
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex-1 flex flex-col justify-between gap-6">
                <div>
                  <h3 className="font-space text-2xl font-bold text-[#e1e3e4] group-hover:text-[#00daf3] transition-colors mb-1">
                    {project.title}
                  </h3>
                  <div className="font-mono-code text-xs text-[#00daf3] mb-4">
                    {project.subtitle}
                  </div>
                  <p className="font-body text-sm text-[#c7c6ca] leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Metrics if present */}
                {project.metrics && (
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 font-mono-code text-xs">
                    {project.metrics.map((m, idx) => (
                      <div key={idx}>
                        <div className="text-[#79797e] text-[10px] uppercase">{m.label}</div>
                        <div className="text-[#e1e3e4] font-semibold">{m.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono-code text-[11px] px-2.5 py-1 rounded-lg bg-[#1d2021] text-[#919094] border border-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-4 py-3 font-mono-code text-xs uppercase rounded-xl border border-white/10 text-[#c7c6ca] hover:text-white hover:border-[#00daf3]/50 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>DETAILS</span>
                    <span className="material-symbols-outlined text-sm">info</span>
                  </button>

                  {project.category === 'web-app' && project.liveUrl && (
                    <button
                      onClick={() => {
                        if (project.liveUrl?.startsWith('http')) {
                          window.open(project.liveUrl, '_blank');
                        } else {
                          setSelectedProject(project);
                        }
                      }}
                      className="btn-primary flex-1 py-3 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2 interactive"
                    >
                      <span>LAUNCH WEB APP</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  )}

                  {project.category === 'ai-videos' && (
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="btn-primary flex-1 py-3 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2 interactive"
                    >
                      <span>PLAY FULL VIDEO</span>
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                    </button>
                  )}

                  {project.category === 'brand-media' && (
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="btn-primary flex-1 py-3 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2 interactive"
                    >
                      <span>VIEW MEDIA KIT</span>
                      <span className="material-symbols-outlined text-sm">visibility</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail & Video/Live Web Preview Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="glass-card max-w-3xl w-full max-h-[92vh] overflow-y-auto rounded-2xl p-6 sm:p-8 border border-[#00daf3]/50 relative shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-[#c7c6ca] hover:text-[#00daf3] p-2 rounded-full border border-white/10 bg-[#111415]/80"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Video or Image Header in Modal */}
            {selectedProject.videoUrl || selectedProject.category === 'ai-videos' ? (
              <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-black">
                <video
                  src={selectedProject.videoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[420px] object-contain"
                />
              </div>
            ) : (
              <div className="mb-6 h-64 rounded-xl overflow-hidden border border-white/10 relative">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="font-mono-code text-xs text-[#00daf3] mb-2 uppercase flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#00daf3]/10 border border-[#00daf3]/30 font-bold">
                {selectedProject.category === 'web-app'
                  ? 'WEB APPLICATION'
                  : selectedProject.category === 'brand-media'
                  ? 'BRAND & MEDIA'
                  : 'AI VIDEO SHOWCASE'}
              </span>
              <span>• {selectedProject.subtitle}</span>
            </div>

            <h3 className="font-space text-3xl font-bold text-[#e1e3e4] mb-4">
              {selectedProject.title}
            </h3>

            <p className="font-body text-base text-[#c7c6ca] mb-6 leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Code Snippet if present */}
            {selectedProject.codeSnippet && (
              <div className="mb-6">
                <div className="font-mono-code text-xs text-[#79797e] uppercase mb-2 flex items-center justify-between">
                  <span>ARCHITECTURE &amp; SOURCE CODE EXCERPT</span>
                  <span className="text-[#00daf3]">SYSTEM CODE</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#0c0f10] border border-white/10 font-mono-code text-xs text-[#00daf3] overflow-x-auto leading-relaxed">
                  <code>{selectedProject.codeSnippet}</code>
                </pre>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {selectedProject.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono-code text-[11px] px-2.5 py-1 rounded bg-[#1d2021] text-[#00daf3] border border-white/10"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-6 py-2.5 font-mono-code text-xs font-bold rounded-xl flex items-center gap-2"
                  >
                    <span>OPEN LIVE APP</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2.5 font-mono-code text-xs border border-white/10 text-[#c7c6ca] hover:text-white rounded-xl"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

