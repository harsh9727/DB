'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { CakeStage } from './CakeCanvas';
import { CakeOverlayUI } from './CakeOverlayUI';
import { cakeAudio } from './cakeAudio';

// Dynamically import the 3D Canvas with ssr: false to prevent SSR hydration mismatches
const CakeCanvas = dynamic(
  () => import('./CakeCanvas').then((mod) => mod.CakeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center text-center">
        <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-2 border-rose-400/30 border-t-rose-500 animate-spin" />
          <span className="text-xl">🧁</span>
        </div>
        <p className="font-serif text-sm italic text-rose-200/80 animate-pulse">
          Baking your 3D birthday cupcake with love... ✨
        </p>
      </div>
    ),
  }
);

interface CakeCuttingScreenProps {
  onNext?: () => void;
  hasNextStep?: boolean;
}

export function CakeCuttingScreen({ onNext, hasNextStep = false }: CakeCuttingScreenProps) {
  const [stage, setStage] = useState<CakeStage>('UNLIT');
  const [showNextModal, setShowNextModal] = useState(false);

  const handleLightCandles = () => {
    cakeAudio.playCandleLighting().catch(() => {});
    setStage('LIT');
  };

  const handleBlowCandles = () => {
    cakeAudio.playCandleBlowing().catch(() => {});
    setStage('BLOWN');
  };

  const handlePickUpKnife = () => {
    setStage('KNIFE_READY');
  };

  const handleCutComplete = () => {
    setStage('CELEBRATION');

    // Trigger celebratory confetti burst
    const end = Date.now() + 1500;
    const colors = ['#f43f5e', '#fb7185', '#ffe4e6', '#d4af37', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleNextStep = () => {
    if (hasNextStep && onNext) {
      onNext();
    } else {
      setShowNextModal(true);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-burgundy-950 via-burgundy-900/90 to-burgundy-velvet select-none">
      {/* Cinematic ambient background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.18)_0%,_transparent_70%)]" />

      {/* 3D Cake Canvas */}
      <Suspense fallback={null}>
        <CakeCanvas
          stage={stage}
          onCutComplete={handleCutComplete}
        />
      </Suspense>

      {/* Interactive UI Overlays */}
      <CakeOverlayUI
        stage={stage}
        onLightCandles={handleLightCandles}
        onBlowCandles={handleBlowCandles}
        onPickUpKnife={handlePickUpKnife}
        onNextStep={handleNextStep}
        hasNextStep={hasNextStep}
      />

      {/* Celebration Modal if no further step is defined yet */}
      {showNextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="glass-romantic-card relative max-w-md w-full rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-rose-400/40">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-lg shadow-rose-500/30">
              <span className="text-2xl">🧁</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-cream-50 mb-2">
              The Cupcake Is Cut! ❤️
            </h3>
            <p className="text-sm text-rose-100/80 leading-relaxed mb-6 font-light">
              Every wish you made today is cherished. The next surprise chapter is waiting to unfold with all our memories.
            </p>
            <button
              onClick={() => setShowNextModal(false)}
              className="btn-romantic w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-lg cursor-pointer"
            >
              Close & Relish the Moment ❤️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
