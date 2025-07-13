#!/usr/bin/env node

/**
 * Updates image-metadata.json with newly downloaded Pexels images
 * Maps images to their appropriate locations based on download manifest
 */

const fs = require('fs').promises;
const path = require('path');

const METADATA_PATH = './public/images/image-metadata.json';
const MANIFEST_PATH = './public/images/pexels/manifest.json';

class ImageMetadataUpdater {
  constructor() {
    this.metadata = null;
    this.manifest = null;
  }

  async loadFiles() {
    try {
      // Load existing metadata
      const metadataContent = await fs.readFile(METADATA_PATH, 'utf8');
      this.metadata = JSON.parse(metadataContent);
      
      // Load Pexels manifest
      const manifestContent = await fs.readFile(MANIFEST_PATH, 'utf8');
      this.manifest = JSON.parse(manifestContent);
      
      console.log('✅ Loaded existing metadata and Pexels manifest');
    } catch (error) {
      console.error('❌ Failed to load files:', error.message);
      throw error;
    }
  }

  updateHeroImages() {
    console.log('🖼️  Updating hero images...');
    
    // Update main hero image
    if (this.manifest.images['hero-cloud-computing']) {
      this.metadata.staticImages.heroes = {
        main: {
          src: '/images/pexels/hero-cloud-computing.jpg',
          alt: 'Modern cloud computing data center with servers',
          priority: true,
          sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw'
        },
        cybersecurity: {
          src: '/images/pexels/hero-cybersecurity.jpg',
          alt: 'Cybersecurity and network protection visualization',
          priority: false
        },
        transformation: {
          src: '/images/pexels/hero-digital-transformation.jpg',
          alt: 'Digital transformation and modern technology',
          priority: false
        }
      };
    }
  }

  updateServiceImages() {
    console.log('🔧 Updating service images...');
    
    // Service category mappings
    const serviceMapping = {
      'cloud-technologies': 'service-cloud-technologies',
      'cybersecurity': 'service-cybersecurity', 
      'devops': 'service-devops',
      'digital-transformation': 'service-digital-transformation',
      'software-engineering': 'service-software-engineering',
      'it-support': 'service-it-support'
    };

    if (!this.metadata.dynamicImages.services) {
      this.metadata.dynamicImages.services = {};
    }

    Object.entries(serviceMapping).forEach(([category, filename]) => {
      if (this.manifest.images[filename]) {
        const imageData = this.manifest.images[filename];
        
        this.metadata.dynamicImages.services[category] = {
          src: `/images/pexels/${filename}.jpg`,
          alt: imageData.alt,
          photographer: imageData.photographer,
          photographer_url: imageData.photographer_url,
          pexels_url: imageData.pexels_url,
          category: category,
          priority: false
        };
      }
    });
  }

  updateCaseStudyImages() {
    console.log('📊 Updating case study images...');
    
    const caseStudyMapping = {
      'fintech': 'case-study-fintech',
      'healthcare': 'case-study-healthcare',
      'manufacturing': 'case-study-manufacturing', 
      'ecommerce': 'case-study-ecommerce'
    };

    if (!this.metadata.dynamicImages.caseStudies) {
      this.metadata.dynamicImages.caseStudies = {};
    }

    Object.entries(caseStudyMapping).forEach(([industry, filename]) => {
      if (this.manifest.images[filename]) {
        const imageData = this.manifest.images[filename];
        
        this.metadata.dynamicImages.caseStudies[industry] = {
          src: `/images/pexels/${filename}.jpg`,
          alt: imageData.alt,
          photographer: imageData.photographer,
          photographer_url: imageData.photographer_url,
          pexels_url: imageData.pexels_url,
          industry: industry,
          priority: false
        };
      }
    });
  }

  updateTeamImages() {
    console.log('👥 Updating team images...');
    
    const teamMapping = {
      'group': 'team-professional-group',
      'founder': 'team-leader-male',
      'engineer': 'team-engineer-female',
      'consultant': 'team-security-consultant'
    };

    if (!this.metadata.dynamicImages.team) {
      this.metadata.dynamicImages.team = {};
    }

    Object.entries(teamMapping).forEach(([role, filename]) => {
      if (this.manifest.images[filename]) {
        const imageData = this.manifest.images[filename];
        
        this.metadata.dynamicImages.team[role] = {
          src: `/images/pexels/${filename}.jpg`,
          alt: imageData.alt,
          photographer: imageData.photographer,
          photographer_url: imageData.photographer_url,
          pexels_url: imageData.pexels_url,
          role: role,
          priority: false
        };
      }
    });
  }

  updateBlogImages() {
    console.log('📝 Updating blog images...');
    
    const blogMapping = {
      'cloud-strategy': 'blog-cloud-strategy',
      'cybersecurity': 'blog-cybersecurity-insights',
      'devops': 'blog-devops-automation'
    };

    if (!this.metadata.dynamicImages.blog) {
      this.metadata.dynamicImages.blog = {};
    }

    Object.entries(blogMapping).forEach(([category, filename]) => {
      if (this.manifest.images[filename]) {
        const imageData = this.manifest.images[filename];
        
        this.metadata.dynamicImages.blog[category] = {
          src: `/images/pexels/${filename}.jpg`,
          alt: imageData.alt,
          photographer: imageData.photographer,
          photographer_url: imageData.photographer_url,
          pexels_url: imageData.pexels_url,
          category: category,
          priority: false
        };
      }
    });
  }

