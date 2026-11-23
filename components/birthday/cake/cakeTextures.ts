'use client';

import * as THREE from 'three';

/**
 * Generates an appetizing, realistic procedural Golden Vanilla Sponge & Strawberry Cream interior texture
 */
export function createVanillaCakeInteriorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Golden moist vanilla sponge cake base
  ctx.fillStyle = '#fcecc4';
  ctx.fillRect(0, 0, 512, 512);

  // Realistic moist vanilla sponge crumb texture (fine pores, golden crumb)
  for (let i = 0; i < 4500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 2.2 + 0.3;
    const tone = Math.random();
    if (tone > 0.65) {
      ctx.fillStyle = 'rgba(235, 195, 130, 0.75)'; // Golden baked crumb
    } else if (tone > 0.25) {
      ctx.fillStyle = 'rgba(215, 170, 105, 0.6)'; // Sponge pore
    } else if (tone > 0.08) {
      ctx.fillStyle = 'rgba(255, 250, 235, 0.85)'; // Moist aerated crumb
    } else {
      ctx.fillStyle = 'rgba(90, 50, 20, 0.4)'; // Real vanilla bean speck
      const beanR = Math.random() * 0.9 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, beanR, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Strawberry jam & sweet vanilla buttercream filling layers
  const drawCreamLayer = (y: number, height: number, isStrawberry: boolean) => {
    const grad = ctx.createLinearGradient(0, y, 0, y + height);
    if (isStrawberry) {
      grad.addColorStop(0, '#ff758f');
      grad.addColorStop(0.5, '#e03a65');
      grad.addColorStop(1, '#ff758f');
    } else {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#fff7ed');
      grad.addColorStop(1, '#ffffff');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, 512, height);

    // Subtle edge shading
    ctx.fillStyle = isStrawberry ? 'rgba(180, 20, 50, 0.25)' : 'rgba(220, 180, 130, 0.25)';
    ctx.fillRect(0, y - 1, 512, 1);
    ctx.fillRect(0, y + height, 512, 1);
  };

  // Layer 1: Strawberry compote ribbon
  drawCreamLayer(160, 16, true);

  // Layer 2: Sweet white vanilla cream filling
  drawCreamLayer(250, 18, false);

  // Layer 3: Strawberry compote ribbon
  drawCreamLayer(340, 16, true);

  // Top layer: Silky blush pink buttercream coating
  const topGrad = ctx.createLinearGradient(0, 0, 0, 30);
  topGrad.addColorStop(0, '#fcdce4');
  topGrad.addColorStop(0.7, '#f9cad6');
  topGrad.addColorStop(1, '#fcdce4');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 512, 30);

  // Glossy highlight on top edge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.fillRect(0, 2, 512, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// Backward compatibility alias
export const createChocolateCakeInteriorTexture = createVanillaCakeInteriorTexture;

/**
 * Generates a procedural smooth buttercream swirl ripple bump map
 */
export function createButtercreamBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Soft smooth buttercream waves
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 30 + 12;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.10)');
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

// Backward compatibility alias
export const createChocolateGanacheBumpMap = createButtercreamBumpMap;
