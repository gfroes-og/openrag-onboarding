'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen({ message = 'Loading...' }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-openpurple-50 via-white to-openpurple-50 dark:from-gray-900 dark:via-gray-900 dark:to-openpurple-950 flex items-center justify-center z-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-openpurple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-openpurple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative text-center">
        {/* Animated Icon Container */}
        <div className="relative mb-8">
          {/* Glow ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-openpurple-400 to-openpurple-600 opacity-20 blur-2xl animate-pulse"></div>
          </div>
          
          {/* Rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-transparent border-t-openpurple-600 animate-spin"></div>
          </div>

          {/* Icon */}
          <div className="relative flex items-center justify-center animate-bounce-slow">
            <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full shadow-2xl flex items-center justify-center border border-gray-200 dark:border-gray-800">
              <Image
                src="/icon.svg"
                alt="OpenGov"
                width={48}
                height={48}
                className="animate-pulse-slow"
              />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {message}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-openpurple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-openpurple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-openpurple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

