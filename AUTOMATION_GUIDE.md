# 🚀 Automated Deployment Guide

## Quick Start (1-Command Deploy)

### Windows Users:
```bash
npm run quick-deploy:windows
```

### Mac/Linux Users:
```bash
npm run quick-deploy:unix
```

## What's Automated?

### 1. GitHub Actions (Auto-Deploy on Push)
- ✅ Automatically builds on every push to `main`
- ✅ Runs tests and linting
- ✅ Deploys to Vercel production
- ✅ Updates Firebase Firestore rules

### 2. Setup Scripts
- ✅ `npm run setup:windows` - Full project setup (Windows)
- ✅ `npm run setup:unix` - Full project setup (Mac/Linux)

### 3. Quick Deploy Scripts
- ✅ `npm run deploy:auto` - Commit and push in one command
- ✅ `npm run quick-deploy:windows` - Smart deploy with checks (Windows)
- ✅ `npm run quick-deploy:unix` - Smart deploy with checks (Mac/Linux)

## First Time Setup

### 1. GitHub Secrets (Required for Auto-Deploy)
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_TOKEN=your_firebase_token (optional)
FIREBASE_SERVICE_ACCOUNT=your_service_account_json (optional)
```

### 2. Get Your Tokens

#### Vercel Token:
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Copy the token

#### Vercel Org & Project IDs:
1. Go to your Vercel project settings
2. Copy Org ID and Project ID from the URL or settings

#### Firebase Token (Optional):
```bash
npm install -g firebase-tools
firebase login:ci
```

### 3. Run Initial Setup
```bash
npm run setup:windows    # Windows
npm run setup:unix       # Mac/Linux
```

## Deployment Workflows

### 🔄 Automatic (Recommended)
1. Make your changes
2. Run: `npm run deploy:auto`
3. That's it! GitHub Actions handles the rest

### ⚡ Quick Deploy
1. Run: `npm run quick-deploy:windows` (or unix)
2. Script automatically:
   - Commits changes
   - Switches to main branch
   - Pushes to GitHub
   - Opens GitHub Actions in browser

### 🎯 Manual Deploy
1. `git add .`
2. `git commit -m "Your message"`
3. `git push origin main`
4. Watch GitHub Actions deploy automatically

## Monitoring

### GitHub Actions
- View builds: https://github.com/Jesslam1020/excel-airtable-clone/actions
- Automatic notifications on build success/failure

### Vercel Dashboard
- Live deployments: https://vercel.com/dashboard
- Real-time logs and metrics

### Firebase Console
- Database: https://console.firebase.google.com/
- Usage and performance metrics

## Troubleshooting

### Build Failures
1. Check GitHub Actions logs
2. Verify environment variables
3. Test locally: `npm run build`

### Deploy Failures
1. Check Vercel deployment logs
2. Verify secrets are set correctly
3. Check project root directory setting

### Firebase Issues
1. Verify Firestore security rules
2. Check project ID in environment variables
3. Ensure Firebase project is active

## Pro Tips

### 🚀 Zero-Downtime Deploys
- GitHub Actions automatically creates preview deployments
- Only promotes to production after successful tests

### 📊 Performance Monitoring
- Vercel automatically provides performance analytics
- Firebase provides usage metrics

### 🔒 Security
- All secrets are encrypted in GitHub
- Environment variables are injected at build time
- No sensitive data in source code

### ⚡ Speed Optimization
- Build cache is automatically handled
- Dependencies are cached between builds
- Incremental static regeneration enabled

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run deploy:auto` | One-command deploy |
| `npm run quick-deploy:windows` | Smart deploy (Windows) |
| `npm run quick-deploy:unix` | Smart deploy (Mac/Linux) |
| `npm run setup:windows` | Initial setup (Windows) |
| `npm run setup:unix` | Initial setup (Mac/Linux) |
| `npm run deploy:vercel` | Direct Vercel deploy |
| `npm run deploy:preview` | Preview deployment |
| `npm run firebase:deploy` | Firebase-only deploy |

---

**🎉 Your Excel-Airtable Clone is now fully automated!**

Push to `main` branch and watch the magic happen! ✨
