const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const IMAGE_DIRS = [
  'public/images/pexels/hero',
  'public/images/pexels/service',
  'public/images/pexels/team',
  'public/images/pexels/general',
  'public/images/pexels/business'
];

const SIZES = [
  { width: 640, suffix: '_640w' },
  { width: 828, suffix: '_828w' },
  { width: 1200, suffix: '_1200w' }
];

const QUALITY = 80;

async function preoptimizeImages() {
  console.log('🚀 Starting image pre-optimization...');
  
  for (const dir of IMAGE_DIRS) {
    const fullDir = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullDir)) {
      console.log(`⏭️  Skipping ${dir} (doesn't exist)`);
      continue;
    }
    
    console.log(`📁 Processing ${dir}...`);
    
    const files = fs.readdirSync(fullDir)
      .filter(file => file.match(/\.(jpg|jpeg|png)$/i));
    
    for (const file of files) {
      const inputPath = path.join(fullDir, file);
      const baseName = path.parse(file).name;
      const ext = path.parse(file).ext;
      
      console.log(`  🖼️  Optimizing ${file}...`);
      
      try {
        // Original WebP version
        const webpPath = path.join(fullDir, `${baseName}.webp`);
        if (!fs.existsSync(webpPath)) {
          await sharp(inputPath)
            .webp({ quality: QUALITY })
            .toFile(webpPath);
        }
        
        // Generate different sizes
        for (const size of SIZES) {
          const sizedPath = path.join(fullDir, `${baseName}${size.suffix}${ext}`);
          const sizedWebpPath = path.join(fullDir, `${baseName}${size.suffix}.webp`);
          
          if (!fs.existsSync(sizedPath)) {
            await sharp(inputPath)
              .resize(size.width, null, { 
                withoutEnlargement: true,
                fastShrinkOnLoad: true 
              })
              .jpeg({ quality: QUALITY })
              .toFile(sizedPath);
          }
          
          if (!fs.existsSync(sizedWebpPath)) {
            await sharp(inputPath)
              .resize(size.width, null, { 
                withoutEnlargement: true,
                fastShrinkOnLoad: true 
              })
              .webp({ quality: QUALITY })
              .toFile(sizedWebpPath);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
  }
  
  console.log('✅ Image pre-optimization complete!');
  console.log('🔥 Images should now load much faster in development');
}

// Run if called directly
if (require.main === module) {
  preoptimizeImages().catch(console.error);
}

module.exports = preoptimizeImages;
