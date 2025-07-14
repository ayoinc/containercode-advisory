#!/usr/bin/env node

/**
 * Comprehensive Pexels Image Replacement System
 * This script replaces all static images with fresh Pexels API images
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { createClient } = require('pexels');

// Configuration
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const PEXELS_DIR = path.join(PUBLIC_IMAGES_DIR, 'pexels');

// Image categories and their search queries
const IMAGE_CATEGORIES = {
  'hero-main': ['cloud computing', 'digital transformation', 'technology innovation'],
  'service-cloud-technologies': ['cloud infrastructure', 'server technology', 'data center'],
  'service-cybersecurity': ['cybersecurity', 'data protection', 'network security'],
  'service-devops': ['software development', 'coding', 'automation'],
  'service-digital-transformation': ['digital innovation', 'business transformation', 'future technology'],
  'service-it-support': ['technical support', 'IT help desk', 'computer repair'],
  'service-software-engineering': ['programming', 'software development', 'code development'],
  'team-professional': ['business team', 'professional meeting', 'corporate team'],
  'placeholder-tech': ['modern technology', 'digital interface', 'innovation'],
};

// Initialize Pexels client
if (!PEXELS_API_KEY) {
  console.error('❌ PEXELS_API_KEY environment variable is required');
  process.exit(1);
}

const pexelsClient = createClient(PEXELS_API_KEY);

/**
 * Download image from URL
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = require('fs').createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      require('fs').unlink(filepath, () => {});
      reject(err);
    });
  });
}

/**
 * Search for high-quality images using Pexels API
 */
async function searchPexelsImage(query, orientation = 'landscape') {
  try {
    const response = await pexelsClient.photos.search({
      query,
      per_page: 20,
      page: 1,
      orientation,
      size: 'large'
    });

    if (response.photos && response.photos.length > 0) {
      // Sort by quality - prioritize larger images
      const sortedPhotos = response.photos.sort((a, b) => {
        const aSize = a.width * a.height;
        const bSize = b.width * b.height;
        return bSize - aSize;
      });

      return sortedPhotos[0];
    }
    return null;
  } catch (error) {
    console.error(`Error searching for "${query}":`, error.message);
    return null;
  }
}

/**
 * Replace a single image file
 */
async function replaceImage(imageName, searchQueries) {
  console.log(`\n🔍 Replacing ${imageName}...`);
  
  for (const query of searchQueries) {
    console.log(`   Searching for: "${query}"`);
    
    const photo = await searchPexelsImage(query);
    if (photo) {
      try {
        // Use the large size image for better quality
        const imageUrl = photo.src.large;
        const filepath = path.join(PUBLIC_IMAGES_DIR, `${imageName}.jpg`);
        
        console.log(`   ✅ Found image by ${photo.photographer}`);
        console.log(`   📥 Downloading: ${imageUrl}`);
        
        await downloadImage(imageUrl, filepath);
        
        // Create metadata
        const metadata = {
          id: photo.id,
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
          pexels_url: photo.url,
          query: query,
          alt: photo.alt || `${imageName} - professional image`,
          width: photo.width,
          height: photo.height,
          downloaded_at: new Date().toISOString()
        };
        
        // Save metadata
        const metadataPath = path.join(PEXELS_DIR, `${imageName}-metadata.json`);
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        
        console.log(`   💾 Saved ${imageName}.jpg and metadata`);
        return metadata;
      } catch (error) {
        console.error(`   ❌ Failed to download ${imageName}:`, error.message);
      }
    }
  }
  
  console.log(`   ⚠️  No suitable image found for ${imageName}`);
  return null;
}

/**
 * Update image metadata file
 */
async function updateImageMetadata(allMetadata) {
  const metadataFile = path.join(PUBLIC_IMAGES_DIR, 'image-metadata.json');
  
  try {
    // Read existing metadata
    let existingMetadata = {};
    try {
      const existing = await fs.readFile(metadataFile, 'utf8');
      existingMetadata = JSON.parse(existing);
    } catch (error) {
      // File doesn't exist or is invalid, start fresh
      existingMetadata = {};
    }
    
    // Update with new metadata
    const updatedMetadata = {
      ...existingMetadata,
      images: {
        ...existingMetadata.images,
        ...allMetadata
      },
      lastUpdated: new Date().toISOString(),
      source: 'pexels-api',
      totalImages: Object.keys(allMetadata).length
    };
    
    await fs.writeFile(metadataFile, JSON.stringify(updatedMetadata, null, 2));
    console.log(`\n📝 Updated image-metadata.json with ${Object.keys(allMetadata).length} images`);
  } catch (error) {
    console.error('❌ Failed to update image metadata:', error.message);
  }
}

/**
 * Update components to use new Pexels images
 */
async function updateComponents() {
  console.log('\n🔧 Updating components to use Pexels images...');
  
  // Files that need updating
  const filesToUpdate = [
    'src/components/ui/smart-image.tsx',
    'src/components/ui/pexels-image.tsx',
    'src/lib/image-mapper.ts',
    'src/components/sections/hero.tsx',
    'src/components/layout/header.tsx',
    'src/components/layout/footer.tsx'
  ];
  
  for (const file of filesToUpdate) {
    const filePath = path.join(__dirname, '..', file);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      
      // Replace placeholder image references
      let updatedContent = content
        .replace(/\/images\/placeholder-tech\.jpg/g, '/images/placeholder-tech.jpg')
        .replace(/\/images\/hero-main\.jpg/g, '/images/hero-main.jpg')
        .replace(/\/images\/team-professional\.jpg/g, '/images/team-professional.jpg');
      
      // Update fallback sources in PexelsImage component
      if (file.includes('pexels-image.tsx')) {
        updatedContent = updatedContent.replace(
          /fallbackSrc = '\/images\/pexels\/placeholder-technology-modern\.jpg'/g,
          "fallbackSrc = '/images/placeholder-tech.jpg'"
        );
      }
      
      if (content !== updatedContent) {
        await fs.writeFile(filePath, updatedContent);
        console.log(`   ✅ Updated ${file}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Could not update ${file}: ${error.message}`);
    }
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Pexels Image Replacement System');
  console.log('=====================================\n');
  
  try {
    // Ensure directories exist
    await fs.mkdir(PUBLIC_IMAGES_DIR, { recursive: true });
    await fs.mkdir(PEXELS_DIR, { recursive: true });
    
    console.log('📁 Created directories');
    
    // Replace all images
    const allMetadata = {};
    let successCount = 0;
    
    for (const [imageName, searchQueries] of Object.entries(IMAGE_CATEGORIES)) {
      const metadata = await replaceImage(imageName, searchQueries);
      if (metadata) {
        allMetadata[imageName] = metadata;
        successCount++;
      }
      
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Update metadata file
    await updateImageMetadata(allMetadata);
    
    // Update components
    await updateComponents();
    
    console.log('\n✨ Image replacement completed!');
    console.log(`📊 Successfully replaced ${successCount}/${Object.keys(IMAGE_CATEGORIES).length} images`);
    console.log('\n📋 Next steps:');
    console.log('   1. Test the application locally');
    console.log('   2. Commit and push changes');
    console.log('   3. Deploy to production');
    
  } catch (error) {
    console.error('\n❌ Error during image replacement:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, replaceImage, updateImageMetadata };