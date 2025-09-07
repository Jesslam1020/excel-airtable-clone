@echo off
echo ?? Starting Vercel deployment process...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ?? Installing Vercel CLI...
    npm install -g vercel
)

echo ?? Building the project...
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ? Build successful! Deploying to Vercel...
    vercel --prod
    
    echo.
    echo ?? Deployment complete!
    echo.
    echo ?? Next steps:
    echo 1. Go to https://vercel.com/dashboard
    echo 2. Find your project and go to Settings ? Environment Variables
    echo 3. Add your Firebase environment variables:
    echo    - NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDbvzMy9-2edTQAPKuJeQX7e3yCz6L_x68
    echo    - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=essay-460509.firebaseapp.com
    echo    - NEXT_PUBLIC_FIREBASE_PROJECT_ID=essay-460509
    echo    - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=essay-460509.firebasestorage.app
    echo    - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=954168447270
    echo    - NEXT_PUBLIC_FIREBASE_APP_ID=1:954168447270:web:f221a861b18cc74781f1e7
    echo 4. Redeploy with: vercel --prod
    echo.
) else (
    echo ? Build failed. Please check for errors and try again.
)

pause