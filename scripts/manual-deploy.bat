@echo off
REM 🚀 Manual Vercel Deployment Script for Windows
REM Use this if GitHub Actions deployment isn't working yet

echo 🚀 Manual Vercel Deployment for Excel-Airtable Clone
echo ==================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this from the project root.
    exit /b 1
)

echo 📦 Installing dependencies...
call npm ci
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo 🔍 Running lint checks...
call npm run lint
if errorlevel 1 (
    echo ⚠️ Lint warnings present but continuing...
)

echo 🏗️ Building project...
call npm run build
if errorlevel 1 (
    echo ❌ Build failed! Please check the errors above.
    exit /b 1
)

echo ✅ Build successful!

echo 🚀 Deploying to Vercel...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    call npm install -g vercel
)

REM Deploy to Vercel
echo 🌐 Starting Vercel deployment...
call vercel --prod

echo 🎉 Deployment complete!
echo 📊 Check your deployment at: https://vercel.com/dashboard

pause
