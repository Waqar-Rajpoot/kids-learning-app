import { useNavigate } from "react-router-dom";
import {
  Dog,
  BookOpen,
  Puzzle,
  Type,
  Hash,
  Palette,
  Cat,
  Sparkles,
  Languages,
  LogOut,
  Shield,
} from "lucide-react";
import ModuleCard from "@/components/ModuleCard";
import { motion } from "framer-motion";
import { playTap } from "@/lib/sounds";
import { auth } from "@/lib/firebase";
import { AuthService } from "@/services/auth.service";
import { toast } from "sonner";
// import { appendNewShadowLevels } from "@/lib/db-utils";
import { useEffect } from "react";

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
    title: "Logic Games",
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
    title: "Poems",
    description: "10 Story Books",
    path: "/poems",
    colorClass: "bg-indigo-600",
    Icon: BookOpen,
    emoji: "🧙",
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
    title: "Drawing",
    description: "Art Studio",
    path: "/drawing",
    colorClass: "bg-pink-500",
    Icon: Palette,
    emoji: "🎨",
  },
  {
    title: "Spelling",
    description: "Play with letters",
    path: "/spelling",
    colorClass: "bg-emerald-500",
    Icon: Type,
    emoji: "✏️",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const userName = auth.currentUser?.displayName || "Explorer";

  const handleLogout = async () => {
    try {
      playTap();
      await AuthService.logout();
      toast.success("See you soon!");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 overflow-x-hidden font-display">
      {/* Background Decorative Blobs - Matching Settings */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      {/* Aesthetic Header */}
      <header className="relative px-4 pt-8 pb-6 max-w-5xl mx-auto flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Bright <span className="text-primary font-medium">Learning</span>
            </h1>
            <p className="text-white/40 text-[10px] font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" /> Secure Learning Environment
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              playTap();
              navigate("/settings");
            }}
            className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 text-white/70"
          >
            <Cat className="w-6 h-6" />
          </button>
          <button
            onClick={handleLogout}
            className="p-3 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl hover:bg-red-500 transition-all active:scale-95 text-red-400 hover:text-white"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="relative px-4 max-w-5xl mx-auto space-y-6 pb-24 z-10">
        {/* Aesthetic Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 transition-all hover:border-white/20 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 font-display text-white tracking-tight">
              Hi, <span className="text-primary">{userName}</span>!
            </h2>
            <p className="text-white/40 font-medium text-base">
              Ready for your next magic quest today?
            </p>
          </div>
        </motion.div>

        {/* Modules Grid - Refined Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module, idx) => (
            <motion.div
              key={module.path + idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={idx === 0 ? "sm:col-span-2" : ""}
            >
              <ModuleCard
                {...module}
                // We keep the logic for large/small, but ModuleCard should
                // now use the same glassmorphic classes as SettingCard
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

export default Index;
