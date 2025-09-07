#!/bin/bash

# Quick Vercel Deployment Script for Excel-Airtable Clone

echo "?? Starting Vercel deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "?? Installing Vercel CLI..."
    npm install -g vercel
fi

echo "?? Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "? Build successful! Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "?? Deployment complete!"
    echo ""
    echo "?? Next steps:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Find your project and go to Settings ? Environment Variables"
    echo "3. Add your Firebase environment variables:"
    echo "   - NEXT_PUBLIC_FIREBASE_API_KEY"
    echo "   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
    echo "   - NEXT_PUBLIC_FIREBASE_PROJECT_ID"
    echo "   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
    echo "   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
    echo "   - NEXT_PUBLIC_FIREBASE_APP_ID"
    echo "4. Redeploy with: vercel --prod"
    echo ""
else
    echo "? Build failed. Please check for errors and try again."
fi