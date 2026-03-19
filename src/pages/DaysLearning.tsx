import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, arrayUnion, increment, onSnapshot } from 'firebase/firestore';
import { DaysAdminService } from '@/services/DaysAdminService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, CheckCircle2, Star, Trophy, Loader2, Zap, PlayCircle } from 'lucide-react';

// --- UPDATED IMPORTS FOR MOBILE ---
import { speakText } from '@/lib/speech';
import { playTap, playPop } from '@/lib/sounds';

const DaysLearning = () => {
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) setUserData(snapshot.data());
        });
        return () => unsubscribeUser();
      }
    });

    const fetchDays = async () => {
      try {
        const data = await DaysAdminService.getDays();
        // Keep the natural weekly order
        setDays(data.sort((a: any, b: any) => a.order - b.order));
      } catch (error) {
        toast.error("The Caterpillar is hiding! Failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchDays();
    return () => unsubscribeAuth();
  }, []);

  // --- MOBILE OPTIMIZED SOUND HANDLER ---
  const handlePlaySound = (dayName: string) => {
    // 1. playTap gives instant tactile audio feedback
    playTap();
    
    // 2. speakText uses Capacitor Native TTS or phonetic Web Fallback
    speakText(dayName);
  };

  const handleCompleteDay = async (dayId: string, dayName: string) => {
    if (!user) return toast.error("Log in to save your progress!");
    
    // Play sound when clicking the specific action button
    handlePlaySound(dayName);

    if (userData?.completedDays?.includes(dayId)) return;

    try {
      const userRef = doc(db, "users", user.uid);
      
      await updateDoc(userRef, {
        "completedDays": arrayUnion(dayId),
        "score": increment(50),
        "xp": increment(25),
        "stats.daysLearned": increment(1),
        "learningProgress.daysMastered": increment(1),
        "stats.lastActive": new Date()
      });

      // Reward sound for mastering the day
      playPop(); 

      toast.success(`You learned ${dayName}!`, {
        description: "+50 Score & +25 XP",
        icon: <Zap className="text-yellow-400" fill="currentColor" />
      });
    } catch (error) {
      toast.error("Progress not saved");
    }
  };

  const progressPercent = days.length > 0 
    ? Math.round(((userData?.completedDays?.length || 0) / days.length) * 100) 
    : 0;

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 pb-32 font-sans selection:bg-indigo-500/30">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Journey Header */}
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <LayoutGrid size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/30 w-fit">
                <Trophy size={28} />
              </div>
              <div className="bg-slate-950 px-4 py-1.5 rounded-full border border-slate-800 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                {userData?.rank || "Rookie"}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Caterpillar Chain</h1>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Weekdays Discovery</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Progress</span>
                <span className="text-xl font-black text-white italic">{progressPercent}%</span>
              </div>
              <div className="h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Days List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {days.map((day) => {
              const isDone = userData?.completedDays?.includes(day.id);

              return (
                <motion.div 
                  key={day.id}
                  layout
                  // Sound triggers when tapping anywhere on the day card
                  onClick={() => handlePlaySound(day.name)}
                  className={`group relative p-5 rounded-[2.5rem] border transition-all duration-300 cursor-pointer active:scale-95 touch-manipulation ${
                    isDone 
                    ? 'bg-slate-900/40 border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.1)]' 
                    : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl shrink-0 transition-transform"
                      style={{ 
                        backgroundColor: day.color,
                        boxShadow: `0 0 20px ${day.color}44`
                      }}
                    >
                      {isDone ? <CheckCircle2 size={24} /> : day.order}
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg font-black text-white uppercase italic tracking-wide">{day.name}</h2>
                      <p className="text-slate-500 text-xs italic mt-0.5 font-medium leading-relaxed">
                        {isDone ? day.fact : "Master this day to find the secret!"}
                      </p>
                    </div>

                    {!isDone && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Stops double voice trigger
                          handleCompleteDay(day.id, day.name);
                        }}
                        className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg transition-all active:scale-90"
                      >
                        <PlayCircle size={20} />
                      </button>
                    )}
                    
                    {isDone && (
                      <div className="p-4 text-indigo-400">
                        <Star size={20} fill="currentColor" className="animate-pulse" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DaysLearning;