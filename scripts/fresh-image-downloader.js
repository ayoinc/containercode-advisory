#!/usr/bin/env node

/**
 * Fresh Targeted Image Downloader for ContainerCode Advisory
 * Downloads only the images actually needed based on website analysis
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Pexels API configuration
const PEXELS_API_KEY = 'vItppRQs2ePF4KaTb7ugqEjTCi8KiziBkOaASfNdJKXP6LSaywsFF9QF';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Download configuration
const config = {
  downloadPath: './public/images',
  perPage: 3, // Fewer options, more targeted
  orientation: 'landscape',
  sizes: {
    hero: { width: 1600, height: 900 },
    service: { width: 800, height: 600 },
    team: { width: 400, height: 400 },
    content: { width: 800, height: 450 }
  }
};

/**
 * TARGETED IMAGE REQUIREMENTS
 * Based on actual website analysis - only download what we actually use
 */
const imageRequirements = {
  // 1. HERO IMAGES - Main homepage and fallbacks
  hero: [
    {
      query: 'modern cloud computing infrastructure servers',
      filename: 'hero-main',
      alt: 'Modern cloud computing infrastructure and data center',
      usage: 'Main homepage hero section',
      priority: 1
    }
  ],

  // 2. SERVICE IMAGES - One per service category used in components
  services: [
    {
      query: 'cloud technology infrastructure multi-cloud',
      filename: 'service-cloud-technologies',
      alt: 'Multi-cloud technology infrastructure',
      category: 'cloud-technologies',
      priority: 1
    },
    {
      query: 'cybersecurity data protection network security',
      filename: 'service-cybersecurity',
      alt: 'Cybersecurity and data protection',
      category: 'cybersecurity',
      priority: 1
    },
    {
      query: 'devops software development automation',
      filename: 'service-devops',
      alt: 'DevOps and software development automation',
      category: 'devops',
      priority: 1
    },
    {
      query: 'digital transformation business technology',
      filename: 'service-digital-transformation',
      alt: 'Digital transformation and business innovation',
      category: 'digital-transformation',
      priority: 1
    },
    {
      query: 'software engineering programming code',
      filename: 'service-software-engineering',
      alt: 'Software engineering and programming',
      category: 'software-engineering',
      priority: 1
    },
    {
      query: 'IT support managed services helpdesk',
      filename: 'service-it-support',
      alt: 'IT support and managed services',
      category: 'it-support',
      priority: 1
    }
  ],

  // 3. CASE STUDY IMAGES - For case study feature sections
  caseStudies: [
    {
      query: 'financial technology fintech banking',
      filename: 'case-study-fintech',
      alt: 'Financial technology and banking solutions',
      industry: 'fintech',
      priority: 2
    },
    {
      query: 'healthcare medical technology systems',
      filename: 'case-study-healthcare',
      alt: 'Healthcare technology and medical systems',
      industry: 'healthcare',
      priority: 2
    }
  ],

  // 4. TEAM IMAGES - Professional team photos
  team: [
    {
      query: 'professional business team meeting',
      filename: 'team-professional',
      alt: 'Professional business team collaboration',
      usage: 'Team section and about page',
      priority: 2
    }
  ]
};

class TargetedImageDownloader {
  constructor() {
    this.downloadedImages = [];
    this.errorLog = [];
    this.startTime = Date.now();
  }

