'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw, Eye } from 'lucide-react';

interface PuzzleProgressProps {
  completedCount: number;
  totalPieces: number;
  onRestart: () => void;
  onTogglePeek?: () => void;
  isPeeking?: boolean;
}

export function PuzzleProgress({
  completedCount,
  totalPieces,
  onRestart,
  onTogglePeek,
  isPeeking = false,
}: PuzzleProgressProps) {
  const percentage = Math.round((completedCount / totalPieces) * 100);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Progress pill badge */}
      <div className="flex items-center gap-3 rounded-full px-5 py-2 glass-romantic border border-rose-400/30 shadow-lg">
        <Heart className="h-4 w-4 text-rose-400 animate-heart-pulse" fill="currentColor" />
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-rose-100">
          {completedCount} / {totalPieces} Pieces Completed
        </span>

        {/* Mini progress bar */}
        <div className="h-2 w-20 sm:w-24 overflow-hidden rounded-full bg-burgundy-950/70 border border-rose-400/30">
          <motion.div
            initial={false}
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-champagne-gold rounded-full"
          />
        </div>
      </div>

      {/* Control buttons: Peek Hint & Restart */}
      <div className="flex items-center gap-2 pt-1">
        {onTogglePeek && (
          <button
            onClick={onTogglePeek}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium text-rose-200/90 glass-romantic hover:text-white hover:border-rose-400/50 transition-all cursor-pointer"
          >
            <Eye className="h-3 w-3 text-champagne-gold" />
            <span>{isPeeking ? 'Hide Original' : 'Peek Memory'}</span>
          </button>
        )}

        <button
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium text-rose-200/90 glass-romantic hover:text-white hover:border-rose-400/50 transition-all cursor-pointer"
        >
          <RotateCcw className="h-3 w-3 text-rose-400" />
          <span>Restart Puzzle</span>
        </button>
      </div>
    </div>
  );
}
