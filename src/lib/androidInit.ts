/**
 * Android-specific initialization for speech and audio
 */

// Ensure speech synthesis is available on Android
export const initAndroidSpeech = () => {
    if (typeof window === 'undefined') return;

    // Force load speech synthesis voices on Android
    if (window.speechSynthesis) {
        // Cancel any pending speech
        window.speechSynthesis.cancel();

        // Load voices immediately
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log('Speech voices loaded:', voices.length);
            return voices;
        };

        // Try to load voices
        loadVoices();

        // Listen for voice changes (Android requirement)
        window.speechSynthesis.onvoiceschanged = () => {
            loadVoices();
        };

        // Force a voice load after a short delay
        setTimeout(() => {
            loadVoices();
        }, 100);
    }

    // Test audio playback capability
    const testAudio = new Audio();
    testAudio.preload = 'auto';
    console.log('Audio element created successfully');
};

// Auto-initialize on module load
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAndroidSpeech);
    } else {
        initAndroidSpeech();
    }

    // Also initialize on Capacitor ready event
    document.addEventListener('deviceready', initAndroidSpeech);

    // Capacitor-specific ready event
    window.addEventListener('capacitorReady', initAndroidSpeech);
}
