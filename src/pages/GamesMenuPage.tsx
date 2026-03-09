import { useNavigate } from 'react-router-dom';
import { Layers, Palette, Puzzle, Hash, Zap, Brain, Sparkles, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const games = [
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Find matching pairs of cards!',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600 border-purple-200',
    path: '/puzzles/memory',
    emoji: '🧠'
  },
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match colors to their names!',
    icon: Palette,
    color: 'bg-orange-100 text-orange-600 border-orange-200',
    path: '/puzzles/colors',
    emoji: '🎨'
  },
  {
    id: 'shadow-match',
    title: 'Shadow Matching',
    description: 'Find the correct shadow!',
    icon: Layers,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    path: '/puzzles/shadows',
    emoji: '👤'
  },
  {
    id: 'odd-one',
    title: 'Odd One Out',
    description: 'Find the different object!',
    icon: Zap,
    color: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    path: '/puzzles/odd-one',
    emoji: '🕵️'
  },
  {
    id: 'dot-connect',
    title: 'Dot Connect',
    description: 'Connect dots to draw!',
    icon: Hash,
    color: 'bg-pink-100 text-pink-600 border-pink-200',
    path: '/puzzles/dots',
    emoji: '✏️'
  }
];

const GamesMenuPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-16 flex items-center shadow-sm">
        <div className="max-w-md mx-auto px-6 flex items-center gap-4 w-full">
          <button
            onClick={() => navigate('/')}
            className="p-2 text-primary active:scale-95 bg-primary/5 rounded-xl"
          >
            <Home className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black text-gray-900 font-display">Logic Games</h1>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-6 py-8 space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] border-4 border-primary/10 shadow-sm flex items-center gap-4 animate-speed-in">
          <div className="p-4 bg-primary/10 rounded-3xl">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 leading-tight font-display">Pick a Challenge!</h2>
            <p className="text-gray-500 text-sm font-bold">Ready to train your brain?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pb-12">
          {games.map((game, idx) => (
            <motion.button
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={game.id}
              onClick={() => navigate(game.path)}
              className={`flex items-center gap-4 p-5 bg-white border-4 rounded-[2.5rem] shadow-sm transition-all active:scale-95 ${game.color}`}
            >
              <div className="text-5xl">{game.emoji}</div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-black text-gray-900 leading-none mb-1 font-display">{game.title}</h3>
                <p className="text-gray-500 text-xs font-bold leading-tight">{game.description}</p>
              </div>
              <div className="p-3 bg-white border border-black/5 rounded-2xl">
                <game.icon className="w-5 h-5" />
              </div>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GamesMenuPage;