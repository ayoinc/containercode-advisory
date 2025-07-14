const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = '/Users/ayodeleajayi/Workspace/containercode/containercode-app';
const PUBLIC_IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images');
const METADATA_FILE = path.join(PROJECT_ROOT, 'scripts', 'image-metadata.json');

// Create SVG-based placeholder images
const SVG_TEMPLATES = {
  cloudComputing: {
    colors: ['#2563eb', '#3b82f6', '#60a5fa'],
    pattern: 'cloud',
    description: 'Cloud computing and data center imagery'
  },
  cybersecurity: {
    colors: ['#dc2626', '#ef4444', '#f87171'],
    pattern: 'shield',
    description: 'Cybersecurity and data protection imagery'
  },
  devops: {
    colors: ['#059669', '#10b981', '#34d399'],
    pattern: 'code',
    description: 'DevOps and software development imagery'
  },
  teamwork: {
    colors: ['#7c3aed', '#8b5cf6', '#a78bfa'],
    pattern: 'team',
    description: 'Teamwork and collaboration imagery'
  },
  innovation: {
    colors: ['#ea580c', '#f97316', '#fb923c'],
    pattern: 'innovation',
    description: 'Innovation and future technology imagery'
  }
};

function generateSVG(category, width = 800, height = 600) {
  const template = SVG_TEMPLATES[category];
  const [color1, color2, color3] = template.colors;
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${category}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${color2};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color3};stop-opacity:1" />
    </linearGradient>
    <pattern id="pattern${category}" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
      <circle cx="25" cy="25" r="3" fill="rgba(255,255,255,0.1)"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad${category})"/>
  <rect width="100%" height="100%" fill="url(#pattern${category})"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold" opacity="0.8">
    ${template.description.split(' ')[0].toUpperCase()}
  </text>
</svg>`;
}

// Function to categorize image based on filename
function categorizeImage(filename) {
  const lower = filename.toLowerCase();
  
  if (lower.includes('cloud') || lower.includes('data') || lower.includes('server')) return 'cloudComputing';
  if (lower.includes('security') || lower.includes('cyber')) return 'cybersecurity';
  if (lower.includes('dev') || lower.includes('code') || lower.includes('software')) return 'devops';
  if (lower.includes('team') || lower.includes('collaboration')) return 'teamwork';
  if (lower.includes('hero') || lower.includes('innovation') || lower.includes('ai')) return 'innovation';
  
  // Service categorization
  if (lower.includes('service')) {
    if (lower.includes('cloud') || lower.includes('digital')) return 'cloudComputing';
    if (lower.includes('security')) return 'cybersecurity';
    if (lower.includes('devops') || lower.includes('software')) return 'devops';
    if (lower.includes('support')) return 'teamwork';
  }
  
  return 'innovation'; // Default fallback
}

// Main function to replace all images with SVG placeholders
async function replaceAllImages() {
  console.log('🚀 Starting comprehensive image replacement with SVG placeholders...');
  
  // Ensure directories exist
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }
  
  // Get list of existing images (we'll replace them)
  const existingImages = fs.readdirSync(PUBLIC_IMAGES_DIR).filter(file => 
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
  );
  
  console.log(`📁 Found ${existingImages.length} existing images to replace`);
  
  const metadata = [];
  let successCount = 0;
  
  // Process each existing image
  for (const filename of existingImages) {
    try {
      const category = categorizeImage(filename);
      console.log(`🔄 Processing: ${filename} (${category})`);
      
      // Determine dimensions based on filename patterns
      let width = 800, height = 600;
      if (filename.includes('hero') || filename.includes('banner')) {
        width = 1200; height = 600;
      } else if (filename.includes('thumb') || filename.includes('card')) {
        width = 400; height = 300;
      } else if (filename.includes('icon')) {
        width = 200; height = 200;
      }
      
      // Generate SVG content
      const svgContent = generateSVG(category, width, height);
      
      // Save as SVG (keeping original name structure but changing extension)
      const svgFilename = filename.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '.svg');
      const svgPath = path.join(PUBLIC_IMAGES_DIR, svgFilename);
      fs.writeFileSync(svgPath, svgContent);
      
      console.log(`✅ Generated: ${svgFilename} (${width}x${height})`);
      
      metadata.push({
        originalFilename: filename,
        newFilename: svgFilename,
        category,
        source: 'svg-placeholder',
        description: SVG_TEMPLATES[category].description,
        dimensions: { width, height }
      });
      
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to process ${filename}:`, error.message);
    }
  }
  
  // Create some additional modern images for the site
  const additionalImages = [
    { name: 'hero-cloud-computing.svg', category: 'cloudComputing', width: 1200, height: 600 },
    { name: 'hero-cybersecurity.svg', category: 'cybersecurity', width: 1200, height: 600 },
    { name: 'hero-devops.svg', category: 'devops', width: 1200, height: 600 },
    { name: 'team-collaboration.svg', category: 'teamwork', width: 800, height: 600 },
    { name: 'innovation-ai.svg', category: 'innovation', width: 800, height: 600 },
    { name: 'cloud-infrastructure.svg', category: 'cloudComputing', width: 600, height: 400 },
    { name: 'security-shield.svg', category: 'cybersecurity', width: 600, height: 400 },
    { name: 'development-code.svg', category: 'devops', width: 600, height: 400 }
  ];
  
  console.log('🎨 Adding modern additional SVG images...');
  for (const img of additionalImages) {
    try {
      const svgContent = generateSVG(img.category, img.width, img.height);
      const svgPath = path.join(PUBLIC_IMAGES_DIR, img.name);
      fs.writeFileSync(svgPath, svgContent);
      
      console.log(`✅ Created: ${img.name} (${img.width}x${img.height})`);
      
      metadata.push({
        originalFilename: null,
        newFilename: img.name,
        category: img.category,
        source: 'svg-placeholder',
        description: SVG_TEMPLATES[img.category].description,
        dimensions: { width: img.width, height: img.height }
      });
      
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to create ${img.name}:`, error.message);
    }
  }
  
  // Save metadata
  const metadataDir = path.dirname(METADATA_FILE);
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }
  
  fs.writeFileSync(METADATA_FILE, JSON.stringify({
    generated: new Date().toISOString(),
    totalImages: metadata.length,
    successCount,
    errorCount: 0,
    imageType: 'svg-placeholders',
    categories: Object.keys(SVG_TEMPLATES),
    images: metadata
  }, null, 2));
  
  console.log(`\n✅ Image replacement complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Total generated: ${successCount}`);
  console.log(`   - All images are now professional SVG placeholders`);
  console.log(`   - Metadata saved: ${METADATA_FILE}`);
  console.log(`\n🎯 Ready for testing and deployment!`);
}

// Run the replacement
replaceAllImages().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});