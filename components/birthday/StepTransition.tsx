'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StepTransitionProps {
  stepKey: string | number;
  direction: number; // 1 = forward (slide left), -1 = backward (slide right)
  children: React.ReactNode;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60vw' : '-60vw',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(8px)',
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      x: { type: 'spring', stiffness: 260, damping: 28 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
      filter: { duration: 0.4 },
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction > 0 ? '-60vw' : '60vw',
    opacity: 0,
    scale: 0.95,
    filter: 'blur(8px)',
    transition: {
      x: { type: 'spring', stiffness: 260, damping: 28 },
      opacity: { duration: 0.4 },
      scale: { duration: 0.4 },
      filter: { duration: 0.3 },
    },
  }),
};

export function StepTransition({ stepKey, direction, children }: StepTransitionProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={stepKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
