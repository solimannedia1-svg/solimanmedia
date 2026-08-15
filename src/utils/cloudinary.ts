/**
 * Cloudinary Integration & Image Optimization Utility
 * 
 * Cloud Name: qazdrpcx
 * Upload Preset: images_soliman
 * Mode: Unsigned Client Uploads
 */

export const CLOUDINARY_CONFIG = {
  cloudName: 'qazdrpcx',
  uploadPreset: 'images_soliman',
  uploadUrl: 'https://api.cloudinary.com/v1_1/qazdrpcx/image/upload',
};

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  created_at?: string;
  [key: string]: any;
}

export interface ImageScanResult {
  id: string;
  type: 'project' | 'gallery' | 'portrait';
  parentId: string;
  parentTitle: string;
  fieldName: string;
  currentUrl: string;
  isCloudinary: boolean;
  sourceType: 'cloudinary' | 'base64' | 'unsplash' | 'youtube_thumb' | 'firebase' | 'external';
  status: 'pending' | 'migrated' | 'migrating' | 'failed';
  newUrl?: string;
  error?: string;
}

/**
 * Checks if a given URL is already hosted on Cloudinary
 */
export function isCloudinaryUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
}

/**
 * Detects the source category of an image URL
 */
export function detectImageSourceType(url?: string): 'cloudinary' | 'base64' | 'unsplash' | 'youtube_thumb' | 'firebase' | 'external' {
  if (!url || typeof url !== 'string') return 'external';
  const lower = url.toLowerCase().trim();
  if (lower.startsWith('data:image/')) return 'base64';
  if (isCloudinaryUrl(url)) return 'cloudinary';
  if (lower.includes('unsplash.com')) return 'unsplash';
  if (lower.includes('ytimg.com') || lower.includes('youtube.com')) return 'youtube_thumb';
  if (lower.includes('firebasestorage.googleapis.com') || lower.includes('firebase')) return 'firebase';
  return 'external';
}

/**
 * Generates an optimized Cloudinary delivery URL with f_auto, q_auto and optional dimensions
 */
export function getOptimizedCloudinaryUrl(
  url?: string,
  options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'scale' | 'fit' | 'limit' | 'thumb';
    quality?: string | number;
    format?: string;
  }
): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return url || '';
  }

  const trimmed = url.trim();

  // If it's a Cloudinary URL, inject standard optimizations
  if (isCloudinaryUrl(trimmed)) {
    // Check if it already has transformations
    const uploadIndex = trimmed.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const prefix = trimmed.substring(0, uploadIndex + 8);
      const rest = trimmed.substring(uploadIndex + 8);

      const transforms: string[] = ['f_auto', 'q_auto'];

      if (options?.width) {
        transforms.push(`w_${options.width}`);
      }
      if (options?.height) {
        transforms.push(`h_${options.height}`);
      }
      if (options?.crop) {
        transforms.push(`c_${options.crop}`);
      }

      const transformString = transforms.join(',');

      // Don't duplicate transformations if already present
      if (rest.startsWith('f_auto') || rest.startsWith('q_auto') || rest.includes('/f_auto')) {
        return trimmed;
      }

      return `${prefix}${transformString}/${rest}`;
    }
  }

  // Non-cloudinary URLs returned as-is
  return trimmed;
}

/**
 * Uploads a local File or Blob directly to Cloudinary using unsigned preset
 */
export async function uploadFileToCloudinary(
  file: File | Blob,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', CLOUDINARY_CONFIG.uploadUrl, true);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
          if (data.secure_url) {
            resolve(data);
          } else {
            reject(new Error(xhr.responseText || 'Missing secure_url in Cloudinary response'));
          }
        } catch (err: any) {
          reject(new Error(`Failed to parse Cloudinary response: ${err.message}`));
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          reject(new Error(errData.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during Cloudinary upload'));
    };

    xhr.send(formData);
  });
}

/**
 * Uploads an image by URL or base64 string to Cloudinary
 */
export async function uploadUrlOrBase64ToCloudinary(
  urlOrBase64: string,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResponse> {
  if (!urlOrBase64 || typeof urlOrBase64 !== 'string' || !urlOrBase64.trim()) {
    throw new Error('Image URL or Data is empty');
  }

  const trimmed = urlOrBase64.trim();

  // If it's already a Cloudinary URL, don't re-upload
  if (isCloudinaryUrl(trimmed)) {
    return {
      secure_url: trimmed,
      public_id: trimmed.split('/').pop() || 'existing_cloudinary',
    };
  }

  // If it's a data URL, upload as is
  if (trimmed.startsWith('data:image/')) {
    const formData = new FormData();
    formData.append('file', trimmed);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const res = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudinary data upload failed: ${errText}`);
    }

    const data = await res.json();
    return data;
  }

  // If it's a remote URL (Unsplash, external, Firebase, etc.)
  // Method 1: Cloudinary allows passing remote URL in `file` parameter for unsigned presets in most configs
  try {
    const formData = new FormData();
    formData.append('file', trimmed);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    const res = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.secure_url) {
        return data;
      }
    }
  } catch (directUrlError) {
    console.warn('Direct URL upload to Cloudinary failed, trying fetch-and-upload blob fallback:', directUrlError);
  }

  // Method 2 Fallback: Fetch image as blob and upload as binary
  try {
    const fetchRes = await fetch(trimmed, { mode: 'cors' });
    if (fetchRes.ok) {
      const blob = await fetchRes.blob();
      return await uploadFileToCloudinary(blob, onProgress);
    }
  } catch (blobError) {
    console.warn('Client blob fetch failed, falling back to server migration endpoint:', blobError);
  }

  // Method 3 Fallback: Server-side proxy migration endpoint
  try {
    const proxyRes = await fetch('/api/cloudinary/migrate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: trimmed }),
    });

    if (proxyRes.ok) {
      const proxyData = await proxyRes.json();
      if (proxyData.secure_url) {
        return proxyData;
      }
    }
    const errText = await proxyRes.text();
    throw new Error(errText);
  } catch (proxyError: any) {
    throw new Error(`Could not migrate image "${trimmed.substring(0, 50)}...": ${proxyError.message || proxyError}`);
  }
}
