#!/usr/bin/env node

/**
 * Autonomous Pexels Image Downloader for ContainerCode Advisory
 * Downloads appropriate images for all placeholder areas
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Pexels API configuration
const PEXELS_API_KEY = 'vItppRQs2ePF4KaTb7ugqEjTCi8KiziBkOaASfNdJKXP6LSaywsFF9QF';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Image download configuration
const config = {
  downloadPath: './public/images/pexels',
  quality: 85,
  perPage: 5, // Multiple options per category
  orientation: 'landscape', // Default orientation
  sizes: {
    hero: { width: 1600, height: 900 },
    service: { width: 800, height: 600 },
    team: { width: 400, height: 400 },
    blog: { width: 800, height: 450 },
    case_study: { width: 1200, height: 675 }
  }
};

// Comprehensive image requirements based on codebase analysis
const imageRequirements = {
  // Hero section images - highest priority
  hero: [
    {
      query: 'cloud computing data center',
      filename: 'hero-cloud-computing',
      alt: 'Modern cloud computing data center with servers',
      usage: 'Main hero section background',
      dimensions: config.sizes.hero,
      priority: 1
    },
    {
      query: 'digital transformation technology',
      filename: 'hero-digital-transformation',
      alt: 'Digital transformation and modern technology',
      usage: 'Alternative hero background',
      dimensions: config.sizes.hero,
      priority: 1
    },
    {
      query: 'cybersecurity network protection',
      filename: 'hero-cybersecurity',
      alt: 'Cybersecurity and network protection visualization',
      usage: 'Security-focused hero image',
      dimensions: config.sizes.hero,
      priority: 1
    }
  ],

  // Service category images - high priority
  services: [
    {
      query: 'cloud computing infrastructure',
      filename: 'service-cloud-technologies',
      alt: 'Multi-cloud infrastructure and technologies',
      category: 'cloud-technologies',
      dimensions: config.sizes.service,
      priority: 2
    },
    {
      query: 'cybersecurity data protection',
      filename: 'service-cybersecurity',
      alt: 'Cybersecurity and data protection',
      category: 'cybersecurity',
      dimensions: config.sizes.service,
      priority: 2
    },
    {
      query: 'devops automation software development',
      filename: 'service-devops',
      alt: 'DevOps automation and software development',
      category: 'devops',
      dimensions: config.sizes.service,
      priority: 2
    },
    {
      query: 'digital innovation technology transformation',
      filename: 'service-digital-transformation',
      alt: 'Digital transformation and innovation',
      category: 'digital-transformation',
      dimensions: config.sizes.service,
      priority: 2
    },
    {
      query: 'software engineering programming',
      filename: 'service-software-engineering',
      alt: 'Software engineering and programming',
      category: 'software-engineering',
      dimensions: config.sizes.service,
      priority: 2
    },
    {
      query: 'it support managed services',
      filename: 'service-it-support',
      alt: 'IT support and managed services',
      category: 'it-support',
      dimensions: config.sizes.service,
      priority: 2
    }
  ],

  // Case study industry images - high priority
  case_studies: [
    {
      query: 'fintech financial technology',
      filename: 'case-study-fintech',
      alt: 'Financial technology and fintech solutions',
      industry: 'fintech',
      dimensions: config.sizes.case_study,
      priority: 2
    },
    {
      query: 'healthcare technology medical data',
      filename: 'case-study-healthcare',
      alt: 'Healthcare technology and medical data systems',
      industry: 'healthcare',
      dimensions: config.sizes.case_study,
      priority: 2
    },
    {
      query: 'manufacturing industry automation',
      filename: 'case-study-manufacturing',
      alt: 'Manufacturing industry automation and technology',
      industry: 'manufacturing',
      dimensions: config.sizes.case_study,
      priority: 2
    },
    {
      query: 'ecommerce online retail technology',
      filename: 'case-study-ecommerce',
      alt: 'E-commerce and online retail technology',
      industry: 'ecommerce',
      dimensions: config.sizes.case_study,
      priority: 2
    }
  ],

  // Team member images - medium priority
  team: [
    {
      query: 'professional business team diverse',
      filename: 'team-professional-group',
      alt: 'Professional business team working together',
      usage: 'Team page group photo',
      dimensions: config.sizes.team,
      priority: 3,
      orientation: 'landscape'
    },
    {
      query: 'business professional headshot african american man',
      filename: 'team-leader-male',
      alt: 'Professional business leader headshot',
      usage: 'Founder profile image',
      dimensions: config.sizes.team,
      priority: 3,
      orientation: 'square'
    },
    {
      query: 'business professional woman asian engineer',
      filename: 'team-engineer-female',
      alt: 'Professional female engineer',
      usage: 'Senior engineer profile',
      dimensions: config.sizes.team,
      priority: 3,
      orientation: 'square'
    },
    {
      query: 'cybersecurity professional consultant',
      filename: 'team-security-consultant',
      alt: 'Cybersecurity professional consultant',
      usage: 'Security consultant profile',
      dimensions: config.sizes.team,
      priority: 3,
      orientation: 'square'
    }
  ],

  // Blog and content images - medium priority
  blog: [
    {
      query: 'cloud strategy technology',
      filename: 'blog-cloud-strategy',
      alt: 'Cloud strategy and technology planning',
      category: 'cloud-strategy',
      dimensions: config.sizes.blog,
      priority: 3
    },
    {
      query: 'cybersecurity best practices',
      filename: 'blog-cybersecurity-insights',
      alt: 'Cybersecurity insights and best practices',
      category: 'cybersecurity',
      dimensions: config.sizes.blog,
      priority: 3
    },
    {
      query: 'devops automation tools',
      filename: 'blog-devops-automation',
      alt: 'DevOps automation tools and processes',
      category: 'devops',
      dimensions: config.sizes.blog,
      priority: 3
    }
  ],

  // Fallback placeholder - low priority
  fallback: [
    {
      query: 'modern technology abstract digital',
      filename: 'placeholder-technology-modern',
      alt: 'Modern technology and digital innovation',
      usage: 'Enhanced fallback placeholder',
      dimensions: { width: 1200, height: 800 },
      priority: 4
    }
  ]
};

class PexelsImageDownloader {
  constructor() {
    this.downloadedCount = 0;
    this.errors = [];
    this.manifest = {
      metadata: {
        downloadDate: new Date().toISOString(),
        totalImages: 0,
        categories: {},
        apiKey: 'pexels',
        version: '1.0.0'
      },
      images: {}
    };
  }

  async init() {
    console.log('🚀 Starting autonomous Pexels image download process...');
    console.log('📁 Creating download directory...');
    
    try {
      await fs.mkdir(config.downloadPath, { recursive: true });
      console.log(`✅ Download directory ready: ${config.downloadPath}`);
    } catch (error) {
      console.error('❌ Failed to create download directory:', error);
      throw error;
    }
  }

  async searchPexels(query, orientation = 'landscape', perPage = 5) {
    const url = `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${perPage}&page=1`;
    
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'Authorization': PEXELS_API_KEY,
          'User-Agent': 'ContainerCode-Advisory/1.0'
        }
      };

      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.photos && response.photos.length > 0) {
              resolve(response.photos);
            } else {
              reject(new Error(`No images found for query: ${query}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse Pexels response: ${error.message}`));
          }
        });
      }).on('error', (error) => {
        reject(new Error(`Pexels API request failed: ${error.message}`));
      });
    });
  }

  async downloadImage(url, filepath, metadata) {
    return new Promise((resolve, reject) => {
      const file = require('fs').createWriteStream(filepath);
      
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          this.downloadedCount++;
          resolve(metadata);
        });
        
        file.on('error', (error) => {
          fs.unlink(filepath).catch(() => {}); // Clean up failed download
          reject(error);
        });
      }).on('error', (error) => {
        reject(error);
      });
    });
  }

  selectBestImage(photos, requirements) {
    // Score images based on suitability
    const scored = photos.map(photo => {
      let score = 0;
      
      // Prefer higher resolution
      const resolution = photo.width * photo.height;
      score += Math.min(resolution / 1000000, 10); // Max 10 points for resolution
      
      // Prefer landscape orientation for most use cases
      const aspectRatio = photo.width / photo.height;
      if (requirements.orientation === 'landscape' && aspectRatio > 1.2) {
        score += 5;
      } else if (requirements.orientation === 'square' && aspectRatio >= 0.8 && aspectRatio <= 1.2) {
        score += 5;
      }
      
      // Prefer images with good aspect ratios for intended use
      const targetRatio = requirements.dimensions.width / requirements.dimensions.height;
      const ratioDiff = Math.abs(aspectRatio - targetRatio);
      score += Math.max(0, 5 - ratioDiff * 2);
      
      return { ...photo, score };
    });
    
    // Sort by score and return best match
    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }

  async processImageCategory(categoryName, requirements) {
    console.log(`\n📂 Processing category: ${categoryName}`);
    const categoryResults = [];
    
    for (const req of requirements) {
      try {
        console.log(`🔍 Searching for: "${req.query}"`);
        
        const photos = await this.searchPexels(
          req.query, 
          req.orientation || config.orientation, 
          config.perPage
        );
        
        const bestPhoto = this.selectBestImage(photos, req);
        
        // Choose appropriate image size URL
        let imageUrl;
        if (req.dimensions.width >= 1200) {
          imageUrl = bestPhoto.src.large2x || bestPhoto.src.large;
        } else if (req.dimensions.width >= 800) {
          imageUrl = bestPhoto.src.large || bestPhoto.src.medium;
        } else {
          imageUrl = bestPhoto.src.medium || bestPhoto.src.small;
        }
        
        const filename = `${req.filename}.jpg`;
        const filepath = path.join(config.downloadPath, filename);
        
        const metadata = {
          id: bestPhoto.id,
          photographer: bestPhoto.photographer,
          photographer_url: bestPhoto.photographer_url,
          pexels_url: bestPhoto.url,
          filename: filename,
          alt: req.alt,
          category: categoryName,
          usage: req.usage || req.category || categoryName,
          dimensions: req.dimensions,
          original_size: {
            width: bestPhoto.width,
            height: bestPhoto.height
          },
          download_date: new Date().toISOString(),
          query: req.query,
          priority: req.priority
        };
        
        await this.downloadImage(imageUrl, filepath, metadata);
        
        // Add to manifest
        this.manifest.images[req.filename] = metadata;
        categoryResults.push(metadata);
        
        // Small delay to be respectful to API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Failed to process "${req.query}":`, error.message);
        this.errors.push({
          query: req.query,
          filename: req.filename,
          error: error.message
        });
      }
    }
    
    this.manifest.metadata.categories[categoryName] = {
      count: categoryResults.length,
      images: categoryResults.map(r => r.filename)
    };
    
    return categoryResults;
  }

  async generateManifest() {
    this.manifest.metadata.totalImages = this.downloadedCount;
    this.manifest.metadata.errors = this.errors;
    
    const manifestPath = path.join(config.downloadPath, 'manifest.json');
    await fs.writeFile(
      manifestPath, 
      JSON.stringify(this.manifest, null, 2), 
      'utf8'
    );
    
    console.log(`📋 Generated manifest: ${manifestPath}`);
  }

  async generateReadme() {
    const readmeContent = `# Pexels Images for ContainerCode Advisory

This directory contains images downloaded from Pexels for use throughout the ContainerCode Advisory website.

## Download Summary
- **Total Images Downloaded:** ${this.downloadedCount}
- **Download Date:** ${this.manifest.metadata.downloadDate}
- **Categories:** ${Object.keys(this.manifest.metadata.categories).join(', ')}

## Image Categories

${Object.entries(this.manifest.metadata.categories).map(([category, info]) => `
### ${category.charAt(0).toUpperCase() + category.slice(1)}
- **Count:** ${info.count} images
- **Files:** ${info.images.join(', ')}
`).join('')}

## Usage Guidelines

All images are from Pexels and are free to use under the Pexels License:
- ✅ Free for commercial and personal use
- ✅ No attribution required (but appreciated)
- ✅ Can be modified and edited
- ❌ Cannot be sold as-is on stock photo sites

## Image Optimization

Images are optimized for web use:
- **Format:** JPEG for photographs
- **Quality:** 85% compression for optimal size/quality balance
- **Responsive:** Multiple sizes available for different breakpoints

## Attribution

While not required, we appreciate the talented photographers:

${Object.values(this.manifest.images).map(img => `
- **${img.filename}** by [${img.photographer}](${img.photographer_url}) on [Pexels](${img.pexels_url})
`).join('')}

## Manifest

See \`manifest.json\` for complete metadata including original sources, dimensions, and usage information.
`;

    const readmePath = path.join(config.downloadPath, 'README.md');
    await fs.writeFile(readmePath, readmeContent, 'utf8');
    
    console.log(`📚 Generated README: ${readmePath}`);
  }

  async run() {
    try {
      await this.init();
      
      // Process images by priority
      const sortedCategories = Object.entries(imageRequirements)
        .sort(([,a], [,b]) => {
          const avgPriorityA = a.reduce((sum, req) => sum + req.priority, 0) / a.length;
          const avgPriorityB = b.reduce((sum, req) => sum + req.priority, 0) / b.length;
          return avgPriorityA - avgPriorityB;
        });
      
      for (const [categoryName, requirements] of sortedCategories) {
        await this.processImageCategory(categoryName, requirements);
      }
      
      await this.generateManifest();
      await this.generateReadme();
      
      console.log('\n🎉 Autonomous image download completed!');
      console.log(`📊 Results:`);
      console.log(`   ✅ Successfully downloaded: ${this.downloadedCount} images`);
      console.log(`   ❌ Errors: ${this.errors.length}`);
      
      if (this.errors.length > 0) {
        console.log('\n⚠️  Errors encountered:');
        this.errors.forEach(error => {
          console.log(`   - ${error.filename}: ${error.error}`);
        });
      }
      
      console.log(`\n📁 All images saved to: ${config.downloadPath}`);
      console.log(`📋 Check manifest.json for complete metadata`);
      console.log(`📚 See README.md for usage guidelines`);
      
    } catch (error) {
      console.error('❌ Fatal error during image download:', error);
      process.exit(1);
    }
  }
}

// Run the autonomous downloader
if (require.main === module) {
  const downloader = new PexelsImageDownloader();
  downloader.run().catch(console.error);
}

module.exports = PexelsImageDownloader;