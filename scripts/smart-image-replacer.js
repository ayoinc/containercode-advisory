const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const PROJECT_ROOT = '/Users/ayodeleajayi/Workspace/containercode/containercode-app';
const PUBLIC_IMAGES_DIR = path.join(PROJECT_ROOT, 'public', 'images');
const METADATA_FILE = path.join(PROJECT_ROOT, 'scripts', 'image-metadata.json');

// Image categories mapped to high-quality placeholder services
const IMAGE_CATEGORIES = {
  'cloudComputing': {
    keywords: ['cloud', 'computing', 'data-center', 'servers', 'technology'],
    placeholder: 'https://picsum.photos/800/600?random=1',
    description: 'Cloud computing and data center imagery'
  },
  'cybersecurity': {
    keywords: ['security', 'cyber', 'protection', 'shield', 'lock'],
    placeholder: 'https://picsum.photos/800/600?random=2',
    description: 'Cybersecurity and data protection imagery'
  },
  'devops': {
    keywords: ['development', 'coding', 'automation', 'programming'],
    placeholder: 'https://picsum.photos/800/600?random=3',
    description: 'DevOps and software development imagery'
  },
  'teamwork': {
    keywords: ['team', 'collaboration', 'meeting', 'business'],
    placeholder: 'https://picsum.photos/800/600?random=4',
    description: 'Teamwork and collaboration imagery'
  },
  'innovation': {
    keywords: ['innovation', 'future', 'ai', 'technology'],
    placeholder: 'https://picsum.photos/800/600?random=5',
    description: 'Innovation and future technology imagery'
  }
};

// Quality placeholder image sources as fallback
const PLACEHOLDER_SOURCES = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop', // Tech/space
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop', // Cloud computing
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop', // Cybersecurity
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop', // Development
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop', // Teamwork
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop', // Innovation
];

// Function to download image from URL
function downloadImage(url, filepath) {
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
      file.on('error', reject);
    }).on('error', reject);
  });
}

// Function to categorize image based on filename
function categorizeImage(filename) {
  const lower = filename.toLowerCase();
  
  for (const [category, data] of Object.entries(IMAGE_CATEGORIES)) {
    if (data.keywords.some(keyword => lower.includes(keyword))) {
      return category;
    }
  }
  
  // Default categorization based on common patterns
  if (lower.includes('hero') || lower.includes('banner')) return 'innovation';
  if (lower.includes('team') || lower.includes('about')) return 'teamwork';
  if (lower.includes('service') || lower.includes('solution')) return 'cloudComputing';
  if (lower.includes('security')) return 'cybersecurity';
  if (lower.includes('dev') || lower.includes('code')) return 'devops';
  
  return 'innovation'; // Default fallback
}

// Function to generate modern, high-quality placeholder images
async function generatePlaceholderImage(category, filename, width = 800, height = 600) {
  const categoryData = IMAGE_CATEGORIES[category];
  
  // Use different placeholder services for variety
  const placeholderServices = [
    `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`,
    `https://source.unsplash.com/${width}x${height}/?${categoryData.keywords[0]}`,
    `https://via.placeholder.com/${width}x${height}/2563eb/ffffff?text=${categoryData.keywords[0].replace('-', '+')}`
  ];
  
  // Try each service until one works
  for (const service of placeholderServices) {
    try {
      const filepath = path.join(PUBLIC_IMAGES_DIR, filename);
      await downloadImage(service, filepath);
      console.log(`✅ Generated placeholder: ${filename} (${category})`);
      return {
        filename,
        category,
        source: 'placeholder',
        url: service,
        description: categoryData.description,
        dimensions: { width, height }
      };
    } catch (error) {
      console.log(`⚠️ Failed placeholder service: ${service}`);
      continue;
    }
  }
  
  throw new Error(`Failed to generate placeholder for ${filename}`);
}

// Main function to replace all images
async function replaceAllImages() {
  console.log('🚀 Starting comprehensive image replacement...');
  
  // Ensure directories exist
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
  }
  
  // Read existing images
  const existingImages = fs.readdirSync(PUBLIC_IMAGES_DIR).filter(file => 
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
  );
  
  console.log(`📁 Found ${existingImages.length} existing images`);
  
  const metadata = [];
  let successCount = 0;
  let errorCount = 0;
  
  // Process each image
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
      
      const imageData = await generatePlaceholderImage(category, filename, width, height);
      metadata.push(imageData);
      successCount++;
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Failed to process ${filename}:`, error.message);
      errorCount++;
    }
  }
  
  // Create some additional modern images for the site
  const additionalImages = [
    { name: 'hero-cloud-computing.jpg', category: 'cloudComputing', width: 1200, height: 600 },
    { name: 'hero-cybersecurity.jpg', category: 'cybersecurity', width: 1200, height: 600 },
    { name: 'hero-devops.jpg', category: 'devops', width: 1200, height: 600 },
    { name: 'team-collaboration.jpg', category: 'teamwork', width: 800, height: 600 },
    { name: 'innovation-ai.jpg', category: 'innovation', width: 800, height: 600 },
    { name: 'cloud-infrastructure.jpg', category: 'cloudComputing', width: 600, height: 400 },
    { name: 'security-shield.jpg', category: 'cybersecurity', width: 600, height: 400 },
    { name: 'development-code.jpg', category: 'devops', width: 600, height: 400 }
  ];
  
  console.log('🎨 Adding modern additional images...');
  for (const img of additionalImages) {
    try {
      const imageData = await generatePlaceholderImage(img.category, img.name, img.width, img.height);
      metadata.push(imageData);
      successCount++;
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (error) {
      console.error(`❌ Failed to create ${img.name}:`, error.message);
      errorCount++;
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
    errorCount,
    categories: Object.keys(IMAGE_CATEGORIES),
    images: metadata
  }, null, 2));
  
  console.log(`\n✅ Image replacement complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Total processed: ${successCount + errorCount}`);
  console.log(`   - Successful: ${successCount}`);
  console.log(`   - Errors: ${errorCount}`);
  console.log(`   - Metadata saved: ${METADATA_FILE}`);
  console.log(`\n🎯 All images are now using high-quality placeholders!`);
}

// Run the replacement
replaceAllImages().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});