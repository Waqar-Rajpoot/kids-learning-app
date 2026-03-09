import { useEffect } from 'react';
import { motion } from 'framer-motion';

const WelcomePage = ({ onFinish }: { onFinish: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#fff9f0]">
            {/* Playful Bright Background */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/30 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                className="text-center z-10 p-10"
            >
                <div className="inline-block p-10 rounded-[4rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-primary/10 mb-10 relative animate-float">
                    <span className="text-9xl block">🚀</span>
                    <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-2 rounded-full shadow-lg rotate-12">
                        FUN!
                    </div>
                </div>

                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-7xl font-black text-gray-900 mb-4 font-display tracking-tight"
                >
                    Kid <span className="text-primary italic">Learing</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-400 text-2xl font-bold tracking-tight font-display"
                >
                    Ready for a big adventure?
                </motion.p>
            </motion.div>

            {/* Playful Loading Bar */}
            <div className="absolute bottom-16 w-80 h-4 bg-white rounded-full overflow-hidden border-4 border-white shadow-inner">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3.5, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-primary via-accent to-yellow-400 rounded-full"
                />
            </div>

            <div className="absolute bottom-6 text-gray-300 font-black tracking-widest text-[10px] uppercase">
                Loading Wonders...
            </div>
        </div>
    );
};

export default WelcomePage;
