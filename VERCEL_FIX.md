# 🚀 Panduan Deployment ke Vercel - Wedding Invitation System

## ⚡ Quick Fix untuk Error Build

Error yang Anda alami: **"doesn't have a root layout"** sudah diperbaiki dengan menambahkan:

1. ✅ `src/app/layout.tsx` - Root layout (REQUIRED)
2. ✅ `src/app/globals.css` - Global styles
3. ✅ `src/app/page.tsx` - Landing page
4. ✅ `next.config.js` - Next.js configuration
5. ✅ `tsconfig.json` - TypeScript configuration
6. ✅ `tailwind.config.ts` - Tailwind configuration
7. ✅ `postcss.config.js` - PostCSS configuration

---

## 📋 Checklist Sebelum Deploy

### 1. File Wajib Ada

```
✅ src/app/layout.tsx          (Root layout - PENTING!)
✅ src/app/page.tsx             (Home page)
✅ src/app/globals.css          (Global CSS)
✅ next.config.js               (Next.js config)
✅ tsconfig.json                (TypeScript config)
✅ tailwind.config.ts           (Tailwind config)
✅ postcss.config.js            (PostCSS config)
✅ package.json                 (Dependencies)
✅ prisma/schema.prisma         (Database schema)
✅ .gitignore                   (Git ignore)
```

### 2. Database Setup

**PENTING**: Sebelum deploy, Anda HARUS punya PostgreSQL database URL!

**Pilihan Database (Pilih salah satu):**

#### A. Neon (Recommended - Free Forever)
```
1. Visit: https://neon.tech
2. Sign up dengan GitHub
3. Create new project: "wedding-invitation"
4. Copy connection string
```

#### B. Supabase (Juga Free)
```
1. Visit: https://supabase.com
2. New project
3. Database → Connection string → URI
```

#### C. Railway (Free trial)
```
1. Visit: https://railway.app
2. New project → Provision PostgreSQL
3. Copy DATABASE_URL
```

---

## 🔧 Langkah-Langkah Deploy ke Vercel

### Step 1: Prepare Repository

```bash
# Extract ZIP file
unzip wedding-invitation-system-fixed.zip
cd wedding-invitation-system

# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit - Wedding Invitation System"

# Push ke GitHub
git remote add origin https://github.com/YOUR_USERNAME/wedding-invitation.git
git branch -M main
git push -u origin main
```

### Step 2: Setup Neon Database

1. **Buat akun Neon**: https://neon.tech
2. **New Project**:
   - Name: `wedding-invitation`
   - Region: Pilih terdekat (Singapore untuk Indonesia)
   - PostgreSQL: 15 atau 16
3. **Copy Connection String**:
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Import ke Vercel

1. **Login Vercel**: https://vercel.com
2. **New Project**
3. **Import Git Repository**:
   - Select: Repository Anda
   - Framework Preset: **Next.js** (auto-detect)
   - Root Directory: `./`

### Step 4: Configure Environment Variables

Di Vercel Project Settings → Environment Variables, tambahkan:

```bash
# Database (REQUIRED - pakai dari Neon)
DATABASE_URL="postgresql://user:password@ep-xxx.aws.neon.tech/neondb?sslmode=require"

# Application (REQUIRED)
NEXT_PUBLIC_APP_URL="https://your-project.vercel.app"

# JWT Secret (REQUIRED - Generate baru!)
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-change-this"

# Cloudinary (OPTIONAL - untuk upload gambar)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google Maps (OPTIONAL)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"

# YouTube API (OPTIONAL)
YOUTUBE_API_KEY="your-youtube-api-key"
```

**CARA GENERATE JWT_SECRET:**
```bash
# Di terminal
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Atau online
# https://generate-random.org/api-key-generator
```

### Step 5: Deploy

1. Click **Deploy**
2. Wait 2-5 minutes
3. Vercel akan:
   - Install dependencies (`npm install`)
   - Run Prisma generate
   - Build Next.js
   - Deploy to production

### Step 6: Run Database Migration

