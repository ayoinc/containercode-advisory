#!/usr/bin/env node

/**
 * Updates image components to use newly downloaded Pexels images
 * Replaces placeholder images with appropriate Pexels images
 */

const fs = require('fs').promises;
const path = require('path');

const METADATA_PATH = './public/images/image-metadata.json';

class ImageComponentUpdater {
  constructor() {
    this.metadata = null;
    this.updates = [];
  }

  async loadMetadata() {
    try {
      const content = await fs.readFile(METADATA_PATH, 'utf8');
      this.metadata = JSON.parse(content);
      console.log('✅ Loaded image metadata');
    } catch (error) {
      console.error('❌ Failed to load metadata:', error.message);
      throw error;
    }
  }

  async updateFile(filePath, oldContent, newContent, description) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      if (content.includes(oldContent)) {
        const updatedContent = content.replace(oldContent, newContent);
        await fs.writeFile(filePath, updatedContent, 'utf8');
        
        this.updates.push({
          file: filePath,
          description: description,
          status: 'updated'
        });
        
        console.log(`✅ ${description} in ${path.basename(filePath)}`);
      } else {
        this.updates.push({
          file: filePath,
          description: description,
          status: 'not_found'
        });
        
        console.log(`⚠️  Content not found in ${path.basename(filePath)}: ${description}`);
      }
    } catch (error) {
      this.updates.push({
        file: filePath,
        description: description,
        status: 'error',
        error: error.message
      });
      
      console.error(`❌ Failed to update ${path.basename(filePath)}: ${error.message}`);
    }
  }

  async updateHeroImages() {
    console.log('\n🖼️  Updating hero images...');
    
    // Update HeroImage component to use new hero images
    const heroImagePath = './src/components/ui/smart-image.tsx';
    
    // Update default hero image
    await this.updateFile(
      heroImagePath,
      '/images/placeholder-tech.jpg',
      '/images/pexels/hero-cloud-computing.jpg',
      'Updated default hero image'
    );
  }

  async updateServiceImages() {
    console.log('\n🔧 Updating service images...');
    
    // Update services overview to use specific service images
    const servicesPath = './src/components/sections/services-overview.tsx';
    
    // Check if the file uses ServiceImage component and update accordingly
    try {
      const content = await fs.readFile(servicesPath, 'utf8');
      
      // Look for service image usage patterns and update them
      const serviceUpdates = [
        {
          pattern: 'service="cloud"',
          replacement: 'service="cloud-technologies"',
          description: 'Updated cloud service reference'
        },
        {
          pattern: 'service="security"',
          replacement: 'service="cybersecurity"',
          description: 'Updated security service reference'
        }
      ];
      
      for (const update of serviceUpdates) {
        if (content.includes(update.pattern)) {
          await this.updateFile(servicesPath, update.pattern, update.replacement, update.description);
        }
      }
      
    } catch (error) {
      console.log(`⚠️  Could not update ${servicesPath}: ${error.message}`);
    }
  }

  async updateTeamImages() {
    console.log('\n👥 Updating team images...');
    
    // Update team page to use professional team images
    const teamPagePath = './src/app/team/page.tsx';
    
    try {
      const content = await fs.readFile(teamPagePath, 'utf8');
      
      // Look for placeholder team image patterns
      const teamImagePattern = /className=".*w-.*h-.*rounded-full.*bg-primary-600.*"/g;
      
      if (content.match(teamImagePattern)) {
        // Replace avatar placeholders with actual images
        const teamReplacements = [
          {
            old: 'className="w-32 h-32 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold"',
            new: 'className="w-32 h-32 rounded-full object-cover"',
            img: '<img src="/images/pexels/team-leader-male.jpg" alt="Professional business leader" className="w-32 h-32 rounded-full object-cover" />',
            description: 'Added founder profile image'
          }
        ];
        
        // Note: This is a simplified update - in practice, you'd want to be more specific
        console.log('📝 Team page structure identified - manual review recommended');
      }
      
    } catch (error) {
      console.log(`⚠️  Could not update ${teamPagePath}: ${error.message}`);
    }
  }

  async updatePlaceholderImage() {
    console.log('\n🔄 Updating fallback placeholder...');
    
    // Update the main placeholder image
    const placeholderPath = './public/images/placeholder-tech.jpg';
    const newPlaceholderPath = './public/images/pexels/placeholder-technology-modern.jpg';
    
    try {
      // Copy the new placeholder to replace the old one
      const newContent = await fs.readFile(newPlaceholderPath);
      await fs.writeFile(placeholderPath, newContent);
      
      this.updates.push({
        file: placeholderPath,
        description: 'Replaced main placeholder with modern technology image',
        status: 'updated'
      });
      
      console.log('✅ Updated main placeholder image');
    } catch (error) {
      console.error(`❌ Failed to update placeholder: ${error.message}`);
    }
  }

  async generateImageUsageGuide() {
    console.log('\n📚 Generating image usage guide...');
    
    const guideContent = `# Image Usage Guide

This guide shows how to use the newly downloaded Pexels images in your components.

## Hero Images

### Primary Hero
\`\`\`tsx
import { SmartImage } from '@/components/ui/smart-image';

<SmartImage
  src="/images/pexels/hero-cloud-computing.jpg"
  alt="Modern cloud computing data center with servers"
  category="hero"
  priority={true}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
/>
\`\`\`

### Alternative Heroes
- **Cybersecurity**: \`/images/pexels/hero-cybersecurity.jpg\`
- **Digital Transformation**: \`/images/pexels/hero-digital-transformation.jpg\`

## Service Images

### Using ServiceImage Component
\`\`\`tsx
import { ServiceImage } from '@/components/ui/smart-image';

<ServiceImage 
  service="cloud-technologies"
  alt="Multi-cloud infrastructure and technologies"
/>
\`\`\`

### Available Services
- **cloud-technologies**: Cloud computing infrastructure
- **cybersecurity**: Data protection and security
- **devops**: Software development and automation
- **digital-transformation**: Innovation and transformation
- **software-engineering**: Programming and development
- **it-support**: Managed IT services

## Case Study Images

### Industry-Specific Images
\`\`\`tsx
<ServiceImage 
  service="fintech"
  category="case-study"
  alt="Financial technology solutions"
/>
\`\`\`

### Available Industries
- **fintech**: Financial technology
- **healthcare**: Medical technology systems
- **manufacturing**: Industrial automation
- **ecommerce**: Online retail technology

## Team Images

### Professional Team Photos
\`\`\`tsx
<img 
  src="/images/pexels/team-professional-group.jpg"
  alt="Professional business team working together"
  className="rounded-lg object-cover"
/>
\`\`\`

### Individual Team Members
- **Founder**: \`/images/pexels/team-leader-male.jpg\`
- **Engineer**: \`/images/pexels/team-engineer-female.jpg\`
- **Consultant**: \`/images/pexels/team-security-consultant.jpg\`

## Blog Images

### Content Category Images
- **Cloud Strategy**: \`/images/pexels/blog-cloud-strategy.jpg\`
- **Cybersecurity**: \`/images/pexels/blog-cybersecurity-insights.jpg\`
- **DevOps**: \`/images/pexels/blog-devops-automation.jpg\`

## Image Metadata Access

All images include complete metadata accessible via the image mapper:

\`\`\`tsx
import { getServiceImage } from '@/lib/image-mapper';

const imageData = await getServiceImage('cybersecurity');
// Returns: { src, alt, photographer, photographer_url, pexels_url }
\`\`\`

## Attribution

All images are from Pexels and include photographer attribution in metadata.
While not required, attribution is appreciated and automatically handled by the image components.

## Next Steps

1. **Update Components**: Replace placeholder images with specific Pexels images
2. **Test Loading**: Verify images load correctly across all pages
3. **Optimize Performance**: Ensure proper lazy loading and responsive images
4. **Review Attribution**: Check that photographer credits are properly displayed

See \`public/images/pexels/manifest.json\` for complete image metadata and sources.
`;

    const guidePath = './PEXELS_IMAGE_USAGE.md';
    await fs.writeFile(guidePath, guideContent, 'utf8');
    
    this.updates.push({
      file: guidePath,
      description: 'Generated image usage guide',
      status: 'created'
    });
    
    console.log('✅ Generated image usage guide');
  }

  async run() {
    try {
      console.log('🚀 Starting image component update process...');
      
      await this.loadMetadata();
      
      await this.updateHeroImages();
      await this.updateServiceImages();
      await this.updateTeamImages();
      await this.updatePlaceholderImage();
      await this.generateImageUsageGuide();
      
      console.log('\n🎉 Image component update completed!');
      console.log('\n📊 Update Summary:');
      
      const statusCounts = this.updates.reduce((acc, update) => {
        acc[update.status] = (acc[update.status] || 0) + 1;
        return acc;
      }, {});
      
      Object.entries(statusCounts).forEach(([status, count]) => {
        const emoji = {
          'updated': '✅',
          'created': '🆕',
          'not_found': '⚠️',
          'error': '❌'
        }[status] || '📝';
        
        console.log(`   ${emoji} ${status}: ${count} files`);
      });
      
      console.log('\n📚 Next Steps:');
      console.log('   1. Review PEXELS_IMAGE_USAGE.md for implementation guide');
      console.log('   2. Test image loading across all pages');
      console.log('   3. Update any remaining placeholder references');
      console.log('   4. Verify responsive image behavior');
      console.log('\n✨ Your website now has professional Pexels images!');
      
    } catch (error) {
      console.error('❌ Fatal error during component update:', error);
      process.exit(1);
    }
  }
}

// Run the component updater
if (require.main === module) {
  const updater = new ImageComponentUpdater();
  updater.run().catch(console.error);
}

module.exports = ImageComponentUpdater;