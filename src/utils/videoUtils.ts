export interface VideoSourceInfo {
  type: 'youtube' | 'vimeo' | 'gdrive' | 'streamable' | 'loom' | 'direct' | 'none';
  embedUrl: string;
  originalUrl: string;
}

/**
 * Parses any video URL (YouTube, YouTube Shorts, Vimeo, Google Drive, Streamable, Loom, or Direct MP4/WebM/Blob/Data URL)
 * and returns embed metadata for smooth playback across desktop and mobile.
 */
export function getVideoSourceInfo(url: string | undefined): VideoSourceInfo {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { type: 'none', embedUrl: '', originalUrl: '' };
  }

  const trimmed = url.trim();

  // Handle truncated base64 placeholder when video was too large for Firestore document
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
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1&playsinline=1`,
      originalUrl: trimmed
    };
  }

  // 2. Google Drive video matcher
  const gdriveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/;
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

  // 4. Streamable matcher
  const streamableRegex = /streamable\.com\/([\w-]+)/;
  const streamableMatch = trimmed.match(streamableRegex);
  if (streamableMatch && streamableMatch[1]) {
    return {
      type: 'streamable',
      embedUrl: `https://streamable.com/e/${streamableMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // 5. Loom matcher
  const loomRegex = /loom\.com\/(?:share|embed)\/([\w-]+)/;
  const loomMatch = trimmed.match(loomRegex);
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // 6. Direct MP4 / WebM / Data URL / Blob / external link
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed
  };
}
