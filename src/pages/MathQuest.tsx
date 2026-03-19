import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  doc, getDoc, updateDoc, collection, getDocs, 
  query, orderBy, increment, arrayUnion, serverTimestamp 
} from 'firebase/firestore';
import { 
  Trophy, Star, Target, CheckCircle2, 
  ArrowRight, Zap, HelpCircle, Loader2,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";

const MathQuest = () => {
  const [userStats, setUserStats] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'finished'>('idle');
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

  // Native navigation function
  const goBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        let completedIds: string[] = [];
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserStats(data);
          completedIds = data.completedLevels || [];
        }

        const q = query(collection(db, "math_challenges"), orderBy("levelNumber", "asc"));
        const snap = await getDocs(q);
        
        const allChallenges = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const remainingChallenges = allChallenges.filter(c => !completedIds.includes(c.id));
        
        setChallenges(remainingChallenges);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentProb = challenges[currentIndex];

  const handleCheck = async () => {
    if (!currentProb) return;
    
    const isCorrect = parseFloat(userAnswer) === currentProb.answer;

    if (isCorrect) {
      setStatus('correct');
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        
        if (userStats?.completedLevels?.includes(currentProb.id)) return;

        await updateDoc(userRef, {
          "stats.mathSolved": increment(1),
          "stats.mathPoints": increment(currentProb.points),
          "stats.lastActive": serverTimestamp(),
          score: increment(currentProb.points),
          completedLevels: arrayUnion(currentProb.id)
        });

        setUserStats((prev: any) => ({
          ...prev,
          completedLevels: [...(prev.completedLevels || []), currentProb.id],
          stats: {
            ...prev.stats,
            mathSolved: (prev.stats?.mathSolved || 0) + 1,
            mathPoints: (prev.stats?.mathPoints || 0) + currentProb.points
          }
        }));
      }
    } else {
      setStatus('wrong');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const handleNext = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer("");
      setStatus('idle');
      setShowHint(false);
    } else {
      setStatus('finished');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-500" size={40} />
      <p className="font-black italic text-slate-500 uppercase tracking-widest text-sm">Initializing Level...</p>
    </div>
  );

  if (challenges.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center relative">
        <button onClick={goBack} className="absolute top-6 left-6 p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <Trophy size={80} className="text-yellow-500 mb-6" />
        <h1 className="text-3xl font-black italic uppercase text-white">All Quests Cleared!</h1>
        <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] border border-slate-800 w-full max-w-xs">
           <p className="text-indigo-400 font-black italic text-xl">{userStats?.stats?.mathPoints || 0}</p>
           <p className="text-slate-500 text-[9px] font-black uppercase">Total Math Wealth Earned</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center p-4 font-sans">
      
      {/* HEADER WITH BACK BUTTON */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <button 
          onClick={goBack}
          className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95 shadow-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 text-center">
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Math Quest</span>
        </div>
        <div className="w-12" /> {/* Empty div for flex alignment */}
      </div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-[2rem] p-5 mb-6 grid grid-cols-2 gap-4 backdrop-blur-md">
        <div className="flex flex-col items-center border-r border-slate-800">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Math Points</span>
          <div className="flex items-center gap-2 text-emerald-400 font-black text-xl italic">
            <Star size={16} fill="currentColor"/> {userStats?.stats?.mathPoints || 0}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Solved</span>
          <div className="flex items-center gap-2 text-indigo-400 font-black text-xl italic">
            <Target size={16}/> {userStats?.stats?.mathSolved || 0}
          </div>
        </div>
      </div>

      <main className="w-full max-w-md flex-1 flex flex-col items-center py-4 space-y-8">
        
        {status === 'finished' ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
            <Trophy size={64} className="text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-black italic uppercase mb-2">Quest Complete!</h1>
            <p className="text-slate-500 font-bold mb-8">You solved all the new problems!</p>
            <Button onClick={() => window.location.reload()} className="w-full bg-indigo-600 py-6 rounded-2xl font-black italic uppercase shadow-xl">Refresh List</Button>
          </motion.div>
        ) : (
          <>
            <div className="text-center space-y-1">
              <div className="px-4 py-1 bg-indigo-500 rounded-full inline-block mb-2">
                 <span className="text-[10px] font-black uppercase text-white tracking-tighter">Level {currentProb?.levelNumber}</span>
              </div>
              <h2 className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">Current Challenge</h2>
            </div>

            <motion.div 
              key={currentProb?.id}
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              className="w-full bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] py-12 px-6 text-center shadow-2xl relative"
            >
              <h1 className="text-5xl font-black tracking-tighter text-white font-mono">
                {currentProb?.expression}
              </h1>
            </motion.div>

            <div className="w-full space-y-6">
              <div className="relative">
                <input 
                  type="number"
                  inputMode="numeric"
                  placeholder="?"
                  value={userAnswer}
                  disabled={status === 'correct'}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className={`w-full bg-slate-950 border-4 ${status === 'correct' ? 'border-emerald-500 text-emerald-400' : status === 'wrong' ? 'border-red-500 animate-bounce' : 'border-slate-800'} rounded-3xl p-8 text-center text-6xl font-black outline-none transition-all`}
                />
                {status === 'correct' && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-4 -right-2 bg-emerald-500 text-black p-2 rounded-full shadow-lg border-4 border-slate-950">
                    <CheckCircle2 size={28}/>
                  </motion.div>
                )}
              </div>

              {status === 'correct' ? (
                <Button onClick={handleNext} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-8 rounded-3xl font-black text-xl uppercase italic gap-2 transition-all">
                  Next Level <ArrowRight size={24}/>
                </Button>
              ) : (
                <Button onClick={handleCheck} disabled={!userAnswer} className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white py-8 rounded-3xl font-black text-xl uppercase italic gap-2 transition-all">
                  Check <Zap size={20} fill="currentColor"/>
                </Button>
              )}
            </div>

            {!status && currentProb?.hint && (
              <div className="w-full">
                <button onClick={() => setShowHint(!showHint)} className="text-slate-600 hover:text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 mx-auto transition-colors">
                  <HelpCircle size={14}/> {showHint ? "Hide Hint" : "Get Hint"}
                </button>
                <AnimatePresence>
                  {showHint && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 overflow-hidden">
                      <p className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-slate-400 text-sm font-medium italic text-center">
                        {currentProb.hint}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {status === 'correct' && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-4 rounded-full font-black italic shadow-2xl flex items-center gap-3 z-50">
            <Star size={20} fill="white"/> +{currentProb.points} PTS EARNED
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MathQuest;