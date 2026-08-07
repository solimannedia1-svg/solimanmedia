export interface VideoSourceInfo {
  type: 'youtube' | 'vimeo' | 'direct' | 'none';
  embedUrl: string;
  originalUrl: string;
}

/**
 * Parses any video URL (YouTube, YouTube Shorts, Vimeo, or Direct MP4/WebM/Blob/Data URL)
 * and returns embed metadata for smooth rendering.
 */
export function getVideoSourceInfo(url: string | undefined): VideoSourceInfo {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { type: 'none', embedUrl: '', originalUrl: '' };
  }

  const trimmed = url.trim();

  // 1. YouTube matcher: watch?v=ID, youtu.be/ID, shorts/ID, embed/ID
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
      originalUrl: trimmed
    };
  }

  // 2. Vimeo matcher: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // 3. Direct video file (MP4, WebM, Blob, Data URL)
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed
  };
}
