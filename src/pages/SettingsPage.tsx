import { useState } from 'react';
import { Volume2, Music, ArrowLeft, Sparkles, User, LogOut, Mail, Edit2, Check, X, Shield } from 'lucide-react';
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
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-primary/30 overflow-x-hidden">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <header className="relative px-4 pt-8 pb-6 max-w-5xl mx-auto flex items-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-all active:scale-95 shadow-xl shrink-0"
                >
                    <ArrowLeft className="w-6 h-6 text-white/80" />
                </button>
                <div>
                    <h1 className="text-2xl font-black tracking-tight font-display bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Parents <span className="text-primary font-medium">Zone</span>
                    </h1>
                    <p className="text-white/40 text-[10px] font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Secure Management
                    </p>
                </div>
            </header>

            <main className="relative px-4 max-w-5xl mx-auto space-y-6 pb-12">
                {/* Profile Card */}
                <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-3 sm:py-8 transition-all hover:border-white/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
                        {/* Avatar Section */}
                        <div className="relative shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-accent to-secondary p-1 shadow-2xl">
                                <div className="w-full h-full rounded-full bg-[#1a2235] flex items-center justify-center overflow-hidden">
                                    <User className="w-10 h-10 text-white/80" />
                                </div> 
                            </div>
                            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#0f172a] rounded-full" />
                        </div>
                        
                        {/* User Details & Enhanced Input */}
                        <div className="flex-1 text-center md:text-left space-y-3 w-full min-w-0">
                            {isEditing ? (
                                <div className="flex flex-col gap-3">
                                    <input 
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-full font-display text-lg placeholder:text-white/30 shadow-inner"
                                        placeholder="Enter your name"
                                        autoFocus
                                    />
                                    <div className="flex gap-2 w-full">
                                        <button 
                                            disabled={loading}
                                            onClick={handleUpdateProfile} 
                                            className="flex-1 py-3 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => { setIsEditing(false); setNewName(currentUser?.displayName || ""); }} 
                                            className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center md:justify-start text-white/60 gap-2">
                                        <h2 className="text-2xl font-bold font-display truncate text-white">
                                            {currentUser?.displayName || "Explorer"}
                                        </h2>
                                        <button onClick={() => setIsEditing(true)} className="p-2 bg-white/10 text-white/60 rounded-xl hover:text-primary transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-white/60">
                                        <Mail className="w-4 h-4 shrink-0" />
                                        <p className="text-sm truncate">{currentUser?.email || "No email linked"}</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <button 
                            onClick={handleLogout}
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl transition-all border border-red-500/20 font-bold shrink-0"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SettingCard 
                        title="Girl's Voice"
                        desc="Sweet narrator for items"
                        icon={<Volume2 className="w-5 h-5" />}
                        active={settings.isGirlVoice}
                        onClick={() => updateSetting('isGirlVoice', !settings.isGirlVoice)}
                        color="bg-primary"
                    />
                    <SettingCard 
                        title="Music"
                        desc="Play happy tunes"
                        icon={<Music className="w-5 h-5" />}
                        active={settings.bgMusic}
                        onClick={() => updateSetting('bgMusic', !settings.bgMusic)}
                        color="bg-secondary"
                    />
                    <SettingCard 
                        title="Magic"
                        desc="Sparkles on clicks"
                        icon={<Sparkles className="w-5 h-5" />}
                        active={settings.magicEffects}
                        onClick={() => updateSetting('magicEffects', !settings.magicEffects)}
                        color="bg-amber-400"
                    />
                </div>
            </main>
        </div>
    );
};

const SettingCard = ({ title, desc, icon, active, onClick, color }) => (
    <button
        onClick={onClick}
        className={`group relative flex flex-col gap-4 p-5 rounded-[1.5rem] border transition-all duration-300 text-left w-full overflow-hidden ${
            active ? `border-white/20 bg-white/5` : 'border-white/5 bg-white/[0.01]'
        }`}
    >
        <div className="flex justify-between items-center w-full relative z-10">
            <div className={`p-3 rounded-xl ${active ? `${color}/20 text-white` : 'bg-white/5 text-white/20'}`}>
                {icon}
            </div>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? color : 'bg-white/10'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'left-6' : 'left-1'}`} />
            </div>
        </div>
        <div className="relative z-10">
            <h3 className={`font-bold transition-colors ${active ? 'text-white' : 'text-white/40'}`}>{title}</h3>
            <p className="text-white/25 text-[11px] leading-tight">{desc}</p>
        </div>
        <div className={`absolute -top-10 -right-10 w-24 h-24 opacity-10 blur-2xl rounded-full transition-colors ${active ? color : 'bg-transparent'}`} />
    </button>
);

export default SettingsPage;