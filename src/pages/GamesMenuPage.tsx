import { useNavigate } from 'react-router-dom';
import { Layers, Palette, Puzzle, Hash, Zap, Brain, Sparkles, Home, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { playTap } from '@/lib/sounds';

const games = [
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Find matching pairs of cards!',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    glow: 'shadow-purple-500/20',
    path: '/puzzles/memory',
    emoji: '🧠'
  },
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match colors to their names!',
    icon: Palette,
    color: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-500/20',
    path: '/puzzles/colors',
    emoji: '🎨'
  },
  {
    id: 'shadow-match',
    title: 'Shadow Matching',
    description: 'Find the correct shadow!',
    icon: Layers,
    color: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-500/20',
    path: '/puzzles/shadows',
    emoji: '👤'
  },
  {
    id: 'odd-one',
    title: 'Odd One Out',
    description: 'Find the different object!',
    icon: Zap,
    color: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    path: '/puzzles/odd-one',
    emoji: '🕵️'
  },
  {
    id: 'dot-connect',
    title: 'Dot Connect',
    description: 'Connect dots to draw!',
    icon: Hash,
    color: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
    path: '/puzzles/dots',
    emoji: '✏️'
  }
];

const GamesMenuPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    playTap();
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display overflow-hidden relative flex flex-col">
      
      {/* 1. Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* 2. Glass Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-lg mx-auto px-6 flex items-center justify-between w-full">
          <button
            onClick={() => handleNavigation('/')}
            className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl shadow-xl active:scale-90 transition-all text-white/70"
          >
            <Home className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Brain Lab</h1>
            <div className="flex items-center justify-center gap-1">
              <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Training Zone</span>
            </div>
          </div>

          <div className="w-12" />
        </div>
      </header>

      {/* 3. Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8 relative z-10 overflow-y-auto no-scrollbar">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-5 mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-tight italic uppercase tracking-tight">Mission Control</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Select your next challenge</p>
          </div>
        </motion.div>

        {/* Games List */}
        <div className="grid grid-cols-1 gap-4 pb-20">
          {games.map((game, idx) => (
            <motion.button
              key={game.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.08, type: 'spring', stiffness: 100 }}
              onClick={() => handleNavigation(game.path)}
              className="group relative flex items-center gap-5 p-2 pr-6 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-[2rem] transition-all active:scale-[0.97]"
            >
              {/* Left Color Bar Accent */}
              <div className={`w-2 h-12 rounded-full bg-gradient-to-b ${game.color} opacity-50 group-hover:opacity-100 transition-opacity ml-2`} />
              
              {/* Emoji Icon Container */}
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="relative text-5xl transform group-hover:scale-110 transition-transform duration-300">
                  {game.emoji}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 text-left py-4">
                <h3 className="text-lg font-black text-white leading-none mb-1 uppercase italic tracking-tight group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider line-clamp-1">
                  {game.description}
                </p>
              </div>

              {/* Right Action Icon */}
              <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-primary/50 transition-all`}>
                <game.icon className="w-5 h-5 text-white/20 group-hover:text-primary" />
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      {/* Bottom Visual Buffer */}
      <div className="h-10 shrink-0 pointer-events-none" />
    </div>
  );
};

export default GamesMenuPage;