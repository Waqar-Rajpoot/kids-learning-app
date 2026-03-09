import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Hash, Home } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playStar, playCelebration } from '@/lib/sounds';
import { emojiCannon, starBurst } from '@/lib/confetti';

const shapes = [
  { name: 'Triangle', dots: [{ x: 100, y: 40 }, { x: 160, y: 160 }, { x: 40, y: 160 }] },
  { name: 'Square', dots: [{ x: 45, y: 45 }, { x: 155, y: 45 }, { x: 155, y: 155 }, { x: 45, y: 155 }] },
  { name: 'House', dots: [{ x: 45, y: 160 }, { x: 45, y: 85 }, { x: 100, y: 30 }, { x: 155, y: 85 }, { x: 155, y: 160 }] },
  { name: 'Star', dots: [{ x: 100, y: 20 }, { x: 115, y: 70 }, { x: 170, y: 75 }, { x: 130, y: 110 }, { x: 145, y: 165 }, { x: 100, y: 135 }, { x: 55, y: 165 }, { x: 70, y: 110 }, { x: 30, y: 75 }, { x: 85, y: 70 }] },
  { name: 'Diamond', dots: [{ x: 100, y: 25 }, { x: 175, y: 100 }, { x: 100, y: 175 }, { x: 25, y: 100 }] },
];

const DotConnectPage = () => {
  const [level, setLevel] = useState(0);
  const [connected, setConnected] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);
  const navigate = useNavigate();
  const currentShape = shapes[level % shapes.length];

  useEffect(() => {
    setConnected([0]);
    setIsWon(false);
    speakText('Connect the dots to draw a ' + currentShape.name + '!');
  }, [level]);

  const handleDotClick = (index: number) => {
    if (isWon) return;

    if (index === connected.length) {
      playTap();
      playStar();
      const newConnected = [...connected, index];
      setConnected(newConnected);
      speakText((index + 1).toString());

      if (newConnected.length === currentShape.dots.length) {
        setIsWon(true);
        playCelebration();
        emojiCannon();
        setTimeout(() => starBurst(), 300);
        speakText('Beautiful ' + currentShape.name + '! Great job!');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 flex flex-col">
      {/* Header - Back Button Removed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 text-pink-600 active:scale-95 bg-pink-50 rounded-xl">
            <Home className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-gray-900">Dot Connect</h1>
          </div>
          <div className="px-4 py-1.5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full shadow-lg">
            <span className="text-white font-black text-sm">{currentShape.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-5 py-6 flex flex-col gap-6">
        {/* Instructions */}
        <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm flex items-center gap-4">
          <span className="text-4xl">✏️</span>
          <div>
            <h2 className="font-black text-gray-900">Connect the dots in order!</h2>
            <p className="text-gray-500 text-sm font-medium">Tap dot {connected.length + 1} next!</p>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="bg-white rounded-[2.5rem] border-2 border-pink-100 shadow-xl overflow-hidden aspect-square flex items-center justify-center p-6">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Lines */}
            {connected.length > 1 && connected.map((dotIdx, i) => {
              if (i === 0) return null;
              const prev = currentShape.dots[connected[i - 1]];
              const curr = currentShape.dots[dotIdx];
              return (
                <line
                  key={i}
                  x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y}
                  stroke="#ec4899" strokeWidth="5" strokeLinecap="round"
                />
              );
            })}

            {/* Closed path for win */}
            {isWon && (
              <line
                x1={currentShape.dots[connected[connected.length - 1]].x}
                y1={currentShape.dots[connected[connected.length - 1]].y}
                x2={currentShape.dots[0].x}
                y2={currentShape.dots[0].y}
                stroke="#ec4899" strokeWidth="5" strokeLinecap="round"
              />
            )}

            {/* Dots */}
            {currentShape.dots.map((dot, i) => (
              <g key={i} onClick={() => handleDotClick(i)} className="cursor-pointer">
                <circle
                  cx={dot.x} cy={dot.y} r={connected.includes(i) ? 14 : 16}
                  fill={connected.includes(i) ? '#ec4899' : '#fce7f3'}
                  stroke={connected.includes(i) ? '#be185d' : '#fbcfe8'}
                  strokeWidth="3"
                  className="transition-all duration-200"
                />
                <text
                  x={dot.x} y={dot.y + 5}
                  textAnchor="middle"
                  className={`font-black text-sm pointer-events-none ${connected.includes(i) ? 'fill-white' : 'fill-pink-500'}`}
                >
                  {i + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Win Modal */}
        {isWon && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-xl">
                <Star className="w-12 h-12 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">⭐ Amazing!</h3>
                <p className="text-gray-500 font-bold">You drew a beautiful {currentShape.name}!</p>
              </div>
              <button
                onClick={() => setLevel(level + 1)}
                className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-all"
              >
                Next Shape
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DotConnectPage;