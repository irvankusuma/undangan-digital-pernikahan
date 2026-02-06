# 🚀 Deployment Guide - Wedding Invitation System

Panduan lengkap untuk deploy aplikasi undangan digital ke production.

---

## 📋 Daftar Isi

1. [Prerequisites](#prerequisites)
2. [Setup Database](#setup-database)
3. [Environment Variables](#environment-variables)
4. [Deploy ke Vercel](#deploy-ke-vercel)
5. [Deploy ke VPS](#deploy-ke-vps)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Prerequisites

### Tools yang Dibutuhkan

- **Node.js** >= 18.x
- **npm** atau **yarn** atau **pnpm**
- **Git**
- **PostgreSQL** database
- Akun **Vercel** (untuk Vercel deployment) atau VPS (untuk manual deployment)

### External Services

1. **PostgreSQL Database**
   - [Neon](https://neon.tech) - Free tier tersedia
   - [Supabase](https://supabase.com) - Free tier tersedia
   - [Railway](https://railway.app) - Free trial tersedia

2. **Cloudinary** (untuk image upload)
   - Sign up: https://cloudinary.com
   - Free tier: 25 credits/month

3. **Google Maps API** (untuk location embed)
   - Console: https://console.cloud.google.com/google/maps-apis
   - Enable: Maps JavaScript API, Maps Embed API

---

## 2️⃣ Setup Database

### Option A: Neon (Recommended)

1. **Buat Akun**
   ```bash
   # Visit https://neon.tech
   # Sign up dengan GitHub
   ```

2. **Create Project**
   - Project name: `wedding-invitation`
   - Region: Pilih yang terdekat
   - PostgreSQL version: 15

3. **Get Connection String**
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Option B: Supabase

1. **Buat Project**
   ```bash
   # Visit https://supabase.com
   # New project → wedding-invitation
   ```

2. **Get Database URL**
   ```
   Settings → Database → Connection string → URI
   ```

### Initialize Database

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env dan masukkan DATABASE_URL
nano .env

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed default data
npx prisma db seed
```

---

## 3️⃣ Environment Variables

### Production Environment Variables

Buat file `.env.production` atau set di hosting platform:

```bash
# Database
DATABASE_URL="postgresql://..."

# Application
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# JWT Secret (GENERATE STRONG KEY!)
JWT_SECRET="$(openssl rand -base64 32)"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"

# (Optional) Email
RESEND_API_KEY="your-resend-key"
EMAIL_FROM="noreply@yourdomain.com"
```

### Generate JWT Secret

```bash
# Di terminal
openssl rand -base64 32
```

---

## 4️⃣ Deploy ke Vercel

### Step 1: Prepare Repository

```bash
# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub
git remote add origin https://github.com/username/wedding-invitation.git
git push -u origin main
```

### Step 2: Import to Vercel

1. **Login ke Vercel**
   ```bash
   # Visit https://vercel.com
   # Sign up dengan GitHub
   ```

2. **New Project**
   - Import Git Repository
   - Pilih repository `wedding-invitation`
   - Framework Preset: **Next.js**

3. **Configure Project**
   ```
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables**
   - Klik "Environment Variables"
   - Add semua variable dari `.env.production`
   - Paste value satu per satu

5. **Deploy**
   - Click "Deploy"
   - Wait ~2-5 minutes

### Step 3: Setup Database

```bash
# Setelah deploy berhasil, run migrations
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration di production
vercel env pull .env.production.local
npx prisma migrate deploy
```

### Step 4: Setup Custom Domain (Optional)

1. **Add Domain**
   - Project Settings → Domains
   - Add domain: `yourdomain.com`

2. **Configure DNS**
   ```
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   ```

3. **Update Environment**
   ```bash
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   ```

---

## 5️⃣ Deploy ke VPS

### Step 1: Setup VPS

```bash
# SSH ke VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install PostgreSQL (optional, jika tidak pakai cloud DB)
apt install -y postgresql postgresql-contrib
```

### Step 2: Clone & Install

```bash
# Clone repository
cd /var/www
git clone https://github.com/username/wedding-invitation.git
cd wedding-invitation

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
nano .env  # Edit dengan production values

# Build application
npm run build

# Run Prisma migrations
npx prisma migrate deploy
```

### Step 3: Setup PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'wedding-invitation',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/wedding-invitation',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Run command yang muncul (sudo env PATH=...)
```

### Step 4: Configure Nginx

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/wedding-invitation << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/wedding-invitation /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 5: Setup SSL (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (cron job sudah disetup otomatis)
certbot renew --dry-run
```

---

## 6️⃣ Post-Deployment

### 1. Seed Default Templates

```bash
# Create seed script
npx tsx prisma/seed.ts
```

### 2. Create Admin User

```bash
# Via Prisma Studio
npx prisma studio

# Atau via API
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "your-strong-password",
    "name": "Admin"
  }'

# Update role ke ADMIN di database
```

### 3. Test All Features

- ✅ Register/Login
- ✅ Create invitation
- ✅ Upload images
- ✅ Add music tracks
- ✅ Add payment methods
- ✅ Generate captions
- ✅ View public invitation
- ✅ RSVP functionality
- ✅ Viewer tracking

### 4. Performance Optimization

```bash
# Enable Gzip compression (Nginx)
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Enable browser caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 5. Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs wedding-invitation

# System monitoring
htop
```

---

## 7️⃣ Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db push

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset
```

### PM2 Issues

```bash
# Restart application
pm2 restart wedding-invitation

# View logs
pm2 logs wedding-invitation --lines 100

# Delete and recreate
pm2 delete wedding-invitation
pm2 start ecosystem.config.js
```

### Nginx Issues

```bash
# Test config
nginx -t

# View error logs
tail -f /var/log/nginx/error.log

# Restart
systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Renew certificate
certbot renew --force-renewal

# Check certificate
certbot certificates
```

---

## 🎯 Deployment Checklist

- [ ] Database setup & migrated
- [ ] Environment variables configured
- [ ] Application built successfully
- [ ] Default templates seeded
- [ ] Admin user created
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] All features tested
- [ ] Performance optimized
- [ ] Monitoring enabled
- [ ] Backups configured

---

## 📊 Recommended Infrastructure

### Small Scale (< 1000 users)

- **Hosting**: Vercel Free
- **Database**: Neon Free Tier
- **Storage**: Cloudinary Free Tier
- **Cost**: $0/month

### Medium Scale (1000-10000 users)

- **Hosting**: Vercel Pro ($20/month)
- **Database**: Neon Pro ($69/month)
- **Storage**: Cloudinary Plus ($99/month)
- **Cost**: ~$188/month

### Large Scale (10000+ users)

- **Hosting**: VPS (DigitalOcean, $40-100/month)
- **Database**: Managed PostgreSQL ($50-200/month)
- **Storage**: Cloudinary Advanced ($249+/month)
- **CDN**: Cloudflare Pro ($20/month)
- **Cost**: ~$359-569/month

---

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to git
   - Use strong JWT secret (min 32 characters)
   - Rotate secrets regularly

2. **Database**
   - Enable SSL connection
   - Use connection pooling
   - Regular backups
   - Limit user permissions

3. **Application**
   - Rate limiting enabled
   - Input validation (Zod)
   - XSS protection
   - CSRF protection
   - Helmet.js headers

4. **Infrastructure**
   - Firewall enabled
   - Fail2ban for SSH
   - Regular security updates
   - DDoS protection (Cloudflare)

---

## 📞 Support

Jika ada masalah saat deployment:

1. Check logs terlebih dahulu
2. Verify environment variables
3. Test database connection
4. Review error messages
5. Search documentation

---

**Happy Deploying! 🎉**
