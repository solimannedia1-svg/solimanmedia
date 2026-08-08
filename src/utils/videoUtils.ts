export interface VideoSourceInfo {
  type: 'youtube' | 'vimeo' | 'gdrive' | 'streamable' | 'loom' | 'facebook' | 'instagram' | 'tiktok' | 'direct' | 'none';
  embedUrl: string;
  originalUrl: string;
}

/**
 * Parses any video URL (YouTube, YouTube Shorts, Vimeo, Google Drive, Streamable, Loom, Facebook, Instagram, TikTok, or Direct MP4/WebM/Blob/Data URL)
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
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&playsinline=1`,
      originalUrl: trimmed
    };
  }

  // 2. Facebook Video / Reel matcher
  if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) {
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=0`,
      originalUrl: trimmed
    };
  }

  // 3. Instagram Reel / Post matcher
  const instaRegex = /instagram\.com\/(?:p|reel|tv)\/([\w-]+)/;
  const instaMatch = trimmed.match(instaRegex);
  if (instaMatch && instaMatch[1]) {
    return {
      type: 'instagram',
      embedUrl: `https://www.instagram.com/p/${instaMatch[1]}/embed`,
      originalUrl: trimmed
    };
  }

  // 4. TikTok matcher
  const tiktokRegex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
  const tiktokMatch = trimmed.match(tiktokRegex);
  if (tiktokMatch && tiktokMatch[1]) {
    return {
      type: 'tiktok',
      embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // 5. Google Drive video matcher
  const gdriveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=)([\w-]+)/;
  const gdriveMatch = trimmed.match(gdriveRegex);
  if (gdriveMatch && gdriveMatch[1]) {
    return {
      type: 'gdrive',
      embedUrl: `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`,
      originalUrl: trimmed
    };
  }

  // 6. Vimeo matcher
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // 7. Streamable matcher
  const streamableRegex = /streamable\.com\/([\w-]+)/;
  const streamableMatch = trimmed.match(streamableRegex);
  if (streamableMatch && streamableMatch[1]) {
    return {
      type: 'streamable',
      embedUrl: `https://streamable.com/e/${streamableMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // 8. Loom matcher
  const loomRegex = /loom\.com\/(?:share|embed)\/([\w-]+)/;
  const loomMatch = trimmed.match(loomRegex);
  if (loomMatch && loomMatch[1]) {
    return {
      type: 'loom',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      originalUrl: trimmed
    };
  }

  // 9. Direct MP4 / WebM / Data URL / Blob / external link
  return {
    type: 'direct',
    embedUrl: trimmed,
    originalUrl: trimmed
  };
}

/**
 * Extracts YouTube thumbnail URL if videoUrl is a valid YouTube link.
 */
export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80';

/**
 * Checks whether a video URL represents a 9:16 vertical video format (YouTube Short, Instagram Reel, TikTok)
 */
export function isReelVideo(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const lower = url.toLowerCase().trim();
  return (
    lower.includes('/shorts/') ||
    lower.includes('/reel') ||
    lower.includes('tiktok.com') ||
    lower.includes('instagram.com')
  );
}

/**
 * Extracts YouTube thumbnail URL using reliable i.ytimg.com CDN.
 */
export function getYouTubeThumbnail(url: string | undefined): string {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const ytRegex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/;
  const match = url.trim().match(ytRegex);
  if (match && match[1]) {
    return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return '';
}

/**
 * Helper to safely resolve a valid display image for a gallery item,
 * automatically falling back to a YouTube thumbnail or sleek video poster.
 */
export function getItemDisplayImage(item: { image?: string; videoUrl?: string; mediaType?: string } | undefined): string {
  if (!item) return DEFAULT_FALLBACK_IMAGE;
  
  const cleanImg = item.image ? item.image.trim() : '';
  if (cleanImg && !cleanImg.includes('...[large video') && cleanImg !== 'undefined' && cleanImg !== 'null') {
    return cleanImg;
  }
  
  if (item.videoUrl) {
    const ytThumb = getYouTubeThumbnail(item.videoUrl);
    if (ytThumb) return ytThumb;
  }
  
  return DEFAULT_FALLBACK_IMAGE;
}

