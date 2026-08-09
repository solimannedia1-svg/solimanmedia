import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data/portfolioData';
import { getVideoSourceInfo } from '../utils/videoUtils';

const LOCAL_STORAGE_KEY = 'mohamed_soliman_projects_v2';

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

  // Track touch start to differentiate scrolling from clicking
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches && e.touches.length > 0) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleProjectSelect = (project: Project, e: React.MouseEvent) => {
    if (touchStartPos.current) {
      const nativeEvent = e.nativeEvent as TouchEvent;
      if (nativeEvent && nativeEvent.changedTouches && nativeEvent.changedTouches.length > 0) {
        const touch = nativeEvent.changedTouches[0];
        const dx = Math.abs(touch.clientX - touchStartPos.current.x);
        const dy = Math.abs(touch.clientY - touchStartPos.current.y);
        // Finger moved > 8px, user was scrolling page
        if (dx > 8 || dy > 8) {
          touchStartPos.current = null;
          return;
        }
      }
    }
    touchStartPos.current = null;
    setSelectedProject(project);
  };

  // Lock body scroll and handle Escape key for modal
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setSelectedProject(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedProject]);

  const handleOpenAdmin = () => {
    window.dispatchEvent(new CustomEvent('open-admin'));
  };

  const filteredProjects = projects.filter((project) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'ai-videos') {
      return (
        project.category === 'ai-videos' ||
        project.mediaType === 'video' ||
        Boolean(project.videoUrl && project.videoUrl.trim())
      );
    }
    return project.category === activeCategory;
  });

  return (
    <section id="work" className="pt-16 md:pt-24 pb-8 md:pb-12 px-6 md:px-16 max-w-[1440px] mx-auto relative z-20 border-t border-white/5">
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
          filteredProjects.map((project) => {
            const videoInfo = getVideoSourceInfo(project.videoUrl);
            const isVideo = videoInfo.type !== 'none' || project.category === 'ai-videos' || project.mediaType === 'video';
            const isReelFormat = project.aspectRatio === 'reel' || project.category === 'ai-videos';

            return (
              <div
                key={project.id}
                onTouchStart={handleTouchStart}
                className="glass-card glass-card-hover rounded-2xl overflow-hidden border border-white/10 active:border-[#00daf3] active:shadow-[0_0_30px_rgba(0,218,243,0.4)] group flex flex-col justify-between transition-all duration-300 touch-manipulation select-none"
              >
                {/* Media Preview (Video or Image) */}
                <div className={`relative overflow-hidden bg-[#0c0f10] flex items-center justify-center ${
                  isReelFormat ? 'h-[440px] md:h-[500px]' : 'h-64 md:h-80'
                }`}>
                  {isVideo ? (
                    <div className={`w-full h-full relative group/video flex items-center justify-center bg-[#07090a] ${
                      isReelFormat ? 'py-3' : ''
                    }`}>
                      {/* Frame Container */}
                      <div className={`relative overflow-hidden shadow-2xl rounded-xl border border-[#00daf3]/30 ${
                        isReelFormat
                          ? 'h-full aspect-[9/16] bg-black max-w-[280px] sm:max-w-[320px]'
                          : 'w-full h-full'
                      }`}>
                        {videoInfo.type !== 'direct' && videoInfo.type !== 'none' ? (
                          <iframe
                            src={videoInfo.embedUrl}
                            title={project.title}
                            className="w-full h-full border-0 rounded-xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={videoInfo.embedUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                            poster={project.image}
                            controls
                            playsInline
                            muted
                            preload="metadata"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        )}
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono-code text-[#00daf3] border border-[#00daf3]/40 flex items-center gap-1.5 pointer-events-none z-10">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span>{isReelFormat ? 'AI REEL 9:16' : 'AI VIDEO'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover max-sm:grayscale-0 max-sm:opacity-100 sm:grayscale sm:opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-active:grayscale-0 group-active:opacity-100 group-focus:grayscale-0 group-focus:opacity-100 group-hover:scale-105 group-active:scale-105 transition-all duration-500"
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
                      type="button"
                      onClick={(e) => handleProjectSelect(project, e)}
                      className="px-4 py-3 font-mono-code text-xs uppercase rounded-xl border border-white/10 text-[#c7c6ca] hover:text-white hover:border-[#00daf3]/50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>DETAILS</span>
                      <span className="material-symbols-outlined text-sm">info</span>
                    </button>

                    {project.category === 'web-app' && project.liveUrl && (
                      <button
                        type="button"
                        onClick={(e) => {
                          if (project.liveUrl?.startsWith('http')) {
                            window.open(project.liveUrl, '_blank');
                          } else {
                            handleProjectSelect(project, e);
                          }
                        }}
                        className="btn-primary flex-1 py-3 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2 interactive cursor-pointer"
                      >
                        <span>LAUNCH WEB APP</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    )}

                    {(project.category === 'ai-videos' || isVideo) && (
                      <button
                        type="button"
                        onClick={(e) => handleProjectSelect(project, e)}
                        className="btn-primary flex-1 py-3 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2 interactive cursor-pointer"
                      >
                        <span>PLAY FULL VIDEO</span>
                        <span className="material-symbols-outlined text-sm">play_arrow</span>
                      </button>
                    )}

                    {project.category === 'brand-media' && !isVideo && (
                      <button
                        type="button"
                        onClick={(e) => handleProjectSelect(project, e)}
                        className="btn-primary flex-1 py-3 font-mono-code text-xs uppercase rounded-xl font-bold flex items-center justify-center gap-2 interactive cursor-pointer"
                      >
                        <span>VIEW MEDIA KIT</span>
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail & Video/Live Web Preview Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-2xl animate-fadeIn overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          {/* Floating Top Right Close Button for Viewport */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProject(null);
            }}
            aria-label="Close"
            className="fixed top-3 right-3 sm:top-6 sm:right-6 z-[210] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#00daf3] text-[#001f24] hover:bg-white hover:text-black flex items-center justify-center shadow-[0_0_25px_rgba(0,218,243,0.9)] border-2 border-white transition-all transform hover:scale-110 active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl font-black">close</span>
          </button>

          <div
            className="glass-card max-w-3xl w-full my-auto rounded-2xl p-4 sm:p-8 border border-[#00daf3]/60 relative shadow-[0_0_40px_rgba(0,227,253,0.25)] bg-[#0e1112] text-left"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top Modal Header */}
            <div className="flex items-center justify-between bg-[#0e1112] py-3.5 px-4 -mx-4 -mt-4 sm:-mx-8 sm:-mt-8 mb-5 sm:mb-6 border-b border-[#00daf3]/30 rounded-t-2xl">
              <div className="font-mono-code text-xs text-[#00daf3] font-bold uppercase flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00daf3] animate-pulse" />
                <span>PROJECT DETAILS</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-3 py-1.5 rounded-lg bg-[#00daf3]/10 hover:bg-[#00daf3] hover:text-[#001f24] text-[#00daf3] font-mono-code text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-[#00daf3]/40"
              >
                <span className="material-symbols-outlined text-sm font-bold">close</span>
                <span>CLOSE</span>
              </button>
            </div>

            {/* Video or Image Header in Modal */}
            {(() => {
              const modalVideoInfo = getVideoSourceInfo(selectedProject.videoUrl);
              const isModalVideo = modalVideoInfo.type !== 'none' || selectedProject.category === 'ai-videos' || selectedProject.mediaType === 'video';
              const fallbackModalUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

              if (isModalVideo) {
                return (
                  <div className="mb-6 rounded-xl overflow-hidden border border-[#00daf3]/50 bg-black min-h-[220px] max-h-[440px] flex items-center justify-center relative shadow-[0_0_25px_rgba(0,227,253,0.15)]">
                    {modalVideoInfo.type !== 'direct' && modalVideoInfo.type !== 'none' ? (
                      <iframe
                        src={modalVideoInfo.embedUrl}
                        title={selectedProject.title}
                        className="w-full h-[280px] sm:h-[380px] border-0 rounded-xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={modalVideoInfo.embedUrl || fallbackModalUrl}
                        poster={selectedProject.image}
                        controls
                        playsInline
                        muted
                        preload="auto"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== fallbackModalUrl) {
                            target.src = fallbackModalUrl;
                            target.load();
                          }
                        }}
                        className="w-full max-h-[400px] object-contain rounded-xl"
                      />
                    )}
                  </div>
                );
              }

              return (
                <div className="mb-6 h-52 sm:h-64 rounded-xl overflow-hidden border border-white/10 relative">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              );
            })()}

            {/* Subtitle & Category Badges */}
            <div className="flex flex-wrap items-center gap-2 font-mono-code text-xs text-[#00daf3] mb-3 leading-normal">
              <span className="px-2.5 py-1 rounded bg-[#00daf3]/10 border border-[#00daf3]/30 font-bold uppercase">
                {selectedProject.category === 'web-app'
                  ? 'WEB APPLICATION'
                  : selectedProject.category === 'brand-media'
                  ? 'BRAND & MEDIA'
                  : 'AI VIDEO SHOWCASE'}
              </span>
              {selectedProject.subtitle && (
                <span className="text-[#c7c6ca] break-words">
                  • {selectedProject.subtitle}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-space text-xl sm:text-3xl font-bold text-[#e1e3e4] mb-3 leading-tight break-words">
              {selectedProject.title}
            </h3>

            {/* Description */}
            <p className="font-body text-sm sm:text-base text-[#c7c6ca] mb-6 leading-relaxed break-words whitespace-pre-line">
              {selectedProject.description}
            </p>

            {/* Metrics if present */}
            {selectedProject.metrics && selectedProject.metrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 mb-6 rounded-xl bg-[#0c0f10] border border-white/10 font-mono-code text-xs">
                {selectedProject.metrics.map((m, idx) => (
                  <div key={idx} className="overflow-hidden">
                    <div className="text-[#79797e] text-[10px] uppercase truncate">{m.label}</div>
                    <div className="text-[#00daf3] font-bold text-sm truncate">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Code Snippet if present */}
            {selectedProject.codeSnippet && (
              <div className="mb-6">
                <div className="font-mono-code text-xs text-[#79797e] uppercase mb-2 flex items-center justify-between">
                  <span>ARCHITECTURE &amp; SOURCE CODE EXCERPT</span>
                  <span className="text-[#00daf3]">SYSTEM CODE</span>
                </div>
                <pre className="p-3.5 sm:p-4 rounded-xl bg-[#0c0f10] border border-white/10 font-mono-code text-[11px] sm:text-xs text-[#00daf3] overflow-x-auto leading-relaxed max-h-52 sm:max-h-64">
                  <code>{selectedProject.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Tags and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 sm:pt-6 border-t border-white/10 w-full">
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

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-6 py-3 font-mono-code text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,227,253,0.3)] w-full sm:w-auto min-h-[44px]"
                  >
                    <span>OPEN LIVE APP</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(null);
                  }}
                  className="w-full sm:w-auto px-8 py-3 font-mono-code text-xs font-black border border-[#00daf3] bg-[#00daf3] text-[#001f24] hover:bg-[#00c5dc] active:scale-95 transition-all rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,227,253,0.5)] cursor-pointer min-h-[44px]"
                >
                  <span className="material-symbols-outlined text-base font-bold">close</span>
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkShowcase;

