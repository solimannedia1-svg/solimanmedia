import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GalleryItem } from '../types';
import { getVideoSourceInfo, getItemDisplayImage, DEFAULT_FALLBACK_IMAGE, isReelVideo } from '../utils/videoUtils';

interface GalleryProps {
  galleryItems?: GalleryItem[];
}

export const Gallery: React.FC<GalleryProps> = ({ galleryItems = [] }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const categories = [
    { id: 'all', label: 'ALL ALBUMS', icon: 'auto_awesome' },
    { id: 'celebrity', label: 'VIP GUESTS', icon: 'star' },
    { id: 'testimonial', label: 'TESTIMONIALS', icon: 'movie' },
  ];

  // Helper to extract embeddable Video URL
  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    const info = getVideoSourceInfo(url);
    if (info.type === 'youtube' && !info.embedUrl.includes('autoplay=1')) {
      return `${info.embedUrl}&autoplay=1`;
    }
    return info.embedUrl || url;
  };

  // Helper to pick items for specific grid slots without duplication
  const getItemAt = (index: number) => {
    if (index >= filteredItems.length) return null;
    return filteredItems[index];
  };

  const itemLeft = getItemAt(0);
  const itemCenter = getItemAt(1);
  const itemRight = getItemAt(2);
  const itemBottom1 = getItemAt(3);
  const itemBottom2 = getItemAt(4);

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-[#0a0c0d] text-[#e1e3e4]">
      {/* Background Subtle Cyber Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#00daf3]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* TOP SECTION HEADER - PHOTIX RETICLE STYLE */}
        <div className="relative text-center mb-10 sm:mb-16 pt-4 sm:pt-8 overflow-hidden">
          {/* Top Cyan Accent Line */}
          <div className="w-16 sm:w-24 h-[2px] sm:h-[3px] bg-[#00daf3] mx-auto mb-6 sm:mb-8 shadow-[0_0_12px_#00daf3]" />

          {/* Camera Viewfinder Framing Reticle Corners for Header */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative inline-block max-w-full px-4 sm:px-12 py-3 sm:py-5 my-1"
          >
            {/* Corner Marks with subtle pulsing glowing animation */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 sm:w-5 sm:h-5 border-t-2 border-l-2 border-[#00daf3] shadow-[0_0_8px_#00daf3] animate-pulse" />
            <div className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-5 sm:h-5 border-t-2 border-r-2 border-[#00daf3] shadow-[0_0_8px_#00daf3] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 sm:w-5 sm:h-5 border-b-2 border-l-2 border-[#00daf3] shadow-[0_0_8px_#00daf3] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-5 sm:h-5 border-b-2 border-r-2 border-[#00daf3] shadow-[0_0_8px_#00daf3] animate-pulse" />

            {/* Display Title - Responsive & Sleek (Static) */}
            <h2 className="text-xl sm:text-4xl lg:text-5xl font-black font-space tracking-[0.06em] sm:tracking-[0.15em] lg:tracking-[0.2em] text-white uppercase select-none flex flex-wrap items-center justify-center gap-1.5 sm:gap-3.5 max-w-full leading-tight">
              <span>GALLERY</span>
              <span className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full border-2 sm:border-3 border-[#00daf3] bg-transparent inline-block mx-0.5 sm:mx-1 shadow-[0_0_12px_#00daf3] shrink-0 animate-pulse" />
              <span>ALBUMS</span>
            </h2>

            <p className="font-mono-code text-[9px] sm:text-xs text-[#00daf3] tracking-[0.08em] sm:tracking-[0.2em] uppercase mt-2 sm:mt-3 font-semibold max-w-full break-words">
              HONORARY MOMENTS &amp; TESTIMONIALS • VIP SHOWCASE
            </p>
          </motion.div>

          {/* Subtitle description */}
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-[#919094] mt-4 sm:mt-6 leading-relaxed px-4">
            High-resolution documentation of technology meeting creativity, featuring exclusive VIP encounters and video testimonials from industry leaders.
          </p>

          {/* HUD Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-8">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-none font-mono-code text-xs tracking-wider transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? 'bg-[#00daf3] text-[#001f24] border-[#00daf3] font-extrabold shadow-[0_0_20px_rgba(0,218,243,0.5)]'
                      : 'bg-[#121618] text-[#919094] border-white/10 hover:border-[#00daf3]/50 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* PHOTIX ASYMMETRICAL GRID SHOWCASE */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#121618] border border-white/10 font-mono-code text-[#919094] text-xs">
            [ NO ALBUMS FOUND IN THIS CATEGORY ]
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            
            {/* TOP ROW: 3-COLUMN ASYMMETRICAL LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
              
              {/* CARD 1 (LEFT COLUMN): PORTRAIT CARD */}
              {itemLeft && (
                <div
                  onClick={() => setSelectedItem(itemLeft)}
                  className={`${
                    filteredItems.length === 1
                      ? 'lg:col-span-12'
                      : filteredItems.length === 2
                      ? 'lg:col-span-6'
                      : 'lg:col-span-3'
                  } group relative bg-[#121618] border border-white/10 hover:border-[#00daf3] transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between min-h-[380px] sm:min-h-[460px] shadow-2xl`}
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={getItemDisplayImage(itemLeft)}
                      alt={itemLeft.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0d] via-[#0a0c0d]/60 to-transparent" />
                  </div>

                  {/* Top Bar */}
                  <div className="relative z-10 p-5 flex items-center justify-between">
                    <span className="font-mono-code text-[10px] text-[#00daf3] bg-[#00daf3]/10 border border-[#00daf3]/40 px-2 py-0.5 tracking-wider font-bold uppercase">
                      {(itemLeft.category || 'celebrity').toUpperCase()}
                    </span>
                    <span className="font-mono-code text-[10px] text-white/50">01 / ALBUM</span>
                  </div>

                  {/* Bottom Text Overlay */}
                  <div className="relative z-10 p-6 space-y-3">
                    {itemLeft.personName && (
                      <div className="text-[#00daf3] text-xs font-mono-code font-bold">
                        {itemLeft.personName}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00daf3] transition-colors leading-tight">
                      {itemLeft.title}
                    </h3>
                    <p className="text-xs text-[#919094] line-clamp-2">
                      {itemLeft.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs text-[#00daf3] font-mono-code font-bold">
                      <span>VIEW ALBUM</span>
                      <span className="material-symbols-outlined text-sm">arrow_right</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 2 (CENTER COLUMN): FEATURED ALBUM GRID */}
              {itemCenter && (
                <div
                  onClick={() => setSelectedItem(itemCenter)}
                  className={`${
                    filteredItems.length === 2 ? 'lg:col-span-6' : 'lg:col-span-5'
                  } group relative bg-[#121618] border border-white/10 hover:border-[#00daf3] transition-all duration-500 overflow-hidden cursor-pointer min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-6 shadow-2xl`}
                >
                  {/* Camera Reticle Corners */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#00daf3]/60 group-hover:border-[#00daf3]" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#00daf3]/60 group-hover:border-[#00daf3]" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#00daf3]/60 group-hover:border-[#00daf3]" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#00daf3]/60 group-hover:border-[#00daf3]" />

                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={getItemDisplayImage(itemCenter)}
                      alt={itemCenter.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0d] via-[#0a0c0d]/70 to-[#0a0c0d]/40" />
                  </div>

                  {/* Header info */}
                  <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00daf3] animate-pulse" />
                      <span className="font-mono-code text-[10px] text-[#00daf3] bg-[#00daf3]/10 border border-[#00daf3]/40 px-2 py-0.5 tracking-wider font-bold uppercase">
                        {(itemCenter.category || 'celebrity').toUpperCase()}
                      </span>
                    </div>
                    <span className="font-mono-code text-xs text-white/60">
                      {itemCenter.date || '2025'}
                    </span>
                  </div>

                  {/* Center Content / Play Icon if video */}
                  <div className="relative z-10 my-auto text-center space-y-4 py-8">
                    {itemCenter.mediaType === 'video' || itemCenter.videoUrl ? (
                      <div className="w-20 h-20 mx-auto rounded-full bg-[#00daf3] text-[#001f24] flex items-center justify-center shadow-[0_0_35px_rgba(0,218,243,0.8)] group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-[#00daf3]/40 text-[#00daf3] flex items-center justify-center backdrop-blur-md group-hover:bg-[#00daf3] group-hover:text-[#001f24] transition-all">
                        <span className="material-symbols-outlined text-2xl">photo_camera</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      {itemCenter.personName && (
                        <span className="inline-block font-mono-code text-xs text-[#00daf3] bg-[#00daf3]/10 px-3 py-1 border border-[#00daf3]/30">
                          {itemCenter.personName} — {itemCenter.personRole}
                        </span>
                      )}
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {itemCenter.title}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* CARD 3 (RIGHT COLUMN - 4 COLS): MYSTICAL SPOTLIGHT PORTRAIT */}
              {itemRight && (
                <div
                  onClick={() => setSelectedItem(itemRight)}
                  className="lg:col-span-4 group relative bg-[#121618] border border-white/10 hover:border-[#00daf3] transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between min-h-[380px] sm:min-h-[460px] p-6 shadow-2xl"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={getItemDisplayImage(itemRight)}
                      alt={itemRight.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0d] via-[#0a0c0d]/60 to-transparent" />
                  </div>

                  {/* Top Reticle Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono-code text-[10px] text-[#00daf3] bg-[#00daf3]/10 border border-[#00daf3]/40 px-2 py-0.5 tracking-wider font-bold uppercase">
                      {(itemRight.category || 'celebrity').toUpperCase()}
                    </span>
                    <span className="font-mono-code text-[10px] text-[#919094]">
                      {itemRight.date || '2025'}
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="relative z-10 space-y-3 mt-auto">
                    {itemRight.personName && (
                      <h4 className="text-xl font-bold text-[#00daf3]">
                        {itemRight.personName}
                      </h4>
                    )}
                    {itemRight.personRole && (
                      <p className="text-xs text-[#919094] font-mono-code">
                        {itemRight.personRole}
                      </p>
                    )}
                    <h3 className="text-2xl font-extrabold text-white leading-snug group-hover:text-[#00daf3] transition-colors">
                      {itemRight.title}
                    </h3>
                    <p className="text-xs text-[#c0c2c3] leading-relaxed line-clamp-3">
                      {itemRight.description}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* BOTTOM ROW: 2 WIDE PANORAMIC CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">

              {/* BOTTOM LEFT: PANORAMIC WIDE FEATURE BANNER */}
              {itemBottom1 && (
                <div
                  onClick={() => setSelectedItem(itemBottom1)}
                  className={`${
                    !itemBottom2 ? 'lg:col-span-12' : 'lg:col-span-7'
                  } group relative bg-[#121618] border border-white/10 hover:border-[#00daf3] transition-all duration-500 overflow-hidden cursor-pointer min-h-[260px] sm:min-h-[300px] flex flex-col justify-between p-6 sm:p-8 shadow-2xl`}
                >
                  {/* Reticle Accent Line */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00daf3] to-transparent" />

                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={getItemDisplayImage(itemBottom1)}
                      alt={itemBottom1.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover opacity-45 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c0d] via-[#0a0c0d]/80 to-transparent" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between font-mono-code text-xs text-[#00daf3]">
                    <span className="font-mono-code text-[10px] text-[#00daf3] bg-[#00daf3]/10 border border-[#00daf3]/40 px-2 py-0.5 tracking-wider font-bold uppercase">
                      {(itemBottom1.category || 'celebrity').toUpperCase()}
                    </span>
                    <span className="text-white/50">{itemBottom1.date || '2025'}</span>
                  </div>

                  <div className="relative z-10 max-w-xl space-y-3 mt-auto">
                    {itemBottom1.personName && (
                      <span className="text-xs font-mono-code text-[#00daf3] font-bold">
                        {itemBottom1.personName} ({itemBottom1.personRole})
                      </span>
                    )}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#00daf3] transition-colors leading-tight">
                      {itemBottom1.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#919094] line-clamp-2">
                      {itemBottom1.description}
                    </p>
                  </div>
                </div>
              )}

              {/* BOTTOM RIGHT (5 COLS): DUAL ACTION / TESTIMONIAL BANNER */}
              {itemBottom2 && (
                <div
                  onClick={() => setSelectedItem(itemBottom2)}
                  className="lg:col-span-5 group relative bg-[#121618] border border-white/10 hover:border-[#00daf3] transition-all duration-500 overflow-hidden cursor-pointer min-h-[260px] sm:min-h-[300px] flex flex-col justify-between p-6 sm:p-8 shadow-2xl"
                >
                  <div className="absolute inset-0 z-0">
                    <img
                      src={getItemDisplayImage(itemBottom2)}
                      alt={itemBottom2.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c0d] via-[#0a0c0d]/70 to-transparent" />
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="font-mono-code text-[10px] text-[#00daf3] bg-[#00daf3]/10 border border-[#00daf3]/40 px-2 py-0.5 tracking-wider font-bold uppercase">
                      {(itemBottom2.category || 'celebrity').toUpperCase()}
                    </span>
                    {(itemBottom2.mediaType === 'video' || itemBottom2.videoUrl) && (
                      <span className="w-8 h-8 rounded-full bg-[#00daf3] text-[#001f24] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(0,218,243,0.6)]">
                        <span className="material-symbols-outlined text-lg">play_arrow</span>
                      </span>
                    )}
                  </div>

                  <div className="relative z-10 space-y-2 mt-auto">
                    {itemBottom2.personName && (
                      <p className="text-xs font-mono-code text-[#00daf3]">
                        {itemBottom2.personName}
                      </p>
                    )}
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00daf3] transition-colors">
                      {itemBottom2.title}
                    </h3>
                  </div>
                </div>
              )}

            </div>

            {/* ALL ITEMS EXPANDABLE GRID (IF MORE THAN 5 ITEMS) */}
            {filteredItems.length > 5 && (
              <div className="pt-12 border-t border-white/10 space-y-8">
                <div className="text-center">
                  <h4 className="font-mono-code text-sm text-[#00daf3] uppercase tracking-widest">
                    [ MORE GALLERY ALBUMS ({filteredItems.length - 5}) ]
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.slice(5).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group relative bg-[#121618] border border-white/10 hover:border-[#00daf3] transition-all overflow-hidden cursor-pointer p-4 space-y-3"
                    >
                      <div className="relative h-48 bg-black overflow-hidden">
                        <img
                          src={getItemDisplayImage(item)}
                          alt={item.title}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {(item.mediaType === 'video' || item.videoUrl) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <div className="w-12 h-12 rounded-full bg-[#00daf3] text-[#001f24] flex items-center justify-center shadow-[0_0_15px_rgba(0,218,243,0.8)]">
                              <span className="material-symbols-outlined text-2xl ml-0.5">play_arrow</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono-code text-[10px] text-[#00daf3] bg-[#00daf3]/10 border border-[#00daf3]/40 px-2 py-0.5 tracking-wider font-bold uppercase">
                            {(item.category || 'celebrity').toUpperCase()}
                          </span>
                          {item.personName && (
                            <span className="text-[11px] font-mono-code text-[#00daf3] truncate">
                              {item.personName}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-white group-hover:text-[#00daf3] transition-colors truncate">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* LIGHTBOX / VIDEO MODAL */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/92 backdrop-blur-2xl p-3 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#121618] border border-[#00daf3]/80 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,218,243,0.4)] my-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Reticle Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#00daf3]/30 bg-[#0a0c0d]">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#00daf3] animate-pulse" />
                <span className="font-mono-code text-xs text-[#00daf3] font-bold uppercase tracking-wider">
                  [ {(selectedItem.mediaType === 'video' || selectedItem.videoUrl) ? (isReelVideo(selectedItem.videoUrl) ? 'REEL / SHORT SHOWCASE' : 'VIDEO SHOWCASE') : 'PHOTO SHOWCASE'} ]
                </span>
              </div>
            </div>

            {/* Modal Media Content */}
            <div className="relative w-full bg-black">
              {(() => {
                const info = getVideoSourceInfo(selectedItem.videoUrl);
                const embedSrc = getEmbedUrl(selectedItem.videoUrl);
                const isVideo = selectedItem.mediaType === 'video' || Boolean(selectedItem.videoUrl && selectedItem.videoUrl.trim());

                if (isVideo) {
                  if (isReelVideo(selectedItem.videoUrl)) {
                    return (
                      <div className="flex flex-col items-center justify-center bg-[#080a0b] py-6 px-4">
                        <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/16] max-h-[72vh] rounded-3xl overflow-hidden border-2 border-[#00daf3] shadow-[0_0_50px_rgba(0,218,243,0.4)] bg-black">
                          {info.type === 'direct' ? (
                            <video
                              src={info.embedUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                              poster={getItemDisplayImage(selectedItem)}
                              controls
                              autoPlay
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <iframe
                              src={embedSrc}
                              title={selectedItem.title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#00daf3]/50 text-[#00daf3] text-[10px] font-mono-code font-bold flex items-center gap-2 shadow-lg pointer-events-none">
                            <span className="w-2 h-2 rounded-full bg-[#00daf3] animate-ping" />
                            <span>REEL / SHORT • 9:16</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="aspect-video w-full bg-black flex items-center justify-center">
                      {info.type === 'direct' ? (
                        <video
                          src={info.embedUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                          poster={getItemDisplayImage(selectedItem)}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <iframe
                          src={embedSrc}
                          title={selectedItem.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  );
                }

                return (
                  <div className="max-h-[65vh] overflow-hidden flex items-center justify-center bg-[#0a0c0d]">
                    <img
                      src={getItemDisplayImage(selectedItem)}
                      alt={selectedItem.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="max-h-[65vh] w-auto object-contain"
                    />
                  </div>
                );
              })()}
            </div>

            {/* Modal Text Details */}
            <div className="p-6 sm:p-8 space-y-4 bg-[#121618]">
              {selectedItem.personName && (
                <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                  <span className="material-symbols-outlined text-2xl text-[#00daf3]">workspace_premium</span>
                  <div>
                    <h4 className="text-lg font-bold text-[#00daf3]">{selectedItem.personName}</h4>
                    <p className="text-xs text-[#919094] font-mono-code">{selectedItem.personRole}</p>
                  </div>
                </div>
              )}

              <h3 className="text-2xl font-bold text-white">{selectedItem.title}</h3>
              <p className="text-sm text-[#c0c2c3] leading-relaxed whitespace-pre-line">
                {selectedItem.description}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                {selectedItem.date ? (
                  <div className="text-xs font-mono-code text-[#79797e]">
                    DATE / OCCASION: {selectedItem.date}
                  </div>
                ) : <div />}

                {/* Big Prominent Close Button at Bottom */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(null);
                  }}
                  className="w-full sm:w-auto px-8 py-3 bg-[#00daf3] hover:bg-[#00c5dc] text-[#001f24] font-mono-code text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(0,218,243,0.5)] rounded-xl border border-[#00daf3] active:scale-95"
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
