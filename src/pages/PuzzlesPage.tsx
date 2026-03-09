import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Trophy, Puzzle, Home } from 'lucide-react';
import { matchingPuzzles } from '@/data/learningData';
import { speakText } from '@/lib/speech';
import { playTap, playMatch, playWrong, playCelebration } from '@/lib/sounds';
import { levelComplete } from '@/lib/confetti';

const PuzzlesPage = () => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [cards, setCards] = useState<{ id: string; emoji: string; name: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const navigate = useNavigate();

  const initializeGame = () => {
    const puzzle = matchingPuzzles[puzzleIndex];
    const gameCards = [...puzzle, ...puzzle]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        ...item,
        id: `${item.id}-${index}`,
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
  }, [puzzleIndex]);

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
            speakText('Excellent! You matched them all!');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-violet-50 flex flex-col">
      {/* Header - Back Button Removed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm h-16 flex items-center">
        <div className="max-w-md mx-auto px-5 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="p-2 text-purple-600 active:scale-95 bg-purple-50 rounded-xl">
            <Home className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <Puzzle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-gray-900">Logic Puzzles</h1>
          </div>
          <button
            onClick={initializeGame}
            className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center active:rotate-180 transition-all duration-500"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-5 flex flex-col gap-5 animate-speed-in">
        {/* Stats */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Moves</p>
              <p className="text-2xl font-black text-gray-900">{moves}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {matchingPuzzles.map((_, i) => (
              <button
                key={i}
                onClick={() => setPuzzleIndex(i)}
                className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${i === puzzleIndex
                  ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg scale-110'
                  : 'bg-gray-100 text-gray-500'
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Puzzle Grid */}
        <div className="grid grid-cols-4 gap-3 text-center">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-[1.5rem] transition-all duration-300
                                flex items-center justify-center text-3xl ${card.isMatched
                  ? 'bg-green-100 border-4 border-green-200 scale-95 opacity-50'
                  : card.isFlipped
                    ? 'bg-gradient-to-br from-purple-500 to-violet-600 border-4 border-white shadow-xl scale-105'
                    : 'bg-white border-4 border-gray-50 shadow-md active:scale-90 active:border-purple-200'
                }`}
            >
              {card.isFlipped || card.isMatched ? (
                <span className="pointer-events-none text-4xl">{card.emoji}</span>
              ) : (
                <span className="text-gray-100 font-black text-3xl">?</span>
              )}
            </button>
          ))}
        </div>

        {/* Win Modal */}
        {isWon && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
            <div className="bg-white w-full max-w-sm p-8 rounded-[3rem] shadow-2xl text-center space-y-6 animate-speed-in">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 leading-tight">🎉 Excellent!</h2>
                <p className="text-gray-500 font-bold">You solved it in {moves} moves!</p>
              </div>
              <button
                onClick={() => {
                  if (puzzleIndex < matchingPuzzles.length - 1) {
                    setPuzzleIndex(puzzleIndex + 1);
                  } else {
                    initializeGame();
                  }
                }}
                className="w-full py-5 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-[2rem] font-black text-xl shadow-lg active:scale-95 transition-all"
              >
                {puzzleIndex < matchingPuzzles.length - 1 ? 'Next Challenge' : 'Play Again'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PuzzlesPage;