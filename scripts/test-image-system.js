#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing image mapping system...\n');

// Test 1: Check if image metadata exists
const metadataPath = path.join(__dirname, '../public/images/image-metadata.json');
if (fs.existsSync(metadataPath)) {
  console.log('✅ Image metadata file exists');
  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log(`✅ Metadata contains ${Object.keys(metadata.staticImages || {}).length} static image categories`);
    console.log(`✅ Metadata contains ${Object.keys(metadata.dynamicImages?.categories || {}).length} dynamic image categories`);
  } catch (error) {
    console.log('❌ Invalid metadata JSON');
  }
} else {
  console.log('❌ Image metadata file missing');
}

// Test 2: Check manifest file
const manifestPath = path.join(__dirname, '../public/media/pexels/manifest.json');
if (fs.existsSync(manifestPath)) {
  console.log('✅ Pexels manifest file exists');
} else {
  console.log('❌ Pexels manifest file missing');
}

// Test 3: Check media client
const mediaClientPath = path.join(__dirname, '../src/lib/media-client.ts');
if (fs.existsSync(mediaClientPath)) {
  console.log('✅ Media client exists');
} else {
  console.log('❌ Media client missing');
}

// Test 4: Check image mapper
const imageMapperPath = path.join(__dirname, '../src/lib/image-mapper.ts');
if (fs.existsSync(imageMapperPath)) {
  console.log('✅ Image mapper exists');
} else {
  console.log('❌ Image mapper missing');
}

// Test 5: Check environment
if (process.env.PEXELS_API_KEY) {
  console.log('✅ Pexels API key configured');
} else {
  console.log('⚠️  Pexels API key not found (checking .env.local)');
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('PEXELS_API_KEY=')) {
      console.log('✅ Pexels API key found in .env.local');
    } else {
      console.log('❌ Pexels API key missing from .env.local');
    }
  }
}

console.log('\n🎯 Image mapping system test complete!');