  /**
   * Search for images using Pexels API
   */
  async searchImages(query, perPage = config.perPage, orientation = config.orientation) {
    try {
      console.log(`🔍 Searching for: "${query}"`);
      
      const url = `${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}`;
      
      const response = await this.makeApiRequest(url);
      const data = JSON.parse(response);
      
      if (data.photos && data.photos.length > 0) {
        console.log(`✅ Found ${data.photos.length} images for "${query}"`);
        return data.photos;
      } else {
        console.log(`⚠️  No images found for "${query}"`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Error searching for "${query}": ${error.message}`);
      this.errorLog.push({ query, error: error.message });
      return [];
    }
  }

  /**
   * Make API request with proper headers
   */
  makeApiRequest(url) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'Authorization': PEXELS_API_KEY,
          'User-Agent': 'ContainerCode Advisory Website/1.0'
        }
      };

      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`API request failed with status ${res.statusCode}: ${data}`));
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Download image from URL
   */
  async downloadImage(imageUrl, filePath) {
    return new Promise((resolve, reject) => {
      const file = require('fs').createWriteStream(filePath);
      
      https.get(imageUrl, (response) => {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
        
        file.on('error', (err) => {
          require('fs').unlink(filePath, () => {}); // Delete the file on error
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Select best image from search results
   */
  selectBestImage(photos, requirements) {
    if (!photos || photos.length === 0) return null;

    // Score images based on various factors
    const scoredPhotos = photos.map(photo => {
      let score = 0;
      
      // Prefer higher resolution
      if (photo.width >= 1200) score += 3;
      else if (photo.width >= 800) score += 2;
      else score += 1;
      
      // Prefer landscape orientation for most use cases
      const aspectRatio = photo.width / photo.height;
      if (aspectRatio >= 1.3 && aspectRatio <= 2.0) score += 2;
      
      // Prefer images from verified photographers
      if (photo.photographer && photo.photographer_url) score += 1;
      
      return { ...photo, score };
    });

    // Sort by score and return the best
    scoredPhotos.sort((a, b) => b.score - a.score);
    return scoredPhotos[0];
  }

  /**
   * Process a category of images
   */
  async processImageCategory(categoryName, imageList) {
    console.log(`\n📂 Processing ${categoryName} images...`);
    
    for (const imageReq of imageList) {
      try {
        console.log(`\n🖼️  Processing: ${imageReq.filename}`);
        
        // Search for images
        const photos = await this.searchImages(imageReq.query, config.perPage);
        
        if (photos.length === 0) {
          console.log(`⚠️  No images found for ${imageReq.filename}, skipping...`);
          continue;
        }

        // Select best image
        const selectedPhoto = this.selectBestImage(photos, imageReq);
        
        if (!selectedPhoto) {
          console.log(`⚠️  No suitable image found for ${imageReq.filename}`);
          continue;
        }

        // Download image
        const fileName = `${imageReq.filename}.jpg`;
        const filePath = path.join(config.downloadPath, fileName);
        
        console.log(`⬇️  Downloading: ${fileName}`);
        await this.downloadImage(selectedPhoto.src.large, filePath);
        
        // Store metadata
        this.downloadedImages.push({
          filename: fileName,
          path: `/${path.relative('./public', filePath)}`,
          alt: imageReq.alt,
          usage: imageReq.usage || categoryName,
          category: imageReq.category || categoryName,
          industry: imageReq.industry,
          priority: imageReq.priority,
          pexels: {
            id: selectedPhoto.id,
            photographer: selectedPhoto.photographer,
            photographer_url: selectedPhoto.photographer_url,
            pexels_url: selectedPhoto.url,
            original_size: {
              width: selectedPhoto.width,
              height: selectedPhoto.height
            }
          }
        });
        
        console.log(`✅ Downloaded: ${fileName}`);
        
        // Rate limiting - wait between downloads
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${imageReq.filename}: ${error.message}`);
        this.errorLog.push({ 
          category: categoryName,
          filename: imageReq.filename, 
          error: error.message 
        });
      }
    }
  }

