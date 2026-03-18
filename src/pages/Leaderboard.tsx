import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Medal, Crown, Loader2, Users, ArrowUp, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const Leaderboard = () => {
  const navigate = useNavigate(); 
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("score", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTopUsers(users);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-500" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 pb-32">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Back Button & Header Section */}
        <div className="relative text-center space-y-2">
          {/* Floating Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-0 top-0 p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-90 text-slate-400 hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="inline-flex p-4 bg-yellow-500/10 rounded-3xl border border-yellow-500/20 text-yellow-500 mb-2">
            <Crown size={40} />
          </div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Hall of Fame</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Academy Top Achievers</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 items-end pt-8 px-2">
          {/* Silver - Rank 2 */}
          {topUsers[1] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-400 overflow-hidden bg-slate-800 flex items-center justify-center text-xl font-black">
                  {topUsers[1].displayName?.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-400 p-1.5 rounded-full text-slate-900"><Medal size={16}/></div>
              </div>
              <div className="h-24 w-full bg-slate-800/40 rounded-t-2xl border-x border-t border-slate-700 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[10px] font-black uppercase text-slate-400 truncate w-full">{topUsers[1].displayName}</span>
                <span className="text-sm font-black text-white">{topUsers[1].score}</span>
              </div>
            </motion.div>
          )}

          {/* Gold - Rank 1 */}
          {topUsers[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 0, scale: 0.9 }} animate={{ opacity: 1, y: -20, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-yellow-500 overflow-hidden bg-slate-800 flex items-center justify-center text-2xl font-black shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  {topUsers[0].displayName?.charAt(0)}
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce"><Crown size={24} fill="currentColor"/></div>
              </div>
              <div className="h-32 w-full bg-yellow-500/10 rounded-t-2xl border-x border-t border-yellow-500/30 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-xs font-black uppercase text-yellow-500 truncate w-full">{topUsers[0].displayName}</span>
                <span className="text-lg font-black text-white">{topUsers[0].score}</span>
              </div>
            </motion.div>
          )}

          {/* Bronze - Rank 3 */}
          {topUsers[2] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-orange-700 overflow-hidden bg-slate-800 flex items-center justify-center text-xl font-black">
                  {topUsers[2].displayName?.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-orange-700 p-1.5 rounded-full text-white"><Medal size={16}/></div>
              </div>
              <div className="h-20 w-full bg-orange-900/10 rounded-t-2xl border-x border-t border-orange-900/30 flex flex-col items-center justify-center p-2 text-center">
                <span className="text-[10px] font-black uppercase text-orange-700 truncate w-full">{topUsers[2].displayName}</span>
                <span className="text-sm font-black text-white">{topUsers[2].score}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* List for remaining ranks */}
        <div className="bg-slate-900/60 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Users size={14}/> Student Rankings
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Score</span>
          </div>

          <div className="divide-y divide-slate-800/50">
            <AnimatePresence>
              {topUsers.slice(3).map((student, index) => (
                <motion.div 
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between p-5 hover:bg-slate-800/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-xs font-black text-slate-600">#{index + 4}</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                      {student.displayName?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase text-sm italic">{student.displayName}</h4>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">{student.rank || 'Rookie'}</p>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    <span className="font-black text-white">{student.score}</span>
                    <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase">
                       <ArrowUp size={10}/> {student.xp} XP
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;