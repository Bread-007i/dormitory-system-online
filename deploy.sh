#!/bin/bash

# Dormitory System - Quick Deployment Script
# Usage: bash deploy.sh

set -e

echo "🚀 Dormitory System Deployment Script"
echo "======================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

echo "📦 Building backend..."
cd backend
npm install
npm run build 2>/dev/null || echo "No build script in backend"

echo ""
echo "📦 Building frontend..."
cd ../frontend
npm install
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "📝 Next steps:"
echo "1. Commit changes: git add . && git commit -m 'Build: prepare for production'"
echo "2. Push to GitHub: git push origin main"
echo "3. Go to https://railway.app and deploy from GitHub"
echo "4. Go to https://vercel.com and deploy frontend"
echo ""
echo "5. Set environment variables on Railway:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=your-strong-secret-key"
echo "   - DB_* (from Railway MySQL)"
echo ""
echo "6. Set environment variables on Vercel:"
echo "   - VITE_API_URL=https://your-railway-backend.railway.app/api"
echo ""
