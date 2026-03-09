import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Trophy, Palette, Home, Sparkles, Zap } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playCorrect, playWrong, playCelebration } from '@/lib/sounds';
import { rainbowBurst } from '@/lib/confetti';
import { motion, AnimatePresence } from 'framer-motion';

const levels = [
  { colors: ['#FF0000', '#00FF00', '#0000FF'], names: ['Red', 'Green', 'Blue'] },
  { colors: ['#FFFF00', '#FF00FF', '#00FFFF'], names: ['Yellow', 'Pink', 'Cyan'] },
  { colors: ['#FFA500', '#800080', '#008000', '#000000'], names: ['Orange', 'Purple', 'Green', 'Black'] },
  { colors: ['#FFC0CB', '#A52A2A', '#808080', '#FFFFFF'], names: ['Pink', 'Brown', 'Gray', 'White'] },
  { colors: ['#FFD700', '#C0C0C0', '#4B0082', '#808000'], names: ['Gold', 'Silver', 'Indigo', 'Olive'] },
];

const ColorMatchPage = () => {
  const [level, setLevel] = useState(0);
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [shuffledNames, setShuffledNames] = useState<string[]>([]);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    setShuffledNames([...levels[level].names].sort(() => Math.random() - 0.5));
    setMatches({});
    setSelectedColor(null);
    setIsWon(false);
    speakText('Match each color to its name!');
  }, [level]);

  const handleColorClick = (color: string) => {
    if (matches[color]) return;
    playTap();
    setSelectedColor(color);
  };

  const handleNameClick = (name: string) => {
    if (!selectedColor) {
      speakText('Pick a color first!');
      return;
    }
    playTap();

    const currentLevel = levels[level];
    const colorIndex = currentLevel.colors.indexOf(selectedColor);
    const correctName = currentLevel.names[colorIndex];

    if (name === correctName) {
      playCorrect();
      const newMatches = { ...matches, [selectedColor]: name };
      setMatches(newMatches);
      setSelectedColor(null);
      
      if (Object.keys(newMatches).length === currentLevel.colors.length) {
        setIsWon(true);
        playCelebration();
        rainbowBurst();
        speakText('Mission Complete! Color spectrum stabilized.');
      }
    } else {
      playWrong();
      speakText('Identity mismatch! Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display flex flex-col overflow-hidden relative">
      
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-lg mx-auto px-6 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70">
            <Home className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Spectrum Lab</h1>
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Analysis Active</span>
            </div>
          </div>

          <div className={`px-5 py-2 bg-white/5 border border-white/10 rounded-2xl`}>
            <span className="text-white/40 font-black text-xs uppercase italic tracking-widest">Lv.{level + 1}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-6 flex flex-col gap-6 relative z-10">
        
        {/* Instruction Banner */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-5"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Palette className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-tight italic uppercase">Sync Identity</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Connect data color to name label</p>
          </div>
        </motion.div>

        {/* Interaction Grid */}
        <div className="flex-1 flex gap-6 py-4">
          
          {/* Colors Column */}
          <div className="flex flex-col gap-4 flex-1">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-center">Data Input</p>
            {levels[level].colors.map((color, idx) => (
              <motion.button
                key={color}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleColorClick(color)}
                disabled={!!matches[color]}
                className={`relative h-24 rounded-[2rem] transition-all duration-300 group overflow-hidden border-4
                  ${selectedColor === color 
                    ? 'border-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]' 
                    : 'border-transparent'
                  }
                  ${matches[color] ? 'opacity-20 scale-90 grayscale' : 'active:scale-95'}
                `}
              >
                <div className="absolute inset-0" style={{ backgroundColor: color }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                {selectedColor === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white animate-bounce" />
                  </div>
                )}
                {matches[color] && (
                  <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-[2px] flex items-center justify-center">
                    <Check className="w-8 h-8 text-white/50" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Names Column */}
          <div className="flex flex-col gap-4 flex-1">
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-center">ID Labels</p>
            {shuffledNames.map((name, idx) => {
              const isMatched = Object.values(matches).includes(name);
              return (
                <motion.button
                  key={name}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => !isMatched && handleNameClick(name)}
                  disabled={isMatched}
                  className={`h-24 rounded-[2rem] border-2 flex items-center justify-center transition-all duration-300
                    font-black text-lg uppercase italic tracking-tighter
                    ${isMatched 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }
                  `}
                >
                  {name}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Victory Modal */}
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
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                  <Trophy className="w-14 h-14 text-white drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2 uppercase">Lab Success!</h3>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">All spectrum data synchronized</p>
                </div>
                
                <button
                  onClick={() => level < levels.length - 1 ? setLevel(level + 1) : setLevel(0)}
                  className="w-full py-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all border border-white/20 uppercase italic tracking-widest"
                >
                  {level < levels.length - 1 ? 'Next Sector' : 'Restart Lab'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ColorMatchPage;