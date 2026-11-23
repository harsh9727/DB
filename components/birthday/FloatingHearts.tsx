'use client';

import React, { useEffect, useRef } from 'react';

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  alphaSpeed: number;
  color: string;
}

export function FloatingHearts() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const heartColors = [
      'rgba(244, 63, 94, 0.55)', // Rose 500
      'rgba(251, 113, 133, 0.5)', // Rose 400
      'rgba(254, 205, 211, 0.45)', // Blush pink
      'rgba(226, 92, 128, 0.5)', // Romantic rose
      'rgba(212, 175, 55, 0.4)', // Warm champagne gold
    ];

    const sparkleColors = [
      'rgba(255, 248, 240, 0.9)', // Cream white
      'rgba(230, 198, 135, 0.85)', // Champagne
      'rgba(255, 214, 224, 0.9)', // Soft rose
    ];

    const hearts: HeartParticle[] = [];
    const sparkles: SparkleParticle[] = [];

    const createHeart = (initialY?: number): HeartParticle => {
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : height + 20 + Math.random() * 50,
        size: Math.random() * 14 + 10,
        speedY: Math.random() * 0.7 + 0.4,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.3,
        fadeSpeed: Math.random() * 0.001 + 0.0005,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        rotation: (Math.random() - 0.5) * 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        swayAmplitude: Math.random() * 25 + 10,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayOffset: Math.random() * Math.PI * 2,
      };
    };

    const createSparkle = (): SparkleParticle => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1,
        alpha: 0,
        maxAlpha: Math.random() * 0.8 + 0.2,
        alphaSpeed: Math.random() * 0.015 + 0.005,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
      };
    };

    // Seed initial hearts spread out
    const initialHeartCount = Math.min(Math.floor(width / 50), 28);
    for (let i = 0; i < initialHeartCount; i++) {
      hearts.push(createHeart(Math.random() * height));
    }

    // Seed sparkles
    const initialSparkleCount = Math.min(Math.floor(width / 35), 45);
    for (let i = 0; i < initialSparkleCount; i++) {
      sparkles.push(createSparkle());
    }

    // Interactive heart spawn on click/tap
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        hearts.push({
          x: clientX,
          y: clientY,
          size: Math.random() * 16 + 12,
          speedY: -Math.abs(Math.sin(angle) * speed) - 0.5,
          speedX: Math.cos(angle) * speed,
          opacity: 0.9,
          fadeSpeed: 0.012,
          color: heartColors[Math.floor(Math.random() * heartColors.length)],
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.05,
          swayAmplitude: 15,
          swaySpeed: 0.03,
          swayOffset: Math.random() * Math.PI,
        });
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    // Draw heart path helper
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      alpha: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.globalAlpha = Math.max(0, Math.min(1, alpha));
      context.fillStyle = color;

      context.beginPath();
      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      // Top left curve
      context.bezierCurveTo(
        -size / 2,
        -size / 2,
        -size,
        topCurveHeight / 3,
        0,
        size
      );
      // Top right curve
      context.bezierCurveTo(
        size,
        topCurveHeight / 3,
        size / 2,
        -size / 2,
        0,
        topCurveHeight
      );
      context.closePath();
      context.fill();

      // Soft ambient glow
      context.shadowBlur = 10;
      context.shadowColor = color;
      context.fill();

      context.restore();
    };

    // Draw sparkle helper
    const drawSparkle = (
      context: CanvasRenderingContext2D,
      sparkle: SparkleParticle
    ) => {
      context.save();
      context.translate(sparkle.x, sparkle.y);
      context.globalAlpha = Math.max(0, Math.min(1, sparkle.alpha));
      context.fillStyle = sparkle.color;

      context.beginPath();
      // Four-point star
      const s = sparkle.size;
      context.moveTo(0, -s * 2.5);
      context.quadraticCurveTo(0, 0, s * 2.5, 0);
      context.quadraticCurveTo(0, 0, 0, s * 2.5);
      context.quadraticCurveTo(0, 0, -s * 2.5, 0);
      context.quadraticCurveTo(0, 0, 0, -s * 2.5);
      context.closePath();
      context.fill();

      context.restore();
    };

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Render sparkles
      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        s.alpha += s.alphaSpeed;
        if (s.alpha > s.maxAlpha || s.alpha < 0) {
          s.alphaSpeed = -s.alphaSpeed;
          if (s.alpha < 0) {
            sparkles[i] = createSparkle();
          }
        }
        drawSparkle(ctx, s);
      }

      // Render hearts
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y -= h.speedY;
        h.x += Math.sin(tick * h.swaySpeed + h.swayOffset) * 0.5 + h.speedX;
        h.rotation += h.rotSpeed;
        h.opacity -= h.fadeSpeed;

        if (h.y < -40 || h.opacity <= 0) {
          if (hearts.length > 28) {
            hearts.splice(i, 1);
          } else {
            hearts[i] = createHeart();
          }
          continue;
        }

        drawHeart(ctx, h.x, h.y, h.size, h.rotation, h.color, h.opacity);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 h-full w-full select-none"
      aria-hidden="true"
    />
  );
}
