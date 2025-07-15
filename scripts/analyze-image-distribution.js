#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function analyzeImageDistribution() {
  console.log('📊 Analyzing image distribution and duplicates...\n');
  
  const manifestPath = path.join(__dirname, '..', 'public', 'images', 'image-metadata.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Image metadata manifest not found');
    return;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Analysis containers
  const urlMap = new Map();
  const photographerMap = new Map();
  const categoryDistribution = new Map();
  const usageDistribution = new Map();
  const duplicateUrls = [];
  
  // Process each image
  for (const [imageId, imageData] of Object.entries(manifest.images)) {
    const { url, photographer, category, usage } = imageData;
    
    // Check for duplicate URLs
    if (urlMap.has(url)) {
      duplicateUrls.push({
        url,
        images: [urlMap.get(url), imageId]
      });
    } else {
      urlMap.set(url, imageId);
    }
    
    // Count photographers
    photographerMap.set(photographer, (photographerMap.get(photographer) || 0) + 1);
    
    // Count categories
    categoryDistribution.set(category, (categoryDistribution.get(category) || 0) + 1);
    
    // Count usage types
    usageDistribution.set(usage, (usageDistribution.get(usage) || 0) + 1);
  }
  
  // Report duplicates
  console.log('🔍 DUPLICATE ANALYSIS');
  console.log('=====================================');
  if (duplicateUrls.length > 0) {
    console.log(`❌ Found ${duplicateUrls.length} duplicate image URLs:`);
    duplicateUrls.forEach(duplicate => {
      console.log(`   URL: ${duplicate.url}`);
      console.log(`   Images: ${duplicate.images.join(', ')}`);
      console.log('');
    });
  } else {
    console.log('✅ No duplicate URLs found');
  }
  
  // Category distribution
  console.log('\n📈 CATEGORY DISTRIBUTION');
  console.log('=====================================');
  const sortedCategories = Array.from(categoryDistribution.entries())
    .sort((a, b) => b[1] - a[1]);
  
  sortedCategories.forEach(([category, count]) => {
    const percentage = ((count / manifest.metadata.totalImages) * 100).toFixed(1);
    console.log(`${category.padEnd(25)} : ${count.toString().padStart(2)} images (${percentage}%)`);
  });
  
  // Usage distribution
  console.log('\n🎯 USAGE DISTRIBUTION');
  console.log('=====================================');
  const sortedUsage = Array.from(usageDistribution.entries())
    .sort((a, b) => b[1] - a[1]);
  
  sortedUsage.forEach(([usage, count]) => {
    const percentage = ((count / manifest.metadata.totalImages) * 100).toFixed(1);
    console.log(`${usage.padEnd(15)} : ${count.toString().padStart(2)} images (${percentage}%)`);
  });
  
  // Photographer distribution
  console.log('\n👨‍💼 PHOTOGRAPHER DISTRIBUTION');
  console.log('=====================================');
  const sortedPhotographers = Array.from(photographerMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 photographers
  
  sortedPhotographers.forEach(([photographer, count]) => {
    const percentage = ((count / manifest.metadata.totalImages) * 100).toFixed(1);
    console.log(`${photographer.padEnd(25)} : ${count.toString().padStart(2)} images (${percentage}%)`);
  });
  
  // Summary statistics
  console.log('\n📊 SUMMARY STATISTICS');
  console.log('=====================================');
  console.log(`Total Images: ${manifest.metadata.totalImages}`);
  console.log(`Unique Categories: ${categoryDistribution.size}`);
  console.log(`Unique Usage Types: ${usageDistribution.size}`);
  console.log(`Unique Photographers: ${photographerMap.size}`);
  console.log(`Duplicate URLs: ${duplicateUrls.length}`);
  
  // Coverage analysis
  console.log('\n🎯 COVERAGE ANALYSIS');
  console.log('=====================================');
  
  // Check if all service categories have adequate images
  const requiredServiceCategories = [
    'cloud computing',
    'cybersecurity',
    'devops automation',
    'digital transformation',
    'software engineering',
    'it support'
  ];
  
  const serviceCoverage = requiredServiceCategories.map(category => {
    const serviceImages = manifest.usageMap.service?.[category] || [];
    return {
      category,
      count: serviceImages.length,
      adequate: serviceImages.length >= 3
    };
  });
  
  console.log('Service Category Coverage:');
  serviceCoverage.forEach(({ category, count, adequate }) => {
    const status = adequate ? '✅' : '⚠️';
    console.log(`  ${status} ${category.padEnd(25)} : ${count} images`);
  });
  
  // Check hero image coverage
  const heroCoverage = Object.keys(manifest.usageMap.hero || {}).map(category => {
    const heroImages = manifest.usageMap.hero[category] || [];
    return {
      category,
      count: heroImages.length,
      adequate: heroImages.length >= 2
    };
  });
  
  console.log('\nHero Category Coverage:');
  heroCoverage.forEach(({ category, count, adequate }) => {
    const status = adequate ? '✅' : '⚠️';
    console.log(`  ${status} ${category.padEnd(25)} : ${count} images`);
  });
  
  return {
    duplicates: duplicateUrls,
    categories: categoryDistribution,
    usage: usageDistribution,
    photographers: photographerMap,
    serviceCoverage,
    heroCoverage
  };
}

if (require.main === module) {
  analyzeImageDistribution();
}

module.exports = { analyzeImageDistribution };