// app/(public)/[slug]/page.tsx
// Public Invitation View Page

import { notFound } from 'next/navigation';
import { getInvitationBySlug } from '@/services/invitation.service';
import InvitationView from '@/components/invitation-view/InvitationView';

interface InvitationPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    guest?: string;
  };
}

export async function generateMetadata({ params }: InvitationPageProps) {
  const invitation = await getInvitationBySlug(params.slug);
  
  if (!invitation) {
    return {
      title: 'Invitation Not Found',
    };
  }
  
  const title = invitation.groomName && invitation.brideName
    ? `${invitation.groomName} & ${invitation.brideName} - Wedding Invitation`
    : invitation.eventName;
  
  const description = invitation.description || 
    `You're invited to ${invitation.eventName} on ${invitation.eventDate.toLocaleDateString()}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: invitation.coverImage ? [invitation.coverImage] : [],
      type: 'website',
    },
  };
}

export default async function InvitationPage({ 
  params, 
  searchParams 
}: InvitationPageProps) {
  const invitation = await getInvitationBySlug(params.slug);
  
  if (!invitation) {
    notFound();
  }
  
  // Get specific guest if provided
  const guestId = searchParams.guest;
  const guest = guestId 
    ? invitation.guests.find(g => g.id === guestId) 
    : null;
  
  return (
    <InvitationView 
      invitation={invitation} 
      guest={guest}
    />
  );
}
