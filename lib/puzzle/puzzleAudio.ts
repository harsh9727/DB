/**
 * Romantic Audio Engine for the Puzzle Game.
 * Plays local audio files with full automatic fallback to Web Audio API synthesis
 * so sound effects never fail even if media files are delayed or blocked.
 */
class PuzzleAudioManager {
  private audioCtx: AudioContext | null = null;
  private completeAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.completeAudio = new Audio('/audio/puzzle-complete.mp3');
        this.completeAudio.preload = 'auto';
      } catch {
        // Fallback to Web Audio synthesis
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  /**
   * Delicate crystalline bell chime when a piece snaps correctly into place.
   */
  public playSnap(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Romantic sparkling major chords (F5, A5, C6)
    const frequencies = [698.46, 880.0, 1046.5];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.4);
    });
  }

  /**
   * Gentle, soft thud when an incorrect slot is attempted.
   */
  public playMismatch(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  /**
   * Celebration fanfares when the entire puzzle is completed.
   */
  public playCelebration(): void {
    if (this.completeAudio) {
      this.completeAudio.currentTime = 0;
      this.completeAudio.play().catch(() => {
        this.synthesizeCelebration();
      });
    } else {
      this.synthesizeCelebration();
    }
  }

  private synthesizeCelebration(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Romantic harp arpeggio (C4, E4, G4, B4, C5, E5, G5, C6)
    const notes = [261.63, 329.63, 392.0, 493.88, 523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.09);

      gain.gain.setValueAtTime(0.0001, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.09 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.8);
    });
  }
}

export const puzzleAudio = new PuzzleAudioManager();
