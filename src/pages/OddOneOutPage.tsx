import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Zap, Home } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playCorrect, playWrong, playCelebration } from '@/lib/sounds';
import { starBurst } from '@/lib/confetti';

const levels = [
  { items: ['🍎', '🍎', '🍌', '🍎'], odd: 2, msg: 'Banana is the odd one!' },
  { items: ['🚗', '🚕', '🚙', '✈️'], odd: 3, msg: 'The airplane flies in the sky!' },
  { items: ['🐘', '🐘', '🐘', '🐭'], odd: 3, msg: 'The mouse is tiny!' },
  { items: ['☁️', '☁️', '☀️', '☁️'], odd: 2, msg: 'The sun is shining bright!' },
  { items: ['🐶', '🐱', '🐶', '🐶'], odd: 1, msg: 'Meow! The cat is different!' },
  { items: ['🟢', '🔴', '🔴', '🔴'], odd: 0, msg: 'Green is the different color!' },
  { items: ['🍕', '🍕', '🍦', '🍕'], odd: 2, msg: 'Ice cream is cold and yummy!' },
  { items: ['👟', '👟', '👟', '🎩'], odd: 3, msg: 'The hat goes on your head!' },
  { items: ['🎸', '🎸', '🥁', '🎸'], odd: 2, msg: 'The drum makes a boom boom sound!' },
  { items: ['🌙', '⭐', '⭐', '⭐'], odd: 0, msg: 'The moon glows at night!' },
];

const OddOneOutPage = () => {
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [wrongPick, setWrongPick] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSelected(null);
    setWrongPick(null);
    setIsWon(false);
    speakText('Find the different one!');
  }, [level]);

  const handleItemClick = (index: number) => {
    if (isWon) return;
    playTap();

    if (index === levels[level].odd) {
      setSelected(index);
      setIsWon(true);
      playCelebration();
      starBurst();
      speakText('Correct! ' + levels[level].msg);
    } else {
      playWrong();
      setWrongPick(index);
      speakText('Oops! Try again!');
      setTimeout(() => setWrongPick(null), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50 flex flex-col">
      {/* Header - Back Button Removed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm h-16 flex items-center">
        <div className="max-w-md mx-auto px-5 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="p-2 text-emerald-600 active:scale-95 bg-emerald-50 rounded-xl">
            <Home className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-gray-900">Odd One Out</h1>
          </div>
          <div className="px-4 py-1.5 bg-emerald-100 rounded-full">
            <span className="text-emerald-600 font-black text-xs uppercase tracking-tight">Lv {level + 1}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-6 flex flex-col gap-6 animate-speed-in">
        {/* Instructions */}
        <div className="bg-white p-5 rounded-[2rem] border border-emerald-100 shadow-sm flex items-center gap-4">
          <span className="text-4xl">🕵️</span>
          <div>
            <h2 className="font-black text-gray-900 leading-tight">Find the different one!</h2>
            <p className="text-gray-500 text-sm font-medium">Tap the odd object!</p>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-50 shadow-xl">
          <div className="grid grid-cols-2 gap-5 text-center">
            {levels[level].items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleItemClick(idx)}
                className={`aspect-square rounded-[2rem] border-4 transition-all duration-300 
                                    flex items-center justify-center text-7xl ${selected === idx
                    ? 'border-emerald-500 bg-emerald-50 scale-105 shadow-xl shadow-emerald-200'
                    : wrongPick === idx
                      ? 'border-red-400 bg-red-50 scale-95'
                      : 'border-white bg-gray-50 active:scale-95 active:border-emerald-200 shadow-md'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Win Modal */}
        {isWon && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl text-center space-y-6 animate-speed-in">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2 font-display leading-tight">🎯 Perfect!</h3>
                <p className="text-gray-500 font-bold leading-relaxed">{levels[level].msg}</p>
              </div>
              <button
                onClick={() => level < levels.length - 1 ? setLevel(level + 1) : setLevel(0)}
                className="w-full py-5 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-[2rem] font-black text-xl shadow-lg active:scale-95 transition-all"
              >
                {level < levels.length - 1 ? 'Next Level' : 'Jump Again'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OddOneOutPage;