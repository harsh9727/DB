'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, EyeOff, Sparkles, KeyRound, AlertCircle, HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { BIRTHDAY_CONFIG } from './config';
import { validateRomanticPassword } from './passwordValidator';

interface PasswordScreenProps {
  onSuccess: () => void;
}

export function PasswordScreen({ onSuccess }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateRomanticPassword(password);

    if (result.isValid) {
      setError(null);
      onSuccess();
    } else {
      setError(result.message || 'Incorrect passcode. Try again ❤️');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center px-4 sm:px-6">
      {/* Background with local image & gradient overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!imageError && (
          <Image
            src={BIRTHDAY_CONFIG.media.passwordBackground}
            alt="Romantic Background"
            fill
            priority
            className="object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
            onError={() => setImageError(true)}
          />
        )}
        {/* Cinematic romantic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-velvet via-burgundy-900/85 to-burgundy-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.18)_0%,_transparent_70%)]" />
      </div>

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: isShaking ? [-12, 12, -9, 9, -4, 4, 0] : 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
          x: { duration: 0.5 },
        }}
        className="glass-romantic-card relative z-20 w-full max-w-[520px] rounded-3xl p-7 sm:p-11 shadow-2xl"
      >
        {/* Soft Ambient Corner Glows */}
        <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-rose-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-champagne-gold/15 blur-2xl" />

        <div className="relative flex flex-col items-center text-center">
          {/* Animated Heart Icon Badge */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Glowing Ring */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute h-20 w-20 rounded-full bg-gradient-to-r from-rose-500/30 to-pink-500/20 blur-md"
            />
            {/* Core Heart Circle */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-rose-400 shadow-lg shadow-rose-600/40 ring-1 ring-white/30">
              <Heart
                className="h-8 w-8 text-white animate-heart-pulse drop-shadow-md"
                fill="currentColor"
              />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-champagne-light animate-sparkle" />
            </div>
          </div>

          {/* Romantic Heading in One Single Line */}
          <h1 className="mb-2 font-serif text-xl sm:text-2xl md:text-[28px] font-bold tracking-tight text-cream-50 text-glow whitespace-nowrap">
            {BIRTHDAY_CONFIG.romanticTitle}
          </h1>

          {/* Romantic Subtitle */}
          <p className="mb-8 text-sm sm:text-base font-light text-rose-100/80 leading-relaxed">
            Something special has been created just for you.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="relative">
              <label htmlFor="surprise-password" className="sr-only">
                Secret Passcode
              </label>

              {/* Leading Icon */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 sm:pl-5 text-rose-300/70">
                <KeyRound className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>

              {/* Password Input with increased pixels */}
              <input
                id="surprise-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleInputChange}
                placeholder="Enter secret passcode..."
                autoComplete="off"
                autoFocus
                className="glass-input h-14 sm:h-16 w-full rounded-2xl pl-12 sm:pl-14 pr-12 sm:pr-14 text-base sm:text-lg text-cream-50 placeholder-rose-200/40 outline-none focus:ring-2 focus:ring-rose-400/50"
              />

              {/* Show / Hide Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-5 text-rose-200/60 hover:text-rose-100 transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>

            {/* Error Message with Romantic Theme */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-rose-950/70 border border-rose-500/40 px-4 py-2.5 text-xs sm:text-sm text-rose-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit CTA Button with matching rounded-full radius */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-romantic group relative flex h-14 sm:h-16 w-full items-center justify-center gap-2.5 overflow-hidden rounded-full text-base sm:text-lg font-bold text-white shadow-xl cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Unlock My Surprise
                <Heart className="h-5 w-5 sm:h-6 sm:w-6 fill-current transition-transform duration-300 group-hover:scale-125" />
              </span>
              {/* Shimmer sweep animation */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            </motion.button>
          </form>

          {/* Gentle Hint Toggle */}
          <div className="mt-6 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="inline-flex items-center gap-1.5 text-xs text-rose-300/70 hover:text-rose-200 transition-colors cursor-pointer"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{showHint ? 'Hide hint' : 'Need a little hint?'}</span>
            </button>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-xs italic text-champagne font-serif"
                >
                  {BIRTHDAY_CONFIG.passwordHint}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
