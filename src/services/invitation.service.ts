// services/invitation.service.ts
// Business Logic untuk Invitation Management

import prisma from '@/lib/prisma';
import { CreateInvitationInput, UpdateInvitationInput } from '@/lib/validators';
import { Invitation, Prisma } from '@prisma/client';

// ==================== TYPES ====================

export interface InvitationWithRelations extends Invitation {
  user: {
    id: string;
    name: string;
    email: string;
  };
  guests: Array<{
    id: string;
    name: string;
    rsvpStatus: string;
  }>;
  viewers: Array<{
    id: string;
    viewedAt: Date;
  }>;
  paymentMethods: Array<{
    id: string;
    type: string;
    accountName: string;
  }>;
  musicTracks: Array<{
    id: string;
    title: string;
    isDefault: boolean;
  }>;
}

export interface InvitationStats {
  totalInvitations: number;
  publishedInvitations: number;
  totalGuests: number;
  totalViewers: number;
  attendingGuests: number;
  notAttendingGuests: number;
  pendingRsvp: number;
}

// ==================== SLUG GENERATOR ====================

/**
 * Generate unique slug dari event name
 */
async function generateUniqueSlug(eventName: string, attempt = 0): Promise<string> {
  // Clean and convert to slug format
  let slug = eventName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .trim();
  
  // Add random suffix jika sudah pernah ada
  if (attempt > 0) {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    slug = `${slug}-${randomSuffix}`;
  }
  
  // Check if slug exists
  const existing = await prisma.invitation.findUnique({
    where: { slug },
  });
  
  // Jika sudah ada, generate lagi dengan random suffix
  if (existing) {
    return generateUniqueSlug(eventName, attempt + 1);
  }
  
  return slug;
}

// ==================== CRUD OPERATIONS ====================

/**
 * Create new invitation
 */
export async function createInvitation(
  userId: string,
  data: CreateInvitationInput
): Promise<Invitation> {
  // Generate unique slug
  const slug = await generateUniqueSlug(data.eventName);
  
  // Convert string date to Date object if needed
  const eventDate = typeof data.eventDate === 'string' 
    ? new Date(data.eventDate) 
    : data.eventDate;
  
  return prisma.invitation.create({
    data: {
      ...data,
      eventDate,
      slug,
      userId,
      galleryImages: data.galleryImages || [],
    },
  });
}

/**
 * Get invitation by ID with full relations
 */
export async function getInvitationById(
  id: string,
  includeRelations = false
): Promise<InvitationWithRelations | Invitation | null> {
  const include = includeRelations
    ? {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        guests: {
          select: {
            id: true,
            name: true,
            rsvpStatus: true,
          },
        },
        viewers: {
          select: {
            id: true,
            viewedAt: true,
          },
          orderBy: {
            viewedAt: 'desc' as const,
          },
          take: 10,
        },
        paymentMethods: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            type: true,
            accountName: true,
          },
        },
        musicTracks: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            isDefault: true,
          },
        },
      }
    : undefined;
  
  return prisma.invitation.findUnique({
    where: { id },
    include,
  }) as Promise<InvitationWithRelations | Invitation | null>;
}

/**
 * Get invitation by slug (untuk public access)
 */
export async function getInvitationBySlug(slug: string): Promise<InvitationWithRelations | null> {
  return prisma.invitation.findUnique({
    where: { 
      slug,
      isPublished: true, // Hanya yang sudah published
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      guests: {
        select: {
          id: true,
          name: true,
          rsvpStatus: true,
          attendanceCount: true,
        },
      },
      viewers: false, // Tidak perlu untuk public view
      paymentMethods: {
        where: {
          isActive: true,
        },
        orderBy: {
          displayOrder: 'asc',
        },
      },
      musicTracks: {
        where: {
          isActive: true,
        },
        orderBy: [
          { isDefault: 'desc' },
          { displayOrder: 'asc' },
        ],
      },
    },
  }) as Promise<InvitationWithRelations | null>;
}

/**
 * Get all invitations by user
 */
export async function getInvitationsByUserId(userId: string): Promise<Invitation[]> {
  return prisma.invitation.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          guests: true,
          viewers: true,
        },
      },
    },
  });
}

