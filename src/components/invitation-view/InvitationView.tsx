'use client';

import { useEffect } from 'react';
import MusicPlayer from './MusicPlayer';

interface InvitationViewProps {
  invitation: any;
  guest?: { name?: string } | null;
}

export default function InvitationView({ invitation, guest }: InvitationViewProps) {
  useEffect(() => {
    const sessionId = sessionStorage.getItem('sessionId') || `session_${Date.now()}`;
    sessionStorage.setItem('sessionId', sessionId);

    fetch('/api/viewers/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invitationId: invitation.id,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        sessionId,
      }),
    }).catch(() => {
      // no-op in public page
    });
  }, [invitation.id]);

  const coupleName = invitation.groomName && invitation.brideName
    ? `${invitation.groomName} & ${invitation.brideName}`
    : invitation.hostName || invitation.eventName;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {invitation.musicTracks.length > 0 && (
        <MusicPlayer
          tracks={invitation.musicTracks.map((track: any) => ({
            ...track,
            startTime: track.startTime || 0,
          }))}
        />
      )}

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold">{coupleName}</h1>
        <p className="mt-2 text-lg">{invitation.eventName}</p>
        <p className="mt-4 text-sm text-gray-600">
          {new Date(invitation.eventDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}{' '}
          • {invitation.eventTime}
        </p>
        {guest?.name && <p className="mt-3">Kepada: {guest.name}</p>}
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="text-2xl font-semibold">Lokasi Acara</h2>
        <p className="mt-2 font-medium">{invitation.venueName}</p>
        <p className="text-gray-600">{invitation.venueAddress}</p>
        {invitation.googleMapsUrl && (
          <a className="mt-4 inline-block text-blue-600 underline" href={invitation.googleMapsUrl} target="_blank" rel="noreferrer">
            Buka Google Maps
          </a>
        )}
      </section>
    </main>
  );
}
