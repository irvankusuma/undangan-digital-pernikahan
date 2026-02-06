// services/template.service.ts
// Business Logic untuk Caption Template Generation

import prisma from '@/lib/prisma';
import { CreateCaptionTemplateInput, UpdateCaptionTemplateInput } from '@/lib/validators';
import { CaptionTemplate, Platform } from '@prisma/client';

// ==================== TYPES ====================

export interface CaptionVariables {
  guestName: string;
  eventName: string;
  groomName?: string;
  brideName?: string;
  hostName?: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  invitationLink: string;
}

// ==================== DEFAULT TEMPLATES ====================

export const DEFAULT_TEMPLATES = {
  WHATSAPP: `Kepada Yth.
Bapak/Ibu/Saudara/i {guest_name}

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan:

{groom_name} & {bride_name}

📅 {event_date}
⏰ {event_time}
📍 {venue_name}

Untuk info lengkap dan konfirmasi kehadiran, silakan buka undangan digital kami:
{invitation_link}

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih 🙏`,

  INSTAGRAM: `✨ You're Invited! ✨

Hai {guest_name}! 👋

Dengan penuh sukacita, kami mengundang Anda untuk merayakan hari istimewa kami:

💑 {groom_name} & {bride_name}

📆 {event_date}
🕐 {event_time}
📌 {venue_name}

Lihat undangan lengkapnya di:
🔗 {invitation_link}

Kehadiran dan doa restu Anda sangat berarti bagi kami! 💝

#Wedding #SaveTheDate #LoveStory`,

  SMS: `Dear {guest_name},

Kami mengundang Anda di pernikahan:
{groom_name} & {bride_name}

{event_date} | {event_time}
{venue_name}

Info lengkap: {invitation_link}

Terima kasih 🙏`,

  EMAIL: `Subject: Undangan Pernikahan - {groom_name} & {bride_name}

Kepada Yth.
{guest_name}

Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan putra-putri kami:

{groom_name} & {bride_name}

Yang akan diselenggarakan pada:
Hari/Tanggal: {event_date}
Waktu: {event_time}
Tempat: {venue_name}
Alamat: {venue_address}

Untuk informasi lebih lengkap dan konfirmasi kehadiran, Bapak/Ibu/Saudara/i dapat membuka undangan digital kami melalui tautan berikut:
{invitation_link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada putra-putri kami.

Atas perhatian dan kehadirannya, kami ucapkan terima kasih.

Hormat kami,
Keluarga Besar {groom_name} & {bride_name}`,

  CUSTOM: `Hai {guest_name},

Kami mengundang Anda untuk hadir di acara {event_name}.

📅 {event_date}
⏰ {event_time}
📍 {venue_name}

Detail lengkap: {invitation_link}`,
};

// ==================== CRUD OPERATIONS ====================

/**
 * Create new caption template
 */
export async function createCaptionTemplate(
  data: CreateCaptionTemplateInput
): Promise<CaptionTemplate> {
  return prisma.captionTemplate.create({
    data,
  });
}

/**
 * Get all caption templates
 */
