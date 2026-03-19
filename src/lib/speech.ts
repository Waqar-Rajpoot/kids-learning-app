/**
 * RE-ENGINEERED Voice Utility with Kid-Friendly Clear Speech
 * Optimized for children ages 3-8 with clear, slow pronunciation
 */
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';


let activeAudio: HTMLAudioElement | null = null;
let cachedVoice: SpeechSynthesisVoice | null = null;

// Audio asset mappings for items that have pre-recorded audio
const audioMap: Record<string, string> = {
  // Numbers
  '1': '/audio/numbers/1.mp3', '2': '/audio/numbers/2.mp3', '3': '/audio/numbers/3.mp3',
  '4': '/audio/numbers/4.mp3', '5': '/audio/numbers/5.mp3', '6': '/audio/numbers/6.mp3',
  '7': '/audio/numbers/7.mp3', '8': '/audio/numbers/8.mp3', '9': '/audio/numbers/9.mp3',
  '10': '/audio/numbers/10.mp3',
  'one': '/audio/numbers/one.mp3', 'two': '/audio/numbers/two.mp3',
  'three': '/audio/numbers/three.mp3', 'four': '/audio/numbers/four.mp3',
  'five': '/audio/numbers/five.mp3', 'six': '/audio/numbers/six.mp3',
  'seven': '/audio/numbers/seven.mp3', 'eight': '/audio/numbers/eight.mp3',
  'nine': '/audio/numbers/nine.mp3', 'ten': '/audio/numbers/ten.mp3',

  // Alphabets - Using kid voice files
  'a': '/audio/alphabets/kid-a.mp3', 'b': '/audio/alphabets/kid-b.mp3',
  'c': '/audio/alphabets/kid-c.mp3', 'd': '/audio/alphabets/kid-d.mp3',
  'e': '/audio/alphabets/kid-e.mp3', 'f': '/audio/alphabets/kid-f.mp3',
  'g': '/audio/alphabets/kid-g.mp3', 'h': '/audio/alphabets/kid-h.mp3',
  'i': '/audio/alphabets/kid-i.mp3', 'j': '/audio/alphabets/kid-j.mp3',
  'k': '/audio/alphabets/kid-k.mp3', 'l': '/audio/alphabets/kid-l.mp3',
  'm': '/audio/alphabets/kid-m.mp3', 'n': '/audio/alphabets/kid-n.mp3',
  'o': '/audio/alphabets/kid-o.mp3', 'p': '/audio/alphabets/kid-p.mp3',
  'q': '/audio/alphabets/kid-q.mp3', 'r': '/audio/alphabets/kid-r.mp3',
  's': '/audio/alphabets/kid-s.mp3', 't': '/audio/alphabets/kid-t.mp3',
  'u': '/audio/alphabets/kid-u.mp3', 'v': '/audio/alphabets/kid-v.mp3',
  'w': '/audio/alphabets/kid-w.mp3', 'x': '/audio/alphabets/kid-x.mp3',
  'y': '/audio/alphabets/kid-y.mp3', 'z': '/audio/alphabets/kid-z.mp3',

  // Colors
  'red': '/audio/color/red.mp3', 'green': '/audio/color/green.mp3',
  'blue': '/audio/color/blue.mp3', 'yellow': '/audio/color/yellow.mp3',
  'orange': '/audio/color/orange.mp3', 'pink': '/audio/color/pink.mp3',
  'purple': '/audio/color/purple.mp3', 'white': '/audio/color/white.mp3',
  'black': '/audio/color/black.mp3', 'brown': '/audio/color/brown.mp3',
  // Days (Optional MP3 mapping - paths assume you will add these files)
  'monday': '/audio/days/monday.mp3', 'tuesday': '/audio/days/tuesday.mp3',
  'wednesday': '/audio/days/wednesday.mp3', 'thursday': '/audio/days/thursday.mp3',
  'friday': '/audio/days/friday.mp3', 'saturday': '/audio/days/saturday.mp3',
  'sunday': '/audio/days/sunday.mp3',

  // Months (Optional MP3 mapping)
  'january': '/audio/months/january.mp3', 'february': '/audio/months/february.mp3',
  'march': '/audio/months/march.mp3', 'april': '/audio/months/april.mp3',
  'may': '/audio/months/may.mp3', 'june': '/audio/months/june.mp3',
  'july': '/audio/months/july.mp3', 'august': '/audio/months/august.mp3',
  'september': '/audio/months/september.mp3', 'october': '/audio/months/october.mp3',
  'november': '/audio/months/november.mp3', 'december': '/audio/months/december.mp3'
};

