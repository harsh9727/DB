'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Stars, ArrowRight, Music, VolumeX, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { BIRTHDAY_CONFIG } from './config';

interface WelcomeScreenProps {
  onNext?: () => void;
  hasNextStep?: boolean;
}

export function WelcomeScreen({ onNext, hasNextStep = false }: WelcomeScreenProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Trigger romantic celebration confetti burst upon entering
  useEffect(() => {
    const end = Date.now() + 1200;
    const colors = ['#f43f5e', '#fb7185', '#ffe4e6', '#d4af37', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleNextClick = () => {
    if (hasNextStep && onNext) {
      onNext();
    } else {
      // If no further step is defined yet in this phase, display a romantic celebration message
      setShowCelebrationModal(true);
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center px-4 sm:px-6">
      {/* Background Media Container (Local Video / Local Image / Gradient Fallback) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Local Video */}
        {!videoError && (
          <video
            ref={videoRef}
            src={BIRTHDAY_CONFIG.media.welcomeVideo}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-35 scale-105' : 'opacity-0'
              }`}
          />
        )}

        {/* Local Fallback Image */}
        {(!videoLoaded || videoError) && !imageError && (
          <Image
            src={BIRTHDAY_CONFIG.media.welcomeBackground}
            alt="Romantic Welcome Scene"
            fill
            priority
            className="object-cover object-center opacity-30 transition-opacity duration-1000"
            onError={() => setImageError(true)}
          />
        )}

        {/* Multi-layered cinematic lighting & vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-velvet via-burgundy-900/70 to-burgundy-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,63,94,0.22)_0%,_transparent_75%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.12)_0%,_transparent_60%)]" />
      </div>

      {/* Main Glass Content Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-romantic-card relative z-20 mx-auto w-full max-w-2xl rounded-3xl p-6 sm:p-12 text-center shadow-2xl"
      >
        {/* Ambient decorative top badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-burgundy-deep/70 px-4 py-1.5 text-xs sm:text-sm font-medium text-champagne shadow-inner"
        >
          <Sparkles className="h-3.5 w-3.5 text-champagne-gold animate-spin-slow" />
          <span>A Dedicated Celebration For You</span>
          <Stars className="h-3.5 w-3.5 text-champagne-gold" />
        </motion.div>

        {/* Romantic Birthday Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-6 font-playfair italic text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-normal text-cream-50 leading-[1.45] sm:leading-[1.52] lg:leading-[1.58] text-glow"
        >
          {BIRTHDAY_CONFIG.welcomeMessage}
        </motion.h1>

        {/* Ornamental Divider with Heart */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="my-6 flex items-center justify-center gap-3"
        >
          <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-rose-400/50 to-rose-400" />
          <Heart className="h-5 w-5 text-rose-400 animate-heart-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" fill="currentColor" />
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-rose-400/50 to-rose-400" />
          <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-rose-400/50 to-rose-400" />
        </motion.div>

        {/* Emotional Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto max-w-lg text-base sm:text-lg font-light text-rose-100/90 leading-relaxed font-sans"
        >
          {BIRTHDAY_CONFIG.welcomeSubtitle}
        </motion.p>

        {/* CTA Button: "Let's Begin Our Journey ❤️" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.7 }}
          className="mt-8 sm:mt-10 flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNextClick}
            className="btn-romantic group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-xl cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              Let&apos;s Begin Our Journey ❤️
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Romantic Celebration Modal when Next is clicked in Phase 1 */}
      <AnimatePresence>
        {showCelebrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="glass-romantic-card relative max-w-md w-full rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-rose-400/40"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/30">
                <Heart className="h-7 w-7 animate-heart-pulse" fill="currentColor" />
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-cream-50 mb-2">
                Our Journey Has Begun! ❤️
              </h2>

              <p className="text-sm text-rose-100/80 leading-relaxed mb-6 font-light">
                Every chapter with you is a treasure. The upcoming surprises (special messages, photo memories, and our love letter) are being prepared with all my heart.
              </p>

              <button
                onClick={() => setShowCelebrationModal(false)}
                className="btn-romantic w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-lg cursor-pointer"
              >
                Close & Enjoy the Moment ❤️
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
