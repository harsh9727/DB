'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Stars, Puzzle } from 'lucide-react';
import Image from 'next/image';

interface PuzzleIntroProps {
  photoUrl: string;
  onStartGame: () => void;
}

export function PuzzleIntro({ photoUrl, onStartGame }: PuzzleIntroProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-4 sm:px-6">
      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-romantic-card relative z-20 mx-auto w-full max-w-xl rounded-3xl p-6 sm:p-8 text-center shadow-2xl"
      >
        {/* Decorative Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-burgundy-deep/70 px-4 py-1.5 text-xs sm:text-sm font-medium text-champagne shadow-inner"
        >
          <Sparkles className="h-3.5 w-3.5 text-champagne-gold animate-spin-slow" />
          <span>Chapter 4 • Romantic Challenge</span>
          <Stars className="h-3.5 w-3.5 text-champagne-gold" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mb-2 font-playfair italic text-2xl sm:text-4xl font-semibold tracking-normal text-cream-50 leading-tight text-glow"
        >
          A Little Puzzle Before Our Memories ❤️
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mx-auto mb-5 max-w-md text-xs sm:text-sm font-light text-rose-100/90 leading-relaxed font-sans"
        >
          Every beautiful memory is made of little pieces. Put them together to reveal something special.
        </motion.p>

        {/* Blurred Photo Preview in White Gift Box Frame with Pink Ribbon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="relative mx-auto mb-5 w-48 sm:w-60 aspect-[4/3] rounded-2xl border-2 sm:border-[3px] border-white bg-[#fdfcfb] p-2 shadow-2xl"
        >
          {/* Clipped Corner Ribbon Layer */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl z-10">
            {/* Top-Left Diagonal Ribbon */}
            <div className="absolute -top-5 -left-5 w-20 sm:w-24 h-4.5 sm:h-5 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 shadow-md transform -rotate-45 border-y border-white/60" />
            {/* Bottom-Right Diagonal Ribbon */}
            <div className="absolute -bottom-5 -right-5 w-20 sm:w-24 h-4.5 sm:h-5 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 shadow-md transform -rotate-45 border-y border-white/60" />
          </div>

          {/* Top-Left Pink Bow Accent */}
          <div className="pointer-events-none absolute -top-3.5 -left-3.5 z-30 h-10 w-10 sm:h-12 sm:w-12 drop-shadow-md">
            <svg viewBox="0 0 100 85" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 44 44 Q 28 62 16 78 Q 28 72 36 82 Q 46 64 48 46 Z" fill="#fb7185" />
              <path d="M 56 44 Q 72 62 84 78 Q 72 72 64 82 Q 54 64 52 46 Z" fill="#fb7185" />
              <path d="M 48 40 C 22 18 2 24 8 44 C 14 58 38 46 48 41 Z" fill="#fb7185" stroke="#fda4af" strokeWidth="2" />
              <path d="M 52 40 C 78 18 98 24 92 44 C 86 58 62 46 52 41 Z" fill="#fb7185" stroke="#fda4af" strokeWidth="2" />
              <ellipse cx="50" cy="41" rx="8" ry="9" fill="#be123c" />
            </svg>
          </div>

          {/* Top-Right Heart Accent */}
          <div className="pointer-events-none absolute top-1.5 right-1.5 z-20 flex items-center gap-0.5">
            <Heart className="h-3.5 w-3.5 text-rose-600 fill-rose-600 drop-shadow-sm" />
            <span className="h-1 w-1 rounded-full bg-amber-400 inline-block" />
          </div>

          {/* Bottom-Left Heart Accent */}
          <div className="pointer-events-none absolute bottom-1.5 left-1.5 z-20 flex items-center gap-0.5">
            <Heart className="h-3 w-3 text-rose-600 fill-rose-600 drop-shadow-sm" />
          </div>

          {/* Mystery Blurred Photo */}
          <div className="relative h-full w-full overflow-hidden rounded-lg">
            <Image
              src={photoUrl}
              alt="Mystery Puzzle Photo"
              fill
              className="object-cover filter blur-sm scale-105 opacity-75"
            />
            {/* Romantic Overlay with Puzzle Icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-burgundy-950/30 backdrop-blur-[1px]">
              <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/30 animate-pulse">
                <Puzzle className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="mt-1 text-[10px] font-medium tracking-wide uppercase text-champagne-light">
                Mystery Memory
              </span>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onStartGame}
            className="btn-romantic group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg font-semibold text-white shadow-2xl cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Our Little Game 💗
            </span>
            <div className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