// Sound effect mappings for animals and birds
const sfxMap: Record<string, string> = {
  // Animals (SFX)
  'alligator': '/audio/animals/Animal_S1.mp3',
  'yak': '/audio/animals/Animal_S2.mp3',
  'deer': '/audio/animals/Animal_S3.mp3',
  'pig': '/audio/animals/Animal_S4.mp3',
  'elephant': '/audio/animals/Animal_S5.mp3',
  'dog': '/audio/animals/Animal_S6.mp3',
  'zebra': '/audio/animals/Animal_S7.mp3',
  'goat': '/audio/animals/Animal_S8.mp3',
  'lion': '/audio/animals/Animal_S9.mp3',
  'tiger': '/audio/animals/Animal_S10.mp3',
  'bear': '/audio/animals/bear.mp3',
  'cat': '/audio/animals/cat.mp3',
  'cow': '/audio/animals/cow.mp3',
  'chicken': '/audio/animals/chicken.mp3',
  'frog': '/audio/animals/frog.mp3',
  'monkey': '/audio/animals/monkey.mp3',
  'mouse': '/audio/animals/mouse.mp3',

  // Birds (SFX)
  'crow': '/audio/birds/Bird_S1.mp3',
  'duck': '/audio/birds/Bird_S2.mp3',
  'pigeon': '/audio/birds/Bird_S3.mp3',
  'hen': '/audio/birds/Bird_S4.mp3',
  'eagle': '/audio/birds/Bird_S5.mp3',
  'toucan': '/audio/birds/Bird_S6.mp3',
  'vulture': '/audio/birds/Bird_S7.mp3',
  'penguin': '/audio/birds/Bird_S8.mp3',
  'parrot': '/audio/birds/Bird_S9.mp3',
  'owl': '/audio/birds/Bird_S10.mp3'
};

// Phonetic pronunciation guide for difficult words (optimized for kids)
const pronunciationMap: Record<string, string> = {
  // Animals with difficult pronunciation
  'fox': 'foks',
  'giraffe': 'juh raff',
  'horse': 'horss',
  'iguana': 'ee gwah nah',
  'jaguar': 'jag you are',
  'kangaroo': 'kang guh roo',
  'monkey': 'mun key',
  'narwhal': 'nar wall',
  'octopus': 'ok toh puss',
  'panda': 'pan dah',
  'quokka': 'kwok kah',
  'rabbit': 'rab bit',
  'snake': 'snayk',
  'unicorn': 'you nee korn',
  'whale': 'wayl',
  'x-ray fish': 'ex ray fish',

  // Birds with difficult pronunciation
  'albatross': 'al buh tross',
  'bluebird': 'bloo bird',
  'flamingo': 'fluh ming go',
  'goose': 'goos',
  'hummingbird': 'hum ming bird',
  'ibis': 'eye biss',
  'jay': 'jay',
  'kiwi': 'kee wee',
  'lark': 'lark',
  'magpie': 'mag pie',
  'nightingale': 'nite in gayl',
  'owl': 'owl',
  'parrot': 'pah rot',
  'quail': 'kwayl',
  'robin': 'rob in',
  'swan': 'swon',
  'woodpecker': 'wood pek ker',
  'xenops': 'zen ops',
  'yellowhammer': 'yel low ham mer',
  'zebra finch': 'zee brah finch',

  // Fruits with pronunciation help
  'apple': 'app ul',
  'banana': 'buh nan nah',
  'cherry': 'cher ree',
  'dragon fruit': 'dra gun froot',
  'elderberry': 'el der ber ree',
  'fig': 'fig',
  'grapes': 'grayps',
  'honeydew': 'hun ee doo',
  'iced melon': 'iced mel on',
  'jackfruit': 'jak froot',
  // Note: 'kiwi' pronunciation already defined in birds section above
  'lemon': 'lem on',
  'mango': 'mang go',
  'nectarine': 'nek tah reen',
  'orange': 'or inj',
  'pineapple': 'pine app ul',
  'quince': 'kwinss',
  'raspberry': 'raz ber ree',
  'strawberry': 'straw ber ree',
  'tangerine': 'tan juh reen',
  'ugli fruit': 'ug lee froot',
  'vanilla bean': 'vuh nil uh bean',
  'watermelon': 'waw ter mel on',
  'xigua': 'shee gwah',
  'kiwi fruit': 'kee wee froot',
  'yellow peach': 'yel low peech',
  'zucchini': 'zoo kee nee'
};