  updateFallbackImage() {
    console.log('🔄 Updating fallback placeholder...');
    
    if (this.manifest.images['placeholder-technology-modern']) {
      const imageData = this.manifest.images['placeholder-technology-modern'];
      
      this.metadata.staticImages.fallback = {
        technology: {
          src: '/images/pexels/placeholder-technology-modern.jpg',
          alt: imageData.alt,
          photographer: imageData.photographer,
          photographer_url: imageData.photographer_url,
          pexels_url: imageData.pexels_url,
          priority: false
        }
      };
    }
  }

  updateLocationMapping() {
    console.log('🗺️  Updating location mappings...');
    
    // Update location mappings to include new images
    const updatedMapping = {
      ...this.metadata.locationMapping,
      
      // Hero sections
      'src/components/sections/hero.tsx': {
        component: 'Hero',
        images: {
          hero: 'heroes.main',
          background: 'patterns.grid'
        }
      },
      
      'src/components/sections/professional-hero.tsx': {
        component: 'ProfessionalHero', 
        images: {
          hero: 'heroes.main'
        }
      },
      
      // Service sections
      'src/components/sections/services-overview.tsx': {
        component: 'ServicesOverview',
        images: {
          'cloud-technologies': 'services.cloud-technologies',
          'cybersecurity': 'services.cybersecurity',
          'devops': 'services.devops',
          'digital-transformation': 'services.digital-transformation',
          'software-engineering': 'services.software-engineering',
          'it-support': 'services.it-support'
        }
      },
      
      // Case studies
      'src/app/case-studies/page.tsx': {
        component: 'CaseStudiesPage',
        images: {
          'fintech': 'caseStudies.fintech',
          'healthcare': 'caseStudies.healthcare', 
          'manufacturing': 'caseStudies.manufacturing',
          'ecommerce': 'caseStudies.ecommerce'
        }
      },
      
      // Team page
      'src/app/team/page.tsx': {
        component: 'TeamPage',
        images: {
          'group': 'team.group',
          'founder': 'team.founder',
          'engineer': 'team.engineer',
          'consultant': 'team.consultant'
        }
      },
      
      // Blog
      'src/app/blog/page.tsx': {
        component: 'BlogPage',
        images: {
          'cloud-strategy': 'blog.cloud-strategy',
          'cybersecurity': 'blog.cybersecurity',
          'devops': 'blog.devops'
        }
      }
    };
    
    this.metadata.locationMapping = updatedMapping;
  }

  updateMetadata() {
    console.log('📝 Updating metadata timestamp...');
    
    this.metadata.metadata = {
      ...this.metadata.metadata,
      lastUpdated: new Date().toISOString(),
      version: '1.1.0',
      pexelsIntegration: {
        enabled: true,
        downloadDate: this.manifest.metadata.downloadDate,
        totalPexelsImages: this.manifest.metadata.totalImages,
        attribution: 'Images from Pexels - https://pexels.com'
      }
    };
  }

  async saveMetadata() {
    try {
      const updatedContent = JSON.stringify(this.metadata, null, 2);
      await fs.writeFile(METADATA_PATH, updatedContent, 'utf8');
      console.log('✅ Updated image metadata saved');
    } catch (error) {
      console.error('❌ Failed to save metadata:', error.message);
      throw error;
    }
  }

  async run() {
    try {
      console.log('🚀 Starting image metadata update process...');
      
      await this.loadFiles();
      
      this.updateHeroImages();
      this.updateServiceImages();
      this.updateCaseStudyImages();
      this.updateTeamImages();
      this.updateBlogImages();
      this.updateFallbackImage();
      this.updateLocationMapping();
      this.updateMetadata();
      
      await this.saveMetadata();
      
      console.log('\n🎉 Image metadata update completed!');
      console.log('📊 Summary:');
      console.log(`   🖼️  Hero images: ${Object.keys(this.metadata.staticImages.heroes || {}).length}`);
      console.log(`   🔧 Service images: ${Object.keys(this.metadata.dynamicImages.services || {}).length}`);
      console.log(`   📊 Case study images: ${Object.keys(this.metadata.dynamicImages.caseStudies || {}).length}`);
      console.log(`   👥 Team images: ${Object.keys(this.metadata.dynamicImages.team || {}).length}`);
      console.log(`   📝 Blog images: ${Object.keys(this.metadata.dynamicImages.blog || {}).length}`);
      console.log('\n✨ All images are now mapped and ready to use!');
      
    } catch (error) {
      console.error('❌ Fatal error during metadata update:', error);
      process.exit(1);
    }
  }
}

// Run the metadata updater
if (require.main === module) {
  const updater = new ImageMetadataUpdater();
  updater.run().catch(console.error);
}

module.exports = ImageMetadataUpdater;