'use client';

import * as THREE from 'three';

/**
 * Generates an appetizing, realistic procedural Dark Chocolate Sponge & Ganache interior texture
 */
export function createChocolateCakeInteriorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Deep moist dark chocolate sponge base
  ctx.fillStyle = '#26140e';
  ctx.fillRect(0, 0, 512, 512);

  // Realistic moist chocolate sponge crumb (fine pores, cocoa cake texture)
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 2.0 + 0.4;
    const tone = Math.random();
    if (tone > 0.6) {
      ctx.fillStyle = 'rgba(68, 38, 26, 0.7)'; // Lighter cocoa crumb
    } else if (tone > 0.25) {
      ctx.fillStyle = 'rgba(24, 11, 7, 0.85)'; // Deep cocoa pore
    } else {
      ctx.fillStyle = 'rgba(110, 62, 42, 0.4)'; // Warm chocolate highlight
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw rich silky cream & chocolate ganache layers
  const drawCreamLayer = (y: number, height: number, isVanilla: boolean) => {
    const grad = ctx.createLinearGradient(0, y, 0, y + height);
    if (isVanilla) {
      grad.addColorStop(0, '#fffbf0');
      grad.addColorStop(0.5, '#f5ecd5');
      grad.addColorStop(1, '#fffbf0');
    } else {
      // Dark chocolate fudge ganache filling
      grad.addColorStop(0, '#1c0d08');
      grad.addColorStop(0.5, '#2e150d');
      grad.addColorStop(1, '#1c0d08');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, 512, height);

    // Subtle edge shading
    ctx.fillStyle = 'rgba(10, 5, 3, 0.4)';
    ctx.fillRect(0, y - 2, 512, 2);
    ctx.fillRect(0, y + height, 512, 2);
  };

  // Draw raspberry / strawberry jam ripple inside the cake
  const drawFruitJamRipple = (y: number) => {
    ctx.fillStyle = 'rgba(195, 20, 55, 0.9)';
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 25) {
      const wave = Math.sin(x * 0.06) * 3.5;
      ctx.lineTo(x, y + wave);
    }
    ctx.lineTo(512, y + 5);
    ctx.lineTo(0, y + 5);
    ctx.closePath();
    ctx.fill();
  };

  // Layer 1: Vanilla mousse cream layer
  drawCreamLayer(150, 22, true);
  drawFruitJamRipple(160);

  // Layer 2: Silky dark chocolate fudge layer
  drawCreamLayer(240, 18, false);

  // Layer 3: Vanilla mousse cream layer
  drawCreamLayer(330, 22, true);
  drawFruitJamRipple(340);

  // Top thick glossy chocolate ganache coating
  const topGrad = ctx.createLinearGradient(0, 0, 0, 32);
  topGrad.addColorStop(0, '#150a06');
  topGrad.addColorStop(0.7, '#241009');
  topGrad.addColorStop(1, '#150a06');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 512, 32);

  // Glossy highlight line on top edge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, 2, 512, 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Generates a procedural ganache ripple / frosting bump map
 */
export function createChocolateGanacheBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Soft smooth ganache waves
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 35 + 15;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    grad.addColorStop(1, 'rgba(128, 128, 128, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  return texture;
}
