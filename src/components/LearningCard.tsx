import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, Sparkle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakText } from '@/lib/speech';
import { playTap } from '@/lib/sounds';

interface LearningCardProps {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: string;
}

const LearningCard = ({ id, name, emoji, color, category }: LearningCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    playTap();
    setIsPlaying(true);
    
    // Speak the name clearly
    speakText(name, () => setIsPlaying(false));
    
    // Short delay for a smoother "Pop" transition
    setTimeout(() => {
        navigate(`/${category}/${category}/${id}`);
    }, 200);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleNavigate}
      className="group relative overflow-hidden rounded-[2.5rem] p-5 aspect-square w-full flex flex-col items-center justify-center
        bg-white/[0.03] backdrop-blur-xl border border-white/10 
        shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all duration-500
        focus:outline-none"
    >
      {/* 1. Dynamic Inner Glow (Based on item color) */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />

      {/* 2. Content Layer */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated Emoji Container */}
        <div className="relative">
            <span 
              className={`text-6xl block transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]
                ${isPlaying ? 'scale-125 rotate-6' : 'group-hover:scale-110 group-hover:-rotate-3'}`}
            >
              {emoji}
            </span>
            
            {/* Particle Sparkle on Hover */}
            <Sparkle className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity" />
        </div>
        
        <div className="space-y-1">
            <h3 className="font-black text-white text-base tracking-tighter text-center uppercase italic">
              {name}
            </h3>
            <div className="h-1 w-8 mx-auto rounded-full opacity-40" style={{ backgroundColor: color }} />
        </div>
      </div>

      {/* 3. Speaking / Active Indicator */}
      <AnimatePresence>
          {isPlaying && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20"
            >
              <div className="absolute inset-0 border-4 border-white/20 rounded-[2.5rem] animate-pulse" />
              <div className="absolute inset-0 bg-white/5 rounded-[2.5rem]" />
              <div className="absolute top-4 right-4">
                <Volume2 className="w-5 h-5 text-white animate-bounce" />
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* 4. Glass Reflection Overlay */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rotate-45 pointer-events-none group-hover:translate-x-10 transition-transform duration-1000" />
    </motion.button>
  );
};

export default LearningCard;