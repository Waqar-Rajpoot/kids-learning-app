import { motion } from 'framer-motion';

interface CategoryTabsProps {
  categories: { id: string; label: string; emoji: string }[];
  activeCategory: string;
  onChange: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onChange }: CategoryTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-1 no-scrollbar relative">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className="relative px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest whitespace-nowrap transition-colors duration-300 focus:outline-none group"
          >
            {/* 1. Background "Pill" Animation */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            {/* 2. Content Layer */}
            <div className={`relative z-10 flex items-center gap-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
              <span className={`text-base transition-transform duration-300 ${isActive ? 'scale-110 rotate-12' : 'group-hover:scale-110'}`}>
                {cat.emoji}
              </span>
              <span className="italic">{cat.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;