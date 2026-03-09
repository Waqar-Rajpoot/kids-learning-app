import { useState } from 'react';
import { Volume2, Music, ArrowLeft, Sparkles, User, LogOut, Mail, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSettings } from '@/context/AppSettingsContext';
import { auth } from '@/lib/firebase';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { settings, updateSetting } = useAppSettings();

    const currentUser = auth.currentUser;
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(currentUser?.displayName || "");
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            toast.success("See you later, Explorer!");
        } catch (error) {
            toast.error("Logout failed. Try again!");
        }
    };

    const handleUpdateProfile = async () => {
        if (!newName.trim() || newName === currentUser?.displayName) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            await AuthService.updateUserProfile(newName);
            toast.success("Profile updated!");
            setIsEditing(false);
        } catch (error) {
            toast.error("Failed to update profile");
            setNewName(currentUser?.displayName || "");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-white">
            <header className="px-6 pt-10 pb-6 flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="p-3 glass rounded-2xl text-white/80 hover:text-white transition-all active:scale-90"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-extrabold tracking-tight font-display">
                    Parents <span className="text-primary-foreground/80">Zone</span>
                </h1>
            </header>

            <main className="px-6 space-y-8 py-4">
                <div className="premium-card rounded-[2.5rem] p-8 glass flex items-center justify-between overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    
                    <div className="flex items-center gap-6 relative z-10 w-full max-w-[80%]">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-4 border-white/10 shadow-xl shrink-0">
                            <User className="w-10 h-10 text-white fill-white/20" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            {isEditing ? (
                                <div className="flex items-center gap-2 relative z-20">
                                    <input 
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        // Changed bg-white/10 to bg-neutral-800 for better contrast
                                        // Added placeholder:text-white/40
                                        className="bg-neutral-800 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-full font-display text-lg placeholder:text-white/40"
                                        placeholder="Enter name..."
                                        autoFocus
                                    />
                                    <button 
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                        className="p-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors shrink-0"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => { setIsEditing(false); setNewName(currentUser?.displayName || ""); }}
                                        className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors shrink-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold font-display capitalize truncate">
                                        {currentUser?.displayName || "Little Explorer"}
                                    </h2>
                                    <button 
                                        onClick={() => setIsEditing(true)}
                                        className="p-1.5 bg-white/5 text-white/40 hover:text-primary hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-white/60 mt-1">
                                <Mail className="w-3.5 h-3.5" />
                                <p className="text-xs font-medium truncate">{currentUser?.email || "No email linked"}</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="p-4 bg-white/10 hover:bg-red-500/20 hover:text-red-400 rounded-2xl transition-all active:scale-95 group relative z-10"
                        title="Logout"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => updateSetting('isGirlVoice', !settings.isGirlVoice)}
                        className="premium-card rounded-[2rem] p-8 glass flex flex-col justify-between h-56 border border-white/5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start w-full">
                            <div className="p-4 bg-primary/20 rounded-2xl">
                                <Volume2 className="w-8 h-8 text-primary" />
                            </div>
                            <div className={`w-14 h-7 rounded-full relative p-1 transition-colors duration-300 ${settings.isGirlVoice ? 'bg-primary' : 'bg-white/10'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full absolute transition-all duration-300 ${settings.isGirlVoice ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Girl's Voice</h3>
                            <p className="text-white/50 text-sm text-balance">Sweet narrator voice for all learning items</p>
                        </div>
                    </button>

                    <button
                        onClick={() => updateSetting('bgMusic', !settings.bgMusic)}
                        className="premium-card rounded-[2rem] p-8 glass flex flex-col justify-between h-56 border border-white/5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start w-full">
                            <div className="p-4 bg-secondary/20 rounded-2xl">
                                <Music className="w-8 h-8 text-secondary" />
                            </div>
                            <div className={`w-14 h-7 rounded-full relative p-1 transition-colors duration-300 ${settings.bgMusic ? 'bg-secondary' : 'bg-white/10'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full absolute transition-all duration-300 ${settings.bgMusic ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Background Music</h3>
                            <p className="text-white/50 text-sm">Play happy tunes while learning</p>
                        </div>
                    </button>

                    <button
                        onClick={() => updateSetting('magicEffects', !settings.magicEffects)}
                        className="premium-card rounded-[2rem] p-8 glass flex flex-col justify-between h-56 border border-white/5 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <div className="flex justify-between items-start w-full">
                            <div className="p-4 bg-amber-400/20 rounded-2xl">
                                <Sparkles className="w-8 h-8 text-amber-400" />
                            </div>
                            <div className={`w-14 h-7 rounded-full relative p-1 transition-colors duration-300 ${settings.magicEffects ? 'bg-amber-400' : 'bg-white/10'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full absolute transition-all duration-300 ${settings.magicEffects ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Magic Effects</h3>
                            <p className="text-white/50 text-sm">Fun glitter and sparkles on interactions</p>
                        </div>
                    </button>
                </div>

                <div className="text-center py-8">
                    <p className="text-white/20 text-xs font-bold tracking-widest uppercase">Bright Beginnings v1.2 • Explorer ID: {currentUser?.uid.slice(0, 8)}...</p>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;