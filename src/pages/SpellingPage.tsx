import { useState, useEffect } from "react";
import {
  Volume2,
  Check,
  RotateCcw,
  ChevronRight,
  Home,
  Sparkles,
  Terminal,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { speakText } from "@/lib/speech";
import { starBurst, quickPop } from "@/lib/confetti";
import { playTap, playCorrect, playWrong } from "@/lib/sounds";
import { motion, AnimatePresence } from "framer-motion";

// Firebase & Service Imports
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import { StatsService } from "@/services/statsService"; // Ensure this path is correct

const SpellingPage = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const navigate = useNavigate();

  // 1. Fetch Spelling Data from Firestore
  useEffect(() => {
    const q = query(collection(db, "spellingWords"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWords(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const currentWord = words[currentIndex];

  // 2. Shuffle logic for dynamic data
  const shuffleLetters = () => {
    if (!currentWord) return;

    const letters = currentWord.word.split("");
    const extras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      .split("")
      .filter((l) => !letters.includes(l))
      .slice(0, 2);

    const allLetters = [...letters, ...extras].sort(() => Math.random() - 0.5);
    setAvailableLetters(allLetters);
    setUserInput([]);
    setIsCorrect(null);
  };

  // 3. Trigger shuffle when data loads or index changes
  useEffect(() => {
    if (currentWord) {
      shuffleLetters();
    }
  }, [currentIndex, words]);

  const speak = (text: string) => {
    speakText(text);
  };

  const handleLetterClick = (letter: string, index: number) => {
    if (!currentWord || userInput.length >= currentWord.word.length) return;
    playTap();

    setUserInput([...userInput, letter]);
    const newAvailable = [...availableLetters];
    newAvailable.splice(index, 1);
    setAvailableLetters(newAvailable);
    speak(letter);
  };

  const handleRemoveLetter = (index: number) => {
    const letter = userInput[index];
    const newInput = [...userInput];
    newInput.splice(index, 1);
    setUserInput(newInput);
    setAvailableLetters([...availableLetters, letter]);
    quickPop();
  };

  const checkAnswer = async () => {
    const answer = userInput.join("");
    const correct = answer === currentWord.word;
    setIsCorrect(correct);

    if (correct) {
      // --- UPDATE USER STATS ---
      try {
        await StatsService.updateUserStats(
          10, // Award 10 points for mastering a word
          `spelling-${currentWord.id}`, // Unique Activity ID
          true, // Increment a specific stat field
          "spellingsMastered" // Field matching your user stats schema
        );
      } catch (error) {
        console.error("Failed to update spelling stats:", error);
      }

      playCorrect();
      starBurst();
      speak(`Excellent! ${currentWord.word} decoded.`);
    } else {
      // track a 'wrongPick' if you want to use that stat field
      StatsService.updateUserStats(0, null, true, "wrongPicks"); 
      
      playWrong();
      speak("Sequence error. Try again!");
    }
  };

  const nextWord = () => {
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display flex flex-col overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-lg mx-auto px-6 flex items-center justify-between w-full">
          <button
            onClick={() => navigate("/")}
            className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70"
          >
            <Home className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-black italic tracking-tighter uppercase">
              Lexical Decoder
            </h1>
            <div className="flex items-center justify-center gap-1.5">
              <Terminal className="w-3 h-3 text-blue-400 animate-pulse" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">
                Ready for input
              </span>
            </div>
          </div>
          <div className="w-12" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 py-6 w-full flex flex-col gap-6 relative z-10">
        <div className="bg-white/5 p-2 rounded-2xl border border-white/5 flex gap-1.5">
          {words.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i === currentIndex
                  ? "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
                  : i < currentIndex
                    ? "bg-emerald-500/50"
                    : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {currentWord && (
          <motion.div
            layout
            className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl p-8 flex flex-col gap-8"
          >
            <div className="text-center relative">
              <motion.span
                key={currentIndex}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl block mb-4 select-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {currentWord.emoji}
              </motion.span>
              <p className="text-blue-300/60 font-black uppercase tracking-[0.2em] text-[10px]">
                {currentWord.hint}
              </p>
            </div>

            <button
              onClick={() => speak(currentWord.word)}
              className="w-full py-5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-[2rem]
                font-black flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-blue-500/20 shadow-inner"
            >
              <Volume2 className="w-6 h-6" />
              Vocalize Output
            </button>

            <div className="flex justify-center flex-wrap gap-2">
              {currentWord.word.split("").map((_, i) => (
                <motion.div
                  key={i}
                  layout
                  onClick={() => userInput[i] && handleRemoveLetter(i)}
                  className={`w-12 h-16 rounded-2xl flex items-center justify-center
                    text-3xl font-black border-2 transition-all cursor-pointer relative overflow-hidden
                    ${
                      userInput[i]
                        ? isCorrect === true
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                          : isCorrect === false
                            ? "bg-red-500/20 border-red-500 text-red-400 animate-shake"
                            : "bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                        : "bg-white/[0.03] border-white/5 text-transparent"
                    }`}
                >
                  {userInput[i] || ""}
                  {userInput[i] && (
                    <div className="absolute bottom-1 w-4 h-0.5 bg-white/20 rounded-full" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-3 pt-4 border-t border-white/5">
              <AnimatePresence mode="popLayout">
                {availableLetters.map((letter, i) => (
                  <motion.button
                    layout
                    key={`${letter}-${i}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    onClick={() => handleLetterClick(letter, i)}
                    className="aspect-square bg-white/5 border border-white/10 text-white active:bg-blue-500/40
                      rounded-2xl text-xl font-black shadow-lg active:scale-90 transition-all active:border-blue-400 
                      hover:bg-white/10 hover:border-white/20"
                  >
                    {letter}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex gap-4">
              <button
                onClick={shuffleLetters}
                className="w-16 h-16 flex items-center justify-center bg-white/5 text-white/50 border border-white/10 rounded-[1.5rem] active:scale-90 transition-all hover:text-white"
              >
                <RotateCcw className="w-6 h-6" />
              </button>

              {isCorrect === true ? (
                <button
                  onClick={nextWord}
                  className="flex-1 h-16 bg-emerald-500 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
                >
                  Next Word
                  <ChevronRight className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={checkAnswer}
                  disabled={userInput.length === 0}
                  className="flex-1 h-16 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(37,99,235,0.3)] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                >
                  Verify Sequence
                  <Check className="w-6 h-6" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {isCorrect && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Sparkles className="w-32 h-32 text-emerald-400/20 animate-ping" />
        </div>
      )}
    </div>
  );
};

export default SpellingPage;