  /**
   * Generate image metadata file
   */
  async generateMetadata() {
    const metadata = {
      timestamp: new Date().toISOString(),
      total_images: this.downloadedImages.length,
      categories: {},
      images: {}
    };

    // Group by category
    for (const image of this.downloadedImages) {
      if (!metadata.categories[image.category]) {
        metadata.categories[image.category] = [];
      }
      metadata.categories[image.category].push(image.filename);
      metadata.images[image.filename] = image;
    }

    // Save metadata
    const metadataPath = path.join(config.downloadPath, 'image-metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`📄 Generated metadata: ${metadataPath}`);
  }

  /**
   * Generate usage guide
   */
  async generateUsageGuide() {
    const guideContent = `# ContainerCode Advisory - Image Usage Guide

This guide shows how to use the newly downloaded targeted images.

## Downloaded Images (${this.downloadedImages.length} total)

### Hero Images
${this.downloadedImages
  .filter(img => img.category === 'hero')
  .map(img => `- **${img.filename}**: ${img.alt} (${img.usage})`)
  .join('\n')}

### Service Images
${this.downloadedImages
  .filter(img => img.category.startsWith('service-'))
  .map(img => `- **${img.filename}**: ${img.alt} (Category: ${img.category})`)
  .join('\n')}

### Case Study Images
${this.downloadedImages
  .filter(img => img.category === 'caseStudies')
  .map(img => `- **${img.filename}**: ${img.alt} (Industry: ${img.industry})`)
  .join('\n')}

### Team Images
${this.downloadedImages
  .filter(img => img.category === 'team')
  .map(img => `- **${img.filename}**: ${img.alt} (${img.usage})`)
  .join('\n')}

## Usage in Components

### Hero Section
\`\`\`tsx
// Use in professional-hero.tsx
<img 
  src="/images/hero-main.jpg"
  alt="Modern cloud computing infrastructure and data center"
  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
/>
\`\`\`

### Service Cards
\`\`\`tsx
// Use in service components
const serviceImages = {
  'cloud-technologies': '/images/service-cloud-technologies.jpg',
  'cybersecurity': '/images/service-cybersecurity.jpg',
  'devops': '/images/service-devops.jpg',
  'digital-transformation': '/images/service-digital-transformation.jpg',
  'software-engineering': '/images/service-software-engineering.jpg',
  'it-support': '/images/service-it-support.jpg'
};
\`\`\`

## Attribution
All images are from Pexels with proper attribution included in metadata.

Generated on: ${new Date().toISOString()}
`;

    await fs.writeFile('./IMAGE_USAGE_GUIDE.md', guideContent);
    console.log('📚 Generated usage guide: IMAGE_USAGE_GUIDE.md');
  }

  /**
   * Main execution function
   */
  async run() {
    try {
      console.log('🚀 Starting targeted image download for ContainerCode Advisory...');
      console.log(`📥 Download path: ${config.downloadPath}`);
      
      // Ensure download directory exists
      await fs.mkdir(config.downloadPath, { recursive: true });
      
      // Process each category
      await this.processImageCategory('hero', imageRequirements.hero);
      await this.processImageCategory('services', imageRequirements.services);
      await this.processImageCategory('caseStudies', imageRequirements.caseStudies);
      await this.processImageCategory('team', imageRequirements.team);
      
      // Generate metadata and documentation
      await this.generateMetadata();
      await this.generateUsageGuide();
      
      // Final summary
      const duration = (Date.now() - this.startTime) / 1000;
      console.log('\n🎉 Download complete!');
      console.log(`📊 Summary:`);
      console.log(`   • Images downloaded: ${this.downloadedImages.length}`);
      console.log(`   • Errors: ${this.errorLog.length}`);
      console.log(`   • Duration: ${duration.toFixed(1)}s`);
      
      if (this.errorLog.length > 0) {
        console.log('\n❌ Errors encountered:');
        this.errorLog.forEach(error => {
          console.log(`   • ${error.filename || error.query}: ${error.error}`);
        });
      }
      
      console.log('\n✨ Ready to update components with new images!');
      
    } catch (error) {
      console.error(`💥 Fatal error: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the downloader
if (require.main === module) {
  const downloader = new TargetedImageDownloader();
  downloader.run();
}

module.exports = TargetedImageDownloader;
