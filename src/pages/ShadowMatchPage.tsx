import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Layers, Home } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playCorrect, playWrong, playCelebration } from '@/lib/sounds';
import { fireBurst } from '@/lib/confetti';

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
    speakText('Match the shadow!');
  }, [level]);

  const handleOptionClick = (item: string, index: number) => {
    if (isWon) return;
    playTap();

    if (item === levels[level].item) {
      playCorrect();
      setIsWon(true);
      playCelebration();
      fireBurst();
      speakText('Correct! ' + levels[level].name);
    } else {
      playWrong();
      setWrongPick(index);
      speakText('Oops! Try again!');
      setTimeout(() => setWrongPick(null), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex flex-col">
      {/* Header - Back Button Removed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm h-16 flex items-center">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="p-2 text-blue-600 active:scale-95 bg-blue-50 rounded-xl">
            <Home className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-gray-900">Shadow Match</h1>
          </div>
          <div className="px-4 py-1.5 bg-blue-100 rounded-full">
            <span className="text-blue-600 font-black text-xs uppercase tracking-tight">Lv {level + 1}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-6 flex flex-col gap-6 animate-speed-in">
        {/* Instructions */}
        <div className="bg-white p-5 rounded-[2rem] border border-blue-100 shadow-sm flex items-center gap-4">
          <span className="text-4xl">🔍</span>
          <div>
            <h2 className="font-black text-gray-900 leading-tight">Match the shadow!</h2>
            <p className="text-gray-500 text-sm font-medium">Which one fits?</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 shadow-xl flex flex-col items-center gap-8">
          <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-9xl brightness-0 opacity-20 blur-[1px] select-none">
              {levels[level].item}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt, i)}
                className={`h-24 rounded-[2rem] border-4 flex items-center justify-center text-6xl 
                                    transition-all duration-200 ${wrongPick === i
                    ? 'bg-red-50 border-red-300 scale-95 animate-shake'
                    : 'bg-gray-50 border-gray-100 active:scale-95 active:border-blue-400 active:bg-blue-50 shadow-md'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Win Modal */}
        {isWon && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl text-center space-y-6 animate-speed-in">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2 font-display leading-tight">✨ Correct!</h3>
                <p className="text-gray-500 font-bold">You found the {levels[level].name}!</p>
              </div>
              <button
                onClick={() => level < levels.length - 1 ? setLevel(level + 1) : setLevel(0)}
                className="w-full py-5 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-[2rem] font-black text-xl shadow-lg active:scale-95 transition-all"
              >
                {level < levels.length - 1 ? 'Next Level' : 'Shadow Jump!'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ShadowMatchPage;