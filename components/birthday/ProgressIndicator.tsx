'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart } from 'lucide-react';
import { StepDefinition } from './types';

interface ProgressIndicatorProps {
  steps: StepDefinition[];
  currentIndex: number;
  onBack?: () => void;
  canGoBack: boolean;
}

export function ProgressIndicator({
  steps,
  currentIndex,
  onBack,
  canGoBack,
}: ProgressIndicatorProps) {
  return (
    <div className="fixed top-4 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
      {/* Back button */}
      <div className="w-24">
        {canGoBack && onBack && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-rose-200/90 glass-romantic hover:text-white hover:border-rose-400/40 transition-colors"
            aria-label="Previous step"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </motion.button>
        )}
      </div>

      {/* Center step indicator */}
      <div className="pointer-events-auto flex items-center gap-2 rounded-full px-4 py-1.5 glass-romantic">
        <Heart className="h-3.5 w-3.5 text-rose-400 animate-pulse" fill="currentColor" />
        <div className="flex items-center gap-1.5">
          {steps.map((step, idx) => {
            const isActive = idx === currentIndex;
            const isCompleted = idx < currentIndex;

            return (
              <motion.div
                key={step.id}
                initial={false}
                animate={{
                  width: isActive ? 24 : 8,
                  backgroundColor: isActive
                    ? '#f43f5e'
                    : isCompleted
                    ? '#fb7185'
                    : 'rgba(255, 255, 255, 0.25)',
                }}
                className="h-2 rounded-full transition-all duration-500 shadow-sm"
                title={step.title}
              />
            );
          })}
        </div>
        <span className="ml-1 text-[11px] font-medium tracking-wider text-rose-200/80 uppercase">
          {currentIndex + 1} / {steps.length}
        </span>
      </div>

      {/* Right spacer for symmetry */}
      <div className="w-24 flex justify-end" />
    </div>
  );
}
