import { useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Home, Music, Sparkles, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { poems } from '@/data/learningData';
import { speakText } from '@/lib/speech';
import { motion, AnimatePresence } from 'framer-motion';
import { playTap, playPop } from '@/lib/sounds';

const PoemsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const navigate = useNavigate();

  const currentPoem = poems[currentIndex];

  const handleNext = () => {
    if (isReading) stopReading();
    playPop();
    setCurrentIndex((prev) => (prev + 1) % poems.length);
  };

  const handlePrev = () => {
    if (isReading) stopReading();
    playPop();
    setCurrentIndex((prev) => (prev - 1 + poems.length) % poems.length);
  };

  const readPoem = () => {
    playTap();
    if (isReading) {
      stopReading();
      return;
    }

    setIsReading(true);
    const text = currentPoem.lines.join('... ');
    speakText(text, () => setIsReading(false));
  };

  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setIsReading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white font-display overflow-hidden relative">
      
      {/* 1. Dynamic Background Aura */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.2, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br ${currentPoem.color} rounded-full blur-[180px]`}
          />
        </AnimatePresence>
      </div>

      {/* 2. Glassmorphic Header */}
      <header className="h-20 px-6 shrink-0 z-50 bg-[#0f172a]/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-xl mx-auto w-full h-full flex items-center justify-between">
          <button
            onClick={() => { stopReading(); navigate('/'); }}
            className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl shadow-xl active:scale-90 transition-all text-white/70 hover:bg-white/10"
          >
            <Home className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-black text-white tracking-tighter flex items-center gap-2 uppercase italic">
              Magic Tales <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </h1>
          </div>

          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isReading ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/10'}`}>
            <Music className={`w-5 h-5 ${isReading ? 'text-primary animate-bounce' : 'text-white/30'}`} />
          </div>
        </div>
      </header>

      {/* 3. Main Tale Area */}
      <main className="flex-1 w-full max-w-xl mx-auto p-4 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -50, rotate: -2 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="w-full flex-1 flex flex-col bg-white/[0.03] backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group"
          >
            {/* Tale Header Section */}
            <div className={`p-8 bg-gradient-to-br ${currentPoem.color} relative shrink-0`}>
              {/* Glass Reflection Overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-20" />
              <div className="absolute inset-0 bg-[grid-white_20px] opacity-10" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
                  className="text-8xl mb-4 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] block"
                >
                  {currentPoem.emoji}
                </motion.span>
                <h2 className="text-3xl font-black text-white drop-shadow-lg leading-none uppercase italic tracking-tighter">
                  {currentPoem.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Tale Body */}
            <div className="flex-1 overflow-y-auto px-8 py-10 no-scrollbar">
              <div className="flex flex-col gap-6">
                {currentPoem.lines.map((line, i) => (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    key={line + i}
                    className="text-center font-bold text-xl md:text-2xl text-white/90 leading-relaxed italic"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Float Action Button (In-Card) */}
            <div className="p-6 pt-0">
              <motion.button
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={readPoem}
                className={`w-full py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl border border-white/20
                  ${isReading
                    ? 'bg-rose-500 text-white shadow-rose-500/20'
                    : `bg-gradient-to-r ${currentPoem.color} text-white shadow-lg`
                  }`}
              >
                {isReading ? (
                  <><VolumeX className="w-6 h-6 animate-pulse" /> Stop Reading</>
                ) : (
                  <><Volume2 className="w-6 h-6" /> Read Aloud</>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Navigation Footer */}
      <footer className="h-28 px-6 shrink-0 flex items-center justify-between max-w-xl mx-auto w-full gap-4 pb-6 z-20">
        <button
          onClick={handlePrev}
          className="h-16 w-16 flex items-center justify-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl active:scale-90 transition-all text-white/50 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div className="flex-1 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-between px-6 border border-white/10 shadow-inner">
           <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Chapter</span>
           </div>
           <div className="flex items-center gap-1.5 font-black text-xl italic">
              <span className="text-white">{currentIndex + 1}</span>
              <span className="text-white/20">/</span>
              <span className="text-white/40">{poems.length}</span>
           </div>
        </div>

        <button
          onClick={handleNext}
          className={`h-16 px-8 bg-gradient-to-r ${currentPoem.color} rounded-2xl shadow-xl border border-white/20 active:scale-95 transition-all flex items-center justify-center font-black text-lg text-white gap-2 uppercase italic tracking-tighter`}
        >
          Next
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
};

export default PoemsPage;