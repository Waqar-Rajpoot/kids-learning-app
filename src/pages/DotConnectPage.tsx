import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Home, PenTool, Activity, ChevronRight, Loader2 } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playStar, playCelebration } from '@/lib/sounds';
import { emojiCannon, starBurst } from '@/lib/confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase Imports
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const DotConnectPage = () => {
  const [dbLevels, setDbLevels] = useState([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [connected, setConnected] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch Vector Schemas from 'vectorLevels' collection
  useEffect(() => {
    const q = query(collection(db, "vectorLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbLevels(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Reset Canvas on Level Change
  useEffect(() => {
    if (dbLevels.length > 0 && dbLevels[levelIndex]) {
      setConnected([0]);
      setIsWon(false);
      speakText(`Reconstruct the vector for the ${dbLevels[levelIndex].name}!`);
    }
  }, [levelIndex, dbLevels]);

  const currentShape = dbLevels[levelIndex];
  const shapeDots = currentShape?.dots || [];

  const handleDotClick = (index: number) => {
    if (isWon || loading || !currentShape) return;

    if (index === connected.length) {
      playTap();
      playStar();
      const newConnected = [...connected, index];
      setConnected(newConnected);
      speakText((index + 1).toString());

      if (newConnected.length === shapeDots.length) {
        setIsWon(true);
        playCelebration();
        emojiCannon();
        setTimeout(() => starBurst(), 300);
        speakText(`Vector complete. ${currentShape.name} data stabilized.`);
      }
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4 text-pink-500">
      <Loader2 className="w-12 h-12 animate-spin" />
      <p className="font-black uppercase tracking-[0.3em] text-[10px]">Loading Vector Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display flex flex-col overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-lg mx-auto px-6 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70">
            <Home className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-black italic text-white tracking-tighter uppercase">Vector Lab</h1>
            <div className="flex items-center justify-center gap-1.5">
              <Activity className="w-3 h-3 text-pink-400 animate-pulse" />
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em]">Drawing active</span>
            </div>
          </div>

          <div className="px-5 py-2 bg-pink-500/10 border border-pink-500/20 rounded-2xl shadow-[0_0_15px_rgba(236,72,153,0.1)]">
            <span className="text-pink-400 font-black text-xs uppercase italic tracking-widest">{currentShape?.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-6 flex flex-col gap-6 relative z-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
            <PenTool className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black leading-tight italic uppercase tracking-tight text-white">Sequence Link</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Target dot {connected.length + 1} for connection</p>
          </div>
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full aspect-square bg-white/[0.02] rounded-[3.5rem] border-2 border-white/5 shadow-inner relative p-8 group"
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 filter drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]">
              {/* Lines using x and y coordinates from Firebase */}
              {connected.length > 1 && connected.map((dotIdx, i) => {
                if (i === 0) return null;
                const prev = shapeDots[connected[i - 1]];
                const curr = shapeDots[dotIdx];
                return (
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    key={`line-${i}`}
                    x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y}
                    stroke="#ec4899" strokeWidth="6" strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_#ec4899]"
                  />
                );
              })}

              {/* Close-Loop Line for Victory */}
              {isWon && shapeDots.length > 0 && (
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  x1={shapeDots[connected[connected.length - 1]].x}
                  y1={shapeDots[connected[connected.length - 1]].y}
                  x2={shapeDots[0].x}
                  y2={shapeDots[0].y}
                  stroke="#ec4899" strokeWidth="6" strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_#ec4899]"
                />
              )}

              {/* Data Nodes using x/y from dots array */}
              {shapeDots.map((dot, i: number) => {
                const isConnected = connected.includes(i);
                const isNext = i === connected.length;

                return (
                  <g key={`dot-${i}`} onClick={() => handleDotClick(i)} className="cursor-pointer group/dot">
                    {isNext && (
                      <circle cx={dot.x} cy={dot.y} r="22" className="fill-pink-500/20 animate-ping" />
                    )}

                    <circle
                      cx={dot.x} cy={dot.y} r={isConnected ? 12 : 15}
                      className={`transition-all duration-300 ${isConnected
                        ? 'fill-pink-500 stroke-pink-300'
                        : isNext
                          ? 'fill-white/10 stroke-pink-500 animate-pulse'
                          : 'fill-[#1e293b] stroke-white/10'
                        }`}
                      strokeWidth="2.5"
                    />

                    <text
                      x={dot.x} y={dot.y + 4}
                      textAnchor="middle"
                      className={`font-black text-[10px] pointer-events-none transition-colors duration-300 ${isConnected ? 'fill-white' : isNext ? 'fill-pink-400' : 'fill-white/20'
                        }`}
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>
        </div>

        {/* Success Modal */}
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
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                  <Star className="w-14 h-14 text-white fill-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase leading-none">Structure OK</h3>
                  <p className="text-pink-400/80 font-bold uppercase tracking-widest text-[10px] bg-pink-500/10 py-2 rounded-full px-4 inline-block">
                    {currentShape.name} geometry verified
                  </p>
                </div>

                <button
                  onClick={() => {
                    // Reset local state first to prevent render glitches
                    setConnected([0]);
                    setIsWon(false);

                    // Check if we are at the last level
                    if (levelIndex < dbLevels.length - 1) {
                      setLevelIndex(prev => prev + 1);
                    } else {
                      setLevelIndex(0);
                    }
                  }}
                  className="w-full py-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all border border-white/20 uppercase italic tracking-widest flex items-center justify-center gap-2"
                >
                  {levelIndex < dbLevels.length - 1 ? (
                    <>Next Schema <ChevronRight className="w-6 h-6" /></>
                  ) : (
                    <>Restart Lab <ChevronRight className="w-6 h-6" /></>
                  )}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DotConnectPage;