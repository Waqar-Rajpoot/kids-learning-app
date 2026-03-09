import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2 } from 'lucide-react';
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
    
    // Navigate to detail page
    navigate(`/${category}/${category}/${id}`);
  };

  const getCategoryGradient = () => {
    switch (category) {
      case 'animals': return 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20';
      case 'birds': return 'from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20';
      case 'fruits': return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
      default: return 'from-slate-50 to-white dark:from-slate-800 dark:to-slate-700';
    }
  };

  const getCategoryBorder = () => {
    switch (category) {
      case 'animals': return 'border-amber-200 dark:border-amber-700';
      case 'birds': return 'border-cyan-200 dark:border-cyan-700';
      case 'fruits': return 'border-green-200 dark:border-green-700';
      default: return 'border-slate-200 dark:border-slate-600';
    }
  };

  return (
    <button
      onClick={handleNavigate}
      className={`group relative overflow-hidden rounded-3xl p-4 aspect-square w-full flex flex-col items-center justify-center
        bg-gradient-to-br ${getCategoryGradient()} 
        border-2 ${getCategoryBorder()} 
        shadow-lg hover:shadow-xl transition-all duration-300
        active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/20`}
    >
      {/* Emoji Display */}
      <div className="flex flex-col items-center gap-3">
        <span 
          className={`text-6xl transition-transform duration-300 drop-shadow-lg
            ${isPlaying ? 'scale-110' : 'group-hover:scale-105'}`}
        >
          {emoji}
        </span>
        
        <h3 className="font-black text-slate-700 dark:text-white text-sm tracking-tight text-center w-full px-2 truncate uppercase">
          {name}
        </h3>
      </div>

      {/* Speaking Indicator */}
      {isPlaying && (
        <div className="absolute inset-0 border-4 border-primary rounded-3xl pointer-events-none">
          <div className="absolute inset-0 bg-primary/10 rounded-3xl" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
            <Volume2 className="w-4 h-4 text-primary animate-pulse" />
          </div>
        </div>
      )}

      {/* Decorative Corner */}
      <div className="absolute top-2 right-2 w-3 h-3 bg-primary/30 rounded-full group-hover:scale-150 transition-transform" />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-primary/20 rounded-full group-hover:scale-150 transition-transform" />
    </button>
  );
};

export default LearningCard;
