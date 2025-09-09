# Automated Deployment Setup Guide

This guide will help you set up automated deployment connecting Firebase, GitHub, and Vercel.

## Prerequisites

Make sure you have accounts and projects set up on:
- [GitHub](https://github.com) - Repository hosting
- [Vercel](https://vercel.com) - Frontend deployment  
- [Firebase](https://firebase.google.com) - Backend services (Firestore)

## Step 1: Configure GitHub Repository Secrets

Go to your GitHub repository ? Settings ? Secrets and variables ? Actions, and add these secrets:

### Vercel Secrets
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id  
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Firebase Secrets
```
FIREBASE_TOKEN=your_firebase_token
FIREBASE_PROJECT_ID=essay-460509
FIREBASE_SERVICE_ACCOUNT=your_firebase_service_account_json
```

### Firebase Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDbvzMy9-2edTQAPKuJeQX7e3yCz6L_x68
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=essay-460509.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=essay-460509
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=essay-460509.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=954168447270
NEXT_PUBLIC_FIREBASE_APP_ID=1:954168447270:web:f221a861b18cc74781f1e7
```

## Step 2: Get Required Tokens and IDs

### Vercel Token and IDs
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to Settings ? Tokens ? Create Token
3. Copy the token for `VERCEL_TOKEN`
4. For `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:
   ```bash
   npx vercel link
   cat .vercel/project.json
   ```

### Firebase Token
```bash
npm install -g firebase-tools
firebase login:ci
```
Copy the token for `FIREBASE_TOKEN`

### Firebase Service Account
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Project Settings ? Service Accounts
3. Generate new private key
4. Copy the entire JSON content for `FIREBASE_SERVICE_ACCOUNT`

## Step 3: Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project ? Settings ? Environment Variables
3. Add all the Firebase environment variables from above

## Step 4: Test the Setup

1. Make a change to your code
2. Push to main branch:
   ```bash
   git add .
   git commit -m "Setup automated deployment"
   git push origin main
   ```
3. Check GitHub Actions tab to see the deployment progress
4. Check Vercel dashboard for deployment status

## Step 5: Development Workflow

### For new features:
1. Create a feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
2. Make your changes
3. Push the branch:
   ```bash
   git push origin feature/new-feature
   ```
4. Create a Pull Request ? This triggers a preview deployment
5. Merge to main ? This triggers production deployment

### Manual deployment commands:
```bash
# Quick Vercel deployment
npm run deploy:vercel

# Build and start locally
npm run deploy:build
```

## Troubleshooting

### Common Issues:
1. **Build fails**: Check if all environment variables are set correctly
2. **Vercel deployment fails**: Verify VERCEL_TOKEN and project IDs
3. **Firebase deployment fails**: Check FIREBASE_TOKEN and service account

### Debug Commands:
```bash
# Test build locally
npm run build

# Check environment variables
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID

# Test Firebase connection
firebase projects:list
```

## Deployment Flow

```
GitHub Push ? GitHub Actions ? Build & Test ? Deploy to Vercel ? Update Firebase
```

- **Pull Request**: Creates preview deployment on Vercel
- **Main Branch Push**: Creates production deployment + updates Firebase
- **Automatic**: No manual intervention required after setup

## Security Notes

- Never commit secrets to the repository
- All sensitive data is stored in GitHub Secrets
- Environment variables are injected during build time
- Firebase service account should have minimal required permissions

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Check Vercel deployment logs  
3. Check Firebase console for errors
4. Verify all secrets are correctly set