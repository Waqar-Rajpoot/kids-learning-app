import confetti from 'canvas-confetti';

// Check if magic effects are enabled
const canShowEffects = (): boolean => {
  return (window as any)._appSettings?.magicEffects !== false;
};

// 🎉 Main celebration confetti - shoots from both sides
export const shootConfetti = () => {
  if (!canShowEffects()) return;
  
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'];

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 50 * (timeLeft / duration);

    // Left side burst
    confetti({
      particleCount: Math.floor(particleCount),
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors,
      zIndex: 9999,
    });

    // Right side burst
    confetti({
      particleCount: Math.floor(particleCount),
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors,
      zIndex: 9999,
    });
  }, 250);
};

// ⭐ Star burst - perfect for completing activities
export const starBurst = () => {
  if (!canShowEffects()) return;

  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    zIndex: 9999,
    shapes: ['star'] as confetti.Shape[],
    colors: ['#FFE66D', '#FFD93D', '#F4D03F', '#FFEB3B'],
  };

  confetti({
    ...defaults,
    particleCount: 30,
    scalar: 1.2,
    origin: { x: 0.5, y: 0.5 },
  });

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 0.8,
      origin: { x: 0.3, y: 0.6 },
    });
  }, 100);

  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 20,
      scalar: 0.8,
      origin: { x: 0.7, y: 0.6 },
    });
  }, 200);
};

// 🎊 Rainbow burst - for big wins
export const rainbowBurst = () => {
  if (!canShowEffects()) return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      particleCount: Math.floor(count * particleRatio),
      spread: 26,
      startVelocity: 55,
      ...opts,
    });
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FF6B6B'] });
  fire(0.2, { spread: 60, colors: ['#FFE66D'] });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#4ECDC4'] });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#AA96DA'] });
  fire(0.1, { spread: 120, startVelocity: 45, colors: ['#95E1D3'] });
};

// 🎈 Emoji cannon - shoots emoji-like shapes
export const emojiCannon = (emoji?: string) => {
  if (!canShowEffects()) return;

  const scalar = 2;
  const emojis = ['🌟', '⭐', '💫', '✨', '🎉', '🎊'];
  
  confetti({
    particleCount: 50,
    spread: 100,
    origin: { y: 0.8 },
    startVelocity: 45,
    gravity: 1.2,
    ticks: 300,
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'],
    scalar,
    zIndex: 9999,
  });
};

// 💥 Quick pop - small celebration for correct answers
export const quickPop = () => {
  if (!canShowEffects()) return;

  confetti({
    particleCount: 30,
    spread: 50,
    origin: { y: 0.6, x: 0.5 },
    colors: ['#4ECDC4', '#95E1D3', '#A8E6CF'],
    startVelocity: 20,
    ticks: 50,
    zIndex: 9999,
  });
};

// 🔥 Fire burst - for streaks
export const fireBurst = () => {
  if (!canShowEffects()) return;

  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF6B6B', '#F38181', '#FFE66D', '#FF8C00'],
    startVelocity: 30,
    ticks: 80,
    zIndex: 9999,
  });
};

// Basic confetti - simple center burst
export const fireBasicConfetti = () => {
  if (!canShowEffects()) return;
  
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181'],
    zIndex: 9999,
  });
};

// 🏆 Level complete - grand celebration
export const levelComplete = () => {
  if (!canShowEffects()) return;

  // First wave
  shootConfetti();
  
  // Star burst after delay
  setTimeout(() => starBurst(), 500);
  
  // Final rainbow burst
  setTimeout(() => rainbowBurst(), 1000);
};
