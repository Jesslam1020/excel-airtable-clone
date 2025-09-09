#!/bin/bash

# 🔧 Quick Deploy Script
# Automated deployment with environment variable checks

set -e  # Exit on any error

echo "🚀 Quick Deploy - Excel-Airtable Clone"
echo "======================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not a git repository. Please initialize git first.${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes. Committing now...${NC}"
    git add .
    git commit -m "🚀 Auto-deploy: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Check if on main branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo -e "${YELLOW}⚠️  Not on main branch. Switching to main...${NC}"
    git checkout main
fi

# Push to trigger GitHub Actions
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
git push origin main

echo -e "${GREEN}✅ Push complete!${NC}"
echo ""
echo -e "${BLUE}📊 Deployment Status:${NC}"
echo "• GitHub Actions will automatically build and deploy"
echo "• Check progress: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
echo "• Vercel dashboard: https://vercel.com/dashboard"
echo ""
echo -e "${YELLOW}⏱️  Deployment typically takes 2-3 minutes${NC}"

# Check if we can open browser
if command -v open &> /dev/null; then
    echo -e "${BLUE}🌐 Opening GitHub Actions in browser...${NC}"
    open "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
elif command -v xdg-open &> /dev/null; then
    echo -e "${BLUE}🌐 Opening GitHub Actions in browser...${NC}"
    xdg-open "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions"
fi

echo ""
echo -e "${GREEN}🎉 Deployment initiated! Your app will be live shortly.${NC}"
