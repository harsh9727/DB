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

/**
 * Romantic Silky Ribbon Bow Component for Top-Left Corner
 */
function RibbonBow() {
  return (
    <div className="pointer-events-none absolute -top-4 -left-4 sm:-top-5 sm:-left-5 z-30 h-16 w-16 sm:h-20 sm:w-20 drop-shadow-[0_4px_8px_rgba(76,5,25,0.45)]">
      <svg viewBox="0 0 100 85" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="45%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="ribbonShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f43f5e" />
          </linearGradient>
        </defs>

        {/* Left Ribbon Tail */}
        <path
          d="M 44 44 Q 28 62 16 78 Q 28 72 36 82 Q 46 64 48 46 Z"
          fill="url(#bowGrad)"
        />
        {/* Right Ribbon Tail */}
        <path
          d="M 56 44 Q 72 62 84 78 Q 72 72 64 82 Q 54 64 52 46 Z"
          fill="url(#bowGrad)"
        />

        {/* Left Bow Loop */}
        <path
          d="M 48 40 C 22 18 2 24 8 44 C 14 58 38 46 48 41 Z"
          fill="url(#bowGrad)"
          stroke="url(#ribbonShine)"
          strokeWidth="1.2"
        />
        {/* Right Bow Loop */}
        <path
          d="M 52 40 C 78 18 98 24 92 44 C 86 58 62 46 52 41 Z"
          fill="url(#bowGrad)"
          stroke="url(#ribbonShine)"
          strokeWidth="1.2"
        />

        {/* Center Knot with Soft Highlight */}
        <ellipse
          cx="50"
          cy="41"
          rx="7.5"
          ry="8.5"
          fill="#be123c"
          stroke="#fda4af"
          strokeWidth="1.2"
        />
        <circle cx="48" cy="38" r="2.5" fill="#fbcfe8" opacity="0.6" />
      </svg>
    </div>
  );
}

export const PuzzleBoard = React.forwardRef<HTMLDivElement, PuzzleBoardProps>(
  function PuzzleBoard(
    { slots, pieces, photoUrl, hoveredSlotIndex, isAllCompleted, onSlotClick },
    ref
  ) {
    return (
      <div className="relative mx-auto flex items-center justify-center p-2">
        {/* Romantic White Picture Frame / Gift Box (matching reference photo) */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#fdfcfb] p-3 sm:p-4 shadow-[0_22px_55px_rgba(0,0,0,0.6),0_6px_18px_rgba(0,0,0,0.35)] border-2 sm:border-[3px] border-white ring-1 ring-black/10">
          {/* Clipped Corner Ribbon Layer (prevents any ribbon from overflowing outside the frame) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl z-10">
            {/* Top-Left Diagonal Ribbon Band */}
            <div className="absolute -top-7 -left-7 sm:-top-8 sm:-left-8 w-28 sm:w-36 h-6 sm:h-7.5 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 shadow-md transform -rotate-45 border-y border-white/60 flex items-center justify-center">
              <div className="w-full h-[1px] bg-white/40" />
            </div>

            {/* Bottom-Right Diagonal Ribbon Band (neatly wrapped around the corner, zero protrusion) */}
            <div className="absolute -bottom-7 -right-7 sm:-bottom-8 sm:-right-8 w-28 sm:w-36 h-6 sm:h-7.5 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 shadow-md transform -rotate-45 border-y border-white/60 flex items-center justify-center">
              <div className="w-full h-[1px] bg-white/40" />
            </div>
          </div>

          {/* Top-Left Silky Ribbon Bow (anchored directly over the diagonal ribbon band) */}
          <RibbonBow />

          {/* Top-Right 3D Red Heart & Golden Confetti Accent (positioned cleanly on the white frame rim) */}
          <div className="pointer-events-none absolute top-2 right-2.5 sm:top-2.5 sm:right-3 z-20 flex items-center gap-1">
            <div className="relative">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600 fill-rose-600 drop-shadow-[0_2px_4px_rgba(190,18,60,0.6)] transform rotate-12" />
              <div className="absolute top-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-white/50 blur-[0.3px]" />
            </div>
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-400 shadow-[0_1px_2px_rgba(0,0,0,0.3)] inline-block" />
            <span className="h-1 w-1 rounded-full bg-amber-300 opacity-80 inline-block -ml-0.5 mt-2" />
          </div>

          {/* Bottom-Left 3D Red Heart & Golden Confetti Accent (positioned cleanly on the white frame rim) */}
          <div className="pointer-events-none absolute bottom-2 left-2.5 sm:bottom-2.5 sm:left-3 z-20 flex items-center gap-1">
            <div className="relative">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600 fill-rose-600 drop-shadow-[0_2px_4px_rgba(190,18,60,0.6)] transform -rotate-12" />
              <div className="absolute top-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-white/50 blur-[0.3px]" />
            </div>
            <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-rose-500 fill-rose-500 drop-shadow-xs" />
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-amber-400 shadow-[0_1px_2px_rgba(0,0,0,0.3)] inline-block ml-0.5" />
          </div>

          {/* Inner Photo Mat / Bevel Frame */}
          <div className="relative rounded-xl sm:rounded-2xl p-0.5 sm:p-1 bg-[#efe7dc] shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)] border border-neutral-300/80">
            {/* Inner 3x3 Puzzle Board Grid (Clean canvas without blur hint image) */}
            <div
              ref={ref}
              data-puzzle-board="true"
              className="relative grid grid-cols-3 grid-rows-3 gap-1 sm:gap-1.5 p-1 rounded-lg sm:rounded-xl bg-[#faf6f0] aspect-[4/3] w-[290px] sm:w-[360px] md:w-[410px] overflow-hidden shadow-inner"
            >
            {/* 9 Puzzle Slots */}
            {slots.map((slot) => {
              const placedPiece = slot.placedPieceId !== null ? pieces[slot.placedPieceId] : null;
              const isHovered = hoveredSlotIndex === slot.index;

              return (
                <div
                  key={slot.index}
                  data-slot-index={slot.index}
                  onClick={() => onSlotClick && onSlotClick(slot.index)}
                  className={`relative flex items-center justify-center overflow-hidden rounded-lg aspect-[4/3] transition-all duration-200 ${
                    placedPiece
                      ? 'shadow-sm z-10'
                      : isHovered
                      ? 'border-2 border-rose-500 bg-rose-400/30 shadow-[0_0_14px_rgba(244,63,94,0.5)] scale-[1.03] z-20'
                      : 'border border-dashed border-rose-300/60 bg-white/80 hover:border-rose-400/80 hover:bg-rose-50/70 cursor-pointer shadow-[inset_0_1px_3px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  {placedPiece ? (
                    <PuzzlePiece
                      piece={placedPiece}
                      photoUrl={photoUrl}
                      isLocked={true}
                      showPlacedIndicator={!isAllCompleted}
                      className="h-full w-full rounded-md"
                    />
                  ) : (
                    /* Clean slot number & heart watermark */
                    <div className="pointer-events-none flex flex-col items-center justify-center opacity-45">
                      <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500" />
                      <span className="text-[10px] font-mono font-bold text-rose-800/80 mt-0.5">
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
                  className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl sm:rounded-2xl border-2 border-champagne-gold shadow-[0_0_35px_rgba(244,63,94,0.6)]"
                  style={{
                    backgroundImage: `url("${photoUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Subtle golden shimmer shine */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-transparent to-champagne/25" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
);
