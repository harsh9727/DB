import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const videosDir = path.join(process.cwd(), 'public', 'videos');

if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(videosDir)) fs.mkdirSync(videosDir, { recursive: true });

// 1. Generate birthday-bg.jpg
const birthdayBgSvg = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#4a0e17" />
      <stop offset="45%" stop-color="#2a060d" />
      <stop offset="100%" stop-color="#140205" />
    </radialGradient>
    <radialGradient id="roseGlow1" cx="30%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#e11d48" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#e11d48" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="roseGlow2" cx="75%" cy="60%" r="45%">
      <stop offset="0%" stop-color="#fb7185" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#fb7185" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="goldGlow" cx="50%" cy="30%" r="35%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#d4af37" stop-opacity="0" />
    </radialGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="30" />
    </filter>
  </defs>

  <!-- Deep Base -->
  <rect width="1920" height="1080" fill="url(#bgGrad)" />

  <!-- Ambient Glow Orbs -->
  <circle cx="500" cy="400" r="450" fill="url(#roseGlow1)" filter="url(#blur)" />
  <circle cx="1400" cy="650" r="400" fill="url(#roseGlow2)" filter="url(#blur)" />
  <circle cx="960" cy="350" r="350" fill="url(#goldGlow)" filter="url(#blur)" />

  <!-- Subtle Bokeh Circles -->
  <circle cx="320" cy="700" r="90" fill="#f43f5e" opacity="0.12" filter="url(#blur)" />
  <circle cx="1600" cy="300" r="110" fill="#fb7185" opacity="0.1" filter="url(#blur)" />
  <circle cx="1100" cy="800" r="70" fill="#d4af37" opacity="0.12" filter="url(#blur)" />
  <circle cx="750" cy="200" r="60" fill="#fff" opacity="0.15" filter="url(#blur)" />

  <!-- Gentle Golden Sparkles -->
  <circle cx="200" cy="250" r="2.5" fill="#e6c687" opacity="0.7" />
  <circle cx="450" cy="180" r="3" fill="#ffe4e6" opacity="0.8" />
  <circle cx="820" cy="220" r="2" fill="#e6c687" opacity="0.6" />
  <circle cx="1150" cy="150" r="3.5" fill="#fff" opacity="0.8" />
  <circle cx="1450" cy="280" r="2.5" fill="#e6c687" opacity="0.7" />
  <circle cx="1720" cy="190" r="3" fill="#ffe4e6" opacity="0.8" />
  <circle cx="300" cy="850" r="2" fill="#fff" opacity="0.5" />
  <circle cx="1620" cy="820" r="3" fill="#e6c687" opacity="0.7" />
</svg>
`;

// 2. Generate welcome-bg.jpg
const welcomeBgSvg = `
<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="welcomeGrad" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#540f1a" />
      <stop offset="50%" stop-color="#300810" />
      <stop offset="100%" stop-color="#140205" />
    </radialGradient>
    <radialGradient id="centerWarmth" cx="50%" cy="45%" r="40%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.38" />
      <stop offset="60%" stop-color="#d4af37" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#540f1a" stop-opacity="0" />
    </radialGradient>
    <filter id="softBlur">
      <feGaussianBlur stdDeviation="45" />
    </filter>
  </defs>

  <rect width="1920" height="1080" fill="url(#welcomeGrad)" />
  <circle cx="960" cy="480" r="600" fill="url(#centerWarmth)" filter="url(#softBlur)" />
  
  <!-- Subtle Romantic Bokeh Spheres -->
  <circle cx="280" cy="380" r="140" fill="#e11d48" opacity="0.18" filter="url(#softBlur)" />
  <circle cx="1640" cy="420" r="150" fill="#f43f5e" opacity="0.16" filter="url(#softBlur)" />
  <circle cx="800" cy="780" r="120" fill="#d4af37" opacity="0.14" filter="url(#softBlur)" />

  <!-- Romantic Sparkle Accents -->
  <path d="M 960 180 Q 960 210 990 210 Q 960 210 960 240 Q 960 210 930 210 Q 960 210 960 180" fill="#e6c687" opacity="0.65" />
  <path d="M 600 320 Q 600 340 620 340 Q 600 340 600 360 Q 600 340 580 340 Q 600 340 600 320" fill="#ffd1dc" opacity="0.75" />
  <path d="M 1320 280 Q 1320 300 1340 300 Q 1320 300 1320 320 Q 1320 300 1300 300 Q 1320 300 1320 280" fill="#ffe4e6" opacity="0.75" />
</svg>
`;

// 3. Generate romantic-photo-1.jpg
const romanticPhotoSvg = `
<svg width="1200" height="1200" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="photoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d0a11" />
      <stop offset="50%" stop-color="#58111a" />
      <stop offset="100%" stop-color="#24040a" />
    </linearGradient>
    <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f43f5e" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#f43f5e" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="1200" fill="url(#photoGrad)" />
  <circle cx="600" cy="600" r="400" fill="url(#heartGlow)" />

  <g transform="translate(600, 580) scale(4.5)">
    <path d="M 0,-15 C -20,-35 -50,-10 -50,15 C -50,45 0,70 0,85 C 0,70 50,45 50,15 C 50,-10 20,-35 0,-15 Z" fill="#e11d48" opacity="0.8" />
  </g>
</svg>
`;

async function main() {
  await sharp(Buffer.from(birthdayBgSvg)).jpeg({ quality: 90 }).toFile(path.join(imagesDir, 'birthday-bg.jpg'));
  await sharp(Buffer.from(welcomeBgSvg)).jpeg({ quality: 90 }).toFile(path.join(imagesDir, 'welcome-bg.jpg'));
  await sharp(Buffer.from(romanticPhotoSvg)).jpeg({ quality: 90 }).toFile(path.join(imagesDir, 'romantic-photo-1.jpg'));
  console.log('Images generated successfully!');
}

main().catch(console.error);
