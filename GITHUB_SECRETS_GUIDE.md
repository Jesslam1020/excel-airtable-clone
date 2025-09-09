# 🔐 Complete GitHub Secrets Setup Guide

## Step-by-Step Instructions to Add GitHub Secrets

### Part 1: 🌐 Getting Vercel Credentials

#### Step 1A: Get VERCEL_TOKEN
1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click on your profile picture** (top right corner)
3. **Select "Settings"** from dropdown
4. **Click "Tokens"** in the left sidebar
5. **Click "Create Token"** button
6. **Enter token name:** `GitHub-Actions-Deploy`
7. **Select scope:** Choose your team/personal account
8. **Set expiration:** Choose "No Expiration" or 1 year
9. **Click "Create"**
10. **COPY THE TOKEN** - You won't see it again!
    ```
    Example: vercel_1234567890abcdefghijklmnop
    ```

#### Step 1B: Get VERCEL_ORG_ID
1. **Go to your Vercel project:** https://vercel.com/dashboard
2. **Click on your "excel-airtable-clone" project**
3. **Click "Settings" tab** (top navigation)
4. **Scroll down to "General" section**
5. **Find "Project ID"** - this is actually your ORG ID
6. **Copy the value** - looks like:
    ```
    Example: team_1234567890abcdefg
    ```

#### Step 1C: Get VERCEL_PROJECT_ID
1. **Same page as above** (Project Settings)
2. **Find "Project ID"** in the General section
3. **Copy the second ID value** - looks like:
    ```
    Example: prj_1234567890abcdefghijklmnop
    ```

### Part 2: 🔑 Adding Secrets to GitHub

#### Step 2A: Navigate to GitHub Secrets
1. **Go to your GitHub repository:** 
   ```
   https://github.com/Jesslam1020/excel-airtable-clone
   ```
2. **Click "Settings" tab** (repository navigation, not your profile)
3. **In left sidebar, click "Secrets and variables"**
4. **Click "Actions"** (submenu under Secrets and variables)

#### Step 2B: Add Each Secret
**For each secret below, follow these steps:**

1. **Click "New repository secret"** (green button)
2. **Enter the Name** (exactly as shown)
3. **Paste the Value** (from Vercel)
4. **Click "Add secret"**

**Add these 3 secrets:**

##### Secret 1: VERCEL_TOKEN
```
Name: VERCEL_TOKEN
Value: [Paste your Vercel token from Step 1A]
```

##### Secret 2: VERCEL_ORG_ID
```
Name: VERCEL_ORG_ID  
Value: [Paste your Vercel org ID from Step 1B]
```

##### Secret 3: VERCEL_PROJECT_ID
```
Name: VERCEL_PROJECT_ID
Value: [Paste your Vercel project ID from Step 1C]
```

### Part 3: ✅ Verification

#### After adding all secrets, you should see:
```
Repository secrets (3)
├── VERCEL_TOKEN          ●●●●●●●●●●●●●●●●
├── VERCEL_ORG_ID         ●●●●●●●●●●●●●●●●  
└── VERCEL_PROJECT_ID     ●●●●●●●●●●●●●●●●
```

### Part 4: 🚀 Test Your Automation

Once secrets are added:

1. **Make a small change** to any file in your project
2. **Run the automation:**
   ```bash
   npm run quick-deploy:windows
   ```
3. **Check GitHub Actions:**
   - Go to GitHub → Actions tab
   - You should see a new workflow running
   - It should deploy to Vercel automatically!

### Part 5: 🔍 Troubleshooting

#### If deployment fails:

**Check GitHub Actions logs:**
1. GitHub → Actions → Click on failed workflow
2. Click on "deploy" job
3. Expand each step to see error details

**Common issues:**
- **Invalid token:** Regenerate Vercel token
- **Wrong org/project ID:** Double-check Vercel project settings
- **Permissions:** Make sure token has deployment permissions

**Test your Vercel token manually:**
```bash
npx vercel --token YOUR_TOKEN_HERE
```

### Part 6: 🎉 Success Indicators

**When everything works:**
- ✅ GitHub Actions show green checkmarks
- ✅ Vercel shows new deployment
- ✅ Your site is live with latest changes
- ✅ You get email notifications from Vercel

**Your automation is complete when:**
1. You push code → GitHub Actions runs
2. GitHub Actions → Builds and deploys
3. Vercel → Shows new deployment
4. Your site → Updates automatically

---

## 📋 Quick Reference

**Vercel URLs you need:**
- Dashboard: https://vercel.com/dashboard
- Token creation: https://vercel.com/account/tokens
- Project settings: https://vercel.com/[your-username]/excel-airtable-clone/settings

**GitHub URLs you need:**
- Repository: https://github.com/Jesslam1020/excel-airtable-clone
- Secrets: https://github.com/Jesslam1020/excel-airtable-clone/settings/secrets/actions
- Actions: https://github.com/Jesslam1020/excel-airtable-clone/actions

**Final test command:**
```bash
npm run quick-deploy:windows
```

That's it! Your Excel/Airtable clone will now deploy automatically! 🚀
