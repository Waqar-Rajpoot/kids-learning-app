import React, { useState, useEffect } from 'react';
import {
    Volume2, Music, ArrowLeft, Sparkles, User, LogOut,
    Edit2, Check, X, Shield, Trash2, Trophy,
    BookOpen, Palette, Type, Hash, Star, Zap, Flame,
    Eye,
    XCircle,
    Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/context/AppSettingsContext';
import { auth } from '@/lib/firebase';
import { AuthService } from '@/services/auth.service';
import { StatsService } from '@/services/statsService';
import { toast } from 'sonner';

import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FullUserStats {
    score: number;
    xp: number;
    totalXp: number;
    level: number;
    rank: string;
    badges: string[];
    stats: {
        poemsRead: number;
        drawingsCreated: number;
        spellingsMastered: number;
        numbersLearned: number;
        alphabetsLearned: number;
        gamesPlayed: number;
        currentStreak: number;
        totalTimeSpent: number;
        totalAnomaliesFound: number;
        wrongPicks: number;
    };
}


// --- Sub-component: MiniStatCard (Mobile Optimized) ---
const MiniStatCard = ({ icon, label, value, color }: { icon, label: string, value: number | string, color: string }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:bg-white/10 transition-all">
        <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${color} bg-opacity-20 text-white shrink-0`}>
            {React.createElement(icon, { size: 18 })}
        </div>
        <div className="min-w-0">
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold truncate">{label}</p>
            <p className="text-lg md:text-xl font-black text-white truncate">{value}</p>
        </div>
    </div>
);

// --- Sub-component: SettingCard (Mobile Optimized) ---
interface SettingCardProps {
    title: string;
    desc: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
    color: string;
}

const SettingCard = ({ title, desc, icon, active, onClick, color }: SettingCardProps) => (
    <button
        onClick={onClick}
        className={`group relative flex flex-row sm:flex-col items-center sm:items-start gap-4 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border transition-all duration-300 text-left w-full overflow-hidden ${active ? `border-white/20 bg-white/5 shadow-lg` : 'border-white/5 bg-white/[0.01]'
            }`}
    >
        <div className={`p-3 rounded-xl sm:rounded-2xl transition-all duration-300 shrink-0 ${active ? `${color} text-white` : 'bg-white/5 text-white/20'}`}>
            {icon}
        </div>

        <div className="flex-1 sm:mt-1">
            <h3 className={`font-bold text-sm sm:text-base transition-colors ${active ? 'text-white' : 'text-white/40'}`}>{title}</h3>
            <p className="text-white/25 text-[9px] sm:text-[10px] uppercase font-black tracking-widest">{desc}</p>
        </div>

        <div className={`w-10 h-6 rounded-full relative transition-colors shrink-0 ${active ? color : 'bg-white/10'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-5' : 'left-1'}`} />
        </div>
    </button>
);

const ProfilePage = () => {
    const navigate = useNavigate();
    const { settings, updateSetting } = useAppSettings();
    const currentUser = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(currentUser?.displayName || "");
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<FullUserStats | null>(null);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const userStats = await StatsService.initStats();
                console.log("Fetched user stats:", userStats);
                setStats(userStats as unknown as FullUserStats);

            } catch (error) {
                console.error("Failed to load stats", error);
            }
        };
        loadStats();
    }, []);

    const formatTime = (seconds: number) => {
    if (!seconds || seconds < 0) return "0m";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
};

    const handleUpdateProfile = async () => {
        if (!newName.trim() || newName === currentUser?.displayName) { setIsEditing(false); return; }
        setLoading(true);
        try {
            await AuthService.updateUserProfile(newName);
            toast.success("Profile updated!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
        } finally { setLoading(false); }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            // Assuming AuthService.deleteAccount exists or similar logic
            await AuthService.deleteAccount(); 
            toast.success("Account permanently deleted");
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to delete account. You may need to re-login first.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 overflow-x-hidden pb-10 md:pb-20">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <header className="relative px-4 pt-6 md:pt-8 pb-6 max-w-5xl mx-auto flex items-center gap-4">
                <button onClick={() => navigate('/')} className="p-2.5 md:p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl hover:bg-white/10 transition-all">
                    <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-white/80" />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-black tracking-tight font-display bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Profile <span className="text-primary font-medium">Zone</span>
                    </h1>
                    <p className="text-white/40 text-[9px] md:text-[10px] font-medium flex items-center gap-1 uppercase tracking-widest">
                        <Shield className="w-3 h-3" /> Secure Management
                    </p>
                </div>
            </header>

            <main className="relative px-4 max-w-5xl mx-auto space-y-6 md:space-y-10">

                {/* 1. PROFILE SECTION (UNTOUCHED LOGIC) */}
                <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex-[1.5] relative overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 md:p-8 transition-all hover:border-white/20">
                        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                                <div className="w-full h-full rounded-full bg-[#1a2235] flex items-center justify-center">
                                    <User className="w-8 h-8 md:w-10 md:h-10 text-white/80" />
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-2">
                                {isEditing ? (
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 w-full text-white" />
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={handleUpdateProfile} className="p-2 bg-primary rounded-xl flex-1 sm:flex-none"><Check /></button>
                                            <button onClick={() => setIsEditing(false)} className="p-2 bg-white/10 rounded-xl flex-1 sm:flex-none"><X /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <h2 className="text-xl md:text-2xl font-black italic text-white/80 uppercase tracking-tighter">{currentUser?.displayName || "Explorer"}</h2>
                                            <button onClick={() => setIsEditing(true)} className="p-1.5 text-white/40 hover:text-primary"><Edit2 size={16} /></button>
                                        </div>
                                        <p className="text-xs md:text-sm text-white/40 font-medium truncate max-w-[250px] mx-auto md:mx-0">{currentUser?.email}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl md:rounded-[2.5rem] border border-white/10 p-5 md:p-6 flex flex-col justify-between backdrop-blur-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em]">Rank</p>
                                <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white leading-none">{stats?.rank || "Rookie"}</h3>
                            </div>
                            <div className="p-2.5 bg-white/10 rounded-xl text-yellow-400"><Trophy size={20} /></div>
                        </div>
                        <div className="mt-4 md:mt-0 space-y-2">
                            <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white/40">Level {stats?.level || 1}</span>
                                <span className="text-primary">{stats?.xp || 0} XP</span>
                            </div>
                            <div className="w-full h-2.5 md:h-3 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(stats?.xp || 0) % 100}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. ACADEMY STATS SECTION (Mobile Optimized) */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30 px-2">Academy Learning</h3>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <MiniStatCard icon={BookOpen} label="Poems" value={stats?.stats.poemsRead || 0} color="bg-blue-500" />
                        <MiniStatCard icon={Palette} label="Drawings" value={stats?.stats.drawingsCreated || 0} color="bg-purple-500" />
                        <MiniStatCard icon={Type} label="Alphabets" value={stats?.stats.alphabetsLearned || 0} color="bg-pink-500" />
                        <MiniStatCard icon={Star} label="Spellings" value={stats?.stats.spellingsMastered || 0} color="bg-amber-500" />
                        <MiniStatCard icon={Hash} label="Numbers" value={stats?.stats.numbersLearned || 0} color="bg-emerald-500" />
                        <MiniStatCard icon={Eye} label="Anomalies" value={stats?.stats.totalAnomaliesFound || 0} color="bg-emerald-500" />
                        <MiniStatCard icon={XCircle} label="Wrong Picks" value={stats?.stats.wrongPicks || 0} color="bg-emerald-500" />
                        <MiniStatCard icon={Clock} label="Time Spent" value={formatTime(stats?.stats.totalTimeSpent || 0)} color="bg-indigo-500" />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                        <div className="bg-white/[0.02] border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-[2rem] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Flame className="text-orange-500" size={20} />
                                <span className="text-xs md:text-sm font-bold text-white/60">Streak</span>
                            </div>
                            <span className="text-lg md:text-xl font-black">{stats?.stats.currentStreak || 0} Days</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-[2rem] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap className="text-yellow-400" size={20} />
                                <span className="text-xs md:text-sm font-bold text-white/60">Score</span>
                            </div>
                            <span className="text-lg md:text-xl font-black">{stats?.totalXp || 0}</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 p-4 md:p-5 rounded-2xl md:rounded-[2rem] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sparkles className="text-primary" size={20} />
                                <span className="text-xs md:text-sm font-bold text-white/60">Games</span>
                            </div>
                            <span className="text-lg md:text-xl font-black">{stats?.stats.gamesPlayed || 0}</span>
                        </div>
                    </div>
                </div>

                {/* 3. SETTINGS SECTION (Mobile Optimized) */}
                <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30 px-2">App Experience</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        <SettingCard title="Girl's Voice" desc="Narrator" icon={<Volume2 size={20} />} active={settings.isGirlVoice} onClick={() => updateSetting('isGirlVoice', !settings.isGirlVoice)} color="bg-primary" />
                        <SettingCard title="Music" desc="Background" icon={<Music size={20} />} active={settings.bgMusic} onClick={() => updateSetting('bgMusic', !settings.bgMusic)} color="bg-secondary" />
                        <SettingCard title="Magic" desc="Effects" icon={<Sparkles size={20} />} active={settings.magicEffects} onClick={() => updateSetting('magicEffects', !settings.magicEffects)} color="bg-amber-400" />
                    </div>
                </div>

                {/* 4. DANGER ZONE */}
                <div className="space-y-4 pt-10">
                    <div className="px-2 flex items-center justify-between">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500/50">Danger Zone</h3>
                        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-red-500/20 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Logout Card */}
                        <button
                            onClick={() => AuthService.logout()}
                            className="group relative flex items-center gap-4 p-4 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 p-3 rounded-2xl bg-white/5 text-white/40 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                <LogOut size={22} />
                            </div>
                            <div className="relative z-10 text-left">
                                <h4 className="font-bold text-white/80 group-hover:text-white transition-colors">Sign Out</h4>
                                <p className="text-[10px] text-white/30 uppercase tracking-tight font-medium">Close your current session</p>
                            </div>
                        </button>

                        {/* Delete Account Dialog */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="group relative flex items-center gap-4 p-4 rounded-3xl border border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/[0.05] hover:border-red-500/20 transition-all duration-300 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 p-3 rounded-2xl bg-red-500/10 text-red-500/40 group-hover:text-red-500 group-hover:scale-110 transition-all duration-300">
                                        <Trash2 size={22} />
                                    </div>
                                    <div className="relative z-10 text-left">
                                        <h4 className="font-bold text-red-500/80 group-hover:text-red-500 transition-colors">Delete Account</h4>
                                        <p className="text-[10px] text-red-500/30 uppercase tracking-tight font-medium">Permanent & Irreversible</p>
                                    </div>
                                </button>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="bg-[#1a2235] border-white/10 rounded-[2rem] max-w-[400px]">
                                <AlertDialogHeader>
                                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                        <Shield className="text-red-500 w-8 h-8" />
                                    </div>
                                    <AlertDialogTitle className="text-white text-center text-xl font-black italic uppercase">Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-white/50 text-center text-sm">
                                        This action cannot be undone. This will permanently delete your academy progress, badges, and all learning stats.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                                    <AlertDialogCancel className="bg-white/5 border-white/10 text-white rounded-xl hover:bg-white/10 hover:text-white mt-0">
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl border-none"
                                    >
                                        {loading ? "Deleting..." : "Yes, Delete Everything"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;