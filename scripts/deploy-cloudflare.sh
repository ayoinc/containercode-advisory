#!/bin/bash
set -e

echo "Starting Cloudflare Pages deployment process..."

# Step 1: Build the Next.js app with OpenNext
echo "Building Next.js app with OpenNext..."
npm run build:cloudflare

# Step 2: Verify build artifacts exist
echo "Verifying build artifacts..."
if [ ! -f ".open-next/worker.js" ]; then
    echo "Error: .open-next/worker.js not found after build"
    ls -la .open-next/ || echo "No .open-next directory found"
    exit 1
fi

echo "Build artifacts verified successfully"
echo "Contents of .open-next directory:"
ls -la .open-next/

# Step 3: Deploy with wrangler
echo "Deploying to Cloudflare..."
npx wrangler deploy

echo "Deployment completed successfully!"
