# 🚀 Vercel Deployment Instructions

## Quick Deploy ke Vercel

### 1. Prerequisites

Pastikan Anda sudah punya:
- ✅ Akun GitHub
- ✅ Akun Vercel (sign up dengan GitHub di vercel.com)
- ✅ Database PostgreSQL (Neon/Supabase - free tier)

### 2. Setup Database

**Option A: Neon (Recommended)**
1. Buat akun di https://neon.tech
2. Create new project
3. Copy connection string (format: `postgresql://user:pass@host/db`)

**Option B: Supabase**
1. Buat akun di https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String → URI

### 3. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

### 4. Import ke Vercel

1. Login ke https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 5. Set Environment Variables

Tambahkan environment variables berikut di Vercel:

**Required:**
```bash
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
```

**Optional (recommended):**
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

**Generate JWT Secret:**
```bash
# Run this locally to generate:
openssl rand -base64 32
```

### 6. Deploy

Click **Deploy** button di Vercel. Build akan memakan waktu 2-5 menit.

### 7. Run Database Migration

Setelah deploy berhasil, jalankan migration:

**Option A: Via Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.production.local
npx prisma migrate deploy
```

**Option B: Via Custom Script**
Buat file `scripts/migrate.js`:
```javascript
const { exec } = require('child_process');
exec('npx prisma migrate deploy', (error, stdout, stderr) => {
  console.log(stdout);
  if (error) console.error(error);
});
```

Lalu run via Vercel Functions atau locally dengan production env.

### 8. Seed Default Data (Optional)

```bash
# Create seed script di prisma/seed.ts
npx prisma db seed
```

### 9. Test Deployment

1. Visit `https://your-project.vercel.app`
2. Coba register user baru
3. Test create invitation
4. Test public invitation view

## Troubleshooting

### Build Error: "Prisma Client not generated"

**Solution:**
Pastikan `prisma generate` ada di build script:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Database Connection Error

**Solution:**
- Pastikan `DATABASE_URL` sudah di-set di Environment Variables
- Format harus: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require`
- Untuk Neon/Supabase, pastikan SSL enabled

### "Module not found" Errors

**Solution:**
```bash
# Clear cache dan reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Working

**Solution:**
- Restart deployment setelah menambah env vars
- Pastikan tidak ada typo di nama variable
- Untuk public vars, harus prefix `NEXT_PUBLIC_`

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   ```
4. Update `NEXT_PUBLIC_APP_URL` env var

## Performance Tips

1. **Enable Caching:**
   - Static files auto-cached by Vercel
   - Use ISR for dynamic pages

2. **Optimize Images:**
   - Use Next.js Image component
   - Configure Cloudinary for auto-optimization

3. **Database Connection:**
   - Use connection pooling (Prisma default)
   - Consider Prisma Accelerate for better performance

## Monitoring

Vercel provides built-in:
- ✅ Analytics
- ✅ Error tracking
- ✅ Performance metrics
- ✅ Deployment logs

Access via Project → Analytics

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

## Cost Estimation

**Free Tier (Hobby):**
- Unlimited deployments
- 100 GB bandwidth/month
- Serverless functions
- Good for: Development, small projects

**Pro Tier ($20/month):**
- Unlimited bandwidth
- Better performance
- Team collaboration
- Good for: Production, multiple projects

---

**Happy Deploying! 🎉**
