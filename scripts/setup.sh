#!/bin/bash

# 🚀 Excel-Airtable Clone - Automated Setup Script
# This script will help you set up and deploy your project automatically

echo "🚀 Excel-Airtable Clone - Automated Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

echo -e "${BLUE}🔧 Building the project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please check for errors.${NC}"
    exit 1
fi

echo -e "${YELLOW}🔐 Setting up environment variables...${NC}"
echo ""
echo "Please add these environment variables to your deployment platform:"
echo ""
echo "NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here"
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com"
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id"
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com"
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id"
echo "NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id"
echo ""

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo -e "${BLUE}🚀 Vercel CLI found! Would you like to deploy now? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
        vercel --prod
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}🎉 Deployment successful!${NC}"
            echo ""
            echo -e "${YELLOW}📝 Don't forget to:${NC}"
            echo "1. Add environment variables in Vercel dashboard"
            echo "2. Check your Firebase Firestore security rules"
            echo "3. Test file upload functionality"
        else
            echo -e "${RED}❌ Deployment failed.${NC}"
        fi
    fi
else
    echo -e "${YELLOW}📋 To deploy manually:${NC}"
    echo "1. Install Vercel CLI: npm install -g vercel"
    echo "2. Run: vercel --prod"
    echo "3. Or use the Vercel web dashboard"
fi

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${BLUE}📚 Quick Links:${NC}"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo "• Firebase Console: https://console.firebase.google.com/"
echo "• GitHub Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
echo ""
echo -e "${YELLOW}💡 Tips:${NC}"
echo "• Push to main branch to trigger automatic deployment"
echo "• Check GitHub Actions for build status"
echo "• Monitor Vercel dashboard for deployment logs"
echo ""
