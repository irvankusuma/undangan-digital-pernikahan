// components/invitation-view/RsvpForm.tsx
'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Guest {
  id: string;
  name: string;
  rsvpStatus: string;
}

interface RsvpFormProps {
  invitationId: string;
  guest?: Guest | null;
}

export default function RsvpForm({ invitationId, guest }: RsvpFormProps) {
  const [name, setName] = useState(guest?.name || '');
  const [attendance, setAttendance] = useState<'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE'>(
    guest?.rsvpStatus as any || 'ATTENDING'
  );
  const [attendanceCount, setAttendanceCount] = useState(1);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // const response = await fetch('/api/guests/rsvp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     invitationId,
      //     guestId: guest?.id,
      //     name,
      //     rsvpStatus: attendance,
      //     attendanceCount,
      //     message,
      //   }),
      // });

      setIsSubmitted(true);
    } catch (error) {
      console.error('RSVP submission failed:', error);
      alert('Gagal mengirim RSVP. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Terima Kasih!
          </h2>
          <p className="text-gray-600 text-lg">
            Konfirmasi kehadiran Anda telah kami terima.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
        Konfirmasi Kehadiran
      </h2>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Name */}
        {!guest && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Masukkan nama Anda"
            />
          </div>
        )}

        {/* Attendance Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Konfirmasi Kehadiran
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setAttendance('ATTENDING')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                attendance === 'ATTENDING'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hadir
            </button>
            <button
              type="button"
              onClick={() => setAttendance('NOT_ATTENDING')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                attendance === 'NOT_ATTENDING'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tidak Hadir
            </button>
            <button
              type="button"
              onClick={() => setAttendance('MAYBE')}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                attendance === 'MAYBE'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mungkin
            </button>
          </div>
        </div>

        {/* Attendance Count */}
        {attendance === 'ATTENDING' && (
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Tamu
            </label>
            <input
              type="number"
              id="count"
              min="1"
              max="10"
              value={attendanceCount}
              onChange={(e) => setAttendanceCount(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>
        )}

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Ucapan & Doa (Opsional)
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
            placeholder="Tulis ucapan atau doa Anda..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
        </button>
      </form>
    </div>
  );
}
