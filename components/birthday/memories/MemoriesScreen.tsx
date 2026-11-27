'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Stars, Camera, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface MemoriesScreenProps {
  onNext?: () => void;
  hasNextStep?: boolean;
}

export function MemoriesScreen({ onNext, hasNextStep = false }: MemoriesScreenProps) {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-4 sm:px-6 select-none">
      {/* Background with Ambient Romantic Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/welcome-bg.jpg"
          alt="Memories Background"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-velvet via-burgundy-900/85 to-burgundy-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.2)_0%,_transparent_70%)]" />
      </div>

      {/* Main Glass Gateway Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="glass-romantic-card relative z-20 mx-auto w-full max-w-xl rounded-3xl p-7 sm:p-10 text-center shadow-2xl"
      >
        {/* Decorative Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-burgundy-deep/70 px-4 py-1.5 text-xs sm:text-sm font-medium text-champagne shadow-inner"
        >
          <Sparkles className="h-3.5 w-3.5 text-champagne-gold animate-spin-slow" />
          <span>Chapter 5 • Unlocked</span>
          <Stars className="h-3.5 w-3.5 text-champagne-gold" />
        </motion.div>

        {/* Floating Camera / Heart Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/30">
          <Camera className="h-8 w-8" />
        </div>

        {/* Heading */}
        <h1 className="mb-3 font-playfair italic text-3xl sm:text-4xl font-semibold tracking-normal text-cream-50 leading-tight text-glow">
          Our Beautiful Memories ❤️
        </h1>

        {/* Ornamental Divider */}
        <div className="my-4 flex items-center justify-center gap-3">
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-rose-400/50 to-rose-400" />
          <Heart className="h-4.5 w-4.5 text-rose-400 animate-heart-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" fill="currentColor" />
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-rose-400/50 to-rose-400" />
        </div>

        {/* Subtitle */}
        <p className="mx-auto mb-6 max-w-md text-sm sm:text-base font-light text-rose-100/90 leading-relaxed font-sans">
          You solved the puzzle and revealed the first memory! A collection of our sweetest moments, heartfelt photographs, and cherished memories is waiting right here.
        </p>

        {/* Placeholder indication or next trigger */}
        {hasNextStep && onNext ? (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className="btn-romantic group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-base font-semibold text-white shadow-xl cursor-pointer"
          >
            <span>Continue Our Journey ❤️</span>
            <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 glass-romantic border border-rose-400/30 text-xs sm:text-sm font-medium text-rose-200">
            <Heart className="h-4 w-4 text-rose-400 animate-heart-pulse" fill="currentColor" />
            <span>Chapter 5 – Our Beautiful Memories is now officially unlocked! ✨</span>
          </div>
        )}
      </motion.div>
    </div>
  );
}
