#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copy static files from public to .next/static for production builds
function copyStaticFiles() {
  const publicDir = path.join(__dirname, '..', 'public');
  const staticDir = path.join(__dirname, '..', '.next', 'static');
  
  // Create static directory if it doesn't exist
  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }
  
  // Copy images directory
  const imagesSource = path.join(publicDir, 'images');
  const imagesTarget = path.join(staticDir, 'images');
  
  if (fs.existsSync(imagesSource)) {
    copyDirectoryRecursive(imagesSource, imagesTarget);
    console.log('✓ Static images copied to .next/static/images');
  } else {
    console.warn('⚠️  Source images directory not found at:', imagesSource);
  }
  
  // Copy other static assets (removed media directory as it was deleted)
}

function copyDirectoryRecursive(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  const items = fs.readdirSync(source);
  
  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectoryRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// Also copy to standalone directory for production
function copyToStandalone() {
  const publicDir = path.join(__dirname, '..', 'public');
  const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
  
  if (!fs.existsSync(standaloneDir)) {
    console.warn('⚠️  Standalone directory not found, skipping copy');
    return;
  }
  
  const standalonePublicDir = path.join(standaloneDir, 'public');
  
  if (fs.existsSync(publicDir)) {
    copyDirectoryRecursive(publicDir, standalonePublicDir);
    console.log('✓ Static files copied to standalone/public');
  }
}

// Copy to OpenNext assets directory for Cloudflare deployment
function copyToOpenNext() {
  const publicDir = path.join(__dirname, '..', 'public');
  const openNextDir = path.join(__dirname, '..', '.open-next');
  
  if (!fs.existsSync(openNextDir)) {
    console.warn('⚠️  OpenNext directory not found, skipping copy');
    return;
  }
  
  const assetsDir = path.join(openNextDir, 'assets');
  
  if (fs.existsSync(publicDir)) {
    copyDirectoryRecursive(publicDir, assetsDir);
    console.log('✓ Static files copied to OpenNext assets');
  }
}

if (require.main === module) {
  console.log('📦 Copying static files for production build...');
  copyStaticFiles();
  copyToStandalone();
  copyToOpenNext();
  console.log('✅ Static files copy completed');
}

module.exports = { copyStaticFiles, copyToStandalone, copyToOpenNext };