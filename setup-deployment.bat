@echo off
REM Automated deployment setup script for Windows
echo ?? Starting automated deployment setup...

REM Check if required tools are installed
echo ?? Checking prerequisites...

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ? Git is not installed
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ? npm is not installed
    exit /b 1
)

REM Install global dependencies
echo ?? Installing global dependencies...
npm install -g vercel firebase-tools

REM Check if we're in a git repository
if not exist ".git" (
    echo ? Not in a git repository. Please run 'git init' first.
    exit /b 1
)

REM Build the project to test
echo ?? Testing build...
npm install
npm run build

if %ERRORLEVEL% EQU 0 (
    echo ? Build successful!
) else (
    echo ? Build failed. Please fix errors before deploying.
    exit /b 1
)

REM Connect to Vercel
echo ?? Connecting to Vercel...
vercel link

REM Get Vercel project info
echo ?? Getting Vercel project information...
if exist ".vercel\project.json" (
    echo Vercel project linked successfully!
    echo Add these to your GitHub secrets:
    echo Check .vercel\project.json for VERCEL_ORG_ID and VERCEL_PROJECT_ID
) else (
    echo ? Vercel project not linked properly
    exit /b 1
)

REM Firebase login check
echo ?? Checking Firebase authentication...
firebase projects:list >nul 2>nul

if %ERRORLEVEL% EQU 0 (
    echo ? Firebase authenticated!
) else (
    echo ?? Please login to Firebase:
    firebase login
)

REM Generate Firebase token
echo ?? Generating Firebase CI token...
firebase login:ci

echo.
echo ?? Setup complete! Next steps:
echo 1. Add all secrets to GitHub repository settings
echo 2. Add environment variables to Vercel project settings
echo 3. Push your code to trigger the first automated deployment
echo.
echo For detailed instructions, see DEPLOYMENT_AUTOMATION_GUIDE.md

pause