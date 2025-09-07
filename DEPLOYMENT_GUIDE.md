# Deploying to Vercel

## ?? Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and offers excellent integration.

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy Your App
```bash
# Navigate to your project directory
cd C:\Users\jessl\gemini-cli\packages\cli\excel-airtable-clone

# Deploy to Vercel
vercel
```

### Step 4: Configure Environment Variables
After deployment, you need to add your Firebase environment variables:

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** ? **Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDbvzMy9-2edTQAPKuJeQX7e3yCz6L_x68
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=essay-460509.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=essay-460509
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=essay-460509.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=954168447270
NEXT_PUBLIC_FIREBASE_APP_ID=1:954168447270:web:f221a861b18cc74781f1e7
```

### Step 5: Redeploy
```bash
vercel --prod
```

### ?? Benefits of Vercel:
- ? **Free tier available**
- ? **Automatic HTTPS**
- ? **Global CDN**
- ? **Automatic deployments from Git**
- ? **Perfect Next.js integration**
- ? **Custom domains**

---

## ?? Alternative: GitHub Pages + GitHub Actions

For a completely free solution using GitHub:

### Step 1: Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/excel-airtable-clone.git
git push -u origin main
```

### Step 2: Configure for Static Export
Add to your `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

### Step 3: Create GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
        NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

---

## ?? Alternative: Netlify

### Step 1: Connect to Netlify
1. Go to https://netlify.com
2. Sign up/login
3. Click "New site from Git"
4. Connect your GitHub repository

### Step 2: Configure Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### Step 3: Environment Variables
Add your Firebase environment variables in Netlify dashboard under Site settings ? Environment variables.

---

## ?? Alternative: Railway

### Step 1: Deploy to Railway
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Step 2: Set Environment Variables
```bash
railway variables set NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDbvzMy9-2edTQAPKuJeQX7e3yCz6L_x68
railway variables set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=essay-460509.firebaseapp.com
# ... add all other variables
```

---

## ?? Quick Comparison

| Platform | Cost | Setup Difficulty | Performance | Features |
|----------|------|------------------|-------------|----------|
| **Vercel** | Free tier ? $20/month | ????? Easy | ????? Excellent | Best for Next.js |
| **Netlify** | Free tier ? $19/month | ???? Easy | ???? Great | Great free tier |
| **GitHub Pages** | Free | ??? Medium | ??? Good | Completely free |
| **Railway** | $5/month | ???? Easy | ???? Great | Simple pricing |

## ?? Recommendation

**Use Vercel** - it's specifically designed for Next.js applications and offers:
- One-command deployment
- Automatic HTTPS and CDN
- Perfect integration with your Firebase backend
- Free tier that's sufficient for most projects

Would you like me to help you set up deployment on any of these platforms?