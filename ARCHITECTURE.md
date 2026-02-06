# 🏗️ Arsitektur Sistem - Wedding Invitation System

Dokumentasi lengkap arsitektur sistem undangan digital full-stack.

---

## 📋 Daftar Isi

1. [Overview Arsitektur](#overview-arsitektur)
2. [Layer Architecture](#layer-architecture)
3. [Data Flow](#data-flow)
4. [API Design](#api-design)
5. [Database Design](#database-design)
6. [Security Architecture](#security-architecture)
7. [Scalability Strategy](#scalability-strategy)

---

## 1️⃣ Overview Arsitektur

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Browser   │  │   Mobile    │  │   Tablet    │         │
│  │  (Desktop)  │  │   Device    │  │   Device    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                   Next.js 14 (App Router)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Public Pages │  │Auth Pages    │  │Admin Dashboard│     │
│  │ - [slug]     │  │ - Login      │  │ - Invitations│      │
│  │ - Landing    │  │ - Register   │  │ - Guests     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         React Server Components + Client Components         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (BFF)                         │
│               Next.js API Routes (RESTful)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │   Auth   │ │Invitation│ │  Guest   │ │ Viewer   │       │
│  │  Routes  │ │  Routes  │ │  Routes  │ │ Tracking │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ Payment  │ │  Music   │ │ Template │                    │
│  │  Routes  │ │  Routes  │ │  Routes  │                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
│              JWT Auth Middleware + Validation               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                       │
│                      Service Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Invitation   │  │   Guest      │  │   Viewer     │      │
│  │  Service     │  │  Service     │  │  Service     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Payment     │  │   Music      │  │  Template    │      │
│  │  Service     │  │  Service     │  │  Service     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           Business Rules + Validation + Logic               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                          │
│                    Prisma ORM Client                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Query Builder + Type-Safe Database Access         │     │
│  │  Connection Pooling + Transaction Management       │     │
│  └────────────────────────────────────────────────────┘     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                          │
│                PostgreSQL (Neon/Supabase)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  users   │ │invitation│ │  guests  │ │ viewers  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│  │ payment_ │ │  music_  │ │ caption_ │                    │
│  │ methods  │ │  tracks  │ │ templates│                    │
│  └──────────┘ └──────────┘ └──────────┘                    │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Cloudinary  │  │ Google Maps  │  │   YouTube    │      │
│  │    (CDN)     │  │     API      │  │  IFrame API  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ Layer Architecture

### 1. Presentation Layer (Frontend)

**Teknologi**: Next.js 14 App Router, React, TypeScript, Tailwind CSS

**Tanggung Jawab**:
- Render UI components
- Handle user interactions
- Client-side state management
- Route handling
- SEO optimization (metadata)

**Components**:
```
├── Server Components (RSC)
│   ├── Page layouts
│   ├── Data fetching components
│   └── Static content
│
└── Client Components ('use client')
    ├── Interactive forms
    ├── Music player
    ├── Modal dialogs
    └── Real-time updates
```

### 2. API Layer (Backend for Frontend)

**Teknologi**: Next.js API Routes, JWT, Zod

**Tanggung Jawab**:
- HTTP request handling
- Authentication & authorization
- Input validation
- Error handling
- Response formatting

**Pattern**: RESTful API
```
GET    /api/resource       → List all
POST   /api/resource       → Create new
GET    /api/resource/:id   → Get single
PUT    /api/resource/:id   → Update
DELETE /api/resource/:id   → Delete
```

### 3. Business Logic Layer

**Teknologi**: TypeScript Services

**Tanggung Jawab**:
- Core business rules
- Data transformation
- Complex calculations
- Third-party integrations
- Email/notification logic

**Separation of Concerns**:
```typescript
// ❌ BAD: Business logic di API route
export async function POST(request) {
  const data = await request.json();
  const slug = data.eventName.toLowerCase().replace(/\s+/g, '-');
  const invitation = await prisma.invitation.create({ data: { ...data, slug } });
  return Response.json(invitation);
}

// ✅ GOOD: Business logic di service
export async function POST(request) {
  const data = await request.json();
  const invitation = await invitationService.create(userId, data);
  return Response.json(invitation);
}

// services/invitation.service.ts
export async function create(userId, data) {
  const slug = await generateUniqueSlug(data.eventName);
  // Complex business logic here
  return prisma.invitation.create({ data: { ...data, slug, userId } });
}
```

### 4. Data Access Layer

**Teknologi**: Prisma ORM

**Tanggung Jawab**:
- Database queries
- Relationship loading
- Transaction management
- Connection pooling
- Type safety

**Benefits**:
- Type-safe database access
- Auto-generated types
- Migration management
- Query optimization

### 5. Database Layer

**Teknologi**: PostgreSQL

**Tanggung Jawab**:
- Data persistence
- ACID compliance
- Indexing
- Constraints enforcement
- Backup & recovery

---

## 3️⃣ Data Flow

### Create Invitation Flow

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│ Client  │────▶│ API Route│────▶│ Service │────▶│  Prisma  │────▶│ Database │
│ (Form)  │     │ /api/inv │     │ Layer   │     │   ORM    │     │   (PG)   │
└─────────┘     └──────────┘     └─────────┘     └──────────┘     └──────────┘
     │               │                 │                │                │
     │ 1. Submit     │                 │                │                │
     │ Form Data     │                 │                │                │
     │──────────────▶│                 │                │                │
     │               │                 │                │                │
     │               │ 2. Validate JWT │                │                │
     │               │ & Parse Body    │                │                │
     │               │─────────────────│                │                │
     │               │                 │                │                │
     │               │ 3. Validate with│                │                │
     │               │    Zod Schema   │                │                │
     │               │─────────────────│                │                │
     │               │                 │                │                │
     │               │ 4. Call Service │                │                │
     │               │─────────────────▶│                │                │
     │               │                 │                │                │
     │               │                 │ 5. Generate    │                │
     │               │                 │    Unique Slug │                │
     │               │                 │────────────────│                │
     │               │                 │                │                │
     │               │                 │ 6. Create DB   │                │
     │               │                 │    Query       │                │
     │               │                 │────────────────▶│                │
     │               │                 │                │                │
     │               │                 │                │ 7. INSERT      │
     │               │                 │                │────────────────▶│
     │               │                 │                │                │
     │               │                 │                │◀───────────────│
     │               │                 │                │ 8. Return Row  │
     │               │                 │◀───────────────│                │
     │               │                 │ 9. Return Data │                │
     │               │◀────────────────│                │                │
     │               │ 10. Return JSON │                │                │
     │◀──────────────│                 │                │                │
     │ 11. Update UI │                 │                │                │
```

### View Invitation Flow

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐
│ Browser │────▶│   Page   │────▶│ Service │────▶│  Prisma  │────▶│ Database │
│         │     │Component │     │ Layer   │     │   ORM    │     │   (PG)   │
└─────────┘     └──────────┘     └─────────┘     └──────────┘     └──────────┘
     │               │                 │                │                │
     │ 1. Visit URL  │                 │                │                │
     │ /andi-siti    │                 │                │                │
     │──────────────▶│                 │                │                │
     │               │                 │                │                │
     │               │ 2. Extract slug │                │                │
     │               │ from URL params │                │                │
     │               │─────────────────│                │                │
     │               │                 │                │                │
     │               │ 3. Fetch Data   │                │                │
     │               │ (Server-side)   │                │                │
     │               │─────────────────▶│                │                │
     │               │                 │                │                │
     │               │                 │ 4. Query DB    │                │
     │               │                 │ with Relations │                │
     │               │                 │────────────────▶│                │
     │               │                 │                │                │
     │               │                 │                │ 5. SELECT      │
     │               │                 │                │ with JOINs     │
     │               │                 │                │────────────────▶│
     │               │                 │                │                │
     │               │                 │                │◀───────────────│
     │               │                 │◀───────────────│ 6. Return Data │
     │               │◀────────────────│                │                │
     │               │ 7. Render HTML  │                │                │
     │◀──────────────│ (SSR)           │                │                │
     │               │                 │                │                │
     │               │                 │                │                │
┌────▼─────┐        │                 │                │                │
│ Client   │        │                 │                │                │
│Component │        │                 │                │                │
│ Hydrates │        │                 │                │                │
└──────────┘        │                 │                │                │
     │              │                 │                │                │
     │ 8. Track     │                 │                │                │
     │ Viewer       │                 │                │                │
     └─────────────▶│ POST /api/      │                │                │
                    │ viewers/track   │                │                │
```

---

## 4️⃣ API Design

### RESTful API Principles

1. **Resource-Based URLs**
   ```
   ✅ /api/invitations
   ✅ /api/guests
   ✅ /api/payment-methods
   
   ❌ /api/getInvitations
   ❌ /api/createGuest
   ```

2. **HTTP Methods**
   ```
   GET    - Retrieve (safe, idempotent)
   POST   - Create (not idempotent)
   PUT    - Update (idempotent)
   DELETE - Delete (idempotent)
   PATCH  - Partial update
   ```

3. **Status Codes**
   ```
   200 OK               - Success (GET, PUT, PATCH)
   201 Created          - Success (POST)
   204 No Content       - Success (DELETE)
   400 Bad Request      - Validation error
   401 Unauthorized     - Not authenticated
   403 Forbidden        - Not authorized
   404 Not Found        - Resource not found
   500 Internal Error   - Server error
   ```

4. **Response Format**
   ```typescript
   // Success Response
   {
     "success": true,
     "data": { ... },
     "message": "Operation successful"
   }
   
   // Error Response
   {
     "success": false,
     "error": "Error message",
     "details": [ ... ]  // Validation errors
   }
   ```

### API Authentication Flow

```
┌─────────┐                    ┌──────────┐
│ Client  │                    │  Server  │
└────┬────┘                    └────┬─────┘
     │                              │
     │ POST /api/auth/login         │
     │ { email, password }          │
     │─────────────────────────────▶│
     │                              │
     │                         ┌────▼────┐
     │                         │ Verify  │
     │                         │Password │
     │                         └────┬────┘
     │                              │
     │                         ┌────▼────┐
     │                         │Generate │
     │                         │  JWT    │
     │                         └────┬────┘
     │                              │
     │                         ┌────▼────┐
     │                         │   Set   │
     │                         │ Cookie  │
     │                         └────┬────┘
     │                              │
     │◀─────────────────────────────│
     │ Set-Cookie: auth-token=...   │
     │ { success: true, user }      │
     │                              │
     │                              │
     │ GET /api/invitations         │
     │ Cookie: auth-token=...       │
     │─────────────────────────────▶│
     │                              │
     │                         ┌────▼────┐
     │                         │ Verify  │
     │                         │  JWT    │
     │                         └────┬────┘
     │                              │
     │                         ┌────▼────┐
     │                         │ Fetch   │
     │                         │  Data   │
     │                         └────┬────┘
     │                              │
     │◀─────────────────────────────│
     │ { success: true, data: [...] }
     │                              │
```

---

## 5️⃣ Database Design

### Entity Relationship Diagram (ERD)

```
┌──────────────┐
│    users     │
├──────────────┤
│ id (PK)      │
│ email        │◀───────────┐
│ passwordHash │            │
│ name         │            │ userId (FK)
│ role         │            │
└──────────────┘            │
                            │
                   ┌────────┴────────┐
                   │   invitations   │
                   ├─────────────────┤
                   │ id (PK)         │◀──────────┐
                   │ slug (UNIQUE)   │           │
                   │ eventName       │           │
                   │ groomName       │           │ invitationId (FK)
                   │ brideName       │           │
                   │ eventDate       │           │
                   │ venueName       │      ┌────┴────────┐
                   │ coverImage      │      │   guests    │
                   │ isPublished     │      ├─────────────┤
                   │ userId (FK)     │      │ id (PK)     │
                   └─────────────────┘      │ name        │
                            │               │ phone       │
                            │               │ rsvpStatus  │
                            │               │ message     │
         ┌──────────────────┼───────────────┴─────────────┘
         │                  │
         │                  │
         │                  │
┌────────┴─────────┐  ┌─────▼─────────┐  ┌───────────────┐
│  payment_methods │  │    viewers    │  │ music_tracks  │
├──────────────────┤  ├───────────────┤  ├───────────────┤
│ id (PK)          │  │ id (PK)       │  │ id (PK)       │
│ type             │  │ userAgent     │  │ youtubeId     │
│ bankName         │  │ device        │  │ title         │
│ accountName      │  │ ipAddress     │  │ isDefault     │
│ accountNumber    │  │ viewedAt      │  │ autoplay      │
│ qrCodeImage      │  │ invitationId  │  │ loop          │
│ invitationId(FK) │  │   (FK)        │  │ invitationId  │
└──────────────────┘  └───────────────┘  │   (FK)        │
                                         └───────────────┘

         ┌──────────────────┐
         │ caption_templates│
         ├──────────────────┤
         │ id (PK)          │
         │ name             │
         │ platform         │
         │ content          │
         │ isDefault        │
         └──────────────────┘
```

### Indexes Strategy

```sql
-- Primary Keys (auto-indexed)
CREATE INDEX idx_invitations_slug ON invitations(slug);
CREATE INDEX idx_invitations_userId ON invitations(userId);
CREATE INDEX idx_guests_invitationId ON guests(invitationId);
CREATE INDEX idx_viewers_invitationId ON viewers(invitationId);
CREATE INDEX idx_viewers_viewedAt ON viewers(viewedAt);
CREATE INDEX idx_payment_methods_invitationId ON payment_methods(invitationId);
CREATE INDEX idx_music_tracks_invitationId ON music_tracks(invitationId);

-- Composite indexes untuk common queries
CREATE INDEX idx_guests_invitation_rsvp ON guests(invitationId, rsvpStatus);
CREATE INDEX idx_viewers_invitation_date ON viewers(invitationId, viewedAt);
```

---

## 6️⃣ Security Architecture

### 1. Authentication

```
┌────────────────────────────────────────────────────┐
│             Authentication Flow                     │
├────────────────────────────────────────────────────┤
│                                                     │
│  1. User Login                                     │
│     ├─ Email + Password                           │
│     └─ Validation (Zod)                           │
│                                                     │
│  2. Password Verification                          │
│     ├─ bcryptjs.compare()                         │
│     └─ 12 rounds hashing                          │
│                                                     │
│  3. JWT Generation                                 │
│     ├─ Payload: { userId, email, role }          │
│     ├─ Secret: JWT_SECRET (env)                   │
│     └─ Expiry: 7 days                             │
│                                                     │
│  4. Set HttpOnly Cookie                            │
│     ├─ name: auth-token                           │
│     ├─ httpOnly: true                             │
│     ├─ secure: true (production)                  │
│     ├─ sameSite: 'lax'                            │
│     └─ maxAge: 7 days                             │
│                                                     │
│  5. Subsequent Requests                            │
│     ├─ Cookie automatically sent                  │
│     ├─ JWT verified on server                     │
│     └─ User data extracted                        │
│                                                     │
└────────────────────────────────────────────────────┘
```

### 2. Authorization

```typescript
// Middleware di API routes
export async function GET(request: NextRequest) {
  // 1. Verify authentication
  const user = await protectRoute(request);
  if (!user) {
    return unauthorizedResponse();
  }
  
  // 2. Check authorization
  const invitation = await getInvitation(id);
  if (invitation.userId !== user.userId) {
    return forbiddenResponse();
  }
  
  // 3. Proceed with request
  // ...
}
```

### 3. Input Validation

```typescript
// Zod schema validation
const schema = z.object({
  email: z.string().email(),
  eventName: z.string().min(3).max(100),
  eventDate: z.date(),
  // ... more fields
});

try {
  const validated = schema.parse(input);
} catch (error) {
  // Return 400 with validation errors
}
```

### 4. SQL Injection Protection

```typescript
// ✅ Prisma automatically protects
await prisma.invitation.findMany({
  where: {
    eventName: userInput  // Safe - parameterized query
  }
});

// ❌ Raw SQL (avoid if possible)
await prisma.$queryRaw`
  SELECT * FROM invitations 
  WHERE eventName = ${userInput}  // Still safe with Prisma
`;
```

### 5. XSS Protection

```typescript
// React automatically escapes
<div>{userInput}</div>  // Safe - auto-escaped

// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Sanitize if needed
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

---

## 7️⃣ Scalability Strategy

### Horizontal Scaling

```
                    ┌─────────────┐
                    │   Vercel    │
                    │   (CDN +    │
                    │   Edge)     │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
         ┌────▼────┐              ┌────▼────┐
         │ Region  │              │ Region  │
         │   US    │              │   EU    │
         └────┬────┘              └────┬────┘
              │                         │
    ┌─────────┼─────────┐    ┌─────────┼─────────┐
    │         │         │    │         │         │
┌───▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐
│Server │ │Server│ │Server│ │Server│ │Server│ │Server│
│  1    │ │  2   │ │  3   │ │  1   │ │  2   │ │  3   │
└───┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┘
                           │
                    ┌──────▼──────┐
                    │  Database   │
                    │  (Primary)  │
                    │             │
                    │  Read       │
                    │  Replicas   │
                    └─────────────┘
```

### Caching Strategy

```
┌────────────────────────────────────────────────────┐
│                 Caching Layers                      │
├────────────────────────────────────────────────────┤
│                                                     │
│  1. Browser Cache                                  │
│     ├─ Static assets (images, CSS, JS)            │
│     ├─ Cache-Control headers                      │
│     └─ Service Worker (PWA)                       │
│                                                     │
│  2. CDN Cache (Vercel Edge)                        │
│     ├─ Static pages                               │
│     ├─ ISR (Incremental Static Regeneration)     │
│     └─ Stale-while-revalidate                     │
│                                                     │
│  3. Application Cache (Redis - Optional)           │
│     ├─ Session data                               │
│     ├─ Rate limiting                              │
│     └─ Frequently accessed data                   │
│                                                     │
│  4. Database Query Cache (Prisma)                  │
│     ├─ Query result caching                       │
│     └─ Connection pooling                         │
│                                                     │
└────────────────────────────────────────────────────┘
```

### Database Optimization

```sql
-- 1. Indexing strategy
CREATE INDEX CONCURRENTLY idx_invitations_slug ON invitations(slug);
CREATE INDEX CONCURRENTLY idx_viewers_date ON viewers(viewedAt);

-- 2. Connection pooling (Prisma)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // Connection pool: min=2, max=10
}

-- 3. Read replicas (untuk read-heavy operations)
-- Primary: Write operations
-- Replica: Read operations (viewers, analytics)

-- 4. Partitioning (untuk large tables)
CREATE TABLE viewers_2024 PARTITION OF viewers
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Performance Monitoring

```
┌────────────────────────────────────────────────────┐
│            Performance Metrics                      │
├────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (Vercel Analytics)                       │
│  ├─ Core Web Vitals (LCP, FID, CLS)               │
│  ├─ Time to First Byte (TTFB)                     │
│  └─ Page Load Time                                │
│                                                     │
│  Backend (Application Metrics)                     │
│  ├─ API Response Time                             │
│  ├─ Database Query Time                           │
│  ├─ Error Rate                                    │
│  └─ Throughput (requests/sec)                     │
│                                                     │
│  Database (Neon/Supabase)                          │
│  ├─ Query Performance                             │
│  ├─ Connection Pool Usage                         │
│  ├─ Cache Hit Rate                                │
│  └─ Storage Size                                  │
│                                                     │
│  Infrastructure                                    │
│  ├─ CPU Usage                                     │
│  ├─ Memory Usage                                  │
│  ├─ Network I/O                                   │
│  └─ Disk I/O                                      │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

## 🎯 Kesimpulan

Arsitektur sistem ini dirancang dengan prinsip:

1. **Separation of Concerns** - Setiap layer punya tanggung jawab jelas
2. **Scalability** - Mudah di-scale horizontal & vertical
3. **Maintainability** - Clean code, mudah di-maintain
4. **Security** - Multiple security layers
5. **Performance** - Optimized di setiap layer
6. **Type Safety** - Full TypeScript coverage
7. **Best Practices** - Mengikuti industry standards

Sistem ini siap untuk production dan dapat handle pertumbuhan user dengan baik.
