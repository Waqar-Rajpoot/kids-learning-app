import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Home, Hash } from 'lucide-react';
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
    // Auto-speak on change
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
  return <div className="h-screen bg-slate-50 flex flex-col overflow-hidden select-none font-display">
      {/* Fixed Header */}
      <header className="h-20 bg-white border-b border-slate-100 shrink-0 flex items-center px-6 z-50 shadow-sm">
        <div className="max-w-md mx-auto w-full flex items-center justify-between">
          <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center text-primary active:scale-90 bg-primary/5 rounded-2xl transition-all">
            <Home className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Numbers Fun</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Count to 10</p>
          </div>
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner border border-indigo-100">
            <Hash className="w-6 h-6" />
          </div>
        </div>
      </header>

      {/* Fixed Content - No Scrolling */}
      <main className="flex-1 max-w-md mx-auto w-full p-6 flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{
          opacity: 0,
          scale: 0.9,
          y: 10
        }} animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }} exit={{
          opacity: 0,
          scale: 1.1,
          y: -10
        }} className="w-full bg-white rounded-[3.5rem] border-8 border-white shadow-2xl overflow-hidden flex flex-col h-[70vh] items-center py-10 relative">
            {/* Number Display */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.span initial={{
              scale: 0.5
            }} animate={{
              scale: 1
            }} className="text-[160px] font-black text-primary leading-none drop-shadow-xl select-none">
                {currentNumber.num}
              </motion.span>
              <h2 className="text-5xl font-black text-slate-800 mt-4 uppercase italic tracking-tighter drop-shadow-sm">
                {currentNumber.word}
              </h2>
            </div>

            {/* Visual Objects Grid */}
            

            {/* Speaker Button */}
            <div className="px-10 pb-8 w-full shrink-0">
              
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed Navigation Bottom */}
      <footer className="h-24 bg-white border-t border-slate-100 shrink-0 flex items-center px-6 shadow-up">
        <div className="max-w-md mx-auto w-full flex items-center justify-between gap-6">
          <button onClick={goPrev} disabled={currentIndex === 0} className="h-16 flex-1 bg-slate-50 border-4 border-slate-100 rounded-[2rem] text-slate-300 active:scale-90 transition-all flex items-center justify-center disabled:opacity-30">
            <ChevronLeft className="w-10 h-10" />
          </button>

          <div className="flex gap-1.5 px-4 h-12 bg-slate-100 rounded-full flex items-center">
            {numbers.map((_, i) => <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-primary shadow-sm' : 'w-2 bg-slate-300'}`} />)}
          </div>

          <button onClick={goNext} disabled={currentIndex === numbers.length - 1} className="h-16 flex-[2] bg-primary border-4 border-primary/20 rounded-[2rem] text-white shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center font-black text-xl gap-2 uppercase disabled:opacity-30">
            Next
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </footer>

      <style>{`
                .shadow-up {
                    box-shadow: 0 -4px 12px rgba(0,0,0,0.02);
                }
            `}</style>
    </div>;
};
export default NumbersPage;