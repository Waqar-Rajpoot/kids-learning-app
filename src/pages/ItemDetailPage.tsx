import { useParams, useNavigate } from 'react-router-dom';
import { Home, Volume2, ChevronLeft, Heart, Utensils, Info, Music, Sparkles } from 'lucide-react';
import { animals, birds, fruits } from '@/data/learningData';
import { speakText, playAnimalSound, hasSFX } from '@/lib/speech';
import { motion } from 'framer-motion';
import { playTap, playCelebration } from '@/lib/sounds';
import { starBurst, quickPop } from '@/lib/confetti';
const ItemDetailPage = () => {
  const {
    category,
    id
  } = useParams();
  const navigate = useNavigate();
  const getItems = () => {
    if (category === 'birds') return birds;
    if (category === 'fruits') return fruits;
    return animals;
  };
  const getCategoryGradient = () => {
    switch (category) {
      case 'animals':
        return 'from-amber-400 via-orange-400 to-red-400';
      case 'birds':
        return 'from-cyan-400 via-blue-400 to-purple-400';
      case 'fruits':
        return 'from-green-400 via-emerald-400 to-teal-400';
      default:
        return 'from-primary to-purple-500';
    }
  };
  const item = getItems().find(i => i.id === id);
  if (!item) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center p-8">
        <span className="text-6xl mb-4 block">🤔</span>
        <h2 className="text-2xl font-black text-slate-700 dark:text-white mb-2">Oops!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">We couldn't find that one!</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-primary text-white rounded-2xl font-bold">
          Go Back
        </button>
      </div>
    </div>;
  }
  const handlePronounce = () => {
    playTap();
    quickPop();
    speakText(item.name);
  };
  const handleAnimalSound = () => {
    playTap();
    quickPop();
    playAnimalSound(item.name);
  };
  const handleSpeakInfo = () => {
    playTap();
    const info = `${item.name}. ${item.food ? `I love to eat ${item.food}.` : ''} ${item.fact || ''}`;
    speakText(info);
  };
  const handleCelebrate = () => {
    playTap();
    playCelebration();
    starBurst();
    speakText(item.name);
  };
  const canPlaySound = hasSFX(item.name);
  return <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-display">
    {/* Decorative Background */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className={`absolute -top-32 -right-32 w-80 h-80 bg-gradient-to-br ${getCategoryGradient()} rounded-full opacity-20 blur-3xl`} />
      <div className={`absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-br ${getCategoryGradient()} rounded-full opacity-20 blur-3xl`} />
    </div>

    {/* Header */}
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-4">
      <div className="flex items-center justify-between w-full max-w-lg mx-auto">
        <button onClick={() => {
          playTap();
          navigate(-1);
        }} className="w-12 h-12 flex items-center justify-center text-slate-500 dark:text-slate-400 active:scale-90 bg-white dark:bg-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm transition-all">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
            {item.name}
          </h1>
          <div className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              {category}
            </p>
          </div>
        </div>

        <button onClick={() => {
          playTap();
          navigate('/');
        }} className="w-12 h-12 flex items-center justify-center text-primary active:scale-90 bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20 transition-all">
          <Home className="w-5 h-5" />
        </button>
      </div>
    </header>

    <main className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Main Visual Card */}
        <motion.div initial={{
          scale: 0.9,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          type: 'spring',
          damping: 15
        }} className="relative">
          <div className={`aspect-square rounded-[2.5rem] bg-gradient-to-br ${getCategoryGradient()} p-1 shadow-2xl`}>
            <div className="w-full h-full bg-white dark:bg-slate-800 rounded-[2.25rem] flex items-center justify-center relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
              </div>

              {/* Emoji */}
              <motion.span initial={{
                scale: 0.5,
                rotate: -15
              }} animate={{
                scale: 1,
                rotate: 0
              }} transition={{
                type: 'spring',
                damping: 10,
                delay: 0.1
              }} onClick={handlePronounce} className="text-[9rem] cursor-pointer select-none drop-shadow-2xl hover:scale-105 transition-transform relative z-10">
                {item.emoji}
              </motion.span>
            </div>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="space-y-4">
          {/* Food Card */}
          {item.food && <motion.div initial={{
            y: 20,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 0.2
          }} whileTap={{
            scale: 0.98
          }} onClick={handleSpeakInfo} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 cursor-pointer shadow-md hover:shadow-lg transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Utensils className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                Favorite Food
              </p>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">
                {item.food}
              </h3>
            </div>
            <span className="text-2xl">🍽️</span>
          </motion.div>}

          {/* Fact Card */}
          {item.fact && <motion.div initial={{
            y: 20,
            opacity: 0
          }} animate={{
            y: 0,
            opacity: 1
          }} transition={{
            delay: 0.3
          }} whileTap={{
            scale: 0.98
          }} onClick={handleSpeakInfo} className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 cursor-pointer shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Fun Fact ✨
              </p>
            </div>
            <p className="text-base font-bold text-slate-600 dark:text-slate-300 leading-relaxed pl-1 border-l-4 border-amber-300 dark:border-amber-600 ml-2">
              "{item.fact}"
            </p>
          </motion.div>}
        </div>

        {/* Action Button */}
        <motion.button initial={{
          y: 20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          delay: 0.4
        }} onClick={handleCelebrate} className={`w-full py-5 bg-gradient-to-r ${getCategoryGradient()} text-white rounded-3xl font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all`}>
          <Heart className="w-6 h-6 fill-white/30" />
          <span>Say My Name! 🎤</span>
        </motion.button>
      </div>
    </main>

    {/* Bottom Safe Area */}
    <div className="h-8" />
  </div>;
};
export default ItemDetailPage;