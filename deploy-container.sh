#!/bin/bash

# ContainerCode Advisory - Separate Container Deployment Script
echo "🚀 Deploying ContainerCode Container Service..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "Installing wrangler..."
    npm install -g wrangler
fi

# Login check
echo "Checking Wrangler authentication..."
wrangler whoami

# Deploy container service separately
echo "Deploying Container Service..."
wrangler deploy --config wrangler.container.toml

# Wait a moment for deployment
sleep 3

# Test container endpoints
echo ""
echo "🧪 Testing Container Endpoints..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Health Check:"
curl -s https://containercode-container.ayoinc.workers.dev/health | jq . 2>/dev/null || curl -s https://containercode-container.ayoinc.workers.dev/health

echo ""
echo "Container Instance Test:"
curl -s https://containercode-container.ayoinc.workers.dev/container/test1

echo ""
echo "Load Balancer Test:" 
curl -s https://containercode-container.ayoinc.workers.dev/lb

echo ""
echo "Singleton Test:"
curl -s https://containercode-container.ayoinc.workers.dev/singleton

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Container Deployment Complete!"
echo ""
echo "🌐 Main Website: https://containercode.ayoinc.workers.dev"
echo "📦 Container Service: https://containercode-container.ayoinc.workers.dev"
echo "🏥 Health Check: https://containercode-container.ayoinc.workers.dev/health"
echo "⚖️ Load Balancer: https://containercode-container.ayoinc.workers.dev/lb"
echo "🎯 Singleton: https://containercode-container.ayoinc.workers.dev/singleton"
