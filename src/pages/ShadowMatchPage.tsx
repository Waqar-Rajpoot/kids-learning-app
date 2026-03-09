import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Home, Search, Target } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playCorrect, playWrong, playCelebration } from '@/lib/sounds';
import { fireBurst } from '@/lib/confetti';
import { motion, AnimatePresence } from 'framer-motion';

const levels = [
  { item: '🍎', name: 'Apple' },
  { item: '🦁', name: 'Lion' },
  { item: '🐘', name: 'Elephant' },
  { item: '🍇', name: 'Grapes' },
  { item: '🦒', name: 'Giraffe' },
  { item: '🦓', name: 'Zebra' },
  { item: '🍌', name: 'Banana' },
  { item: '🐢', name: 'Turtle' },
  { item: '🦋', name: 'Butterfly' },
  { item: '🐙', name: 'Octopus' },
];

const ShadowMatchPage = () => {
  const [level, setLevel] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const current = levels[level].item;
    const others = levels.map(l => l.item).filter(i => i !== current);
    const shuffled = [current, ...others.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
    setOptions(shuffled);
    setIsWon(false);
    setWrongPick(null);
    speakText('Analyze the shadow profile!');
  }, [level]);

  const handleOptionClick = (item: string, index: number) => {
    if (isWon) return;
    playTap();

    if (item === levels[level].item) {
      playCorrect();
      setIsWon(true);
      playCelebration();
      fireBurst();
      speakText('Match confirmed! Profile identified as ' + levels[level].name);
    } else {
      playWrong();
      setWrongPick(index);
      speakText('Negative match. Try again.');
      setTimeout(() => setWrongPick(null), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display flex flex-col overflow-hidden relative">
      
      {/* 1. Background Visuals */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* 2. Command Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-lg mx-auto px-6 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70">
            <Home className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">X-Ray Scanner</h1>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Imaging Active</span>
            </div>
          </div>

          <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-white/40 font-black text-xs uppercase italic tracking-widest">Lv.{level + 1}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-6 flex flex-col gap-6 relative z-10">
        
        {/* 3. Instruction Module */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Search className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black leading-tight italic uppercase tracking-tight text-white">Silhouette ID</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Compare shadow to samples</p>
          </div>
        </motion.div>

        {/* 4. Scanning Pad (Game Area) */}
        <div className="flex-1 flex flex-col items-center justify-center gap-10">
          
          {/* The Shadow Display */}
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative group"
          >
            {/* Pulsing Rings */}
            <div className="absolute inset-[-20px] border border-blue-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
            <div className="absolute inset-[-40px] border border-blue-500/10 rounded-full animate-[ping_4s_linear_infinite]" />
            
            <div className="w-48 h-48 bg-white/[0.03] backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Scanline Effect */}
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/20 animate-scanline shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
              
              <span className="text-9xl brightness-0 invert opacity-10 blur-[1px] select-none transform rotate-12">
                {levels[level].item}
              </span>
              
              {/* Corner Accents */}
              <Target className="absolute top-4 left-4 w-4 h-4 text-white/10" />
              <Target className="absolute bottom-4 right-4 w-4 h-4 text-white/10" />
            </div>
          </motion.div>

          {/* Option Grid */}
          <div className="grid grid-cols-2 gap-5 w-full">
            {options.map((opt, i) => (
              <motion.button
                key={i}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleOptionClick(opt, i)}
                className={`h-28 rounded-[2.5rem] border-2 flex items-center justify-center text-5xl relative overflow-hidden transition-all duration-300
                  ${wrongPick === i
                    ? 'bg-red-500/10 border-red-500/50 scale-95 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                    : 'bg-white/5 border-white/10 active:scale-95 active:bg-blue-500/20 active:border-blue-500/50 hover:bg-white/[0.08]'
                  }`}
              >
                <span className="z-10">{opt}</span>
                {/* Decorative data lines on cards */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/5 rounded-full" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-white/5 rounded-full" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* 5. Victory Overlay */}
        <AnimatePresence>
          {isWon && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0f172a]/90 backdrop-blur-xl flex items-center justify-center z-[100] p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white/5 w-full max-w-sm p-10 rounded-[3.5rem] border border-white/10 shadow-3xl text-center space-y-8"
              >
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                  <Trophy className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase leading-none">ID Confirmed</h3>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Subject identified as: {levels[level].name}</p>
                </div>
                
                <button
                  onClick={() => level < levels.length - 1 ? setLevel(level + 1) : setLevel(0)}
                  className="w-full py-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all border border-white/20 uppercase italic tracking-widest"
                >
                  {level < levels.length - 1 ? 'Next Target' : 'Reset Scanner'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scanline {
          position: absolute;
          animation: scanline 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ShadowMatchPage;