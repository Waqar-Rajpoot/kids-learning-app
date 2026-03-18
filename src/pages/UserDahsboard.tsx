import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dog,
  BookOpen,
  Puzzle,
  Type,
  Hash,
  Palette,
  Sparkles,
  Languages,
  Shield,
  Trophy,
  Zap,
  User,
  ChevronRight,
  TrendingUp,
  Sun,
} from "lucide-react";
import ModuleCard from "@/components/ModuleCard";
import { motion } from "framer-motion";
import { playTap } from "@/lib/sounds";
import { auth } from "@/lib/firebase";
import { StatsService, UserStats } from "@/services/statsService";

const modules = [
  {
    title: "ABC Learning",
    description: "Learn to write A-Z",
    path: "/alphabets",
    colorClass: "bg-primary",
    Icon: Languages,
    emoji: "🅰️",
  },
  {
    title: "Numbers",
    description: "Count 1 to 10",
    path: "/numbers",
    colorClass: "bg-yellow-400",
    Icon: Hash,
    emoji: "🔢",
  },
  {
    title: "Spelling",
    description: "Play with letters",
    path: "/spelling",
    colorClass: "bg-emerald-500",
    Icon: Type,
    emoji: "✏️",
  },
  {
    title: "Logics",
    description: "Puzzles & Colors",
    path: "/puzzles",
    colorClass: "bg-blue-500",
    Icon: Puzzle,
    emoji: "🤖",
  },
  {
    title: "Animals",
    description: "Discovery wildlife",
    path: "/animals",
    colorClass: "bg-orange-500",
    Icon: Dog,
    emoji: "🐼",
  },
  {
    title: "Poems Library",
    description: "10 Story Books",
    path: "/poems",
    colorClass: "bg-indigo-600",
    Icon: BookOpen,
    emoji: "🧙",
  },
  {
    title: "Days Learning",
    description: "Learn about days of the week",
    path: "/days",
    colorClass: "bg-cyan-500",
    Icon: Hash,
    emoji: "📅",
  },
  {
    title: "Months Learning",
    description: "Learn about months of the year",
    path: "/months",
    colorClass: "bg-rose-500",
    Icon: Hash,
    emoji: "📆",
  },
  {
    title: "Drawing",
    description: "Art Studio",
    path: "/drawing",
    colorClass: "bg-pink-500",
    Icon: Palette,
    emoji: "🎨",
  },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const userName = auth.currentUser?.displayName || "Explorer";

  useEffect(() => {
    const fetchStats = async () => {
      const currentStats = await StatsService.initStats();
      setStats(currentStats);
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 overflow-x-hidden font-display">
      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <header className="relative px-4 pt-8 pb-6 max-w-5xl mx-auto flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent uppercase italic">
              Bright <span className="text-primary">Learning</span>
            </h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" /> Secure Lab Active
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Quick Access Leaderboard Button */}
          <button
            onClick={() => { playTap(); navigate("/leaderboard"); }}
            className="p-3 bg-purple-500/10 backdrop-blur-md border border-purple-500/20 rounded-2xl hover:bg-purple-500/20 transition-all text-purple-400 hidden sm:flex"
          >
            <Trophy className="w-6 h-6" />
          </button>
          <button
            onClick={() => { playTap(); navigate("/profile"); }}
            className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white/70"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="relative px-4 max-w-5xl mx-auto space-y-6 pb-24 z-10">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 transition-all hover:border-white/20 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 font-display text-white tracking-tight italic">
              Hi, <span className="text-primary">{userName}</span>!
            </h2>
            <p className="text-white/40 font-black uppercase tracking-widest text-xs">
              Ready for your next magic quest?
            </p>
          </div>

          <div className="relative z-10 flex gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none px-6 py-3 bg-black/40 rounded-3xl border border-white/5 flex flex-col items-center">
              <div className="flex items-center gap-2 text-orange-500 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xl font-black tracking-tighter">{stats?.totalXp || 0}</span>
              </div>
              <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Total XP</span>
            </div>

            <div 
              onClick={() => navigate("/leaderboard")}
              className="flex-1 md:flex-none px-6 py-3 bg-black/40 rounded-3xl border border-white/5 flex flex-col items-center cursor-pointer hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-2 text-primary mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-xl font-black tracking-tighter">#{stats?.rank || "--"}</span>
              </div>
              <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Global Rank</span>
            </div>
          </div>
        </motion.div>

        {/* --- SEPARATE LEADERBOARD PROMO SECTION --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => { playTap(); navigate("/leaderboard"); }}
          className="relative group cursor-pointer overflow-hidden rounded-[2rem] border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-1 transition-all hover:border-purple-500/40"
        >
          <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[1.8rem] p-5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black uppercase italic text-sm tracking-wider text-white">Challenger Board</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">See who is the top explorer today!</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-purple-400 font-black italic text-xs uppercase group-hover:gap-4 transition-all">
                View All <ChevronRight size={16} />
             </div>
          </div>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module, idx) => (
            <motion.div
              key={module.path + idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (idx * 0.05) }}
              className={idx === 0 ? "sm:col-span-2" : ""}
            >
              <ModuleCard
                {...module}
                variant={idx === 0 ? "large" : "small"}
              />
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating Sparkle Decor */}
      <div className="fixed bottom-8 left-8 pointer-events-none">
        <Sparkles className="w-8 h-8 text-primary/20 animate-pulse" />
      </div>
    </div>
  );
};

export default UserDashboard;