# 💍 Wedding Invitation System - Full Stack

> Sistem undangan digital berbasis web yang modern, scalable, dan siap deploy. Dibangun dengan Next.js 14, TypeScript, Prisma, dan PostgreSQL.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)

---

## ✨ Fitur Utama

### 🎨 Undangan Digital
- ✅ **Link unik** untuk setiap undangan
- ✅ **Responsive design** - optimal di semua device
- ✅ **Custom theme** dengan color picker
- ✅ **Gallery foto** dengan lightbox
- ✅ **Google Maps** embed untuk lokasi
- ✅ **Countdown timer** ke hari H
- ✅ **Share buttons** (WhatsApp, Instagram, Facebook)

### 🎵 Musik Otomatis
- ✅ **YouTube embed** untuk hemat storage
- ✅ **Autoplay** saat undangan dibuka
- ✅ **Multiple tracks** dengan playlist
- ✅ **Audio-only** mode (video tersembunyi)
- ✅ **Volume control** dan mute
- ✅ **Loop playback**

### 📊 Viewer Tracking
- ✅ **Real-time visitor count**
- ✅ **Device detection** (mobile, tablet, desktop)
- ✅ **Browser & OS tracking**
- ✅ **Analytics dashboard** dengan charts
- ✅ **Unique visitor count**
- ✅ **Views by day/time**

### 💰 Amplop Digital
- ✅ **Bank transfer** dengan nomor rekening
- ✅ **E-wallet** (OVO, GoPay, DANA, ShopeePay)
- ✅ **Copy to clipboard** button
- ✅ **QR Code upload**
- ✅ **Multiple metode** pembayaran
- ✅ **Aktif/nonaktif** toggle

### 👥 Guest Management
- ✅ **CRUD guests** dengan kategori
- ✅ **RSVP system** (Hadir/Tidak Hadir/Maybe)
- ✅ **Guest count** untuk jumlah tamu
- ✅ **Guest messages** dan ucapan
- ✅ **Status tracking**

### 📝 Caption Template
- ✅ **Auto-generate** caption untuk WhatsApp, Instagram, SMS, Email
- ✅ **Dynamic placeholders** ({guest_name}, {event_date}, dll)
- ✅ **Custom templates**
- ✅ **Bulk generation** untuk semua tamu
- ✅ **CSV export**

### 🎛️ Admin Dashboard
- ✅ **Modern UI** dengan Shadcn UI
- ✅ **Statistics overview**
- ✅ **CRUD undangan**
- ✅ **Manage guests**
- ✅ **Manage payment methods**
- ✅ **Manage music tracks**
- ✅ **Caption generator**
- ✅ **Analytics charts**

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js 18+
- **API**: Next.js API Routes
- **Authentication**: JWT (jose)
- **Validation**: Zod
- **Password**: bcryptjs

### Database
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Hosting**: Neon / Supabase / Railway

### External Services
- **Images**: Cloudinary
- **Maps**: Google Maps API
- **Music**: YouTube IFrame API

---

## 📁 Struktur Proyek

```
wedding-invitation-system/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Seed data
├── public/                    # Static files
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth pages
│   │   ├── (public)/         # Public pages
│   │   ├── (dashboard)/      # Admin dashboard
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn UI components
│   │   ├── dashboard/       # Dashboard components
│   │   └── invitation-view/ # Public view components
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts        # Prisma client
│   │   ├── auth.ts          # Auth utilities
│   │   ├── validators.ts    # Zod schemas
│   │   └── youtube.ts       # YouTube utilities
│   ├── services/             # Business logic
│   │   ├── invitation.service.ts
│   │   ├── guest.service.ts
│   │   ├── viewer.service.ts
│   │   └── template.service.ts
│   ├── types/                # TypeScript types
│   └── hooks/                # Custom React hooks
├── .env.example              # Environment variables example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- PostgreSQL database (atau pakai cloud: Neon, Supabase)
- Cloudinary account (untuk upload images)
- Google Maps API key

### Installation

1. **Clone repository**
   ```bash
   git clone https://github.com/yourusername/wedding-invitation-system.git
   cd wedding-invitation-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   nano .env  # Edit dengan values Anda
   ```

4. **Setup database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed default templates
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts (admin)
- **invitations** - Undangan digital
- **guests** - Daftar tamu undangan
- **viewers** - Tracking pengunjung
- **payment_methods** - Metode pembayaran (bank/e-wallet)
- **music_tracks** - Lagu YouTube
- **caption_templates** - Template caption

### Entity Relationship

```
users (1) ──< (many) invitations
invitations (1) ──< (many) guests
invitations (1) ──< (many) viewers
invitations (1) ──< (many) payment_methods
invitations (1) ──< (many) music_tracks
```

Full schema ada di `/prisma/schema.prisma`

---

## 📡 API Documentation

### Authentication

```typescript
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Invitations

