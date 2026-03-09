// import { useNavigate } from 'react-router-dom';
// import { LucideIcon, Play, ChevronRight } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { playTap } from '@/lib/sounds';

// interface ModuleCardProps {
//   title: string;
//   emoji?: string;
//   description: string;
//   path: string;
//   colorClass: string;
//   Icon: LucideIcon;
//   image?: string;
//   isNew?: boolean;
//   variant?: 'large' | 'small';
// }

// const ModuleCard = ({
//   title,
//   emoji,
//   description,
//   path,
//   colorClass, // Expecting Tailwind colors like 'bg-primary' or 'bg-orange-500'
//   Icon,
//   isNew,
//   variant = 'small'
// }: ModuleCardProps) => {
//   const navigate = useNavigate();
//   const isLarge = variant === 'large';

//   const handleClick = () => {
//     playTap();
//     navigate(path);
//   };

//   // Helper to extract text color from background class for the icon/glow
//   const getIconTextColor = (color: string) => {
//     if (color.includes('primary')) return 'text-primary';
//     const baseColor = color.replace('bg-', 'text-');
//     return baseColor;
//   };

//   const textColor = getIconTextColor(colorClass);

//   return (
//     <motion.button
//       onClick={handleClick}
//       whileHover={{ y: -5, scale: 1.01 }}
//       whileTap={{ scale: 0.98 }}
//       className={`group relative w-full text-left overflow-hidden rounded-[2.5rem] border border-white/10 
//         ${isLarge ? 'min-h-[180px] p-8' : 'min-h-[140px] p-6'} 
//         bg-white/[0.03] backdrop-blur-2xl transition-all duration-500 shadow-2xl hover:border-white/20 hover:bg-white/[0.07]`}
//     >
//       {/* Dynamic Background Glow - Uses the colorClass passed from Index */}
//       <div className={`absolute -top-20 -right-20 w-40 h-40 opacity-10 blur-[80px] rounded-full transition-opacity duration-700 group-hover:opacity-30 ${colorClass}`} />

//       <div className="relative h-full flex flex-col justify-between z-10">
//         <div className="flex justify-between items-start">
//           <div className="space-y-2 max-w-[70%]">
//             {isNew && (
//               <span className="inline-flex items-center text-[10px] font-black bg-primary text-white px-2.5 py-1 rounded-full uppercase tracking-widest mb-2 shadow-lg shadow-primary/20 animate-pulse">
//                 New Quest
//               </span>
//             )}
//             <h3 className={`font-black text-white leading-tight tracking-tight ${isLarge ? 'text-2xl' : 'text-xl'}`}>
//               {title}
//             </h3>
//             <p className="text-white/40 text-xs font-medium leading-relaxed line-clamp-2">
//               {description}
//             </p>
//           </div>

//           {/* Icon Box with Theme Color */}
//           <div className={`p-4 rounded-[1.2rem] bg-white/5 border border-white/10 ${textColor} transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 shadow-xl`}>
//             <Icon className={`${isLarge ? 'w-8 h-8' : 'w-6 h-6'}`} />
//           </div>
//         </div>

//         <div className="mt-6 flex items-center justify-between">
//           <div className="flex items-center gap-2.5">
//             <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${textColor} group-hover:bg-primary group-hover:text-white transition-all`}>
//               <Play className="w-3 h-3 fill-current" />
//             </div>
//             <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30 group-hover:text-white/60 transition-colors">
//               Tap to enter
//             </span>
//           </div>

//           {/* Emoji Floating slightly */}
//           {emoji && (
//             <span className={`transform transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12 ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
//               {emoji}
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Decorative Chevron */}
//       <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 transition-opacity">
//         <ChevronRight className="w-12 h-12 text-white" />
//       </div>
//     </motion.button>
//   );
// };

// export default ModuleCard;