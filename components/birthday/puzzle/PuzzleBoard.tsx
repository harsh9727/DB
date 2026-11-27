'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { PuzzlePieceData, PuzzleBoardSlot } from '@/lib/puzzle/puzzleTypes';
import { PuzzlePiece } from './PuzzlePiece';

interface PuzzleBoardProps {
  slots: PuzzleBoardSlot[];
  pieces: PuzzlePieceData[];
  photoUrl: string;
  hoveredSlotIndex: number | null;
  isAllCompleted: boolean;
  onSlotClick?: (slotIndex: number) => void;
}

export const PuzzleBoard = React.forwardRef<HTMLDivElement, PuzzleBoardProps>(
  function PuzzleBoard(
    { slots, pieces, photoUrl, hoveredSlotIndex, isAllCompleted, onSlotClick },
    ref
  ) {
    return (
      <div className="relative mx-auto flex items-center justify-center">
        {/* 3x3 Puzzle Board Grid */}
        <div
          ref={ref}
          data-puzzle-board="true"
          className="relative grid grid-cols-3 grid-rows-3 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-burgundy-950/70 border-2 border-rose-400/35 shadow-2xl backdrop-blur-md aspect-square w-[280px] sm:w-[330px] md:w-[360px]"
        >
        {slots.map((slot) => {
          const placedPiece = slot.placedPieceId !== null ? pieces[slot.placedPieceId] : null;
          const isHovered = hoveredSlotIndex === slot.index;

          return (
            <div
              key={slot.index}
              data-slot-index={slot.index}
              onClick={() => onSlotClick && onSlotClick(slot.index)}
              className={`relative flex items-center justify-center overflow-hidden rounded-xl aspect-square transition-all duration-200 ${
                placedPiece
                  ? ''
                  : isHovered
                  ? 'border-2 border-rose-400 bg-rose-500/25 shadow-[0_0_16px_rgba(244,63,94,0.5)] scale-[1.02]'
                  : 'border border-dashed border-rose-300/25 bg-burgundy-900/40 hover:border-rose-400/40 hover:bg-rose-950/40'
              }`}
            >
              {placedPiece ? (
                <PuzzlePiece
                  piece={placedPiece}
                  photoUrl={photoUrl}
                  isLocked={true}
                  showPlacedIndicator={!isAllCompleted}
                  className="h-full w-full"
                />
              ) : (
                /* Empty slot placeholder */
                <div className="pointer-events-none flex flex-col items-center justify-center opacity-30">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-300" />
                  <span className="text-[10px] font-mono text-rose-200/60 mt-0.5">
                    {slot.index + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Seamless Full Photo Reveal upon All Completed */}
        <AnimatePresence>
          {isAllCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-champagne-gold shadow-[0_0_35px_rgba(244,63,94,0.6)]"
              style={{
                backgroundImage: `url("${photoUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Golden shimmer shine over full photograph */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-transparent to-champagne/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
