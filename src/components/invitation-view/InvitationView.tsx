// components/invitation-view/InvitationView.tsx
'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import InvitationHero from './InvitationHero';
import CountdownTimer from './CountdownTimer';
import EventDetails from './EventDetails';
import Gallery from './Gallery';
import LocationMap from './LocationMap';
import RsvpForm from './RsvpForm';
import GiftSection from './GiftSection';
import MusicPlayer from './MusicPlayer';
import ShareButtons from './ShareButtons';

interface Guest {
  id: string;
  name: string;
  rsvpStatus: string;
}

interface Invitation {
  id: string;
  slug: string;
  eventName: string;
  groomName?: string | null;
  brideName?: string | null;
  hostName?: string | null;
  eventDate: Date;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  dresscode?: string | null;
  coverImage?: string | null;
  galleryImages: string[];
  theme: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  allowRsvp: boolean;
  paymentMethods: Array<{
    id: string;
    type: string;
    bankName?: string | null;
    accountName: string;
    accountNumber: string;
    ewalletType?: string | null;
    qrCodeImage?: string | null;
  }>;
  musicTracks: Array<{
    id: string;
    youtubeId: string;
    title: string;
    artist?: string | null;
    thumbnail?: string | null;
    isDefault: boolean;
    autoplay: boolean;
    loop: boolean;
    startTime?: number | null;
  }>;
}

interface InvitationViewProps {
  invitation: Invitation;
  guest?: Guest | null;
}

export default function InvitationView({ invitation, guest }: InvitationViewProps) {
  // Track viewer on mount
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch('/api/viewers/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invitationId: invitation.id,
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            sessionId: sessionStorage.getItem('sessionId') || generateSessionId(),
          }),
        });
      } catch (error) {
        console.error('Failed to track viewer:', error);
      }
    };
    
    trackView();
  }, [invitation.id]);
  
  const generateSessionId = () => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('sessionId', id);
    return id;
  };
  
  // Theme colors
  const primaryColor = invitation.primaryColor || '#8b5cf6';
  const secondaryColor = invitation.secondaryColor || '#ec4899';
  
  return (
    <>
      {/* CSS Variables untuk theme colors */}
      <style jsx global>{`
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-white">
        {/* Music Player */}
        {invitation.musicTracks.length > 0 && (
          <MusicPlayer 
            tracks={invitation.musicTracks.map(track => ({
              ...track,
              startTime: track.startTime || 0,
            }))}
          />
        )}
        
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <InvitationHero
            groomName={invitation.groomName}
            brideName={invitation.brideName}
            hostName={invitation.hostName}
            eventName={invitation.eventName}
            coverImage={invitation.coverImage}
            eventDate={invitation.eventDate}
            guestName={guest?.name}
          />
        </motion.section>
        
        {/* Countdown Timer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-12"
        >
          <CountdownTimer eventDate={invitation.eventDate} />
        </motion.section>
        
        {/* Event Details */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-12"
        >
          <EventDetails
            eventDate={invitation.eventDate}
            eventTime={invitation.eventTime}
            venueName={invitation.venueName}
            venueAddress={invitation.venueAddress}
            description={invitation.description}
            dresscode={invitation.dresscode}
          />
        </motion.section>
        
        {/* Gallery */}
        {invitation.galleryImages.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-12"
          >
            <Gallery images={invitation.galleryImages} />
          </motion.section>
        )}
        
        {/* Location Map */}
        {(invitation.latitude && invitation.longitude) || invitation.googleMapsUrl ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-12"
          >
            <LocationMap
              venueName={invitation.venueName}
              venueAddress={invitation.venueAddress}
              latitude={invitation.latitude}
              longitude={invitation.longitude}
              googleMapsUrl={invitation.googleMapsUrl}
            />
          </motion.section>
        ) : null}
        
        {/* RSVP Form */}
        {invitation.allowRsvp && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-12"
          >
            <RsvpForm
              invitationId={invitation.id}
              guest={guest}
            />
          </motion.section>
        )}
        
        {/* Gift Section */}
        {invitation.paymentMethods.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 py-12"
          >
            <GiftSection paymentMethods={invitation.paymentMethods} />
          </motion.section>
        )}
        
        {/* Share Buttons */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-12"
        >
          <ShareButtons
            url={typeof window !== 'undefined' ? window.location.href : ''}
            title={`${invitation.groomName || invitation.hostName} & ${invitation.brideName || invitation.eventName}`}
          />
        </motion.section>
        
        {/* Footer */}
        <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm opacity-80">
              Created with ❤️ by Wedding Invitation System
            </p>
            <p className="text-xs opacity-60 mt-2">
              © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