/**
 * Update invitation
 */
export async function updateInvitation(
  id: string,
  userId: string,
  data: UpdateInvitationInput
): Promise<Invitation> {
  // Verify ownership
  const invitation = await prisma.invitation.findUnique({
    where: { id },
  });
  
  if (!invitation) {
    throw new Error('Invitation not found');
  }
  
  if (invitation.userId !== userId) {
    throw new Error('Unauthorized: You do not own this invitation');
  }
  
  // Convert date if provided
  const updateData: Prisma.InvitationUpdateInput = { ...data };
  if (data.eventDate) {
    updateData.eventDate = typeof data.eventDate === 'string'
      ? new Date(data.eventDate)
      : data.eventDate;
  }
  
  return prisma.invitation.update({
    where: { id },
    data: updateData,
  });
}

/**
 * Delete invitation
 */
export async function deleteInvitation(id: string, userId: string): Promise<void> {
  // Verify ownership
  const invitation = await prisma.invitation.findUnique({
    where: { id },
  });
  
  if (!invitation) {
    throw new Error('Invitation not found');
  }
  
  if (invitation.userId !== userId) {
    throw new Error('Unauthorized: You do not own this invitation');
  }
  
  await prisma.invitation.delete({
    where: { id },
  });
}

/**
 * Publish/unpublish invitation
 */
export async function togglePublishInvitation(
  id: string,
  userId: string,
  isPublished: boolean
): Promise<Invitation> {
  return updateInvitation(id, userId, { isPublished });
}

// ==================== STATISTICS ====================

/**
 * Get invitation statistics
 */
export async function getInvitationStats(id: string): Promise<{
  totalGuests: number;
  totalViewers: number;
  attendingGuests: number;
  notAttendingGuests: number;
  pendingRsvp: number;
  viewersByDay: Array<{ date: string; count: number }>;
}> {
  const [guests, viewers] = await Promise.all([
    prisma.guest.findMany({
      where: { invitationId: id },
    }),
    prisma.viewer.findMany({
      where: { invitationId: id },
    }),
  ]);
  
  // Calculate guest stats
  const totalGuests = guests.length;
  const attendingGuests = guests.filter(g => g.rsvpStatus === 'ATTENDING').length;
  const notAttendingGuests = guests.filter(g => g.rsvpStatus === 'NOT_ATTENDING').length;
  const pendingRsvp = guests.filter(g => g.rsvpStatus === 'PENDING').length;
  
  // Calculate viewers by day (last 7 days)
  const viewersByDay = viewers.reduce((acc, viewer) => {
    const date = viewer.viewedAt.toISOString().split('T')[0];
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing.count++;
    } else {
      acc.push({ date, count: 1 });
    }
    
    return acc;
  }, [] as Array<{ date: string; count: number }>);
  
  return {
    totalGuests,
    totalViewers: viewers.length,
    attendingGuests,
    notAttendingGuests,
    pendingRsvp,
    viewersByDay: viewersByDay.sort((a, b) => a.date.localeCompare(b.date)),
  };
}

/**
 * Get user dashboard statistics
 */
export async function getUserDashboardStats(userId: string): Promise<InvitationStats> {
  const invitations = await prisma.invitation.findMany({
    where: { userId },
    include: {
      guests: true,
      viewers: true,
    },
  });
  
  const totalInvitations = invitations.length;
  const publishedInvitations = invitations.filter(i => i.isPublished).length;
  
  const allGuests = invitations.flatMap(i => i.guests);
  const totalGuests = allGuests.length;
  const attendingGuests = allGuests.filter(g => g.rsvpStatus === 'ATTENDING').length;
  const notAttendingGuests = allGuests.filter(g => g.rsvpStatus === 'NOT_ATTENDING').length;
  const pendingRsvp = allGuests.filter(g => g.rsvpStatus === 'PENDING').length;
  
  const totalViewers = invitations.reduce((sum, i) => sum + i.viewers.length, 0);
  
  return {
    totalInvitations,
    publishedInvitations,
    totalGuests,
    totalViewers,
    attendingGuests,
    notAttendingGuests,
    pendingRsvp,
  };
}
