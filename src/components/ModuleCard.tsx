import { useNavigate } from 'react-router-dom';
import { LucideIcon, Play, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModuleCardProps {
  title: string;
  emoji?: string;
  description: string;
  path: string;
  colorClass: string;
  Icon: LucideIcon;
  image?: string;
  isNew?: boolean;
  variant?: 'large' | 'small';
}

const ModuleCard = ({
  title,
  emoji,
  description,
  path,
  colorClass,
  Icon,
  image,
  isNew,
  variant = 'small'
}: ModuleCardProps) => {
  const navigate = useNavigate();

  // Simplified color parsing for the light background
  const getLightBg = (color: string) => {
    if (color.includes('orange')) return 'bg-orange-50 text-orange-600 border-orange-100';
    if (color.includes('indigo') || color.includes('purple')) return 'bg-purple-50 text-purple-600 border-purple-100';
    if (color.includes('blue') || color.includes('cyan')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (color.includes('emerald') || color.includes('teal')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (color.includes('yellow') || color.includes('amber')) return 'bg-amber-50 text-amber-600 border-amber-100';
    if (color.includes('pink') || color.includes('rose')) return 'bg-pink-50 text-pink-600 border-pink-100';
    return 'bg-gray-50 text-gray-600 border-gray-100';
  };

  const styleClasses = getLightBg(colorClass);

  return (
    <button
      onClick={() => navigate(path)}
      className={`relative w-full text-left overflow-hidden rounded-[2rem] border ${styleClasses.split(' ').slice(2).join(' ')} 
        ${variant === 'large' ? 'min-h-[160px]' : 'min-h-[130px]'} 
        bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-[0.97] transition-all duration-300 group hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1`}
    >
      <div className="relative h-full flex flex-col justify-between p-6 z-10">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            {isNew && (
              <span className="inline-flex items-center text-[10px] font-black bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-lg uppercase tracking-wider mb-2 animate-bounce">
                New
              </span>
            )}
            <h3 className={`font-black text-slate-800 leading-tight ${variant === 'large' ? 'text-2xl' : 'text-lg'}`}>
              {title}
            </h3>
            <p className="text-slate-500 text-xs font-bold leading-relaxed line-clamp-2 max-w-[200px]">
              {description}
            </p>
          </div>

          <div className={`p-4 rounded-2xl ${styleClasses.split(' ')[0]} ${styleClasses.split(' ')[1]} transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-sm`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className={`p-2.5 rounded-full ${styleClasses.split(' ')[0]} ${styleClasses.split(' ')[1]} shadow-sm group-hover:scale-110 transition-transform`}>
            <Play className="w-4 h-4 fill-current" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">Tap to play</span>
        </div>
      </div>

      {/* Premium Decoration (Emoji) */}
      <div className="absolute right-[-15px] bottom-[-15px] opacity-[0.07] pointer-events-none group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 ease-out">
        {emoji ? (
          <span className="text-9xl">{emoji}</span>
        ) : (
          <Icon className="w-40 h-40" />
        )}
      </div>

      {/* Soft Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </button>
  );
};

export default ModuleCard;
