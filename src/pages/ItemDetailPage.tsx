import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Home, Volume2, ChevronLeft, Heart, Utensils, Info, Music, Sparkles } from 'lucide-react';
import { speakText, playAnimalSound, hasSFX } from '@/lib/speech';
import { motion } from 'framer-motion';
import { playTap, playCelebration } from '@/lib/sounds';
import { starBurst, quickPop } from '@/lib/confetti';

const ItemDetailPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();

  // State to hold the database item
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItemFromFirestore = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Fetches directly from the collection named after your category (e.g., "animals")
        // If your collection name is different (like "learning"), change the string below
        const docRef = doc(db, "learning_items", id); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such item in database!");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemFromFirestore();
  }, [id]);

  const getCategoryGradient = () => {
    switch (category) {
      case 'animals': return 'from-orange-500 via-amber-400 to-yellow-300';
      case 'birds': return 'from-cyan-500 via-blue-500 to-indigo-400';
      case 'fruits': return 'from-emerald-500 via-green-400 to-lime-300';
      default: return 'from-primary to-purple-500';
    }
  };

  // 1. Loading State UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/50 font-black uppercase tracking-widest">Finding Item...</p>
        </div>
      </div>
    );
  }

  // 2. Not Found UI
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center p-8 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl">
          <span className="text-7xl mb-4 block animate-bounce">🤔</span>
          <h2 className="text-2xl font-black text-white mb-2">Item Not Found</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-6 px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Helpers for actions
  const itemName = item.name || "Unknown";

  const handlePronounce = () => {
    playTap();
    quickPop();
    speakText(itemName);
  };

  const handleAnimalSound = () => {
    playTap();
    quickPop();
    playAnimalSound(itemName);
  };

  const handleSpeakInfo = () => {
    playTap();
    const info = `${itemName}. ${item.food ? `I love to eat ${item.food}.` : ''} ${item.fact || ''}`;
    speakText(info);
  };

  const handleCelebrate = () => {
    playTap();
    playCelebration();
    starBurst();
    speakText(itemName);
  };

  const canPlaySound = hasSFX(itemName);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-white font-display overflow-hidden relative">
      
      {/* Dynamic Background Aura */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br ${getCategoryGradient()} opacity-20 blur-[180px] rounded-full animate-pulse`} />
      </div>

      {/* Glassmorphic Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="flex items-center justify-between w-full max-w-lg mx-auto">
          <button 
            onClick={() => { playTap(); navigate(-1); }} 
            className="w-12 h-12 flex items-center justify-center text-white/70 active:scale-90 bg-white/5 rounded-2xl border border-white/10 shadow-xl transition-all hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="text-center">
            <h1 className="text-xl font-black text-white tracking-tighter uppercase italic">
              {itemName}
            </h1>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <Sparkles className="w-3 h-3 text-primary animate-pulse" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                {category} Expert
              </p>
            </div>
          </div>

          <button 
            onClick={() => { playTap(); navigate('/'); }} 
            className="w-12 h-12 flex items-center justify-center text-primary active:scale-90 bg-primary/10 rounded-2xl border border-primary/20 shadow-xl transition-all"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 overflow-y-auto no-scrollbar relative z-10">
        <div className="max-w-lg mx-auto space-y-8">
          
          {/* Hero Visual Container */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            className="relative"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient()} opacity-20 blur-2xl animate-pulse rounded-full`} />
            
            <div className="relative aspect-square rounded-[3.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-2 shadow-inner overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.03] bg-[grid-white_20px]" />
              
              <motion.span 
                whileHover={{ scale: 1.1, rotate: 5 }}
                onClick={handlePronounce}
                className="text-[12rem] cursor-pointer drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none relative z-10"
              >
                {item.emoji}
              </motion.span>

              {canPlaySound && (
                <button 
                  onClick={handleAnimalSound}
                  className="absolute bottom-6 right-6 w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-xl active:scale-90 transition-all hover:bg-white/20"
                >
                  <Music className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Glass Info Cards */}
          <div className="grid gap-4">
            {item.food && (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={handleSpeakInfo}
                className="p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center gap-5 cursor-pointer hover:bg-white/10 transition-all shadow-xl group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryGradient()} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <Utensils className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Favorite Food</p>
                  <h3 className="text-xl font-black text-white italic">{item.food}</h3>
                </div>
                <span className="text-3xl opacity-50">🍽️</span>
              </motion.div>
            )}

            {item.fact && (
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={handleSpeakInfo}
                className="p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 cursor-pointer hover:bg-white/10 transition-all shadow-xl group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/30">
                    <span className="font-bold">!</span>
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Fun Fact</p>
                </div>
                <p className="text-lg font-bold text-white/80 leading-relaxed italic border-l-4 border-primary/40 pl-4">
                  "{item.fact}"
                </p>
              </motion.div>
            )}
          </div>

          {/* Giant Action Button */}
          <motion.button 
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCelebrate}
            className={`w-full py-6 bg-gradient-to-r ${getCategoryGradient()} text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20`}
          >
            <Volume2 className="w-7 h-7 animate-pulse" />
            <span className="uppercase tracking-widest italic">Hear My Voice!</span>
            <Heart className="w-7 h-7 fill-white/20" />
          </motion.button>
        </div>
      </main>

      <div className="h-10 shrink-0 pointer-events-none" />
    </div>
  );
};

export default ItemDetailPage;