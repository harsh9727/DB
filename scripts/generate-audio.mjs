import fs from 'fs';
import path from 'path';

const audioDir = path.join(process.cwd(), 'public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

function createWavBuffer(sampleRate, durationSec, generateSample) {
  const numSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = 2;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generateSample(t, i, numSamples)));
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 44100;

// 1. Sparkler Lighting & Crackling Sound (continuous sizzling electrical crackle & firework pops)
const sparklerCracklingWav = createWavBuffer(sampleRate, 2.5, (t) => {
  // Rapid micro-pops and sizzle
  const isPop = Math.random() < 0.08;
  const pop = isPop ? (Math.random() * 2 - 1) * 0.9 : 0;
  const hiss = (Math.random() * 2 - 1) * 0.18;
  const sizzleFreq = Math.sin(2 * Math.PI * (1200 + Math.random() * 1600) * t) * 0.15;
  return (pop + hiss + sizzleFreq) * Math.min(1, t * 5);
});

// 2. Extinguish / Sizzle out
const sparklerExtinguishWav = createWavBuffer(sampleRate, 1.2, (t) => {
  const hiss = (Math.random() * 2 - 1) * Math.exp(-t * 3.5) * 0.4;
  return hiss;
});

// 3. Knife cutting cake
const knifeCuttingWav = createWavBuffer(sampleRate, 1.0, (t) => {
  const friction = (Math.random() * 2 - 1) * 0.2 * Math.sin(Math.PI * t);
  const slide = Math.sin(2 * Math.PI * (220 - t * 40) * t) * 0.2 * (1 - t);
  return friction + slide;
});

// 4. Celebration
const celebrationWav = createWavBuffer(sampleRate, 2.0, (t) => {
  const chord = 
    Math.sin(2 * Math.PI * 523.25 * t) * Math.exp(-t * 2) * 0.3 + 
    Math.sin(2 * Math.PI * 659.25 * t) * Math.exp(-t * 2.5) * 0.25 + 
    Math.sin(2 * Math.PI * 783.99 * t) * Math.exp(-t * 3) * 0.25 + 
    Math.sin(2 * Math.PI * 1046.50 * t) * Math.exp(-t * 3.5) * 0.2;
  return chord;
});

fs.writeFileSync(path.join(audioDir, 'sparkler-crackling.mp3'), sparklerCracklingWav);
fs.writeFileSync(path.join(audioDir, 'sparkler-crackling.wav'), sparklerCracklingWav);
fs.writeFileSync(path.join(audioDir, 'candle-lighting.mp3'), sparklerCracklingWav);
fs.writeFileSync(path.join(audioDir, 'candle-lighting.wav'), sparklerCracklingWav);

fs.writeFileSync(path.join(audioDir, 'sparkler-extinguish.mp3'), sparklerExtinguishWav);
fs.writeFileSync(path.join(audioDir, 'sparkler-extinguish.wav'), sparklerExtinguishWav);
fs.writeFileSync(path.join(audioDir, 'candle-blowing.mp3'), sparklerExtinguishWav);
fs.writeFileSync(path.join(audioDir, 'candle-blowing.wav'), sparklerExtinguishWav);

fs.writeFileSync(path.join(audioDir, 'knife-cutting.mp3'), knifeCuttingWav);
fs.writeFileSync(path.join(audioDir, 'knife-cutting.wav'), knifeCuttingWav);

fs.writeFileSync(path.join(audioDir, 'celebration.mp3'), celebrationWav);
fs.writeFileSync(path.join(audioDir, 'celebration.wav'), celebrationWav);

console.log('Sparkler & cupcake audio updated successfully!');
