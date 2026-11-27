'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface PuzzleCompletionProps {
  photoUrl: string;
  onNext: () => void;
}

export function PuzzleCompletion({ photoUrl, onNext }: PuzzleCompletionProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-romantic-card relative max-w-md w-full rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-rose-400/40"
      >
        {/* Soft decorative glow */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-champagne-gold/15 blur-2xl" />

        {/* Floating Heart Icon Badge */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/30 animate-heart-pulse">
          <Heart className="h-7 w-7" fill="currentColor" />
        </div>

        {/* Heading */}
        <h2 className="mb-2 font-playfair italic text-2xl sm:text-3xl font-bold text-cream-50 text-glow">
          You Did It! ❤️
        </h2>

        {/* Subtitle */}
        <p className="mb-4 text-xs sm:text-sm font-light text-rose-100/90 leading-relaxed font-sans">
          Every little piece found its place, just like every beautiful moment has a special place in my heart.
        </p>

        {/* Completed Photo in White Gift Box Frame with Pink Ribbon Bow (matching reference) */}
        <div className="relative mx-auto mb-5 w-52 sm:w-64 aspect-[4/3] rounded-2xl border-2 sm:border-[3px] border-white bg-[#fdfcfb] p-2 shadow-2xl">
          {/* Clipped Corner Ribbon Layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl z-10">
            {/* Top-Left Diagonal Ribbon */}
            <div className="absolute -top-5 -left-5 w-20 sm:w-24 h-4.5 sm:h-5 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 shadow-md transform -rotate-45 border-y border-white/60" />
            {/* Bottom-Right Diagonal Ribbon */}
            <div className="absolute -bottom-5 -right-5 w-20 sm:w-24 h-4.5 sm:h-5 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 shadow-md transform -rotate-45 border-y border-white/60" />
          </div>

          {/* Top-Left Pink Ribbon Bow */}
          <div className="pointer-events-none absolute -top-3.5 -left-3.5 z-30 h-12 w-12 drop-shadow-md">
            <svg viewBox="0 0 100 85" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 44 44 Q 28 62 16 78 Q 28 72 36 82 Q 46 64 48 46 Z" fill="#fb7185" />
              <path d="M 56 44 Q 72 62 84 78 Q 72 72 64 82 Q 54 64 52 46 Z" fill="#fb7185" />
              <path d="M 48 40 C 22 18 2 24 8 44 C 14 58 38 46 48 41 Z" fill="#f43f5e" stroke="#fda4af" strokeWidth="2" />
              <path d="M 52 40 C 78 18 98 24 92 44 C 86 58 62 46 52 41 Z" fill="#f43f5e" stroke="#fda4af" strokeWidth="2" />
              <ellipse cx="50" cy="41" rx="8" ry="9" fill="#be123c" stroke="#fda4af" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Top-Right Heart Accent */}
          <div className="pointer-events-none absolute top-1.5 right-1.5 z-20 flex items-center gap-0.5">
            <Heart className="h-4 w-4 text-rose-600 fill-rose-600 drop-shadow-sm" />
            <span className="h-1 w-1 rounded-full bg-amber-400 inline-block" />
          </div>

          {/* Bottom-Left Heart Accent */}
          <div className="pointer-events-none absolute bottom-1.5 left-1.5 z-20 flex items-center gap-0.5">
            <Heart className="h-3 w-3 text-rose-600 fill-rose-600 drop-shadow-sm" />
          </div>

          <div className="relative h-full w-full overflow-hidden rounded-xl border border-neutral-200">
            <Image
              src={photoUrl}
              alt="Completed Beautiful Memory"
              fill
              className="object-cover"
            />
          </div>
          <Sparkles className="absolute top-2 right-2 h-5 w-5 text-champagne-gold animate-spin-slow" />
        </div>

        {/* Action Button: "Unlock Our Beautiful Memories 💕" */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onNext}
          className="btn-romantic group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-base font-semibold text-white shadow-xl cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2">
            Unlock Our Beautiful Memories 💕
            <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          <div className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
        </motion.button>
      </motion.div>
    </div>
  );
}
