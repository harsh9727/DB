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

        {/* Completed Photo Preview with Ornate Gold Frame */}
        <div className="relative mx-auto mb-5 h-44 w-44 sm:h-52 sm:w-52 overflow-hidden rounded-2xl border-2 border-champagne-gold shadow-[0_0_25px_rgba(244,63,94,0.5)] p-1 bg-gradient-to-tr from-rose-500/20 to-champagne/20">
          <div className="relative h-full w-full overflow-hidden rounded-xl">
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
