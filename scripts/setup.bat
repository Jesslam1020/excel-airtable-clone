@echo off
REM 🚀 Excel-Airtable Clone - Automated Setup Script (Windows)

echo 🚀 Excel-Airtable Clone - Automated Setup
echo ========================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install

echo 🔧 Building the project...
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Build successful!
) else (
    echo ❌ Build failed. Please check for errors.
    pause
    exit /b 1
)

echo.
echo 🔐 Setting up environment variables...
echo.
echo Please add these environment variables to your deployment platform:
echo.
echo NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
echo NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo 🚀 Vercel CLI found! Would you like to deploy now? (y/n)
    set /p response=
    if /i "%response%"=="y" (
        echo 🚀 Deploying to Vercel...
        call vercel --prod
        
        if %ERRORLEVEL% EQU 0 (
            echo 🎉 Deployment successful!
            echo.
            echo 📝 Don't forget to:
            echo 1. Add environment variables in Vercel dashboard
            echo 2. Check your Firebase Firestore security rules
            echo 3. Test file upload functionality
        ) else (
            echo ❌ Deployment failed.
        )
    )
) else (
    echo 📋 To deploy manually:
    echo 1. Install Vercel CLI: npm install -g vercel
    echo 2. Run: vercel --prod
    echo 3. Or use the Vercel web dashboard
)

echo.
echo 🎉 Setup complete!
echo.
echo 📚 Quick Links:
echo • Vercel Dashboard: https://vercel.com/dashboard
echo • Firebase Console: https://console.firebase.google.com/
echo • GitHub Actions: https://github.com/Jesslam1020/excel-airtable-clone/actions
echo.
echo 💡 Tips:
echo • Push to main branch to trigger automatic deployment
echo • Check GitHub Actions for build status
echo • Monitor Vercel dashboard for deployment logs
echo.

pause
