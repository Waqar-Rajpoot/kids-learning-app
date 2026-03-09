import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Sparkles } from 'lucide-react';
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
      case 'animals': return 'from-amber-400 via-orange-400 to-red-400';
      case 'birds': return 'from-cyan-400 via-blue-400 to-purple-400';
      case 'fruits': return 'from-green-400 via-emerald-400 to-teal-400';
      default: return 'from-primary to-purple-500';
    }
  };

  const getCategoryEmoji = () => {
    switch (activeCategory) {
      case 'animals': return '🦁';
      case 'birds': return '🦜';
      case 'fruits': return '🍎';
      default: return '✨';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-display">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${getCategoryGradient()} rounded-full opacity-20 blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br ${getCategoryGradient()} rounded-full opacity-20 blur-3xl`} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-4">
        <div className="flex items-center justify-between w-full max-w-lg mx-auto">
          <button
            onClick={() => { playTap(); navigate('/'); }}
            className="w-12 h-12 flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-90 bg-white dark:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm transition-all hover:shadow-md"
          >
            <Home className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{getCategoryEmoji()}</span>
              <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                Discovery
              </h1>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <Sparkles className="w-3 h-3 text-primary" />
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                {activeCategory}
              </p>
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
          </div>
          
          <div className="w-12" />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 pb-24 overflow-y-auto no-scrollbar">
        <div className="max-w-lg mx-auto">
          {/* Category Tabs */}
          <div className="mb-6">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={(cat) => {
                playTap();
                setActiveCategory(cat);
              }}
            />
          </div>

          {/* Items Count Badge */}
          <div className="flex justify-center mb-6">
            <div className={`px-4 py-2 bg-gradient-to-r ${getCategoryGradient()} rounded-full shadow-lg`}>
              <span className="text-white text-sm font-bold">
                {getItems().length} {activeCategory} to explore! 🎉
              </span>
            </div>
          </div>

          {/* Grid of Items */}
          <div className="grid grid-cols-2 gap-4">
            {getItems().map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <LearningCard
                  id={item.id}
                  name={item.name}
                  emoji={item.emoji}
                  color={item.color}
                  category={activeCategory}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Safe Area */}
      <div className="h-20" />
    </div>
  );
};

export default AnimalsPage;
