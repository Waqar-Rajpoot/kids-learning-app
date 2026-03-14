import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Home, Search, Target, Loader2 } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playCorrect, playWrong, playCelebration } from '@/lib/sounds';
import { fireBurst } from '@/lib/confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase Imports
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const ShadowMatchPage = () => {
  const [dbLevels, setDbLevels] = useState([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [isWon, setIsWon] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const navigate = useNavigate();

  // 1. Fetch Shadow Data in Real-time
  useEffect(() => {
    const q = query(collection(db, "shadowLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbLevels(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Setup Level & Shuffle Options
  useEffect(() => {
    if (dbLevels.length > 0 && dbLevels[levelIndex]) {
      const current = dbLevels[levelIndex].item;
      
      // Get all items from DB to create distractors
      const allItems = dbLevels.map(l => l.item);
      const others = allItems.filter(i => i !== current);
      
      // Shuffle distractors and pick 3, then combine with current and shuffle again
      const shuffled = [
        current, 
        ...others.sort(() => Math.random() - 0.5).slice(0, 3)
      ].sort(() => Math.random() - 0.5);
      
      setOptions(shuffled);
      setIsWon(false);
      setWrongPick(null);
      speakText('Analyze the shadow profile!');
    }
  }, [levelIndex, dbLevels]);

  const handleOptionClick = (item: string, index: number) => {
    if (isWon || loading) return;
    const currentLevel = dbLevels[levelIndex];
    playTap();

    if (item === currentLevel.item) {
      playCorrect();
      setIsWon(true);
      playCelebration();
      fireBurst();
      speakText(`Match confirmed! Profile identified as ${currentLevel.name}`);
    } else {
      playWrong();
      setWrongPick(index);
      speakText('Negative match. Try again.');
      setTimeout(() => setWrongPick(null), 500);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4 text-blue-500">
      <Loader2 className="w-12 h-12 animate-spin" />
      <p className="font-black uppercase tracking-[0.3em] text-[10px]">Initializing X-Ray...</p>
    </div>
  );

  const currentLevel = dbLevels[levelIndex];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display flex flex-col overflow-hidden relative">
      
      {/* Background Visuals */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Command Header */}
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
            <span className="text-white/40 font-black text-xs uppercase italic tracking-widest">Lv.{levelIndex + 1}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-6 flex flex-col gap-6 relative z-10">
        
        {/* Instruction Module */}
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

        {/* Scanning Pad */}
        <div className="flex-1 flex flex-col items-center justify-center gap-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative group"
          >
            <div className="absolute inset-[-20px] border border-blue-500/20 rounded-full animate-[ping_3s_linear_infinite]" />
            <div className="absolute inset-[-40px] border border-blue-500/10 rounded-full animate-[ping_4s_linear_infinite]" />
            
            <div className="w-48 h-48 bg-white/[0.03] backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/20 animate-scanline shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
              
              <span className="text-9xl brightness-0 invert opacity-10 blur-[1px] select-none transform rotate-12">
                {currentLevel?.item}
              </span>
              
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
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/5 rounded-full" />
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-white/5 rounded-full" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Victory Overlay */}
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
                  <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Subject identified as: {currentLevel.name}</p>
                </div>
                
                <button
                  onClick={() => levelIndex < dbLevels.length - 1 ? setLevelIndex(levelIndex + 1) : setLevelIndex(0)}
                  className="w-full py-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all border border-white/20 uppercase italic tracking-widest"
                >
                  {levelIndex < dbLevels.length - 1 ? 'Next Target' : 'Reset Scanner'}
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