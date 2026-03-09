import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Sparkles, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LearningCard from '@/components/LearningCard';
import CategoryTabs from '@/components/CategoryTabs';
import { animals, birds, fruits } from '@/data/learningData';
import { playTap } from '@/lib/sounds';

const categories = [
  { id: 'animals', label: 'Animals', emoji: '🦁' },
  { id: 'birds', label: 'Birds', emoji: '🦜' },
  { id: 'fruits', label: 'Fruits', emoji: '🍎' },
];

const AnimalsPage = () => {
  const [activeCategory, setActiveCategory] = useState('animals');
  const navigate = useNavigate();

  const getItems = () => {
    switch (activeCategory) {
      case 'animals': return animals;
      case 'birds': return birds;
      case 'fruits': return fruits;
      default: return animals;
    }
  };

  const getCategoryGradient = () => {
    switch (activeCategory) {
      case 'animals': return 'from-orange-500 to-amber-400';
      case 'birds': return 'from-cyan-500 to-blue-400';
      case 'fruits': return 'from-emerald-500 to-green-400';
      default: return 'from-primary to-purple-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white font-display relative overflow-hidden">
      
      {/* 1. Background Aura (Fixed) */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8 }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br ${getCategoryGradient()} rounded-full blur-[160px]`}
          />
        </AnimatePresence>
      </div>

      {/* 2. STICKY TOP SECTION (Header + Tabs) */}
      <div className="sticky top-0 z-50 flex flex-col">
        {/* Header */}
        <header className="bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 px-4 py-4">
          <div className="flex items-center justify-between w-full max-w-lg mx-auto">
            <button
              onClick={() => { playTap(); navigate('/'); }}
              className="w-12 h-12 flex items-center justify-center text-white/70 active:scale-90 bg-white/5 rounded-2xl border border-white/10 shadow-xl transition-all hover:bg-white/10"
            >
              <Home className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2 justify-center uppercase italic">
                Discovery <LayoutGrid className="w-4 h-4 text-primary" />
              </h1>
              <div className="flex items-center justify-center gap-1.5 mt-0.5">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                  Explore {activeCategory}
                </p>
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              </div>
            </div>
            
            <div className="w-12" />
          </div>
        </header>

        {/* Category Tabs (Integrated into sticky stack) */}
        <div className="bg-[#0f172a]/40 backdrop-blur-lg px-4 py-3 border-b border-white/5">
          <div className="max-w-lg mx-auto bg-black/40 p-1 rounded-[2rem] border border-white/10 shadow-2xl">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={(cat) => {
                playTap();
                setActiveCategory(cat);
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. SCROLLABLE CONTENT AREA */}
      <main className="flex-1 px-4 py-6 pb-24 relative z-10 scrollbar-hide">
        <div className="max-w-lg mx-auto">
          
          {/* Stats Badge - Now clearly separated in the main flow */}
          <div className="flex justify-center mb-10">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory + "stats"}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className={`px-6 py-2.5 bg-gradient-to-r ${getCategoryGradient()} rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20`}
              >
                <span className="text-white text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2">
                  {getItems().length} {activeCategory} unlocked 🎉
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Grid of Items */}
          <div className="grid grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {getItems().map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.04, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <LearningCard
                    id={item.id}
                    name={item.name}
                    emoji={item.emoji}
                    color={item.color}
                    category={activeCategory}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom Safe Area */}
      <div className="h-10 shrink-0 pointer-events-none" />
    </div>
  );
};

export default AnimalsPage;