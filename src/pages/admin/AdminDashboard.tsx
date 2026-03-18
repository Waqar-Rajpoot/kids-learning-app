import { useNavigate } from "react-router-dom";
import {
  Users, BookText, Grid, Brain, Palette,
  Ghost, Box, AlertTriangle, Hash, Type,
  Music, BookOpen, ChevronRight, LayoutDashboard,
  LogOut, ShieldCheck, Mail
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const adminModules = [
  { title: "User Control", path: "users", icon: Users, color: "text-blue-400", desc: "Manage accounts & roles" },
  { title: "Learning Hub", path: "learning", icon: BookOpen, color: "text-emerald-400", desc: "Animals, Birds, & Fruits" },
  { title: "Poem Library", path: "poems", icon: Music, color: "text-purple-400", desc: "Audio & lyrics database" },
  { title: "Alphabet Lab", path: "alphabets", icon: Type, color: "text-orange-400", desc: "Character assets & sounds" },
  { title: "Memory Engine", path: "memory", icon: Brain, color: "text-pink-400", desc: "Game levels & difficulty" },
  { title: "Color Matrix", path: "colors", icon: Palette, color: "text-cyan-400", desc: "Matching logic & assets" },
  { title: "Shadow Forge", path: "shadows", icon: Ghost, color: "text-indigo-400", desc: "SVG & mask management" },
  { title: "Vector Hub", path: "vectors", icon: Box, color: "text-yellow-400", desc: "Asset paths & coordinates" },
  { title: "Anomaly Scan", path: "anomalies", icon: AlertTriangle, color: "text-red-400", desc: "Odd-one-out configurations" },
  { title: "Numeric Core", path: "numbers", icon: Hash, color: "text-green-400", desc: "Counting & math modules" },
  { title: "Spelling Unit", path: "spellings", icon: BookText, color: "text-violet-400", desc: "Vocabulary & word logic" },
  { title: "Matching Logic", path: "matching", icon: Grid, color: "text-amber-400", desc: "General pair configurations" },
  { title: "Days of the Week", path: "days", icon: Grid, color: "text-amber-400", desc: "General pair configurations" },
  { title: "Months of the Year", path: "months", icon: Grid, color: "text-amber-400", desc: "General pair configurations" },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Profile & Admin Info Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Card className="bg-white/[0.03] border-white/10 p-4 md:p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-sm">
            {/* Left: User Identity */}
            <div className="flex flex-col md:flex-row items-center gap-5 z-10">
              <div className="relative group">
                {/* Animated Outer Glow */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>

                <div className="relative">
                  {/* Hexagonal/Octagonal Border Clip */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600 p-[1.5px] shadow-[0_0_20px_rgba(59,130,246,0.2)] [clip-path:polygon(25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%)]">
                    <div className="w-full h-full bg-[#020617] flex items-center justify-center overflow-hidden [clip-path:polygon(25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%)]">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Admin"
                          className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                        />
                      ) : (
                        <div className="relative flex items-center justify-center">
                          <ShieldCheck className="text-blue-400 w-7 h-7 relative z-10" />
                          <div className="absolute inset-0 bg-blue-400/10 blur-md rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Indicator with Pulse */}
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#020617]"></span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
                    {user?.displayName || "System Admin"}
                  </h2>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail size={12} className="text-white/20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto z-10">
              <button
                onClick={handleLogout}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 group transition-all duration-300"
              >
                <LogOut size={18} className="text-white/20 group-hover:text-red-400 transition-colors" />
              </button>
            </div>

            {/* Aesthetic Background Elements */}
            <div className="absolute top-0 right-1/4 w-32 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none"></div>
          </Card>
        </motion.div>

        <hr className="border-white/5" />

        {/* Header */}
        <header className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <LayoutDashboard className="text-blue-400 w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-white/90 uppercase italic tracking-tighter">Command Center</h1>
          </div>
          <p className="text-white/40 text-[9px] uppercase tracking-[0.4em] font-bold pl-1">Module Management System</p>
        </header>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {adminModules.map((module, idx) => (
            <motion.div
              key={module.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/admin/${module.path}`)}
              className="cursor-pointer group"
            >
              <Card className="bg-white/5 border-white/10 p-6 rounded-[2rem] hover:border-blue-500/40 transition-all hover:bg-white/[0.08] relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-[#020617] border border-white/5 shadow-2xl ${module.color}`}>
                      <module.icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-black uppercase italic tracking-tighter text-gray-200 text-sm group-hover:text-blue-400 transition-colors">
                        {module.title}
                      </h3>
                      <p className="text-[9px] text-white/30 font-bold uppercase tracking-tight">
                        {module.desc}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-blue-500/40 transition-colors">
                    <ChevronRight size={16} className="text-white/20 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors" />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};