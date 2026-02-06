// components/invitation-view/LocationMap.tsx
'use client';

import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface LocationMapProps {
  venueName: string;
  venueAddress: string;
  latitude?: number | null;
  longitude?: number | null;
  googleMapsUrl?: string | null;
}

export default function LocationMap({
  venueName,
  venueAddress,
  latitude,
  longitude,
  googleMapsUrl,
}: LocationMapProps) {
  // Generate Google Maps embed URL
  const embedUrl = latitude && longitude
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${latitude},${longitude}&zoom=15`
    : googleMapsUrl
    ? googleMapsUrl.replace('/maps/place/', '/maps/embed/v1/place?key=' + process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY + '&q=')
    : null;

  // Generate Google Maps link URL
  const mapsLinkUrl = latitude && longitude
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueName + ' ' + venueAddress)}`;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
        Lokasi Acara
      </h2>

      {/* Venue Info */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          {venueName}
        </h3>
        <p className="text-gray-600 max-w-lg mx-auto">
          {venueAddress}
        </p>
      </div>

      {/* Map Embed */}
      {embedUrl && (
        <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={embedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      )}

      {/* Open in Google Maps Button */}
      <div className="text-center">
        <a
          href={mapsLinkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <MapPin className="w-5 h-5" />
          Buka di Google Maps
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
