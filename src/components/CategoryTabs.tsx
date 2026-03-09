interface CategoryTabsProps {
  categories: { id: string; label: string; emoji: string }[];
  activeCategory: string;
  onChange: (category: string) => void;
}

const CategoryTabs = ({ categories, activeCategory, onChange }: CategoryTabsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`px-5 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all border
            ${activeCategory === cat.id
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 shadow-sm'
            }`}
        >
          <span className="mr-1.5">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
