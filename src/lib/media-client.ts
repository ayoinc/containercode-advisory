// Client-side media utilities (browser-safe)
export interface DownloadedMedia {
  id: string;
  type: 'image' | 'video';
  localPath: string;
  url: string;
  photographer: string;
  alt: string;
  downloadedAt: string;
  category: string;
}

// Client-side manifest cache
let manifestCache: Map<string, DownloadedMedia> | null = null;
let manifestPromise: Promise<Map<string, DownloadedMedia>> | null = null;

async function loadManifest(): Promise<Map<string, DownloadedMedia>> {
  if (manifestCache) return manifestCache;
  if (manifestPromise) return manifestPromise;

  manifestPromise = (async () => {
    try {
      const response = await fetch('/images/image-metadata.json');
      if (!response.ok) {
        console.warn('Could not load media manifest');
        return new Map();
      }
      
      const data = await response.json();
      const manifest = new Map(Object.entries(data)) as Map<string, DownloadedMedia>;
      manifestCache = manifest;
      return manifest;
    } catch (error) {
      console.warn('Failed to load media manifest:', error);
      return new Map();
    }
  })();

  return manifestPromise;
}

export async function getLocalImage(category?: string): Promise<DownloadedMedia | null> {
  try {
    const manifest = await loadManifest();
    const allMedia = Array.from(manifest.values()) as DownloadedMedia[];
    const filteredMedia = category 
      ? allMedia.filter(item => item.category === category)
      : allMedia;
    
    if (filteredMedia.length === 0) {
      console.info(`No local images found for category: ${category || 'all'}`);
      return null;
    }
    return filteredMedia[Math.floor(Math.random() * filteredMedia.length)];
  } catch (error) {
    console.warn('Failed to get local image:', error);
    return null;
  }
}

export async function getAllLocalMedia(): Promise<DownloadedMedia[]> {
  try {
    const manifest = await loadManifest();
    return Array.from(manifest.values()) as DownloadedMedia[];
  } catch (error) {
    console.warn('Failed to get all local media:', error);
    return [];
  }
}

export async function getLocalMediaByCategory(category: string): Promise<DownloadedMedia[]> {
  try {
    const allMedia = await getAllLocalMedia();
    return allMedia.filter(item => item.category === category);
  } catch (error) {
    console.warn('Failed to get media by category:', error);
    return [];
  }
}

// Preload manifest for better performance
if (typeof window !== 'undefined') {
  loadManifest().catch(() => {
    // Silently fail if manifest can't be loaded
  });
}