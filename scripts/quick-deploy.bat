@echo off
REM 🔧 Quick Deploy Script (Windows)

echo 🚀 Quick Deploy - Excel-Airtable Clone
echo ======================================

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Not a git repository. Please initialize git first.
    pause
    exit /b 1
)

REM Check for uncommitted changes
git diff-index --quiet HEAD -- >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  You have uncommitted changes. Committing now...
    git add .
    for /f "tokens=* USEBACKQ" %%a in (`powershell -command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"`) do set datetime=%%a
    git commit -m "🚀 Auto-deploy: %datetime%"
)

REM Check if on main branch
for /f "tokens=*" %%a in ('git branch --show-current') do set current_branch=%%a
if not "%current_branch%"=="main" (
    echo ⚠️  Not on main branch. Switching to main...
    git checkout main
)

REM Push to trigger GitHub Actions
echo 📤 Pushing to GitHub...
git push origin main

if %ERRORLEVEL% EQU 0 (
    echo ✅ Push complete!
    echo.
    echo 📊 Deployment Status:
    echo • GitHub Actions will automatically build and deploy
    echo • Check progress: https://github.com/Jesslam1020/excel-airtable-clone/actions
    echo • Vercel dashboard: https://vercel.com/dashboard
    echo.
    echo ⏱️  Deployment typically takes 2-3 minutes
    echo.
    echo 🌐 Opening GitHub Actions in browser...
    start https://github.com/Jesslam1020/excel-airtable-clone/actions
    echo.
    echo 🎉 Deployment initiated! Your app will be live shortly.
) else (
    echo ❌ Push failed. Please check your git configuration.
)

pause