Setelah deploy sukses:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production.local

# Run migration
npx prisma migrate deploy
```

**ATAU via Vercel Dashboard:**

1. Project Settings → Functions
2. Tambahkan Build Command:
   ```bash
   prisma migrate deploy && prisma generate && next build
   ```

---

## ✅ Verifikasi Deployment

### 1. Check Build Logs

Pastikan tidak ada error di build logs:

```
✓ Generating static pages
✓ Collecting page data
✓ Finalizing page optimization
```

### 2. Test Aplikasi

```
✅ https://your-project.vercel.app - Landing page
✅ https://your-project.vercel.app/login - Login page
✅ https://your-project.vercel.app/register - Register page
✅ https://your-project.vercel.app/api/invitations - API endpoint
```

### 3. Check Database Connection

Di Vercel Function Logs, cek:
- ✅ Prisma connected successfully
- ❌ Connection errors → Cek DATABASE_URL

---

## 🐛 Troubleshooting Common Errors

### Error 1: "doesn't have a root layout"
```
✅ FIXED - src/app/layout.tsx sudah ada di ZIP
```

### Error 2: "Cannot find module '@/...' "
```bash
# Fix: Pastikan tsconfig.json paths sudah benar
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Error 3: "Prisma Client not found"
```bash
# Fix: Tambahkan di package.json build script
"scripts": {
  "build": "prisma generate && next build"
}
```

### Error 4: "Database connection failed"
```bash
# Fix: 
# 1. Pastikan DATABASE_URL benar
# 2. Cek ?sslmode=require di akhir URL
# 3. Test koneksi manual: npx prisma db push
```

### Error 5: "Module parse failed: Unexpected token"
```bash
# Fix: Pastikan next.config.js ada dan valid
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};
```

---

## 🎯 Post-Deployment

### 1. Setup Custom Domain (Optional)

```
1. Vercel Dashboard → Domains
2. Add domain: yourdomain.com
3. Configure DNS:
   - Type: CNAME
   - Name: @ atau www
   - Value: cname.vercel-dns.com
4. Update NEXT_PUBLIC_APP_URL
```

### 2. Seed Default Data

```bash
# Create admin user via API
curl -X POST https://your-project.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "YourStrongPassword123!",
    "name": "Admin"
  }'
```

### 3. Test All Features

- ✅ Create invitation
- ✅ Upload images (jika setup Cloudinary)
- ✅ Add guests
- ✅ Generate caption
- ✅ View public invitation

---

## 📊 Monitoring

### Vercel Analytics

```
1. Project Settings → Analytics
2. Enable Web Analytics
3. Monitor:
   - Page views
   - Response times
   - Errors
```

### Logs

```
# Real-time logs
vercel logs --follow

# Function logs
Vercel Dashboard → Functions → Logs
```

---

## 🔄 Update & Redeploy

```bash
# Make changes locally
git add .
git commit -m "Update: your changes"
git push

# Vercel auto-deploys on git push!
```

---

## 💡 Tips Optimasi

### 1. Enable ISR (Incremental Static Regeneration)

```typescript
// app/[slug]/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds
```

### 2. Optimize Images

```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp', 'image/avif'],
  },
};
```

### 3. Enable Compression

```typescript
// next.config.js
module.exports = {
  compress: true,
};
```

---

## 📞 Need Help?

Jika masih error:

1. **Check Build Logs**: Baca error message dengan teliti
2. **Verify Environment Variables**: Pastikan semua variable terisi
3. **Test Locally**: `npm run build` → harus sukses
4. **Database Connection**: Test dengan `npx prisma db push`

---

## 🎉 Success Checklist

```
✅ ZIP file extracted
✅ Git repository created
✅ Pushed to GitHub
✅ Neon database created
✅ Vercel project created
✅ Environment variables set
✅ Deployment successful
✅ Database migrated
✅ Application accessible
✅ All features working
```

---

**Deployment seharusnya sukses sekarang! 🚀**

Jika masih ada error, share build logs-nya dan saya akan bantu fix.
