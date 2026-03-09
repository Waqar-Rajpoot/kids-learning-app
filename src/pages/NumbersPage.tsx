import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Home, Hash, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { numbers } from '@/data/learningData';
import { speakText } from '@/lib/speech';
import { motion, AnimatePresence } from 'framer-motion';
import { playTap, playPop } from '@/lib/sounds';

const NumbersPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const currentNumber = numbers[currentIndex];

  useEffect(() => {
    speakText(`${currentNumber.num}`);
  }, [currentIndex]);

  const handleSpeak = () => {
    playTap();
    speakText(`${currentNumber.num}... ${currentNumber.word}`);
  };

  const goNext = () => {
    if (currentIndex < numbers.length - 1) {
      playPop();
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      playPop();
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden select-none font-display relative">
      
      {/* 1. Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* 2. Command Header */}
      <header className="h-24 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 shrink-0 flex items-center px-6 z-50">
        <div className="max-w-lg mx-auto w-full flex items-center justify-between">
          <button onClick={() => navigate('/')} className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70">
            <Home className="w-7 h-7" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-black italic text-white tracking-tighter uppercase">Quantum Counter</h1>
            <div className="flex items-center justify-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Data Stream</span>
            </div>
          </div>

          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Hash className="w-7 h-7" />
          </div>
        </div>
      </header>

      {/* 3. Main Hologram Display */}
      <main className="flex-1 max-w-lg mx-auto w-full p-6 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex} 
            initial={{ opacity: 0, scale: 0.8, rotateX: -10 }} 
            animate={{ opacity: 1, scale: 1, rotateX: 0 }} 
            exit={{ opacity: 0, scale: 1.2, rotateX: 10 }} 
            transition={{ type: "spring", damping: 15 }}
            className="w-full bg-white/5 backdrop-blur-2xl rounded-[4rem] border border-white/10 shadow-3xl flex flex-col h-[65vh] items-center py-12 relative overflow-hidden"
          >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            {/* Number Display */}
            <div className="flex-1 flex flex-col items-center justify-center z-10">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="relative"
              >
                <span className="text-[180px] font-black text-white leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] italic tracking-tighter">
                  {currentNumber.num}
                </span>
                {/* Orbital Decoration */}
                <div className="absolute inset-0 border-2 border-white/5 rounded-full scale-[1.4] animate-spin-slow opacity-20" />
              </motion.div>
              
              <h2 className="text-5xl font-black text-indigo-400 mt-2 uppercase italic tracking-tighter drop-shadow-lg">
                {currentNumber.word}
              </h2>
            </div>

            {/* Visual Particle Grid (Counts dots based on current number) */}
            <div className="grid grid-cols-5 gap-3 px-10 mb-8 z-10">
              {Array.from({ length: currentNumber.num }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05, type: "spring" }}
                  className="w-4 h-4 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                />
              ))}
            </div>

            {/* Speaker Interaction */}
            <button 
              onClick={handleSpeak}
              className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <Volume2 className="w-8 h-8" />
            </button>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Navigation Control Deck */}
      <footer className="h-28 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/5 shrink-0 flex items-center px-6">
        <div className="max-w-lg mx-auto w-full flex items-center justify-between gap-6">
          <button 
            onClick={goPrev} 
            disabled={currentIndex === 0} 
            className="h-16 w-20 bg-white/5 border border-white/10 rounded-[2rem] text-white/30 active:scale-90 transition-all flex items-center justify-center disabled:opacity-5"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Stepper Progress */}
          <div className="flex-1 flex flex-col items-center gap-3">
             <div className="flex gap-1.5 px-4 h-10 bg-white/5 rounded-full items-center">
              {numbers.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === currentIndex ? 'w-6 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-1.5 bg-white/10'
                  }`} 
                />
              ))}
            </div>
          </div>

          <button 
            onClick={goNext} 
            disabled={currentIndex === numbers.length - 1} 
            className="h-16 flex-[2] bg-indigo-600 border border-white/10 rounded-[2rem] text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95 transition-all flex items-center justify-center font-black text-xl gap-2 uppercase italic tracking-widest disabled:opacity-5"
          >
            Transmit
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      </footer>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NumbersPage;