#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function identifyMissingImages() {
  console.log('🔍 Identifying missing image categories and requirements...\n');
  
  const manifestPath = path.join(__dirname, '..', 'public', 'images', 'image-metadata.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Define ideal image requirements for each category/usage combination
  const idealRequirements = {
    hero: {
      'cloud computing': { ideal: 5, current: 0 },
      'cybersecurity': { ideal: 5, current: 0 },
      'software development': { ideal: 5, current: 0 },
      'digital innovation': { ideal: 5, current: 0 },
      'business team': { ideal: 5, current: 0 },
      'devops automation': { ideal: 3, current: 0 },
      'digital transformation': { ideal: 3, current: 0 },
      'software engineering': { ideal: 3, current: 0 },
      'it support': { ideal: 3, current: 0 },
      'professional team': { ideal: 3, current: 0 }
    },
    service: {
      'cloud computing': { ideal: 8, current: 0 },
      'cybersecurity': { ideal: 8, current: 0 },
      'devops automation': { ideal: 8, current: 0 },
      'digital transformation': { ideal: 8, current: 0 },
      'software engineering': { ideal: 8, current: 0 },
      'it support': { ideal: 8, current: 0 },
      'artificial intelligence': { ideal: 5, current: 0 },
      'data analytics': { ideal: 5, current: 0 },
      'mobile development': { ideal: 5, current: 0 },
      'web development': { ideal: 5, current: 0 }
    },
    team: {
      'professional team': { ideal: 12, current: 0 },
      'collaboration': { ideal: 12, current: 0 },
      'remote work': { ideal: 8, current: 0 },
      'office culture': { ideal: 8, current: 0 },
      'diversity': { ideal: 8, current: 0 },
      'leadership': { ideal: 5, current: 0 }
    },
    general: {
      'technology': { ideal: 15, current: 0 },
      'business': { ideal: 15, current: 0 },
      'innovation': { ideal: 10, current: 0 },
      'consulting': { ideal: 10, current: 0 },
      'enterprise': { ideal: 10, current: 0 },
      'startups': { ideal: 8, current: 0 },
      'education': { ideal: 8, current: 0 },
      'healthcare': { ideal: 8, current: 0 },
      'finance': { ideal: 8, current: 0 },
      'retail': { ideal: 8, current: 0 }
    }
  };
  
  // Count current images
  for (const [imageId, imageData] of Object.entries(manifest.images)) {
    const { category, usage } = imageData;
    
    if (idealRequirements[usage] && idealRequirements[usage][category]) {
      idealRequirements[usage][category].current++;
    }
  }
  
  // Identify gaps
  const gaps = [];
  const duplicateUrls = new Set();
  
  // Find duplicate URLs from previous analysis
  const urlMap = new Map();
  for (const [imageId, imageData] of Object.entries(manifest.images)) {
    if (urlMap.has(imageData.url)) {
      duplicateUrls.add(imageData.url);
    } else {
      urlMap.set(imageData.url, imageId);
    }
  }
  
  // Generate gap analysis
  for (const [usage, categories] of Object.entries(idealRequirements)) {
    for (const [category, requirements] of Object.entries(categories)) {
      const gap = requirements.ideal - requirements.current;
      if (gap > 0) {
        gaps.push({
          usage,
          category,
          current: requirements.current,
          ideal: requirements.ideal,
          gap,
          priority: gap > 5 ? 'high' : gap > 2 ? 'medium' : 'low'
        });
      }
    }
  }
  
  // Sort gaps by priority and gap size
  gaps.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return b.gap - a.gap;
  });
  
  // Report findings
  console.log('📊 IMAGE GAP ANALYSIS');
  console.log('=====================================');
  console.log(`Total missing images needed: ${gaps.reduce((sum, gap) => sum + gap.gap, 0)}`);
  console.log(`Duplicate URLs to replace: ${duplicateUrls.size}`);
  console.log(`Total new images to download: ${gaps.reduce((sum, gap) => sum + gap.gap, 0) + duplicateUrls.size}\n`);
  
  // Priority categories
  console.log('🔴 HIGH PRIORITY GAPS (>5 images needed)');
  console.log('=====================================');
  gaps.filter(gap => gap.priority === 'high').forEach(gap => {
    console.log(`${gap.usage.padEnd(10)} | ${gap.category.padEnd(25)} | ${gap.current}/${gap.ideal} (need ${gap.gap})`);
  });
  
  console.log('\n🟡 MEDIUM PRIORITY GAPS (3-5 images needed)');
  console.log('=====================================');
  gaps.filter(gap => gap.priority === 'medium').forEach(gap => {
    console.log(`${gap.usage.padEnd(10)} | ${gap.category.padEnd(25)} | ${gap.current}/${gap.ideal} (need ${gap.gap})`);
  });
  
  console.log('\n🟢 LOW PRIORITY GAPS (1-2 images needed)');
  console.log('=====================================');
  gaps.filter(gap => gap.priority === 'low').forEach(gap => {
    console.log(`${gap.usage.padEnd(10)} | ${gap.category.padEnd(25)} | ${gap.current}/${gap.ideal} (need ${gap.gap})`);
  });
  
  return {
    gaps,
    duplicateUrls: Array.from(duplicateUrls),
    totalNeeded: gaps.reduce((sum, gap) => sum + gap.gap, 0)
  };
}

if (require.main === module) {
  identifyMissingImages();
}

module.exports = { identifyMissingImages };