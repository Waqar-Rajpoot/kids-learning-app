import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, arrayUnion, increment, onSnapshot } from 'firebase/firestore';
import { MonthsAdminService } from '@/services/MonthsAdminService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Star, Trophy, Loader2, Sparkles } from 'lucide-react';

// --- UPDATED IMPORTS ---
import { speakText } from '@/lib/speech';
import { playTap, playPop } from '@/lib/sounds';

const MonthsLearning = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [months, setMonths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.data());
          }
        });
        return () => unsubscribeUser();
      }
    });

    const fetchContent = async () => {
      try {
        const data = await MonthsAdminService.getMonths();
        // Sorting ensures months stay in calendar order (Jan-Dec)
        setMonths(data.sort((a: any, b: any) => a.order - b.order));
      } catch (error) {
        toast.error("Failed to load learning modules");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
    return () => unsubscribeAuth();
  }, []);

  // --- OPTIMIZED SOUND HANDLER FOR MOBILE ---
  const handlePlaySound = (monthName: string) => {
    // playTap provides immediate haptic-like feedback on touch
    playTap(); 
    
    // speakText now handles Native TTS via Capacitor or Web Fallback automatically
    speakText(monthName);
  };

  const handleLearnMonth = async (monthId: string, monthName: string) => {
    // 1. Play the month name sound
    handlePlaySound(monthName);
    
    if (!user) return toast.error("Please login to track progress!");

    if (userData?.completedMonths?.includes(monthId)) {
      return toast.info(`You already mastered ${monthName}!`);
    }

    try {
      const userRef = doc(db, "users", user.uid);
      
      await updateDoc(userRef, {
        "completedMonths": arrayUnion(monthId),
        "score": increment(100),
        "xp": increment(50),
        "stats.monthsLearned": increment(1),
        "stats.lastActive": new Date()
      });

      // 2. Play success sound after DB update
      playPop(); 

      toast.success(`Hooray! ${monthName} mastered!`, {
        description: "+100 Score added to your Academy profile",
        icon: <Sparkles className="text-yellow-400" />
      });
    } catch (error) {
      toast.error("Could not update progress");
    }
  };

  const completionRate = months.length > 0 
    ? Math.round(((userData?.completedMonths?.length || 0) / months.length) * 100) 
    : 0;

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 className="animate-spin text-pink-500" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 pb-32">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Progress Dashboard */}
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
            <Trophy size={120} className="text-pink-500" />
          </div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Calendar Quest</h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Monthly Learning Track</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">{completionRate}%</div>
                <div className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">Mastery</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="h-4 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  className="h-full bg-gradient-to-r from-pink-600 to-indigo-600 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                />
              </div>
              <div className="flex justify-between px-2">
                <span className="text-[10px] font-black text-slate-600 uppercase">Beginner</span>
                <span className="text-[10px] font-black text-slate-600 uppercase">Calendar Master</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {months.map((month) => {
              const isDone = userData?.completedMonths?.includes(month.id);

              return (
                <motion.div 
                  key={month.id}
                  layout
                  // Tapping the card plays the month name
                  onClick={() => handlePlaySound(month.name)}
                  className={`group relative overflow-hidden p-6 rounded-[2.5rem] border transition-all duration-500 cursor-pointer active:scale-[0.98] ${
                    isDone 
                    ? 'bg-slate-900/40 border-green-500/20 shadow-inner' 
                    : 'bg-slate-900 border-slate-800 hover:border-pink-500/40'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-xl shrink-0"
                      style={{ 
                        backgroundColor: month.color,
                        boxShadow: `0 0 25px ${month.color}33`
                      }}
                    >
                      {isDone ? <CheckCircle2 size={28} /> : month.order}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl font-black text-white uppercase italic tracking-wider">{month.name}</h2>
                      <p className="text-slate-400 text-sm italic mt-1 leading-relaxed">
                        {isDone ? month.fact : "??? Unlock this month to see a secret fact ???"}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents double sound trigger
                      handleLearnMonth(month.id, month.name);
                    }}
                    disabled={isDone}
                    className={`w-full mt-6 py-4 rounded-2xl font-black uppercase italic transition-all flex items-center justify-center gap-3 active:scale-95 ${
                      isDone 
                      ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    }`}
                  >
                    {isDone ? (
                      <><Star size={18} fill="currentColor"/> Lesson Completed</>
                    ) : (
                      <><BookOpen size={18}/> Start Adventure</>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MonthsLearning;