export async function getAllCaptionTemplates(): Promise<CaptionTemplate[]> {
  return prisma.captionTemplate.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Get caption templates by platform
 */
export async function getCaptionTemplatesByPlatform(
  platform: Platform
): Promise<CaptionTemplate[]> {
  return prisma.captionTemplate.findMany({
    where: {
      platform,
      isActive: true,
    },
    orderBy: { isDefault: 'desc' },
  });
}

/**
 * Update caption template
 */
export async function updateCaptionTemplate(
  id: string,
  data: UpdateCaptionTemplateInput
): Promise<CaptionTemplate> {
  return prisma.captionTemplate.update({
    where: { id },
    data,
  });
}

/**
 * Delete caption template
 */
export async function deleteCaptionTemplate(id: string): Promise<void> {
  await prisma.captionTemplate.delete({
    where: { id },
  });
}

// ==================== CAPTION GENERATION ====================

/**
 * Replace placeholders dengan actual values
 */
export function replacePlaceholders(
  template: string,
  variables: CaptionVariables
): string {
  let result = template;
  
  // Replace each placeholder
  const replacements: Record<string, string> = {
    '{guest_name}': variables.guestName,
    '{event_name}': variables.eventName,
    '{groom_name}': variables.groomName || '',
    '{bride_name}': variables.brideName || '',
    '{host_name}': variables.hostName || '',
    '{event_date}': variables.eventDate,
    '{event_time}': variables.eventTime,
    '{venue_name}': variables.venueName,
    '{venue_address}': variables.venueAddress,
    '{invitation_link}': variables.invitationLink,
  };
  
  // Replace all placeholders
  Object.entries(replacements).forEach(([placeholder, value]) => {
    result = result.replace(new RegExp(placeholder, 'g'), value);
  });
  
  // Clean up empty lines caused by empty optional placeholders
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return result.trim();
}

/**
 * Generate caption untuk specific guest
 */
export async function generateCaption(
  templateId: string,
  variables: CaptionVariables
): Promise<string> {
  const template = await prisma.captionTemplate.findUnique({
    where: { id: templateId },
  });
  
  if (!template) {
    throw new Error('Template not found');
  }
  
  return replacePlaceholders(template.content, variables);
}

/**
 * Generate caption dari platform default template
 */
export async function generateCaptionByPlatform(
  platform: Platform,
  variables: CaptionVariables
): Promise<string> {
  // Get default template untuk platform
  const template = await prisma.captionTemplate.findFirst({
    where: {
      platform,
      isDefault: true,
      isActive: true,
    },
  });
  
  if (!template) {
    // Fallback ke built-in default template
    const defaultTemplate = DEFAULT_TEMPLATES[platform] || DEFAULT_TEMPLATES.WHATSAPP;
    return replacePlaceholders(defaultTemplate, variables);
  }
  
  return replacePlaceholders(template.content, variables);
}

/**
 * Generate captions untuk semua platform
 */
export async function generateAllPlatformCaptions(
  variables: CaptionVariables
): Promise<Record<Platform, string>> {
  const platforms: Platform[] = ['WHATSAPP', 'INSTAGRAM', 'SMS', 'EMAIL', 'CUSTOM'];
  
  const captions = await Promise.all(
    platforms.map(async (platform) => {
      const caption = await generateCaptionByPlatform(platform, variables);
      return { platform, caption };
    })
  );
  
  return captions.reduce((acc, { platform, caption }) => {
    acc[platform] = caption;
    return acc;
  }, {} as Record<Platform, string>);
}

/**
 * Seed default templates ke database
 */
export async function seedDefaultTemplates(): Promise<void> {
  const templates = [
    {
      name: 'WhatsApp Default',
      platform: 'WHATSAPP' as Platform,
      content: DEFAULT_TEMPLATES.WHATSAPP,
      isDefault: true,
      isActive: true,
    },
    {
      name: 'Instagram Default',
      platform: 'INSTAGRAM' as Platform,
      content: DEFAULT_TEMPLATES.INSTAGRAM,
      isDefault: true,
      isActive: true,
    },
    {
      name: 'SMS Default',
      platform: 'SMS' as Platform,
      content: DEFAULT_TEMPLATES.SMS,
      isDefault: true,
      isActive: true,
    },
    {
      name: 'Email Default',
      platform: 'EMAIL' as Platform,
      content: DEFAULT_TEMPLATES.EMAIL,
      isDefault: true,
      isActive: true,
    },
  ];
  
  for (const template of templates) {
    // Check if template already exists
    const existing = await prisma.captionTemplate.findFirst({
      where: {
        platform: template.platform,
        isDefault: true,
      },
    });
    
    if (!existing) {
      await prisma.captionTemplate.create({
        data: template,
      });
    }
  }
}

// ==================== BULK CAPTION GENERATION ====================

/**
 * Generate captions untuk semua guests di invitation
 */
export async function generateCaptionsForAllGuests(
  invitationId: string,
  platform: Platform
): Promise<Array<{ guestId: string; guestName: string; caption: string }>> {
  // Get invitation details
  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
    include: {
      guests: true,
    },
  });
  
  if (!invitation) {
    throw new Error('Invitation not found');
  }
  
  // Generate base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  // Generate caption untuk setiap guest
  const captions = await Promise.all(
    invitation.guests.map(async (guest) => {
      const invitationLink = `${baseUrl}/${invitation.slug}?guest=${guest.id}`;
      
      const variables: CaptionVariables = {
        guestName: guest.name,
        eventName: invitation.eventName,
        groomName: invitation.groomName || undefined,
        brideName: invitation.brideName || undefined,
        hostName: invitation.hostName || undefined,
        eventDate: invitation.eventDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        eventTime: invitation.eventTime,
        venueName: invitation.venueName,
        venueAddress: invitation.venueAddress,
        invitationLink,
      };
      
      const caption = await generateCaptionByPlatform(platform, variables);
      
      return {
        guestId: guest.id,
        guestName: guest.name,
        caption,
      };
    })
  );
  
  return captions;
}

/**
 * Export captions ke CSV
 */
export function exportCaptionsToCSV(
  captions: Array<{ guestId: string; guestName: string; caption: string }>
): string {
  const headers = ['Guest ID', 'Guest Name', 'Caption'];
  const rows = captions.map((c) => [
    c.guestId,
    c.guestName,
    `"${c.caption.replace(/"/g, '""')}"`, // Escape quotes
  ]);
  
  const csv = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');
  
  return csv;
}