```typescript
GET    /api/invitations          // List all invitations
POST   /api/invitations          // Create invitation
GET    /api/invitations/:id      // Get single invitation
PUT    /api/invitations/:id      // Update invitation
DELETE /api/invitations/:id      // Delete invitation
POST   /api/invitations/:id/publish  // Publish/unpublish
```

### Guests

```typescript
GET    /api/guests               // List guests
POST   /api/guests               // Create guest
PUT    /api/guests/:id           // Update guest
DELETE /api/guests/:id           // Delete guest
POST   /api/guests/:id/rsvp      // Submit RSVP
```

### Payment Methods

```typescript
GET    /api/payment-methods      // List payment methods
POST   /api/payment-methods      // Create payment method
PUT    /api/payment-methods/:id  // Update payment method
DELETE /api/payment-methods/:id  // Delete payment method
```

### Music Tracks

```typescript
GET    /api/music                // List music tracks
POST   /api/music                // Add music track
PUT    /api/music/:id            // Update music track
DELETE /api/music/:id            // Delete music track
```

### Templates

```typescript
GET    /api/templates            // List templates
POST   /api/templates/generate   // Generate caption
```

---

## 🎨 Customization

### Theme Colors

Edit di admin dashboard atau langsung di database:

```typescript
{
  primaryColor: "#8b5cf6",    // Purple
  secondaryColor: "#ec4899"   // Pink
}
```

### Default Templates

Template default ada di `services/template.service.ts`. Bisa customize sesuai kebutuhan.

### Components

Semua komponen UI menggunakan Shadcn UI. Bisa customize di `components/ui/`.

---

## 🔒 Security

- ✅ **JWT Authentication** dengan HttpOnly cookies
- ✅ **Password hashing** dengan bcryptjs (12 rounds)
- ✅ **Input validation** dengan Zod
- ✅ **SQL injection protection** (Prisma)
- ✅ **XSS protection** (React escaping)
- ✅ **CORS configuration**
- ✅ **Rate limiting** (optional)

---

## 📊 Analytics & Tracking

### Viewer Tracking Features

- Total views & unique visitors
- Device breakdown (mobile/tablet/desktop)
- Browser & OS detection
- Views by day/hour
- Geographic data (optional)
- Real-time visitor count

### Dashboard Charts

- Line chart: Views over time
- Pie chart: Device distribution
- Bar chart: RSVP status
- Stats cards: Key metrics

---

## 🌐 Deployment

Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap.

### Quick Deploy ke Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables (Production)

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
JWT_SECRET="your-strong-secret-key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="..."
```

---

## 📝 Usage Examples

### 1. Buat Undangan Baru

```typescript
const invitation = await fetch('/api/invitations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eventName: "Pernikahan Kami",
    groomName: "Budi",
    brideName: "Ani",
    eventDate: "2024-12-25",
    eventTime: "14:00 WIB",
    venueName: "Grand Ballroom Hotel XYZ",
    venueAddress: "Jl. Raya No. 123, Jakarta",
  })
});
```

### 2. Generate Caption untuk Tamu

```typescript
const caption = await generateCaptionByPlatform('WHATSAPP', {
  guestName: "Pak Budi",
  eventName: "Pernikahan Kami",
  groomName: "Andi",
  brideName: "Siti",
  eventDate: "Sabtu, 25 Desember 2024",
  eventTime: "14:00 WIB",
  venueName: "Grand Ballroom",
  venueAddress: "Jl. Raya No. 123",
  invitationLink: "https://yourdomain.com/andi-siti"
});
```

### 3. Track Viewer

```typescript
await fetch('/api/viewers/track', {
  method: 'POST',
  body: JSON.stringify({
    invitationId: "...",
    userAgent: navigator.userAgent,
    referrer: document.referrer
  })
});
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Prisma](https://prisma.io) - Database ORM
- [Shadcn UI](https://ui.shadcn.com) - UI components
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Cloudinary](https://cloudinary.com) - Image hosting
- [Vercel](https://vercel.com) - Hosting platform

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:

- 📧 Email: your-email@example.com
- 💬 Discord: [Join our server](#)
- 📝 Issues: [GitHub Issues](https://github.com/yourusername/wedding-invitation-system/issues)

---

## 🗺️ Roadmap

- [ ] Multi-language support (EN, ID)
- [ ] Email invitation sending
- [ ] SMS gateway integration
- [ ] Advanced analytics (Google Analytics)
- [ ] PDF invitation generator
- [ ] WhatsApp Business API integration
- [ ] Live streaming integration
- [ ] Guest check-in QR code
- [ ] Mobile app (React Native)

---

**Made with ❤️ for wedding couples around the world**
