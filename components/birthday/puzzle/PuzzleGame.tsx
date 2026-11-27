'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import { PuzzlePieceData, PuzzleBoardSlot, PuzzleGameStatus } from '@/lib/puzzle/puzzleTypes';
import {
  createInitialPieces,
  createInitialBoardSlots,
  shufflePieceIds,
  TOTAL_PIECES,
} from '@/lib/puzzle/puzzleUtils';
import { puzzleAudio } from '@/lib/puzzle/puzzleAudio';
import { PuzzleIntro } from './PuzzleIntro';
import { PuzzleBoard } from './PuzzleBoard';
import { PuzzlePiece } from './PuzzlePiece';
import { PuzzleProgress } from './PuzzleProgress';
import { PuzzleCompletion } from './PuzzleCompletion';

interface PuzzleGameProps {
  photoUrl?: string;
  backgroundUrl?: string;
  onNext?: () => void;
  hasNextStep?: boolean;
}

export function PuzzleGame({
  photoUrl = '/images/puzzle-photo.jpg',
  backgroundUrl = '/images/puzzle-background.jpg',
  onNext,
}: PuzzleGameProps) {
  const [status, setStatus] = useState<PuzzleGameStatus>('intro');
  const [pieces, setPieces] = useState<PuzzlePieceData[]>(() => createInitialPieces());
  const [boardSlots, setBoardSlots] = useState<PuzzleBoardSlot[]>(() => createInitialBoardSlots());
  const [trayPieceIds, setTrayPieceIds] = useState<number[]>(() =>
    shufflePieceIds([0, 1, 2, 3, 4, 5, 6, 7, 8])
  );

  // Drag state
  const [draggedPieceId, setDraggedPieceId] = useState<number | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredSlotIndex, setHoveredSlotIndex] = useState<number | null>(null);

  // Tap-to-select accessible state
  const [selectedPieceId, setSelectedPieceId] = useState<number | null>(null);

  // Hint peek state
  const [isPeeking, setIsPeeking] = useState<boolean>(false);

  // Completion sequence state
  const [isAllCompleted, setIsAllCompleted] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  const boardRef = useRef<HTMLDivElement | null>(null);

  // Restart puzzle
  const handleRestart = useCallback(() => {
    const initialPieces = createInitialPieces();
    const initialSlots = createInitialBoardSlots();
    const shuffled = shufflePieceIds([0, 1, 2, 3, 4, 5, 6, 7, 8]);

    setPieces(initialPieces);
    setBoardSlots(initialSlots);
    setTrayPieceIds(shuffled);
    setDraggedPieceId(null);
    setSelectedPieceId(null);
    setHoveredSlotIndex(null);
    setIsAllCompleted(false);
    setShowCompletionModal(false);
    setIsPeeking(false);
  }, []);

  // Check completion whenever slots change
  const completedCount = boardSlots.filter((slot) => slot.placedPieceId !== null).length;

  // Handle successful piece placement
  const placePieceIntoSlot = useCallback(
    (pieceId: number, slotIndex: number) => {
      // Validate correct match
      if (pieceId !== slotIndex) {
        puzzleAudio.playMismatch();
        setSelectedPieceId(null);
        return false;
      }

      // Check slot not occupied
      if (boardSlots[slotIndex].placedPieceId !== null) {
        puzzleAudio.playMismatch();
        setSelectedPieceId(null);
        return false;
      }

      // Snap piece into slot!
      puzzleAudio.playSnap();

      setPieces((prev) =>
        prev.map((p) =>
          p.id === pieceId ? { ...p, currentSlotIndex: slotIndex, isPlacedCorrectly: true } : p
        )
      );

      setBoardSlots((prev) =>
        prev.map((slot) =>
          slot.index === slotIndex ? { ...slot, placedPieceId: pieceId } : slot
        )
      );

      setTrayPieceIds((prev) => prev.filter((id) => id !== pieceId));
      setSelectedPieceId(null);

      // Check if this was the last remaining piece
      const newCompletedCount = completedCount + 1;
      if (newCompletedCount === TOTAL_PIECES) {
        setIsAllCompleted(true);
        puzzleAudio.playCelebration();

        // Confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#ffe4e6', '#d4af37', '#ffffff'],
        });

        // Reveal complete modal after brief pause
        setTimeout(() => {
          setShowCompletionModal(true);
        }, 1200);
      }

      return true;
    },
    [boardSlots, completedCount]
  );

  // Pointer drag start
  const handlePointerDownPiece = (e: React.PointerEvent, pieceId: number) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setDraggedPieceId(pieceId);
    setSelectedPieceId(pieceId);
    setDragPointerPos({ x: e.clientX, y: e.clientY });
  };

  // Pointer move global tracking
  useEffect(() => {
    if (draggedPieceId === null) return;

    const handlePointerMove = (e: PointerEvent) => {
      setDragPointerPos({ x: e.clientX, y: e.clientY });

      // Hit test board slots
      if (boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        if (
          e.clientX >= boardRect.left &&
          e.clientX <= boardRect.right &&
          e.clientY >= boardRect.top &&
          e.clientY <= boardRect.bottom
        ) {
          // Inside board: find specific slot
          const slotElements = boardRef.current.querySelectorAll('[data-slot-index]');
          let foundSlot: number | null = null;

          slotElements.forEach((el) => {
            const rect = el.getBoundingClientRect();
            if (
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom
            ) {
              const idx = parseInt(el.getAttribute('data-slot-index') || '-1', 10);
              if (idx >= 0 && boardSlots[idx].placedPieceId === null) {
                foundSlot = idx;
              }
            }
          });

          setHoveredSlotIndex(foundSlot);
          return;
        }
      }

      setHoveredSlotIndex(null);
    };

    const handlePointerUp = () => {
      if (hoveredSlotIndex !== null) {
        placePieceIntoSlot(draggedPieceId, hoveredSlotIndex);
      } else {
        // Released outside: play mismatch if it was dragged onto wrong area
        setSelectedPieceId(null);
      }

      setDraggedPieceId(null);
      setHoveredSlotIndex(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [draggedPieceId, hoveredSlotIndex, boardSlots, placePieceIntoSlot]);

  // Tap-to-select accessible piece placement
  const handleSlotClick = (slotIndex: number) => {
    if (selectedPieceId !== null) {
      placePieceIntoSlot(selectedPieceId, slotIndex);
    }
  };

  const handleTrayPieceClick = (pieceId: number) => {
    if (selectedPieceId === pieceId) {
      setSelectedPieceId(null); // toggle off
    } else {
      setSelectedPieceId(pieceId);
    }
  };

  const handleUnlockMemories = () => {
    setShowCompletionModal(false);
    if (onNext) {
      onNext();
    }
  };

  // 1. Intro Screen
  if (status === 'intro') {
    return (
      <div className="relative h-full w-full overflow-hidden select-none">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundUrl}
            alt="Puzzle Background"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-velvet via-burgundy-900/85 to-burgundy-950/90" />
        </div>

        <PuzzleIntro photoUrl={photoUrl} onStartGame={() => setStatus('playing')} />
      </div>
    );
  }

  // 2. Active Puzzle Game Screen
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden px-4 py-4 sm:px-6 sm:py-6 select-none">
      {/* Background with Ambient Romantic Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src={backgroundUrl}
          alt="Puzzle Background"
          fill
          priority
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-velvet via-burgundy-900/85 to-burgundy-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.18)_0%,_transparent_70%)]" />
      </div>

      {/* Top Header Section */}
      <div className="relative z-10 flex flex-col items-center pt-8 sm:pt-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-playfair italic text-xl sm:text-2xl font-bold text-cream-50 text-glow"
        >
          Let&apos;s Complete This Memory ❤️
        </motion.h2>
        <p className="text-xs sm:text-sm font-light text-rose-200/85 mt-0.5">
          Drag each piece into its correct place.
        </p>
      </div>

      {/* Center 3x3 Puzzle Board */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center">
        <PuzzleBoard
          ref={boardRef}
          slots={boardSlots}
          pieces={pieces}
          photoUrl={photoUrl}
          hoveredSlotIndex={hoveredSlotIndex}
          isAllCompleted={isAllCompleted}
          onSlotClick={handleSlotClick}
        />

        {/* Peek Original Image Overlay Modal */}
        <AnimatePresence>
          {isPeeking && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setIsPeeking(false)}
              className="absolute z-30 flex flex-col items-center justify-center rounded-2xl bg-burgundy-950/90 p-3 shadow-2xl border border-champagne-gold/60 backdrop-blur-md cursor-pointer"
            >
              <div className="relative h-48 w-48 sm:h-56 sm:w-56 overflow-hidden rounded-xl">
                <Image src={photoUrl} alt="Original Reference" fill className="object-cover" />
              </div>
              <span className="text-[11px] text-rose-200/80 mt-2">Tap anywhere to close peek</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Shuffled Pieces Tray & Progress */}
      <div className="relative z-10 flex flex-col items-center pb-3 sm:pb-5 gap-2.5">
        {/* Shuffled Pieces Tray */}
        <div className="flex w-full max-w-md items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto rounded-2xl p-2 sm:p-2.5 glass-romantic border border-rose-400/30 shadow-xl min-h-[64px] sm:min-h-[72px]">
          {trayPieceIds.length > 0 ? (
            trayPieceIds.map((id) => (
              <PuzzlePiece
                key={id}
                piece={pieces[id]}
                photoUrl={photoUrl}
                isDragging={draggedPieceId === id}
                isSelected={selectedPieceId === id}
                onPointerDown={(e) => handlePointerDownPiece(e, id)}
                onClick={() => handleTrayPieceClick(id)}
                className="h-12 w-12 sm:h-14 sm:w-14 aspect-square flex-shrink-0"
              />
            ))
          ) : (
            <div className="flex items-center gap-2 py-1 text-xs text-rose-200/70 italic">
              <span>All pieces have found their place! ✨</span>
            </div>
          )}
        </div>

        {/* Progress & Controls */}
        <PuzzleProgress
          completedCount={completedCount}
          totalPieces={TOTAL_PIECES}
          onRestart={handleRestart}
          onTogglePeek={() => setIsPeeking((prev) => !prev)}
          isPeeking={isPeeking}
        />
      </div>

      {/* Floating Dragged Piece Preview following pointer */}
      {draggedPieceId !== null && (
        <div
          style={{
            position: 'fixed',
            left: `${dragPointerPos.x}px`,
            top: `${dragPointerPos.y}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <PuzzlePiece
            piece={pieces[draggedPieceId]}
            photoUrl={photoUrl}
            isDragging={true}
            className="h-20 w-20 sm:h-24 sm:w-24 aspect-square shadow-2xl ring-2 ring-rose-400 scale-110"
          />
        </div>
      )}

      {/* Completion Modal when All 9 Pieces Solved */}
      <AnimatePresence>
        {showCompletionModal && (
          <PuzzleCompletion photoUrl={photoUrl} onNext={handleUnlockMemories} />
        )}
      </AnimatePresence>
    </div>
  );
}
