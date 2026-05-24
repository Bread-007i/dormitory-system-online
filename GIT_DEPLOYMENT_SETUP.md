# Git & Deployment Setup Guide

## 1. ตั้งค่า .gitignore

ตรวจสอบว่า `.gitignore` ของคุณมี:

```
# Environment variables
.env
.env.local
.env.*.local
.env.production

# Node modules
node_modules/
npm-debug.log*
yarn-debug.log*

# Build files
dist/
build/

# Logs
logs/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
```

## 2. เตรียม GitHub Repository

### เริ่มแรก (หากยังไม่มี GitHub repo)

```bash
# ไปที่ root folder
cd c:\dormitory-system-online

# Initialize Git
git init
git add .
git commit -m "Initial commit - dormitory system online ready for deployment"
git branch -M main

# เพิ่ม GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/dormitory-system-online.git
git push -u origin main
```

### หากมี Repository แล้ว

```bash
cd c:\dormitory-system-online
git add .
git commit -m "Update: add environment configuration for production"
git push origin main
```

## 3. ผลลัพธ์ที่คาดหวัง

หลังจาก push ไป GitHub:
- ✅ Repository structure ที่สมบูรณ์
- ✅ Backend และ Frontend อยู่ในเดียวกัน
- ✅ Railway สามารถอ่าน config ได้

## 4. การ Deploy ไป Railway

เมื่อ push ไป GitHub แล้ว:

1. เข้า https://railway.app
2. New Project → Deploy from GitHub
3. Railway จะ auto-detect Node.js backend
4. เลือก branch `main`
5. Railway จะ deploy อัตโนมัติ

---

**Note:** ห้าม commit `.env` ไปยัง GitHub!
