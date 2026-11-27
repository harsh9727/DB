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
        opacity: isDragging ? 0.92 : 1,
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
      className={`relative select-none overflow-hidden rounded-xl border transition-shadow duration-200 ${
        isLocked
          ? 'border-rose-300/40 shadow-md cursor-default pointer-events-none'
          : isSelected
          ? 'border-champagne-gold ring-2 ring-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.55)] cursor-pointer'
          : 'border-white/20 shadow-md hover:border-rose-300/50 hover:shadow-lg cursor-grab active:cursor-grabbing'
      } ${className}`}
    >
      {/* Placed checkmark or heart indicator badge */}
      {showPlacedIndicator && isLocked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500/80 text-white shadow-sm backdrop-blur-xs"
        >
          <Check className="h-2.5 w-2.5 stroke-[3]" />
        </motion.div>
      )}

      {/* Selected indicator badge */}
      {isSelected && !isLocked && (
        <div className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-champagne-gold/90 text-burgundy-950 shadow-sm animate-pulse">
          <Heart className="h-2.5 w-2.5" fill="currentColor" />
        </div>
      )}

      {/* Delicate inner shine */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/10" />
    </motion.div>
  );
}
