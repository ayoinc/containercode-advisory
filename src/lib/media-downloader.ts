// Server-side only - Node.js environment required
import { searchPhotos, getPhoto } from './pexels';
import { join } from 'path';
import type { Photo } from 'pexels';

// Dynamic imports for Node.js modules to prevent bundling issues
const getNodeModules = async () => {
  if (typeof window !== 'undefined') {
    throw new Error('Media downloader can only be used server-side');
  }
  
  const fs = await import('fs');
  const path = await import('path');
  const util = await import('util');
  const stream = await import('stream');
  
  return {
    createWriteStream: fs.createWriteStream,
    existsSync: fs.existsSync,
    mkdirSync: fs.mkdirSync,
    join: path.join,
    dirname: path.dirname,
    streamPipeline: util.promisify(stream.pipeline)
  };
};

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

export interface MediaDownloadOptions {
  category: string;
  count?: number;
  quality?: 'small' | 'medium' | 'large' | 'original';
  orientation?: 'landscape' | 'portrait' | 'square';
  forceRedownload?: boolean;
}

class MediaDownloader {
  private downloadDir: string;
  private manifestPath: string;
  private manifest: Map<string, DownloadedMedia>;
  private nodeModules: any = null;

  constructor(downloadDir = 'public/media/pexels') {
    this.downloadDir = downloadDir;
    this.manifestPath = '';
    this.manifest = new Map();
  }

  private async ensureNodeModules() {
    if (!this.nodeModules) {
      this.nodeModules = await getNodeModules();
      this.manifestPath = this.nodeModules.join(this.downloadDir, 'manifest.json');
      await this.initializeStorage();
      await this.loadManifest();
    }
    return this.nodeModules;
  }

  private async initializeStorage(): Promise<void> {
    const { existsSync, mkdirSync, join } = await this.ensureNodeModules();
    
    if (!existsSync(this.downloadDir)) {
      mkdirSync(this.downloadDir, { recursive: true });
    }
    
    // Create subdirectories for different categories
    const categories = ['cloud', 'security', 'devops', 'team', 'innovation'];
    categories.forEach(category => {
      const categoryDir = join(this.downloadDir, category);
      if (!existsSync(categoryDir)) {
        mkdirSync(categoryDir, { recursive: true });
      }
    });
  }

  private async loadManifest(): Promise<void> {
    try {
      const { existsSync } = this.nodeModules;
      if (existsSync(this.manifestPath)) {
        const data = require(this.manifestPath);
        this.manifest = new Map(Object.entries(data));
      }
    } catch (error) {
      console.warn('Could not load media manifest:', error);
    }
  }

  private async saveManifest(): Promise<void> {
    try {
      const manifestData = Object.fromEntries(this.manifest);
      const fs = await import('fs/promises');
      await fs.writeFile(this.manifestPath, JSON.stringify(manifestData, null, 2));
    } catch (error) {
      console.error('Failed to save media manifest:', error);
    }
  }

  private async getLocalFilename(photo: Photo, quality: string, category: string): Promise<string> {
    const extension = this.getImageExtension(photo.src[quality as keyof typeof photo.src] || photo.src.medium);
    return `${category}/${photo.id}_${quality}.${extension}`;
  }

