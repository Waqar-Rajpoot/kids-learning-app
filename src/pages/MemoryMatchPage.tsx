import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Trophy, Brain, Home } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playMatch, playWrong, playCelebration } from '@/lib/sounds';
import { levelComplete } from '@/lib/confetti';

const levelAssets = [
  ['🦁', '🐵', '🐱', '🐶'],
  ['🍎', '🍌', '🍇', '🍓'],
  ['🚗', '✈️', '🚢', '🚂', '🚁', '🚀'],
  ['🏀', '⚽', '🎾', '🏈', '🏐', '🎱'],
  ['🌈', '☀️', '🌙', '⭐', '☁️', '⛈️', '🌧️', '❄️'],
  ['🍔', '🍕', '🍦', '🍩', '🍬', '🍪', '🍎', '🥕'],
  ['🧸', '🎨', '🎺', '🎸', '⚽', '♟️', '🎮', '🧩'],
  ['🐘', '🦒', '🦓', '🦘', '🦏', '🐅', '🐊', '🦩'],
  ['🚒', '🚓', '🚑', '🚜', '🚲', '🛴', '🛸', '🛶'],
  ['🌍', '🪐', '☄️', '🛰️', '📡', '🔭', '👨‍🚀', '👾']
];

const levelColors = [
  'from-amber-400 to-orange-500',
  'from-red-400 to-pink-500',
  'from-blue-400 to-cyan-500',
  'from-green-400 to-emerald-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-red-500',
  'from-indigo-400 to-blue-500',
  'from-teal-400 to-green-500',
  'from-fuchsia-400 to-pink-500',
  'from-sky-400 to-blue-500'
];

const MemoryMatchPage = () => {
  const [level, setLevel] = useState(0);
  const [cards, setCards] = useState<{ id: string; emoji: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const navigate = useNavigate();

  const initializeGame = () => {
    const assets = levelAssets[level];
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
    initializeGame();
    speakText('Find the matching pairs!');
  }, [level]);

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
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
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setSelectedCards([]);
          speakText('Great match!');

          if (matchedCards.every((c) => c.isMatched)) {
            setIsWon(true);
            playCelebration();
            levelComplete();
            speakText('Amazing! You completed level ' + (level + 1) + '!');
          }
        }, 400);
      } else {
        playWrong();
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

  const currentColor = levelColors[level % levelColors.length];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-purple-50 flex flex-col">
      {/* Header - Back Button Removed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm h-16 flex items-center">
        <div className="max-w-md mx-auto px-5 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="p-2 text-violet-600 active:scale-95 bg-violet-50 rounded-xl">
            <Home className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 bg-gradient-to-br ${currentColor} rounded-xl flex items-center justify-center shadow-lg`}>
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-gray-900">Memory Match</h1>
          </div>
          <button
            onClick={initializeGame}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-4 flex flex-col gap-4 animate-speed-in">
        {/* Stats Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Moves</p>
              <p className="text-2xl font-black text-gray-900">{moves}</p>
            </div>
          </div>
          <div className={`px-5 py-2 bg-gradient-to-r ${currentColor} rounded-full shadow-lg`}>
            <span className="text-white font-black text-sm">Level {level + 1}</span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid ${cards.length > 8 ? 'grid-cols-4' : 'grid-cols-2'} gap-3`}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-[2rem] transition-all duration-300 flex items-center justify-center 
                ${card.isMatched
                  ? 'bg-green-100 border-4 border-green-300 scale-95 opacity-50'
                  : card.isFlipped
                    ? `bg-gradient-to-br ${currentColor} border-4 border-white shadow-xl scale-105`
                    : 'bg-white border-4 border-gray-50 shadow-md active:scale-95 active:border-violet-200'
                }`}
            >
              {card.isFlipped || card.isMatched ? (
                <span className={`text-4xl ${cards.length > 8 ? 'text-3xl' : 'text-5xl'}`}>{card.emoji}</span>
              ) : (
                <span className="text-4xl text-gray-100 font-black">?</span>
              )}
            </button>
          ))}
        </div>

        {/* Win Modal */}
        {isWon && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl text-center space-y-6 animate-speed-in">
              <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${currentColor} rounded-full flex items-center justify-center shadow-xl`}>
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">🎉 Amazing!</h3>
                <p className="text-gray-500 font-bold">You completed Level {level + 1} in {moves} moves!</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => level < levelAssets.length - 1 ? setLevel(level + 1) : setLevel(0)}
                  className={`w-full py-5 bg-gradient-to-r ${currentColor} text-white rounded-[2rem] font-black text-xl shadow-lg active:scale-95 transition-all`}
                >
                  {level < levelAssets.length - 1 ? 'Next Level' : 'Play Again'}
                </button>
                <button
                  onClick={initializeGame}
                  className="w-full py-4 bg-gray-50 text-gray-500 rounded-2xl font-black active:scale-95 transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MemoryMatchPage;