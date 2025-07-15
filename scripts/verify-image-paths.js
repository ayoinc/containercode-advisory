#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function verifyImagePaths() {
  console.log('🔍 Verifying image paths...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const manifestPath = path.join(publicDir, 'images', 'image-metadata.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Image metadata manifest not found at:', manifestPath);
    return false;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  let allPathsValid = true;
  let validImages = 0;
  let invalidImages = 0;
  
  console.log(`📊 Checking ${manifest.metadata.totalImages} images from manifest...`);
  
  for (const [imageId, imageData] of Object.entries(manifest.images)) {
    const imagePath = path.join(publicDir, imageData.localPath);
    
    if (fs.existsSync(imagePath)) {
      validImages++;
      console.log(`✅ ${imageId}: ${imageData.localPath}`);
    } else {
      invalidImages++;
      console.error(`❌ ${imageId}: ${imageData.localPath} (file not found)`);
      allPathsValid = false;
    }
  }
  
  console.log(`\n📈 Summary:`);
  console.log(`✅ Valid images: ${validImages}`);
  console.log(`❌ Invalid images: ${invalidImages}`);
  console.log(`📊 Total images: ${validImages + invalidImages}`);
  
  if (allPathsValid) {
    console.log('\n🎉 All image paths are valid!');
  } else {
    console.log('\n⚠️  Some image paths are invalid. Please check the files.');
  }
  
  return allPathsValid;
}

function checkBuildOutput() {
  console.log('\n🔍 Checking build output...');
  
  const nextStaticDir = path.join(__dirname, '..', '.next', 'static');
  const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
  
  if (fs.existsSync(nextStaticDir)) {
    console.log('✅ .next/static directory exists');
    
    const staticImagesDir = path.join(nextStaticDir, 'images');
    if (fs.existsSync(staticImagesDir)) {
      console.log('✅ .next/static/images directory exists');
    } else {
      console.log('⚠️  .next/static/images directory not found');
    }
  } else {
    console.log('⚠️  .next/static directory not found');
  }
  
  if (fs.existsSync(standaloneDir)) {
    console.log('✅ .next/standalone directory exists');
    
    const standalonePublicDir = path.join(standaloneDir, 'public');
    if (fs.existsSync(standalonePublicDir)) {
      console.log('✅ .next/standalone/public directory exists');
      
      const standaloneImagesDir = path.join(standalonePublicDir, 'images');
      if (fs.existsSync(standaloneImagesDir)) {
        console.log('✅ .next/standalone/public/images directory exists');
      } else {
        console.log('⚠️  .next/standalone/public/images directory not found');
      }
    } else {
      console.log('⚠️  .next/standalone/public directory not found');
    }
  } else {
    console.log('⚠️  .next/standalone directory not found');
  }
}

if (require.main === module) {
  const pathsValid = verifyImagePaths();
  checkBuildOutput();
  
  if (!pathsValid) {
    process.exit(1);
  }
}

module.exports = { verifyImagePaths, checkBuildOutput };