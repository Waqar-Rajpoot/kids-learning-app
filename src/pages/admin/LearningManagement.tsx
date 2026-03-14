import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { BookOpen, Plus, Pencil, Trash2, Sparkles, Activity, Save, Utensils, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "sonner";

// Shadcn UI Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface LearningItem {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: 'animal' | 'bird' | 'fruit';
  food: string;
  fact: string;
}

export const LearningManagement = () => {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LearningItem | null>(null);
  const [filter, setFilter] = useState<string>('all');

  // Form State
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState('bg-blue-50');
  const [category, setCategory] = useState<'animal' | 'bird' | 'fruit'>('animal');
  const [food, setFood] = useState('');
  const [fact, setFact] = useState('');

  useEffect(() => {
    const q = query(collection(db, "learning_items"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as LearningItem));
      setItems(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = filter === 'all' ? items : items.filter(i => i.category === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !emoji || !food || !fact) return toast.error("CURRICULUM DATA INCOMPLETE");

    try {
      const payload = { name, emoji, color, category, food, fact };
      if (editingItem) {
        await updateDoc(doc(db, "learning_items", editingItem.id), payload);
        toast.success("ITEM RECALIBRATED");
      } else {
        await addDoc(collection(db, "learning_items"), { ...payload, createdAt: serverTimestamp() });
        toast.success("NEW ENTITY ARCHIVED");
      }
      resetForm();
    } catch (error) {
      toast.error("DATABASE UPLINK FAILURE");
    }
  };

  const resetForm = () => {
    setName('');
    setEmoji('');
    setColor('bg-blue-50');
    setCategory('animal');
    setFood('');
    setFact('');
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: LearningItem) => {
    setEditingItem(item);
    setName(item.name);
    setEmoji(item.emoji);
    setColor(item.color);
    setCategory(item.category);
    setFood(item.food);
    setFact(item.fact);
    setIsDialogOpen(true);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-24 selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        {/* Responsive Header: Stacks on mobile, Rows on Desktop */}
    <header className="flex flex-col lg:items-center justify-between gap-8 md:gap-10 lg:gap-6">
  {/* Left Section: Branding */}
  <div className="space-y-2 text-center lg:text-left">
    <div className="flex items-center justify-center lg:justify-start gap-4">
      <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl shadow-inner">
        <BookOpen className="text-blue-400 w-6 h-6 md:w-7 md:h-7" />
      </div>
      <h1 className="text-2xl md:text-4xl text-white/80 font-black uppercase italic tracking-tighter leading-none">
        Curriculum Catalyst
      </h1>
    </div>
    <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold italic px-1">
      Unified Learning Database
    </p>
  </div>

  {/* Right Section: Controls Stacking */}
  <div className="flex flex-col items-center lg:flex-row gap-5 w-full lg:w-auto">
    
    {/* Category Pills: Full width on mobile, auto on desktop */}
    <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar shadow-xl">
      {['all', 'animal', 'bird', 'fruit'].map((cat) => (
        <button 
          key={cat}
          onClick={() => setFilter(cat)}
          className={`flex-2 lg:flex-none px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            filter === cat 
            ? 'bg-blue-500 text-black shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
            : 'text-white/40 hover:text-white hover:bg-white/5'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Action Button: Full width on mobile */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <button 
          onClick={resetForm} 
          className="w-full lg:w-auto bg-blue-500 hover:bg-blue-400 text-black p-4 lg:px-7 lg:py-3.5 rounded-2xl flex flex-1 items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-[0_0_25px_rgba(59,130,246,0.2)] border-t border-white/20"
        >
          <Plus size={20} strokeWidth={3} />
          <span className="font-black uppercase text-xs md:text-sm italic tracking-tighter">Add New Item</span>
        </button>
      </DialogTrigger>
      
      {/* Dialog Content */}
      <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2.5rem] w-[92%] sm:max-w-[450px] max-h-[90vh] overflow-hidden flex flex-col p-0 outline-none shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
            <Sparkles className="text-blue-400 w-6 h-6" />
            {editingItem ? 'Refine Item' : 'Create Item'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-8 pt-2 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Alligator" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-bold outline-none focus:border-blue-500/50 transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Emoji</label>
                <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🐊" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-3xl text-center outline-none focus:border-blue-500/50 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value as 'animal' | 'bird' | 'fruit')} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black uppercase outline-none focus:border-blue-500/50 appearance-none cursor-pointer text-white [&>option]:bg-[#020617] [&>option]:text-white">
                  <option value="animal">Animal</option>
                  <option value="bird">Bird</option>
                  <option value="fruit">Fruit</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1">Color Style</label>
                <input value={color} onChange={e => setColor(e.target.value)} placeholder="bg-green-50" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-mono outline-none focus:border-blue-500/50" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1 italic">Dietary Source</label>
              <div className="relative">
                <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input value={food} onChange={e => setFood(e.target.value)} placeholder="Fish & Meat" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-xs font-bold outline-none focus:border-blue-500/50" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-white/30 tracking-widest px-1 italic">Knowledge Fragment</label>
              <div className="relative">
                <Info className="absolute left-4 top-4 text-white/20 w-4 h-4" />
                <textarea value={fact} onChange={e => setFact(e.target.value)} placeholder="Enter a unique fact..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-12 text-xs font-bold outline-none focus:border-blue-500/50 resize-none" />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
              <Save size={16} strokeWidth={3} /> Synchronize Data
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</header>        

        {/* Updated Grid System: 1 column on mobile, 2 on tablet, 3 on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-5">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item, idx) => (
              <motion.div 
                key={item.id} 
                layout 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.02 }}
              >
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group h-full flex flex-col">
                  <CardHeader className="p-6 pb-2 flex-row justify-between items-center space-y-0">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                        {item.emoji}
                      </div>
                      <div className="space-y-0.5">
                         <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full border ${item.category === 'animal' ? 'border-orange-500/30 text-orange-400 bg-orange-500/5' : item.category === 'bird' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' : 'border-green-500/30 text-green-400 bg-green-500/5'}`}>
                           {item.category}
                         </span>
                         <h3 className="text-base font-black uppercase italic tracking-tighter text-white/90">{item.name}</h3>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleEdit(item)} className="p-2.5 bg-white/5 hover:text-blue-400 text-white/60 rounded-xl border border-white/10 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <DeleteDialog onConfirm={async () => { await deleteDoc(doc(db, "learning_items", item.id)); toast.success("ITEM REMOVED"); }} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between gap-5">
                    <div className="space-y-4">
                       <div className="flex items-start gap-3 bg-[#020617]/50 p-3 rounded-2xl border border-white/5">
                          <Utensils size={14} className="text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] font-bold text-white/70 uppercase tracking-tight">{item.food}</p>
                       </div>
                       <p className="text-[11px] text-white/40 leading-relaxed font-medium italic border-l-2 border-white/10 pl-4">"{item.fact}"</p>
                    </div>
                    <div className={`h-2 w-full rounded-full opacity-20 ${item.color}`} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Sub-components (DeleteDialog, LoadingState) remain unchanged but integrated.
const DeleteDialog = ({ onConfirm }: { onConfirm: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="p-2.5 bg-white/5 hover:text-red-500 text-white/60 rounded-xl border border-white/10 transition-colors">
        <Trash2 size={14} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[92%] sm:max-w-md outline-none">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter text-left">Discard Entity?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-bold tracking-tight text-left">
          This record will be permanently expunged from the learning items collection.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-row gap-2">
        <AlertDialogCancel className="flex-1 bg-white/5 border-white/10 text-white rounded-xl uppercase text-[10px] font-black h-12">Abort</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl uppercase text-[10px] font-black h-12">Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const LoadingState = () => (
  <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-blue-500">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
      <Activity className="w-10 h-10" />
    </motion.div>
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Cataloging Species...</p>
  </div>
);