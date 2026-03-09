import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles } from 'lucide-react';

const WelcomePage = ({ onFinish }: { onFinish: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#0f172a] select-none">
            
            {/* 1. Atmospheric Depth */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[100px] rounded-full animate-pulse delay-700" />
                
                {/* Subtle Grid overlay */}
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                className="text-center z-10 p-10 flex flex-col items-center"
            >
                {/* 2. The Launch Portal */}
                <div className="relative mb-12">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-8 border-2 border-dashed border-blue-500/20 rounded-full"
                    />
                    
                    <div className="relative inline-block p-12 rounded-[4rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Rocket className="w-24 h-24 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        </motion.div>
                        
                        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/40 uppercase tracking-widest italic">
                            Active
                        </div>
                    </div>
                </div>

                {/* 3. Branding Matrix */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                >
                    <h1 className="text-6xl font-black text-white font-display tracking-tighter uppercase italic">
                        Nebula <span className="text-blue-500">Learning</span>
                    </h1>
                    
                    <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                        <p className="text-blue-200/40 text-sm font-black uppercase tracking-[0.5em] font-display">
                            Initializing Mission
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* 4. The Ignition Bar */}
            <div className="absolute bottom-24 flex flex-col items-center gap-4">
                <div className="w-72 h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                    {/* Animated Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] w-1/2 animate-[scan_2s_infinite]" />
                    
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3.5, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    />
                </div>
                
                <div className="text-blue-400/30 font-black tracking-[0.6em] text-[9px] uppercase animate-pulse">
                    Synchronizing System...
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
