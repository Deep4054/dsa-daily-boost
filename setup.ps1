# DSA Daily Boost - Windows Setup Script
# Run this script in PowerShell to start the development server

Write-Host "🚀 DSA Daily Boost - Setting up development environment..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm." -ForegroundColor Red
    exit 1
}

# Navigate to project directory
Write-Host "📁 Navigating to project directory..." -ForegroundColor Blue
Set-Location -Path $PSScriptRoot

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Warning: .env.local file not found!" -ForegroundColor Yellow
    Write-Host "Please create .env.local with your configuration:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "VITE_SUPABASE_URL=https://lsgjhhkbroecvlmiolnc.supabase.co" -ForegroundColor Cyan
    Write-Host "VITE_SUPABASE_ANON_KEY=your_anon_key_here" -ForegroundColor Cyan
    Write-Host "VITE_GOOGLE_CLIENT_ID=your_google_client_id_here" -ForegroundColor Cyan
    Write-Host "VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here" -ForegroundColor Cyan
    Write-Host "VITE_APP_URL=http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to continue anyway..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Start development server
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "📱 Your app will be available at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
