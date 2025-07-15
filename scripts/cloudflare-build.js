#!/usr/bin/env node

/**
 * Cloudflare deployment build script
 * Handles the differences between local and Cloudflare platform builds
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Cloudflare deployment build...');

try {
  // Check if we're running on Cloudflare's build environment
  const isCloudflare = process.env.CF_PAGES === '1' || process.env.CLOUDFLARE === '1';
  
  if (isCloudflare) {
    console.log('📦 Building with OpenNext for Cloudflare...');
    // Use OpenNext for Cloudflare deployment
    execSync('npx @opennextjs/cloudflare@latest build', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  } else {
    console.log('📦 Building with Next.js for local/other platforms...');
    // Use regular Next.js build for local development
    execSync('npm run build:next', { 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });
  }
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}