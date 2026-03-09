import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Trophy, Palette, Home } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playCorrect, playWrong, playCelebration } from '@/lib/sounds';
import { rainbowBurst } from '@/lib/confetti';

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
    speakText('Now pick the name!');
    setSelectedColor(color);
  };

  const handleNameClick = (name: string) => {
    if (!selectedColor) {
      speakText('First tap a color!');
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
      speakText('Correct! That is ' + name + '!');

      if (Object.keys(newMatches).length === currentLevel.colors.length) {
        setIsWon(true);
        playCelebration();
        rainbowBurst();
        speakText('Wonderful! You know your colors!');
      }
    } else {
      playWrong();
      speakText('Oops! Try again!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 text-orange-600 active:scale-95 bg-orange-50 rounded-xl">
            <Home className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-gray-900">Color Match</h1>
          </div>
          <div className="px-4 py-1.5 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full shadow-lg">
            <span className="text-white font-black text-sm">Lv {level + 1}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-6 flex flex-col gap-6">
        {/* Instructions */}
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex items-center gap-4">
          <span className="text-4xl">🎨</span>
          <div>
            <h2 className="font-black text-gray-900">Tap a color, then its name!</h2>
            <p className="text-gray-500 text-sm font-medium">Match all colors to win!</p>
          </div>
        </div>

        {/* Game Area */}
        <div className="bg-white p-6 rounded-[2rem] border-2 border-orange-100 shadow-xl">
          <div className="flex gap-6">
            {/* Colors Column */}
            <div className="flex flex-col gap-4 flex-1">
              <p className="text-xs font-black text-gray-400 uppercase text-center mb-1">Colors</p>
              {levels[level].colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  disabled={!!matches[color]}
                  className={`h-16 rounded-2xl border-4 transition-all duration-200 ${selectedColor === color
                    ? 'border-gray-800 scale-105 shadow-xl ring-4 ring-gray-200'
                    : 'border-transparent shadow-md'
                    } ${matches[color] ? 'opacity-30 grayscale' : 'active:scale-95'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Names Column */}
            <div className="flex flex-col gap-4 flex-1">
              <p className="text-xs font-black text-gray-400 uppercase text-center mb-1">Names</p>
              {shuffledNames.map((name) => {
                const isMatched = Object.values(matches).includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => !isMatched && handleNameClick(name)}
                    disabled={isMatched}
                    className={`h-16 rounded-2xl border-2 flex items-center justify-center 
                      font-black text-sm transition-all duration-200 ${isMatched
                        ? 'border-green-400 text-green-600 bg-green-50'
                        : 'border-gray-200 text-gray-700 bg-gray-50 active:bg-orange-50 active:border-orange-300 active:scale-95'
                      }`}
                  >
                    {name}
                    {isMatched && <Check className="ml-2 w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Win Modal */}
        {isWon && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">🌟 Amazing!</h3>
                <p className="text-gray-500 font-bold">You're a Color Expert!</p>
              </div>
              <button
                onClick={() => level < levels.length - 1 ? setLevel(level + 1) : setLevel(0)}
                className="w-full py-4 bg-gradient-to-r from-orange-400 to-amber-500 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
              >
                {level < levels.length - 1 ? 'Next Level' : 'Play Again'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ColorMatchPage;