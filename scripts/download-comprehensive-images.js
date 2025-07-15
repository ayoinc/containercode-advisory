#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

class ComprehensiveImageDownloader {
  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY;
    this.baseUrl = 'https://api.pexels.com/v1/search';
    this.downloadDelay = 1000; // 1 second delay between requests
    this.maxRetries = 3;
    this.manifest = this.loadManifest();
    this.existingUrls = new Set();
    this.downloadedCount = 0;
    
    if (!this.apiKey) {
      throw new Error('PEXELS_API_KEY is required in environment variables');
    }
    
    // Track existing URLs to avoid duplicates
    for (const image of Object.values(this.manifest.images)) {
      this.existingUrls.add(image.url);
    }
  }
  
  loadManifest() {
    const manifestPath = path.join(__dirname, '..', 'public', 'images', 'image-metadata.json');
    if (fs.existsSync(manifestPath)) {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    }
    return {
      metadata: { generatedAt: new Date().toISOString(), version: '2.0.0', totalImages: 0 },
      images: {},
      categories: {},
      usageMap: {}
    };
  }
  
  async downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filepath);
      
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
  
  async searchImages(query, page = 1, perPage = 20) {
    const url = `${this.baseUrl}?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'Authorization': this.apiKey,
          'User-Agent': 'ContainerCode-Image-Downloader/1.0'
        }
      };
      
      https.get(url, options, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (response.statusCode === 200) {
              resolve(result);
            } else {
              reject(new Error(`API Error: ${result.error || 'Unknown error'}`));
            }
          } catch (err) {
            reject(err);
          }
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
  
  async downloadCategoryImages(category, usage, searchTerms, neededCount) {
    console.log(`\n🔍 Downloading ${neededCount} images for ${usage}/${category}...`);
    
    const downloadedImages = [];
    let totalAttempts = 0;
    const maxAttempts = neededCount * 5; // Try 5x more than needed
    
    for (const searchTerm of searchTerms) {
      if (downloadedImages.length >= neededCount) break;
      
      console.log(`  Searching: "${searchTerm}"...`);
      
      try {
        const searchResult = await this.searchImages(searchTerm, 1, 20);
        
        if (searchResult.photos && searchResult.photos.length > 0) {
          for (const photo of searchResult.photos) {
            if (downloadedImages.length >= neededCount) break;
            if (totalAttempts >= maxAttempts) break;
            
            totalAttempts++;
            
            // Skip if we already have this image
            if (this.existingUrls.has(photo.src.large)) {
              console.log(`    ⏭️  Skipping duplicate: ${photo.id}`);
              continue;
            }
            
            // Generate unique filename
            const imageId = `${usage}-${category.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}-${photo.id}`;
            const filename = `${imageId}.jpeg`;
            const subDir = this.getSubDirectory(usage);
            const localPath = `images/pexels/${subDir}/${filename}`;
            const fullPath = path.join(__dirname, '..', 'public', localPath);
            
            // Ensure directory exists
            const dirPath = path.dirname(fullPath);
            if (!fs.existsSync(dirPath)) {
              fs.mkdirSync(dirPath, { recursive: true });
            }
            
            try {
              await this.downloadImage(photo.src.large, fullPath);
              
              // Generate alt text
              const altText = this.generateAltText(photo, category, usage);
              
              // Add to manifest
              const imageData = {
                id: imageId,
                filename,
                localPath,
                url: photo.src.large,
                photographer: photo.photographer,
                alt: altText,
                category,
                usage,
                searchTerm,
                dimensions: {
                  width: photo.width,
                  height: photo.height
                },
                downloadedAt: new Date().toISOString(),
                pexelsId: photo.id,
                pexelsUrl: photo.url
              };
              
              this.manifest.images[imageId] = imageData;
              this.existingUrls.add(photo.src.large);
              downloadedImages.push(imageData);
              this.downloadedCount++;
              
              console.log(`    ✅ Downloaded: ${imageId} by ${photo.photographer}`);
              
              // Delay to respect rate limits
              await new Promise(resolve => setTimeout(resolve, this.downloadDelay));
              
            } catch (error) {
              console.log(`    ❌ Failed to download ${photo.id}: ${error.message}`);
            }
          }
        }
      } catch (error) {
        console.log(`    ❌ Search failed for "${searchTerm}": ${error.message}`);
      }
    }
    
    console.log(`  📊 Downloaded ${downloadedImages.length}/${neededCount} images for ${usage}/${category}`);
    return downloadedImages;
  }
  
  getSubDirectory(usage) {
    const subDirs = {
      'hero': 'hero',
      'service': 'service',
      'team': 'team',
      'general': 'general',
      'business': 'business'
    };
    return subDirs[usage] || 'general';
  }
  
  generateAltText(photo, category, usage) {
    const templates = {
      'cloud computing': 'Modern cloud computing infrastructure and data center technology',
      'cybersecurity': 'Cybersecurity protection and data security technology',
      'software development': 'Software development and programming technology',
      'digital innovation': 'Digital innovation and technological advancement',
      'business team': 'Professional business team collaboration and meeting',
      'devops automation': 'DevOps automation and continuous integration technology',
      'digital transformation': 'Digital transformation and business modernization',
      'software engineering': 'Software engineering and application development',
      'it support': 'IT support and technical assistance services',
      'professional team': 'Professional team collaboration and business meeting',
      'collaboration': 'Team collaboration and professional cooperation',
      'remote work': 'Remote work and distributed team collaboration',
      'office culture': 'Office culture and professional workplace environment',
      'diversity': 'Diverse and inclusive professional team',
      'leadership': 'Business leadership and executive management',
      'technology': 'Modern technology and digital innovation',
      'business': 'Professional business and corporate environment',
      'innovation': 'Innovation and creative business solutions',
      'consulting': 'Professional consulting and business advisory services',
      'enterprise': 'Enterprise business and corporate organization',
      'startups': 'Startup company and entrepreneurial business',
      'education': 'Education technology and professional learning',
      'healthcare': 'Healthcare technology and medical innovation',
      'finance': 'Financial technology and banking services',
      'retail': 'Retail technology and e-commerce solutions',
      'artificial intelligence': 'Artificial intelligence and machine learning technology',
      'data analytics': 'Data analytics and business intelligence',
      'mobile development': 'Mobile app development and smartphone technology',
      'web development': 'Web development and website programming'
    };
    
    return templates[category] || `${category} related professional image`;
  }
  
  updateManifestStructure() {
    // Update categories
    this.manifest.categories = {};
    this.manifest.usageMap = {};
    
    for (const [imageId, imageData] of Object.entries(this.manifest.images)) {
      const { category, usage } = imageData;
      
      // Update categories
      if (!this.manifest.categories[category]) {
        this.manifest.categories[category] = [];
      }
      this.manifest.categories[category].push(imageId);
      
      // Update usage map
      if (!this.manifest.usageMap[usage]) {
        this.manifest.usageMap[usage] = {};
      }
      if (!this.manifest.usageMap[usage][category]) {
        this.manifest.usageMap[usage][category] = [];
      }
      this.manifest.usageMap[usage][category].push(imageId);
    }
    
    // Update metadata
    this.manifest.metadata.totalImages = Object.keys(this.manifest.images).length;
    this.manifest.metadata.generatedAt = new Date().toISOString();
    this.manifest.metadata.version = '2.1.0';
  }
  
  saveManifest() {
    const manifestPath = path.join(__dirname, '..', 'public', 'images', 'image-metadata.json');
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));
  }
  
  async downloadComprehensiveImages() {
    console.log('🚀 Starting comprehensive image download...');
    console.log(`📊 Using API Key: ${this.apiKey.substring(0, 10)}...`);
    
    // Define search terms for each category
    const searchTerms = {
      'cloud computing': ['cloud computing', 'server room', 'data center', 'cloud infrastructure'],
      'cybersecurity': ['cybersecurity', 'data protection', 'network security', 'cyber defense'],
      'software development': ['software development', 'programming', 'coding', 'developer'],
      'digital innovation': ['digital innovation', 'technology advancement', 'innovation'],
      'business team': ['business team', 'professional meeting', 'office collaboration'],
      'devops automation': ['devops', 'automation', 'ci cd', 'infrastructure'],
      'digital transformation': ['digital transformation', 'business innovation', 'modernization'],
      'software engineering': ['software engineering', 'application development', 'programming'],
      'it support': ['it support', 'technical support', 'help desk'],
      'professional team': ['professional team', 'business meeting', 'office teamwork'],
      'collaboration': ['team collaboration', 'business cooperation', 'teamwork'],
      'remote work': ['remote work', 'home office', 'virtual meeting'],
      'office culture': ['office culture', 'workplace environment', 'company culture'],
      'diversity': ['diverse team', 'inclusive workplace', 'multicultural team'],
      'leadership': ['business leadership', 'executive team', 'management'],
      'technology': ['technology', 'digital technology', 'tech innovation'],
      'business': ['business', 'corporate', 'professional business'],
      'innovation': ['innovation', 'creative solutions', 'brainstorming'],
      'consulting': ['business consulting', 'professional advice', 'consulting'],
      'enterprise': ['enterprise business', 'corporate office', 'large organization'],
      'startups': ['startup company', 'entrepreneurship', 'new business'],
      'education': ['education technology', 'learning', 'training'],
      'healthcare': ['healthcare technology', 'medical innovation', 'health tech'],
      'finance': ['financial technology', 'fintech', 'banking'],
      'retail': ['retail technology', 'e-commerce', 'online shopping'],
      'artificial intelligence': ['artificial intelligence', 'ai technology', 'machine learning'],
      'data analytics': ['data analytics', 'big data', 'data visualization'],
      'mobile development': ['mobile development', 'smartphone apps', 'mobile technology'],
      'web development': ['web development', 'website design', 'web programming']
    };
    
    // Priority download plan (focus on high-priority gaps first)
    const downloadPlan = [
      // HIGH PRIORITY - Missing categories for general use
      { category: 'innovation', usage: 'general', needed: 10 },
      { category: 'consulting', usage: 'general', needed: 10 },
      { category: 'enterprise', usage: 'general', needed: 10 },
      { category: 'remote work', usage: 'team', needed: 8 },
      { category: 'office culture', usage: 'team', needed: 8 },
      { category: 'diversity', usage: 'team', needed: 8 },
      { category: 'startups', usage: 'general', needed: 8 },
      { category: 'education', usage: 'general', needed: 8 },
      { category: 'healthcare', usage: 'general', needed: 8 },
      { category: 'finance', usage: 'general', needed: 8 },
      { category: 'retail', usage: 'general', needed: 8 },
      
      // MEDIUM PRIORITY - New service categories
      { category: 'artificial intelligence', usage: 'service', needed: 5 },
      { category: 'data analytics', usage: 'service', needed: 5 },
      { category: 'mobile development', usage: 'service', needed: 5 },
      { category: 'web development', usage: 'service', needed: 5 },
      { category: 'leadership', usage: 'team', needed: 5 },
      
      // Fill gaps in existing categories
      { category: 'technology', usage: 'general', needed: 5 },
      { category: 'professional team', usage: 'team', needed: 4 },
      { category: 'collaboration', usage: 'team', needed: 4 },
      
      // Hero images for missing categories
      { category: 'devops automation', usage: 'hero', needed: 3 },
      { category: 'digital transformation', usage: 'hero', needed: 3 },
      { category: 'software engineering', usage: 'hero', needed: 3 },
      { category: 'it support', usage: 'hero', needed: 3 },
      { category: 'professional team', usage: 'hero', needed: 3 },
      
      // Service images to reach 8 per category
      { category: 'cloud computing', usage: 'service', needed: 3 },
      { category: 'cybersecurity', usage: 'service', needed: 3 },
      { category: 'devops automation', usage: 'service', needed: 3 },
      { category: 'digital transformation', usage: 'service', needed: 3 },
      { category: 'software engineering', usage: 'service', needed: 3 },
      { category: 'it support', usage: 'service', needed: 3 },
      
      // LOW PRIORITY - Additional hero images
      { category: 'cloud computing', usage: 'hero', needed: 2 },
      { category: 'cybersecurity', usage: 'hero', needed: 2 },
      { category: 'software development', usage: 'hero', needed: 2 },
      { category: 'digital innovation', usage: 'hero', needed: 2 },
      { category: 'business team', usage: 'hero', needed: 2 }
    ];
    
    // Execute download plan
    for (const plan of downloadPlan) {
      const terms = searchTerms[plan.category] || [plan.category];
      
      try {
        await this.downloadCategoryImages(
          plan.category,
          plan.usage,
          terms,
          plan.needed
        );
      } catch (error) {
        console.log(`❌ Failed to download images for ${plan.usage}/${plan.category}: ${error.message}`);
      }
    }
    
    // Update manifest structure
    this.updateManifestStructure();
    
    // Save updated manifest
    this.saveManifest();
    
    console.log(`\\n🎉 Download complete!`);
    console.log(`📊 Total images downloaded: ${this.downloadedCount}`);
    console.log(`📊 Total images in manifest: ${this.manifest.metadata.totalImages}`);
    console.log(`💾 Manifest saved to: public/images/image-metadata.json`);
  }
}

// Run the downloader
if (require.main === module) {
  const downloader = new ComprehensiveImageDownloader();
  downloader.downloadComprehensiveImages()
    .then(() => {
      console.log('✅ Image download completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Download failed:', error);
      process.exit(1);
    });
}

module.exports = ComprehensiveImageDownloader;