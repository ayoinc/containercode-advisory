#!/usr/bin/env node

/**
 * Media Download CLI
 * Downloads and manages Pexels images/videos for the website
 */

import { downloadAllHeroImages, downloadCategoryImages, mediaDownloader, getAllLocalMedia } from '../src/lib/media-downloader';

interface DownloadConfig {
  categories: string[];
  count: number;
  quality: 'small' | 'medium' | 'large' | 'original';
  cleanup: boolean;
  force: boolean;
}

class MediaDownloadCLI {
  private config: DownloadConfig;

  constructor(config: DownloadConfig) {
    this.config = config;
  }

  async run(): Promise<void> {
    console.log('🖼️  Starting Media Download Process');
    console.log('Configuration:', this.config);

    try {
      // Validate Pexels API key
      if (!process.env.PEXELS_API_KEY) {
        console.warn('⚠️  PEXELS_API_KEY not set - media downloads will be skipped');
        console.log('To enable media downloads, set your Pexels API key:');
        console.log('export PEXELS_API_KEY="your-api-key-here"');
        return;
      }

      // Cleanup old media if requested
      if (this.config.cleanup) {
        console.log('🧹 Cleaning up old media files...');
        await mediaDownloader.cleanupOldMedia();
      }

      // Download hero images for all categories
      if (this.config.categories.includes('all') || this.config.categories.includes('hero')) {
        console.log('🚀 Downloading hero images...');
        await downloadAllHeroImages();
      }

      // Download specific categories
      for (const category of this.config.categories) {
        if (category !== 'all' && category !== 'hero') {
          console.log(`🔍 Downloading ${this.config.count} images for: ${category}`);
          await downloadCategoryImages(category, this.config.count);
        }
      }

      // Show summary
      await this.showSummary();

      console.log('✅ Media download process completed successfully');
    } catch (error) {
      console.error('❌ Media download failed:', error);
      process.exit(1);
    }
  }

  private async showSummary(): Promise<void> {
    const allMedia = getAllLocalMedia();
    const categorySet = new Set(allMedia.map(m => m.category));
    const categories = Array.from(categorySet);
    
    console.log('\n📊 Download Summary:');
    console.log(`Total media files: ${allMedia.length}`);
    console.log('Categories:');
    
    categories.forEach(category => {
      const count = allMedia.filter(m => m.category === category).length;
      console.log(`  - ${category}: ${count} files`);
    });

    console.log('\n📁 Available local media:');
    allMedia.slice(0, 5).forEach(media => {
      console.log(`  - ${media.localPath} (by ${media.photographer})`);
    });

    if (allMedia.length > 5) {
      console.log(`  ... and ${allMedia.length - 5} more files`);
    }
  }

  private async listCategories(): Promise<void> {
    console.log('\n📂 Available categories:');
    const categories = [
      'cloud computing - Data centers, servers, cloud infrastructure',
      'cybersecurity - Security, data protection, network security',
      'software development - Coding, development, programming',
      'business team - Teamwork, collaboration, meetings',
      'digital innovation - AI, technology, innovation',
      'consulting - Business consulting, strategy',
      'data analytics - Analytics, charts, data visualization',
      'mobile development - Mobile apps, smartphones',
      'networking - Networks, connectivity, communication',
      'automation - Process automation, robotics'
    ];

    categories.forEach(cat => console.log(`  • ${cat}`));
  }

  private async validateEnvironment(): Promise<void> {
    console.log('🔍 Validating environment...');
    
    const requiredDirs = ['public', 'public/media'];
    const fs = await import('fs');
    
    requiredDirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        console.log(`📁 Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    if (process.env.PEXELS_API_KEY) {
      console.log('✅ PEXELS_API_KEY configured');
    } else {
      console.log('⚠️  PEXELS_API_KEY not configured');
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const config: DownloadConfig = {
    categories: args.includes('--category') 
      ? args[args.indexOf('--category') + 1]?.split(',') || ['hero']
      : ['hero'],
    count: parseInt(args.find(arg => arg.startsWith('--count='))?.split('=')[1] || '5'),
    quality: (args.find(arg => arg.startsWith('--quality='))?.split('=')[1] as any) || 'large',
    cleanup: args.includes('--cleanup'),
    force: args.includes('--force')
  };

  switch (command) {
    case 'download':
      const downloader = new MediaDownloadCLI(config);
      await downloader.run();
      break;

    case 'list':
      const lister = new MediaDownloadCLI(config);
      await lister['listCategories']();
      break;

    case 'summary':
      const summarizer = new MediaDownloadCLI(config);
      await summarizer['showSummary']();
      break;

    case 'validate':
      const validator = new MediaDownloadCLI(config);
      await validator['validateEnvironment']();
      break;

    default:
      console.log(`
🖼️  Media Download CLI

Usage:
  npm run media:download [options]         - Download media files
  npm run media:list                       - List available categories  
  npm run media:summary                    - Show download summary
  npm run media:validate                   - Validate environment

Options:
  --category=<categories>                  - Comma-separated categories (default: hero)
  --count=<number>                         - Number of images per category (default: 5)
  --quality=<quality>                      - Image quality: small|medium|large|original (default: large)
  --cleanup                                - Remove old media files
  --force                                  - Force re-download existing files

Examples:
  npm run media:download --category=hero --count=10
  npm run media:download --category="cloud computing,cybersecurity" --count=5
  npm run media:download --cleanup --force
  npm run media:list
  npm run media:summary

Environment Variables:
  PEXELS_API_KEY                          - Your Pexels API key (required)

Categories:
  hero                                    - Download hero images for all sections
  all                                     - Download from all categories
  cloud computing                         - Cloud infrastructure images
  cybersecurity                           - Security and protection images  
  software development                    - Development and coding images
  business team                           - Team and collaboration images
  digital innovation                      - Technology and innovation images
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { MediaDownloadCLI, type DownloadConfig };