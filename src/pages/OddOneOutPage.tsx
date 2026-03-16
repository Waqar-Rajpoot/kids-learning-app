import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Home, ShieldAlert, Fingerprint, Sparkles, Loader2 } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playWrong, playCelebration } from '@/lib/sounds';
import { starBurst } from '@/lib/confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase & Service Imports
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { StatsService } from '@/services/statsService'; // Added StatsService

const OddOneOutPage = () => {
  const [dbLevels, setDbLevels] = useState([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch Anomaly Data
  useEffect(() => {
    const q = query(collection(db, "anomalyLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbLevels(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Level Reset Logic
  useEffect(() => {
    if (dbLevels.length > 0) {
      setSelected(null);
      setWrongPick(null);
      setIsWon(false);
      speakText('Locate the anomaly!');
    }
  }, [levelIndex, dbLevels]);

  const handleItemClick = (index: number) => {
    if (isWon || loading) return;
    const currentLevel = dbLevels[levelIndex];
    playTap();

    if (index === currentLevel.odd) {
      setSelected(index);
      setIsWon(true);
      playCelebration();
      starBurst();
      speakText(`Anomaly neutralized! ${currentLevel.msg}`);

      // TRIGGER STATS UPDATE HERE
      // Rewarding 20 points for finding the anomaly
      StatsService.updateUserStats(
        20, 
        `odd-one-${currentLevel.id}`, 
        true, 
        "totalAnomaliesFound"
      );

    } else {
      playWrong();
      setWrongPick(index);
      speakText('Negative. Try again.');
      
      // LOG INCORRECT PICK
      // Passing 'false' for isCorrect to increment the wrongPicks counter
      StatsService.updateUserStats(
        0, 
        `odd-one-${currentLevel.id}-fail`, 
        false
      );

      setTimeout(() => setWrongPick(null), 500);
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4 text-emerald-500">
      <Loader2 className="w-12 h-12 animate-spin" />
      <p className="font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Radar...</p>
    </div>
  );

  const currentLevel = dbLevels[levelIndex];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display flex flex-col overflow-hidden relative">
      {/* Cyber-Glow Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-green-500/5 blur-[100px] rounded-full" />
      </div>

      {/* Command Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-lg mx-auto px-6 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70">
            <Home className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Anomaly Radar</h1>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Scanning Area</span>
            </div>
          </div>

          <div className="px-5 py-2 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-white/40 font-black text-xs uppercase italic tracking-widest">Lv.{levelIndex + 1}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-6 flex flex-col gap-6 relative z-10">
        
        {/* Mission Status Module */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black leading-tight italic uppercase text-white">Detect Anomaly</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Identify the divergent object</p>
          </div>
        </motion.div>

        {/* Scanner Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/[0.02] p-8 rounded-[3.5rem] border-2 border-white/5 shadow-inner w-full">
            <div className="grid grid-cols-2 gap-5">
              {currentLevel?.items.map((item: string, idx: number) => (
                <motion.button
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleItemClick(idx)}
                  className={`aspect-square rounded-[2.5rem] border-4 transition-all duration-300 relative overflow-hidden
                    flex items-center justify-center text-7xl 
                    ${selected === idx
                      ? 'border-emerald-500 bg-emerald-500/10 scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                      : wrongPick === idx
                        ? 'border-red-500/50 bg-red-500/10 scale-95 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                        : 'border-white/5 bg-white/5 active:scale-95 active:border-emerald-500/30 hover:bg-white/[0.08]'
                    }`}
                >
                  <span className="z-10 drop-shadow-2xl">{item}</span>
                  
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-4 text-[8px] font-black text-white/10 uppercase tracking-tighter">
                      ID-{1024 + idx}
                    </div>
                    <Fingerprint className="absolute bottom-4 right-4 w-6 h-6 text-white/5 opacity-40" />
                  </div>

                  {selected === idx && (
                    <motion.div 
                      layoutId="target"
                      className="absolute inset-0 border-2 border-emerald-400/50 rounded-[2rem] animate-pulse"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Victory Interface */}
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
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                  <Trophy className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase leading-none">Target Locked</h3>
                  <p className="text-emerald-400/80 font-bold uppercase tracking-widest text-[10px] bg-emerald-500/10 py-2 rounded-full px-4 inline-block">
                    {currentLevel.msg}
                  </p>
                </div>
                
                <button
                  onClick={() => levelIndex < dbLevels.length - 1 ? setLevelIndex(levelIndex + 1) : setLevelIndex(0)}
                  className="w-full py-6 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all border border-white/20 uppercase italic tracking-widest"
                >
                  {levelIndex < dbLevels.length - 1 ? 'Next Sector' : 'Restart Hunt'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OddOneOutPage;