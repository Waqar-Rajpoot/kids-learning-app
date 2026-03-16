let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume if suspended (required for mobile after user interaction)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Play a simple tone
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
};

// Play multiple notes in sequence
const playMelody = (notes: { freq: number; duration: number }[], type: OscillatorType = 'sine') => {
  let time = 0;
  notes.forEach(({ freq, duration }) => {
    setTimeout(() => playTone(freq, duration, type, 0.25), time * 1000);
    time += duration * 0.7;
  });
};

// ========== SOUND EFFECTS ==========

// Button tap - soft click
export const playTap = () => {
  playTone(800, 0.05, 'sine', 0.15);
};

// Correct answer - happy rising sound
export const playCorrect = () => {
  playMelody([
    { freq: 523, duration: 0.1 },  // C5
    { freq: 659, duration: 0.1 },  // E5
    { freq: 784, duration: 0.15 }, // G5
  ], 'sine');
};

// Wrong answer - gentle low sound
export const playWrong = () => {
  playMelody([
    { freq: 300, duration: 0.15 },
    { freq: 250, duration: 0.2 },
  ], 'triangle');
};

// Match found - sparkle sound
export const playMatch = () => {
  playMelody([
    { freq: 880, duration: 0.08 },  // A5
    { freq: 1100, duration: 0.08 }, // C#6
    { freq: 1320, duration: 0.12 }, // E6
  ], 'sine');
};

// Win/Celebration - victory fanfare
export const playCelebration = () => {
  playMelody([
    { freq: 523, duration: 0.12 },  // C5
    { freq: 523, duration: 0.12 },  // C5
    { freq: 523, duration: 0.12 },  // C5
    { freq: 523, duration: 0.3 },   // C5
    { freq: 415, duration: 0.3 },   // Ab4
    { freq: 466, duration: 0.3 },   // Bb4
    { freq: 523, duration: 0.15 },  // C5
    { freq: 466, duration: 0.1 },   // Bb4
    { freq: 523, duration: 0.4 },   // C5
  ], 'sine');
};

// Level up - ascending triumphant
export const playLevelUp = () => {
  playMelody([
    { freq: 392, duration: 0.1 },  // G4
    { freq: 523, duration: 0.1 },  // C5
    { freq: 659, duration: 0.1 },  // E5
    { freq: 784, duration: 0.2 },  // G5
    { freq: 1047, duration: 0.3 }, // C6
  ], 'sine');
};

// Pop sound - for stickers/selections
export const playPop = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
};

// Whoosh - for transitions
export const playWhoosh = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

    oscillator.frequency.setValueAtTime(100, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
};

// Star collect - magical chime
export const playStar = () => {
  playMelody([
    { freq: 1047, duration: 0.08 }, // C6
    { freq: 1319, duration: 0.08 }, // E6
    { freq: 1568, duration: 0.15 }, // G6
  ], 'sine');
};