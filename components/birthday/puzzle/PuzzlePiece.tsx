'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Check } from 'lucide-react';
import { PuzzlePieceData } from '@/lib/puzzle/puzzleTypes';

interface PuzzlePieceProps {
  piece: PuzzlePieceData;
  photoUrl: string;
  className?: string;
  isDragging?: boolean;
  isSelected?: boolean;
  isLocked?: boolean;
  showPlacedIndicator?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onClick?: () => void;
}

export function PuzzlePiece({
  piece,
  photoUrl,
  className = '',
  isDragging = false,
  isSelected = false,
  isLocked = false,
  showPlacedIndicator = false,
  onPointerDown,
  onClick,
}: PuzzlePieceProps) {
  return (
    <motion.div
      layout={!isDragging}
      initial={false}
      animate={{
        scale: isDragging ? 1.08 : isSelected ? 1.05 : 1,
        opacity: isDragging ? 0.95 : 1,
      }}
      transition={{ duration: 0.2 }}
      onPointerDown={onPointerDown}
      onClick={onClick}
      style={{
        backgroundImage: `url("${photoUrl}")`,
        backgroundSize: '300% 300%',
        backgroundPosition: `${piece.bgPositionX} ${piece.bgPositionY}`,
        backgroundRepeat: 'no-repeat',
        touchAction: isLocked ? 'auto' : 'none',
      }}
      className={`relative select-none overflow-hidden rounded-lg aspect-[4/3] transition-shadow duration-200 ${
        isLocked
          ? 'border border-white/40 shadow-sm cursor-default pointer-events-none'
          : isSelected
          ? 'border-2 border-rose-400 ring-2 ring-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.6)] cursor-pointer'
          : 'border border-white/60 shadow-md hover:border-rose-300 hover:shadow-lg cursor-grab active:cursor-grabbing bg-white/20'
      } ${className}`}
    >
      {/* Placed checkmark or heart indicator badge */}
      {showPlacedIndicator && isLocked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500/85 text-white shadow-sm"
        >
          <Check className="h-2 w-2 stroke-[3]" />
        </motion.div>
      )}

      {/* Selected indicator badge */}
      {isSelected && !isLocked && (
        <div className="absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-champagne-gold text-burgundy-950 shadow-sm animate-pulse">
          <Heart className="h-2 w-2" fill="currentColor" />
        </div>
      )}

      {/* Tactile puzzle piece shine & embossed bevel */}
      <div className="pointer-events-none absolute inset-0 border-t border-l border-white/30 rounded-lg" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15" />
    </motion.div>
  );
}
