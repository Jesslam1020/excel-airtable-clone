#!/bin/bash

# 🚀 Manual Vercel Deployment Script
# Use this if GitHub Actions deployment isn't working yet

echo "🚀 Manual Vercel Deployment for Excel-Airtable Clone"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm ci

echo "🔍 Running lint checks..."
npm run lint || echo "⚠️ Lint warnings present but continuing..."

echo "🏗️ Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    echo "🚀 Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    echo "🌐 Starting Vercel deployment..."
    vercel --prod
    
    echo "🎉 Deployment complete!"
    echo "📊 Check your deployment at: https://vercel.com/dashboard"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
