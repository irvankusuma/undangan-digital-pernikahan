// components/invitation-view/CountdownTimer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  eventDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ eventDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(eventDate).getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  const isEventPassed = timeLeft.days === 0 && timeLeft.hours === 0 && 
                        timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">
        {isEventPassed ? 'Acara Telah Berlangsung' : 'Hitung Mundur Acara'}
      </h2>

      {!isEventPassed ? (
        <div className="grid grid-cols-4 gap-4 md:gap-8">
          <TimeBox value={timeLeft.days} label="Hari" />
          <TimeBox value={timeLeft.hours} label="Jam" />
          <TimeBox value={timeLeft.minutes} label="Menit" />
          <TimeBox value={timeLeft.seconds} label="Detik" />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Terima kasih atas kehadiran dan doa restu Anda
          </p>
        </div>
      )}
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 md:p-6 mb-2">
        <div className="text-3xl md:text-5xl font-bold text-white">
          {String(value).padStart(2, '0')}
        </div>
      </div>
      <div className="text-sm md:text-base font-medium text-gray-600">
        {label}
      </div>
    </motion.div>
  );
}