export const hasSFX = (name: string): boolean => {
  return !!sfxMap[name.toLowerCase().trim()];
};

export const speakText = (text: string, onEnd?: () => void) => {
  const cleanText = text.toLowerCase().trim();

  // Check for pre-recorded audio first
  const audioPath = audioMap[cleanText];
  if (audioPath) {
    playAudioFile(audioPath, onEnd);
    return;
  }

  // Use speech synthesis with kid-friendly settings
  speakWithSynthesis(text, onEnd);
};

export const playAnimalSound = (name: string, onEnd?: () => void) => {
  const clean = name.toLowerCase().trim();
  const sfxPath = sfxMap[clean];

  if (sfxPath) {
    playAudioFile(sfxPath, onEnd);
  } else {
    // No sound effect available
    if (onEnd) onEnd();
  }
};

const playAudioFile = (path: string, onEnd?: () => void) => {
  // Stop any currently playing audio
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  const audio = new Audio(path);
  activeAudio = audio;

  // Set audio properties for better mobile compatibility
  audio.preload = 'auto';
  audio.autoplay = false;

  audio.onended = () => {
    activeAudio = null;
    if (onEnd) onEnd();
  };

  audio.onerror = (e) => {
    console.warn(`Audio file failed: ${path}. Error:`, e);
    activeAudio = null;
    // Fall back to speech synthesis
    const name = path.split('/').pop()?.replace('.mp3', '') || '';
    speakWithSynthesis(name, onEnd);
  };

  // Play with error handling for mobile browsers
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Audio started playing successfully
      })
      .catch((error) => {
        console.warn('Audio playback failed:', error);
        activeAudio = null;

        // Try speech synthesis as fallback
        const name = path.split('/').pop()?.replace('.mp3', '') || '';
        speakWithSynthesis(name, onEnd);
      });
  }
};

const speakWithSynthesis = async (text: string, onEnd?: () => void) => {
  const cleanText = text.toLowerCase().trim();
  const phoneticText = pronunciationMap[cleanText] || text;

  // Use Native Plugin on Android/iOS
  if (Capacitor.isNativePlatform()) {
    try {
      console.log('[Speech] Using Native Capacitor Plugin');
      await TextToSpeech.stop();

      await TextToSpeech.speak({
        text: phoneticText,
        lang: 'en-US',
        rate: 0.8, // Slightly slower for kids
        pitch: 1.2, // Slightly higher
        volume: 1.0,
        category: 'ambient',
      });

      console.log('[Speech] Native speech finished');
      if (onEnd) onEnd();
    } catch (err) {
      console.error('[Speech] Native plugin error:', err);
      // Fallback to web implementation if native fails
      speakWithWebSynthesis(text, onEnd);
    }
  } else {
    // Web Fallback
    speakWithWebSynthesis(text, onEnd);
  }
};

