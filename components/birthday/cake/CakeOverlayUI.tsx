'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Wind, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { CakeStage } from './CakeCanvas';

interface CakeOverlayUIProps {
  stage: CakeStage;
  onLightCandles: () => void;
  onBlowCandles: () => void;
  onPickUpKnife: () => void;
  onCutCake?: () => void;
  onNextStep?: () => void;
  hasNextStep?: boolean;
}

export function CakeOverlayUI({
  stage,
  onLightCandles,
  onBlowCandles,
  onPickUpKnife,
  onCutCake,
  onNextStep,
}: CakeOverlayUIProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Floating Instruction Badge */}
      <div className="flex justify-center pt-8 sm:pt-10">
        <AnimatePresence mode="wait">
          {stage === 'UNLIT' && (
            <motion.div
              key="unlit-msg"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-romantic inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-medium text-rose-100 shadow-lg"
            >
              <Heart className="h-4 w-4 text-rose-400 animate-heart-pulse" fill="currentColor" />
              <span>Before we cut the cupcake, let&apos;s make a wish! ❤️</span>
            </motion.div>
          )}

          {stage === 'LIT' && (
            <motion.div
              key="lit-msg"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-romantic inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-medium text-champagne shadow-lg border border-champagne/30"
            >
              <Sparkles className="h-4 w-4 text-champagne-gold animate-sparkle" />
              <span>Watch the fireworks! Close your eyes & make a wish... ✨</span>
            </motion.div>
          )}

          {(stage === 'BLOWN' || stage === 'KNIFE_READY' || stage === 'CUTTING') && (
            <motion.div
              key="cut-msg"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-romantic inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-medium text-rose-100 shadow-lg"
            >
              <Heart className="h-4 w-4 text-rose-400" fill="currentColor" />
              <span>Your wish is now in the universe! Now let&apos;s cut your cupcake! 🧁</span>
            </motion.div>
          )}

          {stage === 'CELEBRATION' && (
            <motion.div
              key="celebration-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-romantic inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold text-champagne-light shadow-xl border border-rose-400/40"
            >
              <Sparkles className="h-4 w-4 text-champagne-gold animate-spin-slow" />
              <span>Your first birthday cupcake slice is ready! ❤️</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Interactive Controls Panel */}
      <div className="flex flex-col items-center pb-8 sm:pb-12 md:pb-14">
        <AnimatePresence mode="wait">
          {/* Interaction 1: Light the Sparkler */}
          {stage === 'UNLIT' && (
            <motion.button
              key="btn-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onLightCandles}
              className="pointer-events-auto btn-romantic group relative flex items-center gap-2.5 overflow-hidden rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg font-semibold text-white shadow-2xl cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-champagne-gold animate-sparkle" />
              <span>Light the Sparkler ✨</span>
            </motion.button>
          )}

          {/* Interaction 2: Blow/Extinguish the Sparkler */}
          {stage === 'LIT' && (
            <motion.button
              key="btn-blow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onBlowCandles}
              className="pointer-events-auto btn-romantic group relative flex items-center gap-2.5 overflow-hidden rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg font-semibold text-white shadow-2xl cursor-pointer"
            >
              <Wind className="h-5 w-5 text-rose-200" />
              <span>Make a Wish & Blow the Sparkler 💗</span>
            </motion.button>
          )}

          {/* Interaction 3: Pick up knife */}
          {stage === 'BLOWN' && (
            <motion.div
              key="btn-knife-pickup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center gap-1.5"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onPickUpKnife}
                className="pointer-events-auto btn-romantic group relative flex items-center gap-2.5 overflow-hidden rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg font-semibold text-white shadow-2xl cursor-pointer"
              >
                <span>Pick Up the Cake Knife 🎂</span>
              </motion.button>
              <p className="text-xs text-rose-200/80 font-light">
                Click to hold the knife and prepare the cut
              </p>
            </motion.div>
          )}

          {/* Interaction 4: Drag knife down to cut */}
          {(stage === 'KNIFE_READY' || stage === 'CUTTING') && (
            <motion.div
              key="btn-knife-cutting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center gap-1.5"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onCutCake}
                className="pointer-events-auto btn-romantic group relative flex items-center gap-2.5 overflow-hidden rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg font-semibold text-white shadow-2xl cursor-pointer"
              >
                <span>Drag Down to Cut the Cupcake 🧁</span>
                <div className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              </motion.button>
              <p className="text-xs text-rose-200/80 font-light animate-pulse">
                Click the button or drag the knife down to cut
              </p>
            </motion.div>
          )}

          {/* Interaction 5: Celebration & Continue */}
          {stage === 'CELEBRATION' && (
            <motion.div
              key="btn-celebrate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onNextStep}
                className="pointer-events-auto btn-romantic group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-base sm:text-lg font-semibold text-white shadow-2xl cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Continue Our Surprise 💕
                  <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
