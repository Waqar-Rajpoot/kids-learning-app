import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Palette, Hash, Zap, Brain, Sparkles, Home, Star, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { playTap } from '@/lib/sounds';

// Stats Integration
import { StatsService, UserStats } from '@/services/statsService';

const games = [
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Find matching pairs of cards!',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    path: '/puzzles/memory',
    emoji: '🧠'
  },
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match colors to their names!',
    icon: Palette,
    color: 'from-orange-500 to-amber-500',
    path: '/puzzles/colors',
    emoji: '🎨'
  },
  {
    id: 'shadow-match',
    title: 'Shadow Matching',
    description: 'Find the correct shadow!',
    icon: Layers,
    color: 'from-blue-500 to-cyan-500',
    path: '/puzzles/shadows',
    emoji: '👤'
  },
  {
    id: 'odd-one',
    title: 'Odd One Out',
    description: 'Find the different object!',
    icon: Zap,
    color: 'from-emerald-500 to-teal-500',
    path: '/puzzles/odd-one',
    emoji: '🕵️'
  },
  {
    id: 'dot-connect',
    title: 'Dot Connect',
    description: 'Connect dots to draw!',
    icon: Hash,
    color: 'from-pink-500 to-rose-500',
    path: '/puzzles/dots',
    emoji: '✏️'
  }
];

const GamesMenuPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const userStats = await StatsService.initStats();
      setStats(userStats);
    };
    loadStats();
  }, []);

  const handleNavigation = (path: string) => {
    playTap();
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-display overflow-hidden relative flex flex-col">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Glass Header */}
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

          <div className="flex flex-col items-end">
             <div className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-lg flex items-center gap-1.5">
                <Star className="w-3 h-3 text-primary fill-primary" />
                <span className="text-xs font-black text-primary">{stats?.xp || 0} XP</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-8 relative z-10 overflow-y-auto no-scrollbar">
        
        {/* User Stats Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-tight italic uppercase tracking-tight">
                {stats?.rank || "Rookie"}
              </h2>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Level {stats?.level || 1} Specialist</p>
            </div>
          </div>
          
          <div className="text-right">
             <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Progress</p>
             <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${(stats?.xp || 0) % 100}%` }}
                />
             </div>
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
              <div className={`w-2 h-12 rounded-full bg-gradient-to-b ${game.color} opacity-50 group-hover:opacity-100 transition-opacity ml-2`} />
              
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="relative text-5xl transform group-hover:scale-110 transition-transform duration-300">
                  {game.emoji}
                </div>
              </div>

              <div className="flex-1 text-left py-4">
                <h3 className="text-lg font-black text-white leading-none mb-1 uppercase italic tracking-tight group-hover:text-primary transition-colors">
                  {game.title}
                </h3>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider line-clamp-1">
                  {game.description}
                </p>
              </div>

              <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-primary/50 transition-all`}>
                <game.icon className="w-5 h-5 text-white/20 group-hover:text-primary" />
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      <div className="h-10 shrink-0 pointer-events-none" />
    </div>
  );
};

export default GamesMenuPage;