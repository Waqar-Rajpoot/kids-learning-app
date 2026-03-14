import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { Home, Sparkles, LayoutGrid, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LearningCard from '@/components/LearningCard';
import CategoryTabs from '@/components/CategoryTabs';
import { playTap } from '@/lib/sounds';

// Firebase Imports
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const categories = [
  { id: 'animal', label: 'Animals', emoji: '🦁' }, 
  { id: 'bird', label: 'Birds', emoji: '🦜' },
  { id: 'fruit', label: 'Fruits', emoji: '🍎' },
];

const AnimalsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const parentPath = location.pathname.split('/')[1] || 'animals';

  const getInitialCategory = () => {
    if (parentPath === 'birds') return 'bird';
    if (parentPath === 'fruits') return 'fruit';
    return 'animal';
  };

  const [activeCategory, setActiveCategory] = useState(getInitialCategory());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Real-time Database Listener
  useEffect(() => {
    setLoading(true);
    
    const q = query(
      collection(db, "learning_items"), 
      where("category", "==", activeCategory)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(fetchedItems);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeCategory]);

  const handleCategoryChange = (cat: string) => {
    playTap();
    setActiveCategory(cat);
    
    // Update URL when tab changes to keep parentPath in sync
    const pathMap: Record<string, string> = {
      animal: '/animals',
      bird: '/birds',
      fruit: '/fruits'
    };
    navigate(pathMap[cat], { replace: true });
  };

  const getCategoryGradient = () => {
    switch (activeCategory) {
      case 'animal': return 'from-orange-500 to-amber-400';
      case 'bird': return 'from-cyan-500 to-blue-400';
      case 'fruit': return 'from-emerald-500 to-green-400';
      default: return 'from-primary to-purple-500';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white font-display relative overflow-hidden">
      
      {/* 1. Background Aura */}
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

      {/* 2. STICKY TOP SECTION */}
      <div className="sticky top-0 z-50 flex flex-col">
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
                  Explore {activeCategory}s
                </p>
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              </div>
            </div>
            <div className="w-12" />
          </div>
        </header>

        <div className="bg-[#0f172a]/40 backdrop-blur-lg px-4 py-3 border-b border-white/5">
          <div className="max-w-lg mx-auto bg-black/40 p-1 rounded-[2rem] border border-white/10 shadow-2xl">
            <CategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </div>
      </div>

      {/* 3. SCROLLABLE CONTENT AREA */}
      <main className="flex-1 px-4 py-6 pb-24 relative z-10 scrollbar-hide">
        <div className="max-w-lg mx-auto">
          
          {/* Stats Badge */}
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
                  {loading ? "Counting..." : `${items.length} ${activeCategory}s unlocked 🎉`}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Grid of Items */}
          <div className="grid grid-cols-2 gap-5 min-h-[300px]">
            {loading ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-20 text-white/40">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Finding Friends...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
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
                      parentPath={parentPath} // Re-added parentPath prop
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>

      <div className="h-10 shrink-0 pointer-events-none" />
    </div>
  );
};

export default AnimalsPage;