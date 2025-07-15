#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function updateImagePaths() {
  console.log('🔄 Updating image paths in manifest...');
  
  const manifestPath = path.join(__dirname, '..', 'public', 'images', 'image-metadata.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Update all image paths to remove "pexels" subdirectory
  for (const [imageId, imageData] of Object.entries(manifest.images)) {
    const oldPath = imageData.localPath;
    
    // Convert from: images/pexels/hero/hero-cloud-computing-1.jpeg
    // To: images/hero-cloud-computing-1.jpeg
    const newPath = oldPath.replace(/images\/pexels\/[^\/]+\//, 'images/');
    
    manifest.images[imageId].localPath = newPath;
    
    console.log(`✅ Updated: ${oldPath} -> ${newPath}`);
  }
  
  // Update metadata
  manifest.metadata.generatedAt = new Date().toISOString();
  manifest.metadata.version = '2.1.0';
  
  // Save updated manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log('✅ Image paths updated successfully!');
  console.log(`📊 Updated ${Object.keys(manifest.images).length} images`);
}

if (require.main === module) {
  updateImagePaths();
}

module.exports = { updateImagePaths };