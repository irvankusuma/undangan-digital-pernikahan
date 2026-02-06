// lib/validators.ts
// Zod Schemas untuk Validasi Input

import { z } from 'zod';

// ==================== AUTH VALIDATORS ====================

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z.string().optional(),
});

// ==================== INVITATION VALIDATORS ====================

export const createInvitationSchema = z.object({
  eventName: z.string().min(3, 'Nama acara minimal 3 karakter'),
  groomName: z.string().optional(),
  brideName: z.string().optional(),
  hostName: z.string().optional(),
  eventDate: z.string().or(z.date()),
  eventTime: z.string().min(1, 'Waktu acara wajib diisi'),
  venueName: z.string().min(3, 'Nama venue minimal 3 karakter'),
  venueAddress: z.string().min(5, 'Alamat venue minimal 5 karakter'),
  googleMapsUrl: z.string().url('URL Google Maps tidak valid').optional().or(z.literal('')),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
  dresscode: z.string().optional(),
  coverImage: z.string().url('URL cover image tidak valid').optional(),
  galleryImages: z.array(z.string().url()).optional(),
  isPublished: z.boolean().default(false),
  allowRsvp: z.boolean().default(true),
  maxGuests: z.number().int().positive().optional(),
  theme: z.string().default('classic'),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Format warna harus HEX (#RRGGBB)').optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Format warna harus HEX (#RRGGBB)').optional(),
});

export const updateInvitationSchema = createInvitationSchema.partial();

// ==================== GUEST VALIDATORS ====================

export const createGuestSchema = z.object({
  invitationId: z.string().cuid('ID undangan tidak valid'),
  name: z.string().min(2, 'Nama tamu minimal 2 karakter'),
  phone: z.string().optional(),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  category: z.enum(['VIP', 'FAMILY', 'FRIEND', 'COLLEAGUE', 'GENERAL']).default('GENERAL'),
});

export const updateGuestSchema = createGuestSchema.partial().omit({ invitationId: true });

export const rsvpSchema = z.object({
  rsvpStatus: z.enum(['PENDING', 'ATTENDING', 'NOT_ATTENDING', 'MAYBE']),
  attendanceCount: z.number().int().positive().default(1),
  message: z.string().max(500, 'Pesan maksimal 500 karakter').optional(),
});

// ==================== PAYMENT METHOD VALIDATORS ====================

const paymentMethodBaseSchema = z.object({
  invitationId: z.string().cuid('ID undangan tidak valid'),
  type: z.enum(['BANK_TRANSFER', 'E_WALLET']),
  bankName: z.string().optional(),
  accountName: z.string().min(2, 'Nama akun minimal 2 karakter'),
  accountNumber: z.string().min(5, 'Nomor akun minimal 5 karakter'),
  ewalletType: z.string().optional(),
  qrCodeImage: z.string().url('URL QR Code tidak valid').optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export const createPaymentMethodSchema = paymentMethodBaseSchema.refine(
  (data) => {
    if (data.type === 'BANK_TRANSFER') {
      return !!data.bankName;
    }
    if (data.type === 'E_WALLET') {
      return !!data.ewalletType;
    }
    return true;
  },
  {
    message: 'Bank name wajib untuk transfer bank, E-wallet type wajib untuk e-wallet',
  }
);

export const updatePaymentMethodSchema = paymentMethodBaseSchema.partial().omit({ invitationId: true });

// ==================== MUSIC TRACK VALIDATORS ====================

// Helper function to extract YouTube video ID
export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Jika sudah berupa ID langsung (11 karakter)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  return null;
};

const musicTrackBaseSchema = z.object({
  invitationId: z.string().cuid('ID undangan tidak valid'),
  youtubeUrl: z.string().min(1, 'URL YouTube wajib diisi').refine(
    (url) => extractYouTubeId(url) !== null,
    'URL YouTube tidak valid'
  ),
  title: z.string().min(1, 'Judul lagu wajib diisi'),
  artist: z.string().optional(),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  startTime: z.number().int().min(0).default(0),
  autoplay: z.boolean().default(true),
  loop: z.boolean().default(true),
});

export const createMusicTrackSchema = musicTrackBaseSchema.transform((data) => ({
  ...data,
  youtubeId: extractYouTubeId(data.youtubeUrl)!,
}));

export const updateMusicTrackSchema = musicTrackBaseSchema.partial().omit({ invitationId: true });

// ==================== CAPTION TEMPLATE VALIDATORS ====================

export const createCaptionTemplateSchema = z.object({
  name: z.string().min(3, 'Nama template minimal 3 karakter'),
  platform: z.enum(['WHATSAPP', 'INSTAGRAM', 'SMS', 'EMAIL', 'CUSTOM']),
  content: z.string().min(10, 'Konten template minimal 10 karakter'),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateCaptionTemplateSchema = createCaptionTemplateSchema.partial();

// ==================== VIEWER TRACKING VALIDATOR ====================

export const trackViewerSchema = z.object({
  invitationId: z.string().cuid('ID undangan tidak valid'),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  sessionId: z.string().optional(),
  referrer: z.string().optional(),
});

// ==================== TYPE EXPORTS ====================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
export type RsvpInput = z.infer<typeof rsvpSchema>;
export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;
export type CreateMusicTrackInput = z.infer<typeof createMusicTrackSchema>;
export type UpdateMusicTrackInput = z.infer<typeof updateMusicTrackSchema>;
export type CreateCaptionTemplateInput = z.infer<typeof createCaptionTemplateSchema>;
export type UpdateCaptionTemplateInput = z.infer<typeof updateCaptionTemplateSchema>;
export type TrackViewerInput = z.infer<typeof trackViewerSchema>;
