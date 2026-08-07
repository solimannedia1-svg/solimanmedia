export interface VideoSourceInfo {
  type: 'youtube' | 'vimeo' | 'gdrive' | 'direct' | 'none';
  embedUrl: string;
  originalUrl: string;
}

/**
 * Parses any video URL (YouTube, YouTube Shorts, Vimeo, Google Drive, or Direct MP4/WebM/Blob/Data URL)
 * and returns embed metadata for smooth playback.
 */
export function getVideoSourceInfo(url: string | undefined): VideoSourceInfo {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { type: 'none', embedUrl: '', originalUrl: '' };
  }

  const trimmed = url.trim();

  // Fallback for truncated large string placeholder
  if (trimmed.includes('...[large video')) {
    return {
      type: 'direct',
      embedUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      originalUrl: trimmed
    };
  }

  // 1. YouTube matcher: watch?v=ID, youtu.be/ID, shorts/ID, embed/ID, live/ID
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1&playsinline=1`,
      originalUrl: trimmed
    };
  }

  // 2. Google Drive video matcher
  const gdriveRegex = /drive\.google\.com\/file\/d\/([\w-]+)/;
  const gdriveMatch = trimmed.match(gdriveRegex);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
      originalUrl: trimmed
    };
  }

  // 3. Vimeo matcher
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // 4. Direct MP4 / WebM / Data URL / Blob / external link
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed
  };
}
