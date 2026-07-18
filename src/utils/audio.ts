/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Frequencies for our soft piano synth
const NOTE_FREQS: Record<string, number> = {
  'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4b': 466.16, 'B4': 493.88,
  'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5b': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51, 'F6': 1396.91, 'G6': 1567.98, 'A6': 1760.00,
  'REST': 0
};

// Emotional, warm lullaby-style melody
// [Note, duration in beats] where 1 beat = 0.5s (120 BPM)
const MELODY: [string, number][] = [
  // Phrase 1
  ['F5', 2], ['A5', 2], ['C6', 4], ['Bb5', 2], ['A5', 2], ['G5', 4],
  ['A5', 2], ['C6', 2], ['F5', 4], ['E5', 2], ['D5', 2], ['C5', 4],
  // Phrase 2
  ['D5', 2], ['F5', 2], ['A5', 4], ['G5', 2], ['F5', 2], ['E5', 4],
  ['G5', 2], ['Bb5', 2], ['D6', 4], ['C6', 4], ['A5', 4], ['F5', 4],
  // Phrase 3 (Sweet emotional highlight)
  ['C6', 3], ['D6', 1], ['C6', 2], ['A5', 2], ['F5', 4], ['G5', 4],
  ['A5', 3], ['Bb5', 1], ['A5', 2], ['F5', 2], ['D5', 4], ['C5', 4],
  // Phrase 4 (Soft happy birthday hint resolved to comforting warmth)
  ['C5', 2], ['C5', 1], ['D5', 1], ['C5', 2], ['F5', 2], ['E5', 4],
  ['C5', 2], ['C5', 1], ['D5', 1], ['C5', 2], ['G5', 2], ['F5', 6],
];

// Accompanying lower chords playing softly underneath
const BASS_CHORDS = [
  'F4', 'F4', 'C4', 'C4',
  'D4', 'D4', 'A3', 'A3',
  'Bb4', 'Bb4', 'F4', 'F4',
  'G4', 'G4', 'C4', 'C4',
];

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private bgMusic: HTMLAudioElement | null = null;

  constructor() {
    // Create the audio element for background music
    this.bgMusic = new Audio('/background-music.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.5;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public start() {
    this.initCtx();
    if (this.isPlaying) return;
    this.isPlaying = true;
    if (this.bgMusic) {
      this.bgMusic.play().catch(e => console.warn('Audio play failed', e));
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.bgMusic) {
      this.bgMusic.pause();
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  // Play a simple crisp click sound for UI buttons
  public playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      // Audio context block safety
    }
  }

  // Magical chime sound for opening the gift
  public playMagicChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Cascade notes to make an ascending fairy shimmer sound
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } catch (e) {
      // Fallback safety
    }
  }

  // Double bell chime for PIN correct
  public playCorrectPin() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Two beautiful clean chimes (A5 then C#6)
      const notes = [880.00, 1109.73];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.4);
      });
    } catch (e) {
      // Fallback safety
    }
  }

  // Low error warning tone for PIN incorrect
  public playWrongPin() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Low dual buzzing square-like oscillators
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      
      osc1.frequency.setValueAtTime(140, now);
      osc2.frequency.setValueAtTime(141.5, now); // slightly detuned

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      
      gain.disconnect(this.ctx.destination);
      gain.connect(filter);
      filter.connect(this.ctx.destination);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch (e) {
      // Fallback safety
    }
  }

  // Tick sound for countdown
  public playCountdownTick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      // Fallback safety
    }
  }
}

export const audioSynth = new SoundSynthesizer();
