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
        className="glass-romantic-card relative z-20 mx-auto w-full max-w-xl rounded-3xl p-6 sm:p-9 text-center shadow-2xl"
      >
        {/* Decorative Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-burgundy-deep/70 px-4 py-1.5 text-xs sm:text-sm font-medium text-champagne shadow-inner"
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
          className="mb-3 font-playfair italic text-2xl sm:text-4xl font-semibold tracking-normal text-cream-50 leading-tight text-glow"
        >
          A Little Puzzle Before Our Memories ❤️
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mx-auto mb-6 max-w-md text-xs sm:text-sm font-light text-rose-100/90 leading-relaxed font-sans"
        >
          Every beautiful memory is made of little pieces. Put them together to reveal something special.
        </motion.p>

        {/* Blurred Photo Preview in Ornate Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="relative mx-auto mb-6 h-36 w-36 sm:h-44 sm:w-44 overflow-hidden rounded-2xl border-2 border-rose-300/40 p-1.5 shadow-xl bg-gradient-to-tr from-rose-500/20 to-champagne/15"
        >
          <div className="relative h-full w-full overflow-hidden rounded-xl">
            <Image
              src={photoUrl}
              alt="Mystery Puzzle Photo"
              fill
              className="object-cover filter blur-md scale-110 opacity-70"
            />
            {/* Romantic Overlay with Lock/Puzzle Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-burgundy-950/40 backdrop-blur-[2px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/30 animate-pulse">
                <Puzzle className="h-6 w-6" />
              </div>
              <span className="mt-2 text-[10px] sm:text-xs font-medium tracking-wide uppercase text-champagne-light">
                Mystery Memory
              </span>
            </div>
          </div>
          {/* Subtle Heart Pulsing at Corner */}
          <Heart
            className="absolute -bottom-1 -right-1 h-6 w-6 text-rose-400 animate-heart-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            fill="currentColor"
          />
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
