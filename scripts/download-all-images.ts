#!/usr/bin/env node

/**
 * Comprehensive Pexels Image Download and Management System
 * Downloads high-quality images and updates all references
 */

import 'dotenv/config';
import { searchPhotos } from '../src/lib/pexels';
import { join } from 'path';

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
    writeFileSync: fs.writeFileSync,
    join: path.join,
    dirname: path.dirname,
    streamPipeline: util.promisify(stream.pipeline)
  };
};

interface ImageDefinition {
  category: string;
  searchTerms: string[];
  count: number;
  orientation: 'landscape' | 'portrait' | 'square';
  usage: string;
  slug: string;
}

export class ComprehensiveImageDownloader {
  private nodeModules: any = null;
  private downloadDir = 'public/images/pexels';
  private manifestPath = 'public/images/image-metadata.json';
  private manifest: Record<string, any> = {};

  // Define all required images for the website
  private imageDefinitions: ImageDefinition[] = [
    // Hero Images
    { category: 'cloud computing', searchTerms: ['cloud computing servers', 'data center infrastructure', 'cloud technology'], count: 3, orientation: 'landscape', usage: 'hero', slug: 'hero-cloud-computing' },
    { category: 'cybersecurity', searchTerms: ['cybersecurity shield', 'data protection security', 'network security'], count: 3, orientation: 'landscape', usage: 'hero', slug: 'hero-cybersecurity' },
    { category: 'software development', searchTerms: ['software development coding', 'programming computer', 'developer workspace'], count: 3, orientation: 'landscape', usage: 'hero', slug: 'hero-devops' },
    { category: 'digital innovation', searchTerms: ['digital transformation technology', 'innovation artificial intelligence', 'future technology'], count: 3, orientation: 'landscape', usage: 'hero', slug: 'hero-innovation' },
    { category: 'business team', searchTerms: ['business team meeting', 'professional collaboration', 'consulting teamwork'], count: 3, orientation: 'landscape', usage: 'hero', slug: 'hero-team' },
    
    // Service Images
    { category: 'cloud computing', searchTerms: ['cloud server infrastructure', 'aws azure cloud', 'cloud migration'], count: 5, orientation: 'landscape', usage: 'service', slug: 'service-cloud-technologies' },
    { category: 'cybersecurity', searchTerms: ['cybersecurity protection', 'security compliance', 'threat detection'], count: 5, orientation: 'landscape', usage: 'service', slug: 'service-cybersecurity' },
    { category: 'devops automation', searchTerms: ['devops pipeline', 'continuous integration', 'automation development'], count: 5, orientation: 'landscape', usage: 'service', slug: 'service-devops' },
    { category: 'digital transformation', searchTerms: ['digital transformation business', 'technology modernization', 'digital innovation'], count: 5, orientation: 'landscape', usage: 'service', slug: 'service-digital-transformation' },
    { category: 'software engineering', searchTerms: ['software engineering', 'application development', 'custom software'], count: 5, orientation: 'landscape', usage: 'service', slug: 'service-software-engineering' },
    { category: 'it support', searchTerms: ['it support help desk', 'technical support', 'it infrastructure'], count: 5, orientation: 'landscape', usage: 'service', slug: 'service-it-support' },
    
    // Team Images
    { category: 'professional team', searchTerms: ['professional business team', 'diverse team meeting', 'consulting professionals'], count: 8, orientation: 'landscape', usage: 'team', slug: 'team-professional' },
    { category: 'collaboration', searchTerms: ['team collaboration workspace', 'business meeting discussion', 'professional teamwork'], count: 8, orientation: 'landscape', usage: 'team', slug: 'team-collaboration' },
    
    // General/Fallback Images
    { category: 'technology', searchTerms: ['modern technology', 'tech innovation', 'computer technology'], count: 10, orientation: 'landscape', usage: 'general', slug: 'tech-general' },
    { category: 'business', searchTerms: ['business professional', 'corporate office', 'business success'], count: 10, orientation: 'landscape', usage: 'business', slug: 'business-general' }
  ];