  private getImageExtension(url: string): string {
    const match = url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i);
    return match ? match[1].toLowerCase() : 'jpg';
  }

  private async downloadFile(url: string, localPath: string): Promise<void> {
    try {
      const { join, dirname, existsSync, mkdirSync, createWriteStream, streamPipeline } = await this.ensureNodeModules();
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const fullPath = join(this.downloadDir, localPath);
      const dir = dirname(fullPath);
      
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const fileStream = createWriteStream(fullPath);
      
      if (response.body) {
        await streamPipeline(response.body as any, fileStream);
      } else {
        throw new Error('No response body');
      }
      
      console.log(`✅ Downloaded: ${localPath}`);
    } catch (error) {
      console.error(`❌ Failed to download ${url}:`, error);
      throw error;
    }
  }

  async downloadImagesForCategory(options: MediaDownloadOptions): Promise<DownloadedMedia[]> {
    await this.ensureNodeModules();
    
    const { category, count = 5, quality = 'large', orientation = 'landscape', forceRedownload = false } = options;
    
    console.log(`🔍 Searching for ${count} ${category} images...`);
    
    try {
      // Search for images
      const searchResults = await searchPhotos(category, {
        perPage: count,
        orientation
      });

      if (!searchResults.photos || searchResults.photos.length === 0) {
        console.warn(`No images found for category: ${category}`);
        return [];
      }

      const downloadedMedia: DownloadedMedia[] = [];

      for (const photo of searchResults.photos.slice(0, count)) {
        const mediaId = `${photo.id}_${quality}`;
        
        // Check if already downloaded
        if (!forceRedownload && this.manifest.has(mediaId)) {
          const existing = this.manifest.get(mediaId)!;
          console.log(`⏭️  Skipping ${mediaId} (already downloaded)`);
          downloadedMedia.push(existing);
          continue;
        }

        try {
          const localPath = await this.getLocalFilename(photo, quality, category);
          const imageUrl = photo.src[quality as keyof typeof photo.src] || photo.src.medium;
          
          await this.downloadFile(imageUrl, localPath);

          const downloadedItem: DownloadedMedia = {
            id: mediaId,
            type: 'image',
            localPath: `media/pexels/${localPath}`,
            url: imageUrl,
            photographer: photo.photographer,
            alt: photo.alt || `${category} image by ${photo.photographer}`,
            downloadedAt: new Date().toISOString(),
            category
          };

          this.manifest.set(mediaId, downloadedItem);
          downloadedMedia.push(downloadedItem);
        } catch (error) {
          console.error(`Failed to download image ${photo.id}:`, error);
        }
      }

      await this.saveManifest();
      
      console.log(`✅ Downloaded ${downloadedMedia.length} images for category: ${category}`);
      return downloadedMedia;

    } catch (error) {
      console.error(`Failed to download images for category ${category}:`, error);
      return [];
    }
  }

  async downloadHeroImages(): Promise<DownloadedMedia[]> {
    console.log('🚀 Downloading hero images for ContainerCode Advisory...');
    
    const categories = [
      { name: 'cloud computing', category: 'cloud', count: 3 },
      { name: 'cybersecurity', category: 'security', count: 3 },
      { name: 'software development', category: 'devops', count: 3 },
      { name: 'business team', category: 'team', count: 3 },
      { name: 'digital innovation', category: 'innovation', count: 3 }
    ];

    const allDownloaded: DownloadedMedia[] = [];

    for (const cat of categories) {
      try {
        const downloaded = await this.downloadImagesForCategory({
          category: cat.name,
          count: cat.count,
          quality: 'large',
          orientation: 'landscape'
        });
        allDownloaded.push(...downloaded);
      } catch (error) {
        console.error(`Failed to download ${cat.category} images:`, error);
      }
    }

    return allDownloaded;
  }

  getLocalMedia(category?: string): DownloadedMedia[] {
    const allMedia = Array.from(this.manifest.values());
    return category ? allMedia.filter(item => item.category === category) : allMedia;
  }

  getRandomLocalImage(category?: string): DownloadedMedia | null {
    const media = this.getLocalMedia(category);
    if (media.length === 0) return null;
    return media[Math.floor(Math.random() * media.length)];
  }

  async cleanupOldMedia(maxAge: number = 30 * 24 * 60 * 60 * 1000): Promise<void> {
    const now = Date.now();
    const toDelete: string[] = [];

    for (const [id, media] of Array.from(this.manifest.entries())) {
      const age = now - new Date(media.downloadedAt).getTime();
      if (age > maxAge) {
        toDelete.push(id);
        try {
          const fs = await import('fs/promises');
          const fullPath = join(process.cwd(), 'public', media.localPath);
          await fs.unlink(fullPath);
          console.log(`🗑️  Deleted old media: ${media.localPath}`);
        } catch (error) {
          console.warn(`Could not delete ${media.localPath}:`, error);
        }
      }
    }

    toDelete.forEach(id => this.manifest.delete(id));
    if (toDelete.length > 0) {
      await this.saveManifest();
      console.log(`✅ Cleaned up ${toDelete.length} old media files`);
    }
  }
}

export const mediaDownloader = new MediaDownloader();

// Helper functions for easy usage
export async function downloadCategoryImages(category: string, count: number = 5): Promise<DownloadedMedia[]> {
  return mediaDownloader.downloadImagesForCategory({ category, count });
}

export async function downloadAllHeroImages(): Promise<DownloadedMedia[]> {
  return mediaDownloader.downloadHeroImages();
}

export function getLocalImage(category?: string): DownloadedMedia | null {
  return mediaDownloader.getRandomLocalImage(category);
}

export function getAllLocalMedia(): DownloadedMedia[] {
  return mediaDownloader.getLocalMedia();
}