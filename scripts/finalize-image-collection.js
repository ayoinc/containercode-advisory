#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function finalizeImageCollection() {
  console.log('🎯 Finalizing image collection and updating mappings...\n');
  
  // Load current manifest
  const manifestPath = path.join(__dirname, '..', 'public', 'images', 'image-metadata.json');
  let manifest;
  
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    console.error('❌ Failed to load manifest:', error.message);
    return;
  }
  
  // Count current images by category and usage
  const currentCounts = {};
  
  for (const [imageId, imageData] of Object.entries(manifest.images)) {
    const key = `${imageData.usage}/${imageData.category}`;
    currentCounts[key] = (currentCounts[key] || 0) + 1;
  }
  
  // Define minimum requirements for each page/section
  const minimumRequirements = {
    // Homepage hero
    'hero/business team': 3,
    'hero/cloud computing': 3,
    'hero/digital innovation': 3,
    
    // Service pages
    'service/cloud computing': 6,
    'service/cybersecurity': 6,
    'service/devops automation': 6,
    'service/digital transformation': 6,
    'service/software engineering': 6,
    'service/it support': 6,
    
    // Team page
    'team/professional team': 10,
    'team/collaboration': 10,
    'team/remote work': 8,
    'team/diversity': 8,
    
    // General content
    'general/technology': 12,
    'general/business': 12,
    'general/innovation': 8,
    'general/consulting': 8
  };
  
  // Check coverage
  console.log('📊 CURRENT IMAGE COVERAGE');
  console.log('=====================================');
  
  let totalNeeded = 0;
  const gaps = [];
  
  for (const [key, required] of Object.entries(minimumRequirements)) {
    const current = currentCounts[key] || 0;
    const gap = Math.max(0, required - current);
    const status = gap === 0 ? '✅' : '⚠️';
    
    console.log(`${status} ${key.padEnd(35)} : ${current}/${required} ${gap > 0 ? `(need ${gap})` : ''}`);
    
    if (gap > 0) {
      gaps.push({ key, current, required, gap });
      totalNeeded += gap;
    }
  }
  
  console.log(`\n📊 Total images needed: ${totalNeeded}`);
  console.log(`📊 Total images available: ${Object.keys(manifest.images).length}`);
  
  // Update Smart Image mappings to include new categories
  const smartImageMappingPath = path.join(__dirname, '..', 'src', 'components', 'ui', 'images', 'smart-image.tsx');
  
  if (fs.existsSync(smartImageMappingPath)) {
    console.log('\\n🔄 Updating Smart Image component mappings...');
    
    let smartImageContent = fs.readFileSync(smartImageMappingPath, 'utf8');
    
    // Find and update the image mapping section
    const imageMapStart = smartImageContent.indexOf('const imageMap: Record<string, Record<string, string[]>> = {');
    const imageMapEnd = smartImageContent.indexOf('};', imageMapStart) + 2;
    
    if (imageMapStart !== -1 && imageMapEnd !== -1) {
      // Generate new image mapping based on current manifest
      const newImageMap = generateImageMapFromManifest(manifest);
      
      const newImageMapString = `const imageMap: Record<string, Record<string, string[]>> = ${JSON.stringify(newImageMap, null, 6)};`;
      
      const updatedContent = smartImageContent.substring(0, imageMapStart) + 
                            newImageMapString + 
                            smartImageContent.substring(imageMapEnd);
      
      fs.writeFileSync(smartImageMappingPath, updatedContent);
      console.log('✅ Smart Image component updated with new mappings');
    } else {
      console.log('⚠️  Could not find image mapping section in Smart Image component');
    }
  }
  
  // Generate summary report
  console.log('\\n📋 IMAGE COLLECTION SUMMARY');
  console.log('=====================================');
  
  const categoryCounts = {};
  const usageCounts = {};
  const photographerCounts = {};
  
  for (const imageData of Object.values(manifest.images)) {
    categoryCounts[imageData.category] = (categoryCounts[imageData.category] || 0) + 1;
    usageCounts[imageData.usage] = (usageCounts[imageData.usage] || 0) + 1;
    photographerCounts[imageData.photographer] = (photographerCounts[imageData.photographer] || 0) + 1;
  }
  
  console.log('\\nBy Category:');
  Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([category, count]) => {
    console.log(`  ${category.padEnd(30)} : ${count} images`);
  });
  
  console.log('\\nBy Usage:');
  Object.entries(usageCounts).sort((a, b) => b[1] - a[1]).forEach(([usage, count]) => {
    console.log(`  ${usage.padEnd(30)} : ${count} images`);
  });
  
  console.log('\\nTop Photographers:');
  Object.entries(photographerCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([photographer, count]) => {
    console.log(`  ${photographer.padEnd(30)} : ${count} images`);
  });
  
  return {
    totalImages: Object.keys(manifest.images).length,
    gaps,
    coverage: minimumRequirements
  };
}

function generateImageMapFromManifest(manifest) {
  const imageMap = {};
  
  for (const [imageId, imageData] of Object.entries(manifest.images)) {
    const { usage, category, localPath } = imageData;
    
    if (!imageMap[usage]) {
      imageMap[usage] = {};
    }
    
    if (!imageMap[usage][category]) {
      imageMap[usage][category] = [];
    }
    
    // Add the image path (with leading slash)
    const imagePath = localPath.startsWith('/') ? localPath : `/${localPath}`;
    
    if (!imageMap[usage][category].includes(imagePath)) {
      imageMap[usage][category].push(imagePath);
    }
  }
  
  return imageMap;
}

if (require.main === module) {
  finalizeImageCollection();
}

module.exports = { finalizeImageCollection };