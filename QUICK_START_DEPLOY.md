# 🚀 Quick Start - Deploy to Production

## 5-Minute Overview

คุณต้อง:
1. **Push code ไป GitHub**
2. **Deploy backend ไป Railway.app** (MySQL included)
3. **Deploy frontend ไป Vercel**
4. **Test on mobile**

**Total time: 30-45 minutes**

---

## ⚡ FAST SETUP

### Step 1: GitHub (5 min)

```bash
cd c:\dormitory-system-online

# ถ้ายังไม่มี GitHub repo:
git init
git add .
git commit -m "Initial: dormitory system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dormitory-system.git
git push -u origin main

# ถ้ามี repo แล้ว:
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Railway Backend (10 min)

1. ไป https://railway.app
2. Sign up / Login with GitHub
3. "+ New Project"
4. "Deploy from GitHub repo"
5. เลือก dormitory-system
6. Wait 2-3 minutes...
7. Back → "+ Add" → MySQL

**Get your URLs:**
- Backend URL: `your-project.railway.app` (copy for Vercel)
- MySQL credentials: Railway dashboard

### Step 3: Frontend env (2 min)

```bash
cd frontend

# Create .env.local
echo VITE_API_URL=https://your-project.railway.app/api > .env.local
```

### Step 4: Vercel Frontend (10 min)

1. ไป https://vercel.com
2. Sign up / Login with GitHub
3. "New Project"
4. Select dormitory-system repo
5. Select "frontend" folder
6. Environment: VITE_API_URL
7. Deploy!

### Step 5: Test (5 min)

```
1. Open: https://your-frontend.vercel.app
2. Try: Login
3. Open DevTools: F12 → Responsive
4. Test on mobile
5. ✅ Done!
```

---

## 📚 Full Documentation

- **Setup Guide:** [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
- **Mobile Design:** [MOBILE_RESPONSIVE_GUIDE.md](MOBILE_RESPONSIVE_GUIDE.md)
- **Deployment:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Git Setup:** [GIT_DEPLOYMENT_SETUP.md](GIT_DEPLOYMENT_SETUP.md)

---

## ✨ Key Points

✅ **Works on mobile** - Bootstrap responsive  
✅ **Free tier** - Railway + Vercel  
✅ **HTTPS** - Both platforms auto HTTPS  
✅ **Database** - MySQL on Railway  
✅ **Auto deploy** - GitHub push → auto deploy  

---

## 🎯 Next: Manual Deploy ไป Railway

**Step-by-step guide:**

### 1. Import Database
```bash
# หลัง Railway create MySQL
# ใช้ Tools ใดๆ import database-schema.sql
```

### 2. Backend Environment Variables (Railway)
```
NODE_ENV=production
JWT_SECRET=your-super-secret-key-min-32-chars
CORS_ORIGIN=https://your-vercel-domain.vercel.app
DB_HOST=mysql.railway.internal  # Railway auto
DB_PORT=3306
DB_USER=root
DB_PASSWORD=****  # Railway auto
DB_NAME=railway  # Railway auto
```

### 3. Frontend Environment Variables (Vercel)
```
VITE_API_URL=https://your-project.railway.app/api
```

### 4. Deploy & Test
- Railway: auto-deploy from GitHub
- Vercel: auto-deploy from GitHub
- Test: Open frontend → login → check data

---

## ❓ Need Help?

- Check: [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
- Railway: https://railway.app/docs
- Vercel: https://vercel.com/docs

---

**Status: Ready to deploy! ✅**

