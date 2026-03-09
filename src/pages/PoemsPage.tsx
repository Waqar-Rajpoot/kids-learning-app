import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Home, Music, Sparkles } from 'lucide-react';
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

  // Handle smooth transition
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
    // Add pauses between lines for better rhythm
    const text = currentPoem.lines.join('... ');
    speakText(text, () => setIsReading(false));
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  return (
    <div className="h-screen bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-50 via-purple-50 to-slate-100 flex flex-col overflow-hidden select-none">
      {/* Premium Header */}
      <header className="h-20 px-6 flex items-center shrink-0 z-50">
        <div className="max-w-xl mx-auto w-full flex items-center justify-between">
          <button
            onClick={() => { stopReading(); navigate('/'); }}
            className="w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg active:scale-90 transition-all text-slate-600 hover:text-primary"
          >
            <Home className="w-6 h-6" />
          </button>

          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Magic Tales <Sparkles className="w-5 h-5 text-yellow-400" />
            </h1>
          </div>

          <div className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl flex items-center justify-center shadow-lg">
            <Music className={`w-6 h-6 text-primary ${isReading ? 'animate-bounce' : ''}`} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-xl mx-auto p-4 flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full flex-1 flex flex-col bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-2xl relative overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 180px)' }} // Ensure it fits between header and footer
          >
            {/* Dynamic Header */}
            <div className={`p-6 bg-gradient-to-br ${currentPoem.color} relative shrink-0 overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 noise-bg" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="text-7xl mb-2 drop-shadow-2xl animate-float block"
                >
                  {currentPoem.emoji}
                </motion.span>
                <h2 className="text-3xl font-black text-white drop-shadow-lg leading-none uppercase font-heading italic tracking-wide">
                  {currentPoem.title}
                </h2>
              </div>
            </div>

            {/* Scrollable Poem Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
              <div className="flex flex-col gap-5 py-2">
                {currentPoem.lines.map((line, i) => (
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    key={line + i}
                    className="text-center font-bold text-xl md:text-2xl text-slate-700 leading-snug font-display"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Fixed Bottom Action Area */}
            <div className="p-4 bg-gradient-to-t from-white via-white to-transparent shrink-0">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={readPoem}
                className={`w-full py-4 rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-500/20
                  ${isReading
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
              >
                {isReading ? (
                  <><VolumeX className="w-6 h-6" /> Stop Reading</>
                ) : (
                  <><Volume2 className="w-6 h-6" /> Read Aloud</>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Footer */}
      <footer className="h-24 px-6 shrink-0 flex items-center justify-between max-w-xl mx-auto w-full gap-4 pb-4">
        <button
          onClick={handlePrev}
          className="h-14 w-14 flex items-center justify-center bg-white rounded-2xl shadow-lg border-b-4 border-slate-100 active:border-b-0 active:translate-y-1 transition-all text-slate-400 hover:text-primary"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div className="px-4 h-10 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 shadow-sm">
          <span className="text-slate-800 font-bold">{currentIndex + 1}</span>
          <span className="text-slate-400 mx-1">/</span>
          <span className="text-slate-500 font-bold">{poems.length}</span>
        </div>

        <button
          onClick={handleNext}
          className="h-14 flex-1 bg-primary rounded-2xl shadow-lg shadow-primary/30 border-b-4 border-primary-foreground/20 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center font-black text-lg text-white gap-2"
        >
          Next Tale
          <ChevronRight className="w-6 h-6" />
        </button>
      </footer>
    </div>
  );
};

export default PoemsPage;
