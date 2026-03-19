import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Home, Hash, Zap, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { speakText } from '@/lib/speech';
import { motion, AnimatePresence } from 'framer-motion';
import { playTap, playPop } from '@/lib/sounds';

// Firebase & Service Imports
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { StatsService } from '@/services/statsService';

const NumbersPage = () => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "numbers"), orderBy("num", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const currentNumber = items[currentIndex];

  useEffect(() => {
    if (!loading && currentNumber) {
      speakText(`${currentNumber.num}`);
    }
  }, [currentIndex, loading]);

  const handleSpeak = () => {
    playTap();
    if (currentNumber) {
      speakText(`${currentNumber.num}... ${currentNumber.word}`);
    }
  };

  const goNext = () => {
    if (currentIndex < items.length - 1) {
      StatsService.updateUserStats(
        5, 
        `number-${currentNumber.num}-learning`, 
        true, 
        "numbersLearned"
      );
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

  if (loading) {
    return (
      <div className="h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-white font-black uppercase tracking-widest text-sm">Syncing Stream...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden select-none font-display relative">
      
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[100px] rounded-full" />
      </div>

      {/* Header - Reduced height for mobile */}
      <header className="h-20 sm:h-24 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 shrink-0 flex items-center px-4 sm:px-6 z-50">
        <div className="max-w-lg mx-auto w-full flex items-center justify-between">
          <button onClick={() => navigate('/')} className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70 shrink-0">
            <Home className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
          
          <div className="text-center px-2">
            <h1 className="text-base sm:text-xl font-black italic text-white tracking-tighter uppercase truncate">Quantum Counter</h1>
            <div className="flex items-center justify-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400 animate-pulse" />
              <span className="text-[8px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Stream Active</span>
            </div>
          </div>

          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0">
            <Hash className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
        </div>
      </header>

      {/* Main Display - Flex-1 with padding to prevent overlap */}
      <main className="flex-1 max-w-lg mx-auto w-full p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-0">
        <AnimatePresence mode="wait">
          {currentNumber && (
            <motion.div 
              key={currentIndex} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 1.1 }} 
              className="w-full bg-white/5 backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[4rem] border border-white/10 shadow-3xl flex flex-col h-full max-h-[550px] items-center py-6 sm:py-12 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

              <div className="flex-1 flex flex-col items-center justify-center z-10 w-full">
                <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="relative flex flex-col items-center">
                  {/* Scaled Number Text */}
                  <span className="text-8xl sm:text-[150px] md:text-[180px] font-black text-white leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] italic tracking-tighter">
                    {currentNumber.num}
                  </span>
                  
                  <h2 className="text-3xl sm:text-5xl font-black text-indigo-400 mt-2 uppercase italic tracking-tighter drop-shadow-lg text-center">
                    {currentNumber.word}
                  </h2>
                </motion.div>
              </div>

              {/* Visual Particle Grid - Restricted height */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3 px-8 mb-4 sm:mb-8 z-10 max-h-[80px] sm:max-h-[120px] overflow-y-auto no-scrollbar">
                {Array.from({ length: Number(currentNumber.num) }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.03, type: "spring" }}
                    className="w-3 h-3 sm:w-4 sm:h-4 bg-indigo-400 rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]"
                  />
                ))}
              </div>

              <button 
                onClick={handleSpeak}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/50 active:scale-90 transition-all shrink-0"
              >
                <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation - Guaranteed to stay in view */}
      <footer className="h-24 sm:h-28 bg-[#0f172a]/80 backdrop-blur-xl border-t border-white/5 shrink-0 flex items-center px-4 sm:px-6">
        <div className="max-w-lg mx-auto w-full flex items-center justify-between gap-3 sm:gap-6 min-w-0">
          
          <button 
            onClick={goPrev} 
            disabled={currentIndex === 0} 
            className="h-14 w-14 sm:h-16 sm:w-20 bg-white/5 border border-white/10 rounded-2xl text-white/30 active:scale-90 flex items-center justify-center disabled:opacity-5 shrink-0"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Center Progress - Forces internal scroll if too many dots */}
          <div className="flex-1 flex flex-col items-center justify-center min-w-0">
            <div className="flex gap-1 sm:gap-1.5 px-3 h-8 sm:h-10 bg-white/5 rounded-full items-center max-w-[120px] sm:max-w-full overflow-hidden">
              <div className="flex gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
                {items.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 shrink-0 ${
                      i === currentIndex ? 'w-4 sm:w-6 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-1 sm:w-1.5 bg-white/10'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={goNext} 
            disabled={currentIndex === items.length - 1} 
            className="h-14 sm:h-16 px-4 sm:px-8 bg-indigo-600 border border-white/10 rounded-2xl text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-95 flex items-center justify-center font-black text-sm sm:text-xl gap-2 uppercase italic tracking-widest disabled:opacity-5 shrink-0"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        /* Utility to hide text on extremely small screens */
        @media (max-width: 380px) {
          .xs\\:inline { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default NumbersPage;