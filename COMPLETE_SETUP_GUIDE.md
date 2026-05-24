# Complete Setup & Deployment Guide

## 📱 ทำให้ใช้ได้บนมือถือและ Production

### สรุปขั้นตอน

ระบบนี้จะ deploy ไป:
1. **Backend API** → Railway.app (MySQL Database)
2. **Frontend** → Vercel (บน HTTPS)
3. **Mobile Support** → Bootstrap responsive design (รองรับแล้ว)

---

## 🔧 Step 1: เตรียม Local Environment

### 1.1 ตั้งค่า Backend Environment

```bash
# ไป backend folder
cd backend

# Copy .env.example → .env
cp .env.example .env

# แก้ไข .env ด้วย local database config:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_local_password
# DB_NAME=dormitory_system
# NODE_ENV=development
# JWT_SECRET=your-local-secret-key
```

### 1.2 ตั้งค่า Frontend Environment

```bash
# ไป frontend folder
cd frontend

# Copy .env.example → .env
cp .env.example .env

# Default: VITE_API_URL=http://localhost:5000/api
```

### 1.3 รัน Local (Testing)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Open browser: http://localhost:5173
```

---

## 🚀 Step 2: Deploy ไป Production

### 2.1 Push Code ไป GitHub

```bash
# จาก root folder
git init
git add .
git commit -m "Initial commit: Dormitory system ready for production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dormitory-system.git
git push -u origin main
```

### 2.2 Deploy Backend ไป Railway.app

**สมัคร Railway:**
1. ไป https://railway.app
2. Click "Sign up with GitHub"
3. Authorize Railway

**Deploy Backend:**
1. Click "+ New Project"
2. Select "Deploy from GitHub repo"
3. เลือก `dormitory-system` repository
4. Railway auto-detect Node.js

**ตั้งค่า Database:**
1. ใน Railway Dashboard
2. Click "+ Add"
3. Select "MySQL"
4. Database สร้างอัตโนมัติ

**ตั้งค่า Environment Variables:**

ใน Railway → Backend Service → Variables:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-very-strong-random-secret-key-here-min-32-chars
CORS_ORIGIN=https://your-frontend-domain.vercel.app
DB_HOST=your-mysql-host (Railway ให้)
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password (Railway ให้)
DB_NAME=railway
PROMPTPAY_ACCOUNT_NAME=Your Business Name
PROMPTPAY_ACCOUNT_MASK=xxx-x-x****-x
```

**Import Database Schema:**

```bash
# ใช้ MySQL client
mysql -h <railway-host> -u root -p<password> railway < database-schema.sql
```

หรือ

```bash
# ใช้ phpMyAdmin (ถ้า Railway ให้ access)
1. Export database-schema.sql
2. Import เข้า Railway MySQL
```

### 2.3 Deploy Frontend ไป Vercel

**สมัคร Vercel:**
1. ไป https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

**Deploy Frontend:**
1. Click "New Project"
2. เลือก GitHub repository
3. Select "frontend" folder
4. Framework: "Vite"

**ตั้งค่า Environment:**

ใน Vercel → Project Settings → Environment Variables:

```
VITE_API_URL=https://your-railway-backend-url.railway.app/api
```

Railway จะให้ URL ใหม่ อยากหน้า Deployment Details

---

## 📱 Step 3: ทดสอบ Mobile

### 3.1 ทดสอบบนมือถือ

```bash
# หากมือถือและ computer เชื่อม WiFi เดียวกัน
# จากมือถือเข้า:
https://your-frontend-domain.vercel.app
```

หรือ Local Testing:
```bash
# เปิด Developer Tools (F12)
# Ctrl+Shift+M (Toggle Device Toolbar)
# เปลี่ยน viewport เป็น iPhone/Android
```

### 3.2 ตรวจสอบ Responsive

- [ ] Login page - มือถือ ✓
- [ ] Dashboard - tablet ✓
- [ ] List pages - โทรศัพท์แนวตั้ง ✓
- [ ] Forms - ทั้ง portrait & landscape ✓

ถ้าต้องแก้ไข UI responsive:
```bash
# Components ใช้ React Bootstrap (responsive แล้ว)
# หากต้องปรับ: แก้ไข className ด้วย Bootstrap utilities
```

---

## 🔐 Security Checklist

- [ ] `JWT_SECRET` ต่างกันจาก Local
- [ ] `.env` ไม่ commit ไป GitHub
- [ ] `CORS_ORIGIN` มี frontend URL เท่านั้น
- [ ] Database password ปลอดภัย
- [ ] HTTPS enabled (Vercel + Railway)

---

## 🧪 Testing Checklist

- [ ] Backend API accessible จาก frontend
- [ ] Login/logout ทำงาน
- [ ] CRUD operations ทำงาน
- [ ] File upload ทำงาน
- [ ] Mobile view responsive
- [ ] Payment system ทำงาน (ถ้าใช้)

---

## ❌ Troubleshooting

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**วิธีแก้:**
- ตรวจสอบ `CORS_ORIGIN` ใน Railway backend
- ต้องรวม frontend URL เต็มๆ

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**วิธีแก้:**
- ตรวจสอบ DB credentials ใน Railway
- Database online หรือไม่?
- Firewall allow connection หรือไม่?

### Frontend ไม่เห็น Data
**วิธีแก้:**
- ตรวจสอบ `VITE_API_URL` ใน Vercel
- ต้องเป็น Railway backend URL

### Slow Performance
**วิธีแก้:**
- ใช้ Railway CPU upgrade (paid)
- ใช้ CDN (Railway support)
- Optimize database queries

---

## 📊 Cost Estimate (Monthly)

| Service | Free Tier | Usage |
|---------|-----------|-------|
| Railway | $5 credit | Backend + DB |
| Vercel | Free | Frontend |
| **Total** | ~$0-5 | Dormitory system |

---

## 📞 Support

- Railway Docs: https://railway.app/docs
- Vercel Docs: https://vercel.com/docs
- Contact: Your support email

---

## Next Steps

1. ✅ Prepare .env files (DONE)
2. ✅ Create GitHub repo
3. ✅ Deploy to Railway
4. ✅ Deploy to Vercel
5. ✅ Test on mobile
6. ✅ Monitor & maintain

**Estimated setup time: 30-45 minutes**

