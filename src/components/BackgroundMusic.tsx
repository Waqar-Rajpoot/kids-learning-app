import React, { useEffect, useRef } from 'react';
import { useAppSettings } from '@/context/AppSettingsContext';

const BackgroundMusic: React.FC = () => {
    const { settings } = useAppSettings();
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode[]>([]);
    const gainRef = useRef<GainNode | null>(null);

    useEffect(() => {
        if (settings.bgMusic) {
            startMusic();
        } else {
            stopMusic();
        }

        return () => stopMusic();
    }, [settings.bgMusic]);

    const startMusic = () => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.015, ctx.currentTime); // Very soft
            gain.connect(ctx.destination);
            gainRef.current = gain;

            // Simple warm "lullaby" like progression
            const chords = [
                [261.63, 329.63, 392.00], // C
                [349.23, 440.00, 523.25], // F
                [392.00, 493.88, 587.33], // G
                [349.23, 440.00, 523.25]  // F
            ];

            let count = 0;
            const playLoop = () => {
                if (!gainRef.current) return;

                const chord = chords[count % chords.length];
                const now = ctx.currentTime;

                chord.forEach(freq => {
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);

                    const chordGain = ctx.createGain();
                    chordGain.gain.setValueAtTime(0, now);
                    chordGain.gain.linearRampToValueAtTime(0.5, now + 1);
                    chordGain.gain.linearRampToValueAtTime(0, now + 4);

                    osc.connect(chordGain);
                    chordGain.connect(gain);

                    osc.start(now);
                    osc.stop(now + 4);
                    oscillatorRef.current.push(osc);
                });

                count++;
                (window as any)._bgMusicTimeout = setTimeout(playLoop, 4000);
            };

            playLoop();
        } catch (e) {
            console.error('Failed to start bg music', e);
        }
    };

    const stopMusic = () => {
        clearTimeout((window as any)._bgMusicTimeout);
        oscillatorRef.current.forEach(osc => {
            try { osc.stop(); } catch (e) { }
        });
        oscillatorRef.current = [];
        if (gainRef.current) {
            gainRef.current.disconnect();
            gainRef.current = null;
        }
    };

    return null;
};

export default BackgroundMusic;
