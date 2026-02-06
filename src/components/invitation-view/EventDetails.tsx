// components/invitation-view/EventDetails.tsx
'use client';

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface EventDetailsProps {
  eventDate: Date;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  description?: string | null;
  dresscode?: string | null;
}

export default function EventDetails({
  eventDate,
  eventTime,
  venueName,
  venueAddress,
  description,
  dresscode,
}: EventDetailsProps) {
  const displayDate = new Date(eventDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
        Detail Acara
      </h2>

      {/* Description */}
      {description && (
        <div className="mb-8 text-center">
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      )}

      {/* Event Info Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Date */}
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Tanggal</h3>
          <p className="text-gray-600">{displayDate}</p>
        </div>

        {/* Time */}
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600 rounded-full mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Waktu</h3>
          <p className="text-gray-600">{eventTime}</p>
        </div>

        {/* Location */}
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-600 rounded-full mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Lokasi</h3>
          <p className="text-gray-600 font-medium">{venueName}</p>
          <p className="text-gray-500 text-sm mt-1">{venueAddress}</p>
        </div>
      </div>

      {/* Dresscode */}
      {dresscode && (
        <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Dress Code</h3>
          <p className="text-gray-600">{dresscode}</p>
        </div>
      )}
    </div>
  );
}
