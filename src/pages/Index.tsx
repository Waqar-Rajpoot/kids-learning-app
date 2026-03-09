import { useNavigate } from 'react-router-dom';
import { Dog, BookOpen, Puzzle, Type, Hash, Palette, Cat, Sparkles, Languages, LogOut } from 'lucide-react';
import ModuleCard from '@/components/ModuleCard';
import { motion } from 'framer-motion';
import { playTap } from '@/lib/sounds';
import { auth } from '@/lib/firebase'; // Added to get user data
import { AuthService } from '@/services/auth.service'; // Added for logout
import { toast } from 'sonner';

const modules = [
  {
    title: 'ABC Learning',
    description: 'Learn to write A-Z',
    path: '/alphabets',
    colorClass: 'bg-purple-500',
    Icon: Languages,
    emoji: '🅰️',
  },
  {
    title: 'Animals',
    description: 'Discovery wildlife',
    path: '/animals',
    colorClass: 'bg-orange-500',
    Icon: Dog,
    emoji: '🐼',
  },
  {
    title: 'Poems',
    description: '10 Story Books',
    path: '/poems',
    colorClass: 'bg-indigo-600',
    Icon: BookOpen,
    emoji: '🧙',
  },
  {
    title: 'Logic Games',
    description: 'Puzzles & Colors',
    path: '/puzzles',
    colorClass: 'bg-blue-500',
    Icon: Puzzle,
    emoji: '🤖',
  },
  {
    title: 'Spelling',
    description: 'Play with letters',
    path: '/spelling',
    colorClass: 'bg-emerald-500',
    Icon: Type,
    emoji: '✏️',
  },
  {
    title: 'Numbers',
    description: 'Count 1 to 10',
    path: '/numbers',
    colorClass: 'bg-yellow-400',
    Icon: Hash,
    emoji: '🔢',
  },
  {
    title: 'Drawing',
    description: 'Art Studio',
    path: '/drawing',
    colorClass: 'bg-pink-500',
    Icon: Palette,
    emoji: '🎨',
  },
];

const Index = () => {
  const navigate = useNavigate();
  
  // Get the current user's name from Firebase
  const userName = auth.currentUser?.displayName || "Explorer";

  const handleLogout = async () => {
    try {
      playTap();
      await AuthService.logout();
      toast.success("See you soon!");
      // Navigation happens automatically because App.tsx is listening to auth state
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-display">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-6 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
              Bright <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Learning</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">A Kids Adventure</p>
          </div>
          <div className="flex gap-2">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-12 h-12 bg-white text-slate-400 rounded-2xl active:scale-90 transition-all border border-slate-100 flex items-center justify-center shadow-sm hover:text-red-500"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            {/* Settings Button */}
            <button
              onClick={() => { playTap(); navigate('/settings'); }}
              className="w-12 h-12 bg-white text-slate-400 rounded-2xl active:scale-90 transition-all border border-slate-100 flex items-center justify-center shadow-sm hover:border-primary/20 hover:text-primary"
            >
              <Cat className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 space-y-6 overflow-y-auto no-scrollbar">
        {/* Personalized Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary via-purple-600 to-indigo-700 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20"
        >
          <div className="relative z-10">
            {/* Displaying the User's Name here */}
            <h2 className="text-2xl font-black mb-1">Hi, {userName}! 🚀</h2>
            <p className="text-white/80 font-bold text-sm">Pick a magic quest to start!</p>
          </div>
          <Sparkles className="absolute top-[-20px] right-[-20px] w-40 h-40 text-white/10 rotate-12" />
          <div className="absolute bottom-[-10px] left-[-10px] w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-4 pb-24">
          {modules.map((module, idx) => (
            <ModuleCard
              key={module.path + idx}
              {...module}
              variant={idx === 0 ? "large" : "small"}
            />
          ))}
        </div>
      </main>

      {/* Floating Decor Items */}
      <div className="fixed bottom-6 left-6 pointer-events-none opacity-10">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
    </div>
  );
};

export default Index;