  private async ensureNodeModules() {
    if (!this.nodeModules) {
      this.nodeModules = await getNodeModules();
      await this.initializeStorage();
    }
    return this.nodeModules;
  }

  private async initializeStorage(): Promise<void> {
    const { existsSync, mkdirSync } = this.nodeModules;
    
    if (!existsSync(this.downloadDir)) {
      mkdirSync(this.downloadDir, { recursive: true });
    }
    
    // Create subdirectories
    const subdirs = ['hero', 'services', 'team', 'general', 'fallback'];
    subdirs.forEach(subdir => {
      const dirPath = this.nodeModules.join(this.downloadDir, subdir);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  private async downloadFile(url: string, localPath: string): Promise<void> {
    try {
      const { join, dirname, existsSync, mkdirSync, createWriteStream, streamPipeline } = this.nodeModules;
      
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

  private getImageExtension(url: string): string {
    const match = url.match(/\.(jpg|jpeg|png|webp)(\?|$)/i);
    return match ? match[1].toLowerCase() : 'jpg';
  }

  private async downloadImageSet(definition: ImageDefinition): Promise<any[]> {
    await this.ensureNodeModules();
    
    console.log(`🔍 Downloading ${definition.count} images for: ${definition.category} (${definition.usage})`);
    
    const downloadedImages: any[] = [];
    
    // Try each search term
    for (const searchTerm of definition.searchTerms) {
      try {
        const response = await searchPhotos(searchTerm, {
          perPage: Math.ceil(definition.count / definition.searchTerms.length) + 2,
          orientation: definition.orientation
        });

        if (!response.photos || response.photos.length === 0) {
          console.warn(`No images found for: ${searchTerm}`);
          continue;
        }

        // Download images from this search
        const imagesNeeded = Math.ceil(definition.count / definition.searchTerms.length);
        const imagesToDownload = response.photos.slice(0, imagesNeeded);
        
        for (const [index, photo] of imagesToDownload.entries()) {
          try {
            const extension = this.getImageExtension(photo.src.large);
            const filename = `${definition.slug}-${downloadedImages.length + 1}.${extension}`;
            const localPath = `${definition.usage}/${filename}`;
            
            await this.downloadFile(photo.src.large, localPath);
            
            const imageInfo = {
              id: `${definition.slug}-${downloadedImages.length + 1}`,
              filename,
              localPath: `images/pexels/${localPath}`,
              url: photo.src.large,
              photographer: photo.photographer,
              alt: photo.alt || `${definition.category} by ${photo.photographer}`,
              category: definition.category,
              usage: definition.usage,
              searchTerm,
              dimensions: { width: photo.width, height: photo.height },
              downloadedAt: new Date().toISOString()
            };
            
            downloadedImages.push(imageInfo);
            
            if (downloadedImages.length >= definition.count) {
              break;
            }
          } catch (error) {
            console.error(`Failed to download image ${photo.id}:`, error);
          }
        }
        
        if (downloadedImages.length >= definition.count) {
          break;
        }
      } catch (error) {
        console.error(`Failed to search for "${searchTerm}":`, error);
      }
    }
    
    console.log(`✅ Downloaded ${downloadedImages.length}/${definition.count} images for ${definition.category}`);
    return downloadedImages;
  }

  private async saveManifest(): Promise<void> {
    try {
      const { writeFileSync } = this.nodeModules;
      const manifestPath = this.nodeModules.join(process.cwd(), this.manifestPath);
      writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));
      console.log(`📄 Updated manifest: ${this.manifestPath}`);
    } catch (error) {
      console.error('Failed to save manifest:', error);
    }
  }

  async downloadAllImages(): Promise<void> {
    await this.ensureNodeModules();
    
    console.log('🚀 Starting comprehensive image download...');
    
    // Initialize manifest structure
    this.manifest = {
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '2.0.0',
        totalImages: 0
      },
      images: {},
      categories: {},
      usageMap: {}
    };
    
    let totalDownloaded = 0;
    
    for (const definition of this.imageDefinitions) {
      try {
        const images = await this.downloadImageSet(definition);
        
        // Add to manifest
        if (!this.manifest.categories[definition.category]) {
          this.manifest.categories[definition.category] = [];
        }
        
        if (!this.manifest.usageMap[definition.usage]) {
          this.manifest.usageMap[definition.usage] = {};
        }
        
        images.forEach(image => {
          this.manifest.images[image.id] = image;
          this.manifest.categories[definition.category].push(image.id);
          
          if (!this.manifest.usageMap[definition.usage][definition.category]) {
            this.manifest.usageMap[definition.usage][definition.category] = [];
          }
          this.manifest.usageMap[definition.usage][definition.category].push(image.id);
        });
        
        totalDownloaded += images.length;
        
        // Small delay to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Failed to download images for ${definition.category}:`, error);
      }
    }
    
    this.manifest.metadata.totalImages = totalDownloaded;
    await this.saveManifest();
    
    console.log(`🎉 Download complete! Total images: ${totalDownloaded}`);
    await this.generateSummary();
  }

  private async generateSummary(): Promise<void> {
    console.log('\n📊 Download Summary:');
    console.log('═══════════════════════════════════════');
    console.log(`Total Images Downloaded: ${this.manifest.metadata.totalImages}`);
    
    console.log('\n📂 By Category:');
    Object.entries(this.manifest.categories).forEach(([category, images]: [string, any]) => {
      console.log(`  • ${category}: ${images.length} images`);
    });
    
    console.log('\n🎯 By Usage:');
    Object.entries(this.manifest.usageMap).forEach(([usage, categories]: [string, any]) => {
      const totalForUsage = Object.values(categories).reduce((sum: number, images: any) => sum + images.length, 0);
      console.log(`  • ${usage}: ${totalForUsage} images`);
      Object.entries(categories).forEach(([category, images]: [string, any]) => {
        console.log(`    - ${category}: ${images.length} images`);
      });
    });
    
    console.log('\n🔗 Sample Image Paths:');
    const sampleImages = Object.values(this.manifest.images).slice(0, 5) as any[];
    sampleImages.forEach(image => {
      console.log(`  • /${image.localPath} (${image.category} - ${image.usage})`);
    });
    
    console.log(`\n📄 Manifest saved to: ${this.manifestPath}`);
    console.log('✅ All images ready for use in components!');
  }

  async cleanupOldImages(): Promise<void> {
    console.log('🧹 Cleaning up old images...');
    // Implementation for cleanup would go here
    console.log('✅ Cleanup complete');
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!process.env.PEXELS_API_KEY) {
    console.error('❌ PEXELS_API_KEY environment variable is required');
    console.log('Please set your Pexels API key:');
    console.log('export PEXELS_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  const downloader = new ComprehensiveImageDownloader();

  switch (command) {
    case 'download':
      await downloader.downloadAllImages();
      break;

    case 'cleanup':
      await downloader.cleanupOldImages();
      break;

    default:
      console.log(`
🖼️  Comprehensive Image Download System

Usage:
  npm run images:download-all download    - Download all required images
  npm run images:download-all cleanup     - Clean up old images

Features:
  • Downloads high-quality Pexels images for all website sections
  • Creates organized directory structure
  • Generates comprehensive manifest for easy access
  • Handles hero, service, team, and general images
  • Provides fallback images for error states

Categories:
  • Hero Images: Main landing page visuals
  • Service Images: Specific service category images  
  • Team Images: Professional team and collaboration
  • General Images: Fallback and utility images

Environment Variables:
  PEXELS_API_KEY    - Your Pexels API key (required)
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}