const speakWithWebSynthesis = (text: string, onEnd?: () => void) => {
  // Check if speech synthesis is available
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('[Speech] Speech synthesis not available');
    if (onEnd) onEnd();
    return;
  }

  const synth = window.speechSynthesis;
  console.log('[Speech] Starting Web speech synthesis for:', text);

  // Cancel any ongoing speech
  synth.cancel();

  const runSpeech = () => {
    // Resume if paused (mobile browsers)
    if (synth.paused) {
      console.log('[Speech] Resuming paused speech');
      synth.resume();
    }
    if (synth.speaking) {
      console.log('[Speech] Canceling ongoing speech');
      synth.cancel();
    }

    // Get phonetic version if available for clearer pronunciation
    const cleanText = text.toLowerCase().trim();
    const phoneticText = pronunciationMap[cleanText] || text;
    console.log('[Speech] Using text:', phoneticText);

    // Create utterance with kid-optimized settings
    const utterance = new SpeechSynthesisUtterance(phoneticText);
    utterance.lang = 'en-US';
    utterance.rate = 0.7; // Very slow for clarity
    utterance.pitch = 1.3; // Higher pitch for child-friendly voice
    utterance.volume = 1.0;

    // Select the best voice for children
    const voice = getBestVoice(synth);
    if (voice) {
      utterance.voice = voice;
      console.log('[Speech] Using voice:', voice.name);
    } else {
      console.warn('[Speech] No voice selected, using default');
    }

    utterance.onstart = () => {
      console.log('[Speech] Speech started');
    };

    utterance.onend = () => {
      console.log('[Speech] Speech ended');
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('[Speech] Speech error:', event.error, event);
      // Retry once on error (common on Android)
      if (event.error === 'interrupted' || event.error === 'canceled') {
        console.log('[Speech] Retrying after interruption');
        setTimeout(() => {
          synth.speak(utterance);
        }, 100);
      } else {
        if (onEnd) onEnd();
      }
    };

    // Speak immediately (reduced delay for mobile)
    console.log('[Speech] Calling speak()');
    synth.speak(utterance);
  };

  // Ensure voices are loaded
  const voices = synth.getVoices();
  console.log('[Speech] Available voices:', voices.length);

  if (voices.length === 0) {
    console.log('[Speech] No voices loaded yet, waiting...');
    // Wait for voices to load
    let voicesLoaded = false;
    synth.onvoiceschanged = () => {
      if (!voicesLoaded) {
        voicesLoaded = true;
        const newVoices = synth.getVoices();
        console.log('[Speech] Voices loaded:', newVoices.length);
        runSpeech();
      }
    };
    // Trigger voice loading
    synth.getVoices();

    // Fallback timeout in case voices don't load
    setTimeout(() => {
      if (!voicesLoaded) {
        voicesLoaded = true;
        console.warn('[Speech] Timeout waiting for voices, proceeding anyway');
        runSpeech();
      }
    }, 1000);
  } else {
    runSpeech();
  }
};

const getBestVoice = (synth: SpeechSynthesis): SpeechSynthesisVoice | null => {
  // Return cached voice if available
  if (cachedVoice) return cachedVoice;

  const voices = synth.getVoices();

  // Priority list of preferred voices for children (clear, friendly female voices)
  const voicePriorities = [
    'Google US English Female',
    'Microsoft Aria Online (Natural)',
    'Microsoft Jenny Online (Natural)',
    'Samantha',
    'Karen',
    'Victoria',
    'Alex',
    'Moira',
    'Fiona',
    'Female'
  ];

  // Find first matching voice
  for (const priority of voicePriorities) {
    const voice = voices.find(v =>
      v.name.includes(priority) && v.lang.startsWith('en')
    );
    if (voice) {
      cachedVoice = voice;
      return voice;
    }
  }

  // Fallback: find any English female voice
  const femaleVoice = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  );
  if (femaleVoice) {
    cachedVoice = femaleVoice;
    return femaleVoice;
  }

  // Last fallback: any English voice
  const englishVoice = voices.find(v => v.lang.startsWith('en'));
  if (englishVoice) {
    cachedVoice = englishVoice;
    return englishVoice;
  }

  return null;
};

// Pre-load voices on module load
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}