#!/bin/bash

# Automated deployment script for Firebase + GitHub + Vercel
echo "?? Starting automated deployment setup..."

# Check if required tools are installed
echo "?? Checking prerequisites..."

if ! command -v git &> /dev/null; then
    echo "? Git is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "? npm is not installed"  
    exit 1
fi

# Install global dependencies
echo "?? Installing global dependencies..."
npm install -g vercel firebase-tools

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "? Not in a git repository. Please run 'git init' first."
    exit 1
fi

# Build the project to test
echo "?? Testing build..."
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "? Build successful!"
else
    echo "? Build failed. Please fix errors before deploying."
    exit 1
fi

# Connect to Vercel
echo "?? Connecting to Vercel..."
vercel link

# Get Vercel project info
echo "?? Getting Vercel project information..."
if [ -f ".vercel/project.json" ]; then
    echo "Vercel project linked successfully!"
    echo "Add these to your GitHub secrets:"
    echo "VERCEL_ORG_ID=$(cat .vercel/project.json | grep -o '"orgId":"[^"]*' | cut -d'"' -f4)"
    echo "VERCEL_PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)"
else
    echo "? Vercel project not linked properly"
    exit 1
fi

# Firebase login check
echo "?? Checking Firebase authentication..."
firebase projects:list > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "? Firebase authenticated!"
else
    echo "?? Please login to Firebase:"
    firebase login
fi

# Generate Firebase token
echo "?? Generating Firebase CI token..."
firebase login:ci

echo ""
echo "?? Setup complete! Next steps:"
echo "1. Add all secrets to GitHub repository settings"
echo "2. Add environment variables to Vercel project settings"  
echo "3. Push your code to trigger the first automated deployment"
echo ""
echo "For detailed instructions, see DEPLOYMENT_AUTOMATION_GUIDE.md"