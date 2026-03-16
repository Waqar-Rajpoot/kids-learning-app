import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Trophy, Brain, Home, Target, Sparkles, Loader2 } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playMatch, playWrong, playCelebration } from '@/lib/sounds';
import { levelComplete } from '@/lib/confetti';
import { motion, AnimatePresence } from 'framer-motion';

// Firebase & Service Imports
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { StatsService } from '@/services/statsService';

const levelColors = [
  'from-amber-400 to-orange-600',
  'from-rose-400 to-pink-600',
  'from-blue-400 to-cyan-600',
  'from-green-400 to-emerald-600',
  'from-violet-400 to-purple-600'
];

const MemoryMatchPage = () => {
  const [dbLevels, setDbLevels] = useState([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<{ id: string; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const navigate = useNavigate();

  // 1. Fetch data from Firestore on mount
  useEffect(() => {
    const q = query(collection(db, "memoryLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const levels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbLevels(levels);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const currentLevelData = dbLevels[levelIndex];

  // 2. Initialize Game Logic
  const initializeGame = () => {
    if (!currentLevelData) return;

    const assets = currentLevelData.emojis;
    const gameCards = [...assets, ...assets]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: `${emoji}-${index}`,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(gameCards);
    setSelectedCards([]);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    if (dbLevels.length > 0) {
      initializeGame();
      speakText(`Find the matching ${currentLevelData?.theme || 'pairs'}!`);
    }
  }, [levelIndex, dbLevels]);

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    
    playTap();
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((prev) => prev + 1);
      const [first, second] = newSelected;

      if (cards[first].emoji === cards[second].emoji) {
        playMatch();
        setTimeout(async () => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          
          if (matchedCards.every((c) => c.isMatched)) {
            setIsWon(true);
            
            // Update Stats: Completion gives 20 points
            await StatsService.updateUserStats(
              20, 
              `memory_${currentLevelData.id}`, 
              true
            );

            playCelebration();
            levelComplete();
            speakText(`Level ${levelIndex + 1} cleared!`);
          }
        }, 400);
      } else {
        playWrong();
        // Track a mismatch as a 'wrongPick'
        StatsService.updateUserStats(0, null, false, "wrongPicks");

        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setSelectedCards([]);
        }, 700);
      }
    }
  };

  if (loading) return (
    <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-white/40 font-black uppercase tracking-widest text-xs">Loading Mission...</p>
    </div>
  );

  const currentColor = levelColors[levelIndex % levelColors.length];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display flex flex-col overflow-hidden relative">
      <div className={`fixed inset-0 bg-gradient-to-br ${currentColor} opacity-5 blur-[150px] pointer-events-none transition-all duration-1000`} />

      <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-lg mx-auto px-6 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70">
            <Home className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Brain Scan</h1>
            <div className="flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                {currentLevelData?.theme || 'Memory'} Mode
              </span>
            </div>
          </div>

          <button onClick={initializeGame} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/40 hover:text-white">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-6 flex flex-col gap-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
              <Target className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Moves</p>
              <p className="text-2xl font-black text-white italic">{moves}</p>
            </div>
          </div>
          <div className={`px-6 py-3 bg-gradient-to-r ${currentColor} rounded-2xl shadow-lg border border-white/20`}>
            <span className="text-white font-black text-sm uppercase italic">Lv.{levelIndex + 1}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-4">
          <div className={`grid ${cards.length > 8 ? 'grid-cols-4' : 'grid-cols-2'} gap-4 w-full`}>
            {cards.map((card, index) => (
              <motion.button
                key={card.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleCardClick(index)}
                className="aspect-square relative perspective-1000 group"
              >
                <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}>
                  <div className={`absolute inset-0 backface-hidden rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-xl border border-white/10
                    ${card.isMatched ? 'bg-emerald-500/20 border-emerald-500/50' : `bg-gradient-to-br ${currentColor} border-white/30`} 
                    rotate-y-180`}
                  >
                    <span className={`${cards.length > 8 ? 'text-4xl' : 'text-6xl'} drop-shadow-lg`}>
                      {card.emoji}
                    </span>
                  </div>

                  <div className="absolute inset-0 backface-hidden bg-white/5 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/10 shadow-lg group-hover:bg-white/10 transition-colors">
                    <Brain className="w-10 h-10 text-white/10" />
                    <div className="absolute inset-2 border border-dashed border-white/5 rounded-[1.5rem]" />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {isWon && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-center z-[100] p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-2xl w-full max-w-sm p-10 rounded-[3.5rem] border border-white/10 shadow-3xl text-center space-y-8"
              >
                <div className={`w-28 h-28 mx-auto bg-gradient-to-br ${currentColor} rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.3)] border-4 border-white/20`}>
                  <Trophy className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase">Success!</h3>
                  <p className="text-white/50 font-bold uppercase tracking-widest text-xs">Mission level {levelIndex + 1} complete</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
                   <div>
                     <p className="text-[10px] font-black text-white/30 uppercase">Moves</p>
                     <p className="text-xl font-black">{moves}</p>
                   </div>
                   <div className="border-l border-white/10">
                     <p className="text-[10px] font-black text-white/30 uppercase">Accuracy</p>
                     <p className="text-xl font-black">{Math.round(((cards.length / 2) / moves) * 100)}%</p>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => levelIndex < dbLevels.length - 1 ? setLevelIndex(levelIndex + 1) : setLevelIndex(0)}
                    className={`w-full py-6 bg-gradient-to-r ${currentColor} text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all border border-white/20 uppercase italic tracking-widest`}
                  >
                    {levelIndex < dbLevels.length - 1 ? 'Next Phase' : 'Restart Lab'}
                  </button>
                  <button
                    onClick={initializeGame}
                    className="w-full py-4 text-white/40 hover:text-white font-black text-sm uppercase tracking-widest transition-all"
                  >
                    Repeat Level
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default MemoryMatchPage;
