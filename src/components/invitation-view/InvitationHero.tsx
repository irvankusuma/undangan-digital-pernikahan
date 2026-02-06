// components/invitation-view/InvitationHero.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InvitationHeroProps {
  groomName?: string | null;
  brideName?: string | null;
  hostName?: string | null;
  eventName: string;
  coverImage?: string | null;
  eventDate: Date;
  guestName?: string;
}

export default function InvitationHero({
  groomName,
  brideName,
  hostName,
  eventName,
  coverImage,
  eventDate,
  guestName,
}: InvitationHeroProps) {
  const displayDate = new Date(eventDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {coverImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500" />
      )}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 py-20">
        {/* Guest Name */}
        {guestName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-lg md:text-xl opacity-90 mb-2">
              Kepada Yth.
            </p>
            <p className="text-2xl md:text-3xl font-semibold">
              {guestName}
            </p>
          </motion.div>
        )}

        {/* Event Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif">
            {groomName && brideName ? (
              <>
                {groomName}
                <span className="block text-4xl md:text-6xl my-4">&</span>
                {brideName}
              </>
            ) : (
              eventName
            )}
          </h1>
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl font-light"
        >
          {displayDate}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
