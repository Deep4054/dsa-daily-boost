@echo off
echo 🚀 DSA Daily Boost - Setting up development environment...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install npm.
    pause
    exit /b 1
)

echo ✅ Node.js and npm found!
echo.

REM Navigate to project directory
echo 📁 Navigating to project directory...
cd /d "%~dp0"

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies.
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!
echo.

REM Check if .env.local exists
if not exist ".env.local" (
    echo ⚠️  Warning: .env.local file not found!
    echo Please create .env.local with your configuration:
    echo.
    echo VITE_SUPABASE_URL=https://lsgjhhkbroecvlmiolnc.supabase.co
    echo VITE_SUPABASE_ANON_KEY=your_anon_key_here
    echo VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
    echo VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
    echo VITE_APP_URL=http://localhost:5173
    echo.
    echo Press any key to continue anyway...
    pause >nul
)

REM Start development server
echo 🚀 Starting development server...
echo 📱 Your app will be available at: http://localhost:5173
echo 🛑 Press Ctrl+C to stop the server
echo.

npm run dev
