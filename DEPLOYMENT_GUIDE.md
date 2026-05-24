# Deployment Guide - Dormitory System

## Option: Deploy ไป Railway.app + Vercel (แนะนำสำหรับ Free Tier)

Railway.app เหมาะสำหรับการ deploy ฟรี:
- ✅ Backend + Database รวมได้
- ✅ Automatic HTTPS
- ✅ Easy setup from GitHub

## ขั้นตอนการ Deploy Backend ไป Railway.app

### 1. เตรียม GitHub Repository
```bash
# หากยังไม่ได้ push code ไป GitHub
git init
git add .
git commit -m "Initial commit - dormitory system online ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dormitory-system-online.git
git push -u origin main
```

### 2. สร้าง Railway Account
- ไป https://railway.app
- Sign up ด้วย GitHub
- Authorize Railway

### 3. เพิ่ม Backend ไป Railway
1. Click "+ New Project"
2. Select "Deploy from GitHub repo"
3. Select your `dormitory-system-online` repository (online version)
4. Railway จะ auto-detect Node.js project
5. Click "Deploy"

### 4. ตั้งค่า Database ใน Railway
1. ใน Railway Dashboard ของ project
2. Click "+ Add"
3. Select "MySQL"
4. Railway จะ create database automatically

### 5. ตั้งค่า Environment Variables ใน Railway

ใน Railway Dashboard:
1. ไปที่ Backend service
2. Click "Variables"
3. Add สิ่งต่อไปนี้:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-very-strong-random-secret-key-here
DB_HOST=your-railway-mysql-host
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-railway-db-password
DB_NAME=railway
CORS_ORIGIN=https://your-frontend-domain.vercel.app,https://your-custom-domain.com
```

**หมายเหตุ:** Railway จะให้ DB_HOST, DB_USER, DB_PASSWORD ให้คุณ

### 6. ตั้งค่า Build & Start Commands

ใน Railway Dashboard → Backend Service → Settings:

**Build Command:**
```
npm install
```

**Start Command:**
```
npm start
```

### 7. Import Database Schema

Railway จะให้ connection string คุณ สามารถ:
1. ใช้ MySQL Workbench หรือ phpMyAdmin
2. Import file `database-schema.sql` เข้าไป
3. หรือรัน script `setup-db.js` (หากให้ permission)

---

## Deploy Frontend ไป Vercel (Free)

### 1. Push Frontend ไป GitHub

สร้าง repository สำหรับ frontend หรือใช้ subdirectory เดียวกัน
(ใช้ `dormitory-system-online` repository)

### 2. Deploy ไป Vercel
1. ไป https://vercel.com
2. Sign up/Login ด้วย GitHub
3. Click "New Project"
4. Select `dormitory-system-online` repository
5. Select "frontend" folder
6. ตั้งค่า Environment Variables:

```
VITE_API_URL=https://your-railway-backend-url.railway.app
```

### 3. Vercel จะ Auto-Deploy เมื่อ Push ไป main branch

(ทั้ง `dormitory-system-online` repository)

---

## ตรวจสอบหลังจากการ Deploy

### 1. ทดสอบ Backend API
```bash
curl https://your-railway-backend.railway.app/api/health
```

### 2. ทดสอบ Frontend
- เข้า https://your-frontend.vercel.app
- ควรสามารถ login ได้
- ควรเห็น data ที่ดึงมาจาก Railway Database

### 3. ทดสอบจากมือถือ
- ใช้ browser บนมือถือ
- เข้า https://your-frontend.vercel.app
- ควรแสดง UI responsive

---

## ปัญหา & แก้ไข

### CORS Error
- ตรวจสอบ `CORS_ORIGIN` environment variable ใน Railway
- ต้องรวม frontend URL ของคุณ

### Database Connection Error
- ตรวจสอบ `DB_HOST`, `DB_USER`, `DB_PASSWORD` ใน Railway
- Database เปิด public networking ใน Railway หรือไม่?

### Frontend ไม่เห็น Data
- ตรวจสอบ `VITE_API_URL` ใน Vercel
- ให้เป็น Backend URL ของ Railway เต็มๆ

---

## Custom Domain (Optional)

### Railway
Railway → Project Settings → Domains → Add Custom Domain

### Vercel
Vercel → Project Settings → Domains → Add Domain

---

## อยากให้ Responsive บนมือถือได้

Frontend ของคุณใช้ React Bootstrap แล้ว ซึ่งช่วยได้แล้ว
แต่ควรตรวจสอบ:

1. เปิด DevTools (F12) → Responsive Design Mode
2. ทดสอบที่ขนาดต่างๆ (Mobile, Tablet, Desktop)
3. ถ้าดูไม่ดี ให้ปรับ component ให้ responsive มากขึ้น

---

## Steps Summary

1. ✅ Push code ไป GitHub
2. ✅ Create Railway account
3. ✅ Connect GitHub repository ไป Railway
4. ✅ Setup MySQL database ใน Railway
5. ✅ Configure environment variables
6. ✅ Import database schema
7. ✅ Deploy frontend ไป Vercel
8. ✅ Test from mobile device

**คาดว่าใช้เวลา 20-30 นาที**

