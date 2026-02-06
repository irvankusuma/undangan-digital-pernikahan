# 📁 Struktur Folder Proyek

```
wedding-invitation-system/
│
├── 📂 prisma/
│   ├── schema.prisma           # Database schema (sudah dibuat)
│   ├── seed.ts                 # Data seed untuk development
│   └── migrations/             # Database migrations (auto-generated)
│
├── 📂 public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── 📂 src/
│   │
│   ├── 📂 app/                 # Next.js 14 App Router
│   │   ├── (auth)/            # Route group untuk auth pages
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (public)/          # Route group untuk public pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   └── [slug]/        # Dynamic route untuk undangan
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/       # Route group untuk admin dashboard
│   │   │   ├── layout.tsx     # Dashboard layout dengan sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx   # Overview/statistics
│   │   │   ├── invitations/
│   │   │   │   ├── page.tsx   # List undangan
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx      # Detail undangan
│   │   │   │       ├── edit/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── guests/
│   │   │   │       │   └── page.tsx
│   │   │   │       ├── music/
│   │   │   │       │   └── page.tsx
│   │   │   │       └── payment/
│   │   │   │           └── page.tsx
│   │   │   ├── guests/
│   │   │   │   └── page.tsx
│   │   │   ├── templates/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── register/
│   │   │   │       └── route.ts
│   │   │   ├── invitations/
│   │   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts      # GET, PUT, DELETE
│   │   │   │       ├── publish/
│   │   │   │       │   └── route.ts
│   │   │   │       └── stats/
│   │   │   │           └── route.ts
│   │   │   ├── guests/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── rsvp/
│   │   │   │           └── route.ts
│   │   │   ├── viewers/
│   │   │   │   └── track/
│   │   │   │       └── route.ts
│   │   │   ├── payment-methods/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── music/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── templates/
│   │   │   │   ├── route.ts
│   │   │   │   └── generate/
│   │   │   │       └── route.ts
│   │   │   └── upload/
│   │   │       └── route.ts         # Image upload ke Cloudinary
│   │   │
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   │
│   ├── 📂 components/          # React Components
│   │   ├── ui/                # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   └── ViewerChart.tsx
│   │   │
│   │   ├── invitation/
│   │   │   ├── InvitationCard.tsx
│   │   │   ├── InvitationForm.tsx
│   │   │   ├── InvitationPreview.tsx
│   │   │   ├── ThemeSelector.tsx
│   │   │   └── GalleryUploader.tsx
│   │   │
│   │   ├── invitation-view/    # Components untuk halaman undangan publik
│   │   │   ├── InvitationHero.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── LocationMap.tsx
│   │   │   ├── RsvpForm.tsx
│   │   │   ├── GiftSection.tsx
│   │   │   ├── MusicPlayer.tsx
│   │   │   └── ShareButtons.tsx
│   │   │
│   │   ├── guest/
│   │   │   ├── GuestList.tsx
│   │   │   ├── GuestForm.tsx
│   │   │   └── RsvpStatus.tsx
│   │   │
│   │   ├── payment/
│   │   │   ├── PaymentMethodList.tsx
│   │   │   ├── PaymentMethodForm.tsx
│   │   │   ├── BankTransferCard.tsx
│   │   │   └── EWalletCard.tsx
│   │   │
│   │   ├── music/
│   │   │   ├── MusicTrackList.tsx
│   │   │   ├── MusicTrackForm.tsx
│   │   │   ├── YouTubePlayer.tsx
│   │   │   └── YouTubeEmbed.tsx
│   │   │
│   │   ├── template/
│   │   │   ├── TemplateList.tsx
│   │   │   ├── TemplateForm.tsx
│   │   │   ├── TemplatePreview.tsx
│   │   │   └── CaptionGenerator.tsx
│   │   │
│   │   └── common/
│   │       ├── Loading.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── Modal.tsx
│   │       └── Navbar.tsx
│   │
│   ├── 📂 lib/                 # Utilities & Configurations
│   │   ├── prisma.ts          # Prisma client instance
│   │   ├── auth.ts            # Auth utilities (JWT, session)
│   │   ├── cloudinary.ts      # Cloudinary configuration
│   │   ├── youtube.ts         # YouTube API utilities
│   │   ├── utils.ts           # Common utilities
│   │   ├── constants.ts       # App constants
│   │   └── validators.ts      # Zod schemas untuk validation
│   │
│   ├── 📂 services/            # Business Logic Layer
│   │   ├── auth.service.ts
│   │   ├── invitation.service.ts
│   │   ├── guest.service.ts
│   │   ├── viewer.service.ts
│   │   ├── payment.service.ts
│   │   ├── music.service.ts
│   │   └── template.service.ts
│   │
│   ├── 📂 types/               # TypeScript Types & Interfaces
│   │   ├── index.ts
│   │   ├── invitation.types.ts
│   │   ├── guest.types.ts
│   │   ├── payment.types.ts
│   │   └── api.types.ts
│   │
│   ├── 📂 hooks/               # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useInvitation.ts
│   │   ├── useGuest.ts
│   │   ├── useViewer.ts
│   │   ├── useMusic.ts
│   │   └── useMediaQuery.ts
│   │
│   └── 📂 middleware/          # Middleware functions
│       ├── auth.middleware.ts
│       └── rate-limit.middleware.ts
│
├── 📄 .env                     # Environment variables
├── 📄 .env.example             # Example environment variables
├── 📄 .gitignore
├── 📄 next.config.js           # Next.js configuration
├── 📄 tailwind.config.ts       # Tailwind CSS configuration
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 package.json
├── 📄 README.md
└── 📄 DEPLOYMENT.md            # Deployment guide

```

## 📝 Penjelasan Struktur

### 1. **App Router (Next.js 14)**
- Menggunakan route groups: `(auth)`, `(public)`, `(dashboard)`
- Dynamic routes untuk undangan: `[slug]`
- API routes terpisah dengan struktur RESTful

### 2. **Components**
- **ui/**: Komponen UI dasar (Shadcn UI)
- **dashboard/**: Komponen khusus dashboard admin
- **invitation-view/**: Komponen untuk tampilan undangan publik
- **common/**: Komponen reusable

### 3. **Services Layer**
- Memisahkan business logic dari API routes
- Setiap service menangani satu domain entity
- Mudah untuk testing dan maintenance

### 4. **Hooks**
- Custom hooks untuk state management
- Reusable logic untuk fetch data
- Type-safe dengan TypeScript

### 5. **Types**
- Centralized type definitions
- Type safety di seluruh aplikasi
- Auto-complete di IDE

## 🎯 Keuntungan Struktur Ini

✅ **Separation of Concerns**: Setiap layer punya tanggung jawab jelas  
✅ **Scalable**: Mudah menambah fitur baru  
✅ **Type-Safe**: Full TypeScript coverage  
✅ **Maintainable**: Clean code & easy to navigate  
✅ **Testable**: Services terpisah, mudah di-test  
✅ **Performance**: Next.js 14 App Router dengan RSC
