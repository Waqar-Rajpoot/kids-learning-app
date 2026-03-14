import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Brain, Plus, Pencil, Trash2, Sparkles, Activity, Layout, Save, PlusCircle, Hash, Type } from 'lucide-react';
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

interface MemoryLevel {
  id: string;
  theme: string;
  order: number;
  emojis: string[];
}

export const MemoryManagement = () => {
  const [levels, setLevels] = useState<MemoryLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<MemoryLevel | null>(null);

  // Form State
  const [theme, setTheme] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [emojis, setEmojis] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    const q = query(collection(db, "memoryLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as MemoryLevel));
      setLevels(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || emojis.some(e => !e)) return toast.error("DATA INCOMPLETE");

    try {
      const payload = { theme, order: Number(order), emojis };
      if (editingLevel) {
        await updateDoc(doc(db, "memoryLevels", editingLevel.id), payload);
        toast.success("NEURAL PATHWAY REWIRED");
      } else {
        await addDoc(collection(db, "memoryLevels"), { ...payload, createdAt: serverTimestamp() });
        toast.success("LEVEL INITIALIZED");
      }
      resetForm();
    } catch (error) {
      toast.error("UPLINK ERROR");
    }
  };

  const resetForm = () => {
    setTheme('');
    setOrder(levels.length + 1);
    setEmojis(['', '', '', '']);
    setEditingLevel(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lv: MemoryLevel) => {
    setEditingLevel(lv);
    setTheme(lv.theme);
    setOrder(lv.order);
    setEmojis(lv.emojis);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "memoryLevels", id));
    toast.success("DATA PURGED");
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-24 selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Brain className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white/80 uppercase italic tracking-tighter">Memory Matrix</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Level Configuration Hub</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95">
                <Plus size={18} strokeWidth={3} />
                <span className="font-black uppercase text-xs italic tracking-tighter">New Level</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[450px] max-h-[90vh] overflow-hidden flex flex-col p-0">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Sparkles className="text-blue-400" />
                  {editingLevel ? 'Edit Level' : 'New Level'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Order</label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-500" />
                        <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-8 text-xs font-bold outline-none focus:border-blue-500/50" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Theme</label>
                      <div className="relative">
                        <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-500" />
                        <input value={theme} onChange={e => setTheme(e.target.value)} placeholder="Space" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-8 text-xs font-bold uppercase outline-none focus:border-blue-500/50" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Emoji Sequence (4 Required)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {emojis.map((emoji, idx) => (
                        <input
                          key={idx}
                          value={emoji}
                          maxLength={2}
                          onChange={(e) => {
                            const newEmojis = [...emojis];
                            newEmojis[idx] = e.target.value;
                            setEmojis(newEmojis);
                          }}
                          placeholder="❓"
                          className="bg-white/5 border border-white/10 rounded-xl p-3 text-center text-xl outline-none focus:border-blue-500/50"
                        />
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2">
                    <Save size={14} /> Commit Changes
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode='popLayout'>
            {levels.map((lv, idx) => (
              <motion.div key={lv.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group">
                  <CardHeader className="p-6 pb-2 flex-row justify-between items-center space-y-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black italic text-xs">#{lv.order}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{lv.theme}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(lv)} className="p-2 bg-white/5 hover:text-blue-400 text-white/70 rounded-xl border border-white/10 transition-colors"><Pencil size={14} /></button>
                      <DeleteDialog onConfirm={() => handleDelete(lv.id)} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between bg-[#020617]/50 p-4 rounded-2xl border border-white/5">
                      {lv.emojis.map((e, i) => (
                        <span key={i} className="text-2xl drop-shadow-md">{e}</span>
                      ))}
                    </div>
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

// Subcomponents (DeleteDialog, LoadingState) remain identical to previous logic for consistency.
const DeleteDialog = ({ onConfirm }: { onConfirm: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="p-2 bg-white/5 hover:text-red-500 text-white/70 rounded-xl border border-white/10 transition-colors">
        <Trash2 size={14} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[90vw] md:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Decommission Level?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-xs">THIS WILL PERMANENTLY REMOVE THIS LEVEL FROM THE MEMORY SEQUENCE.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-row gap-2">
        <AlertDialogCancel className="flex-1 bg-white/5 border-white/10 text-white rounded-xl uppercase text-[10px] font-black">Abort</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl uppercase text-[10px] font-black">Confirm Purge</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const LoadingState = () => (
  <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-blue-500">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Activity className="w-10 h-10" /></motion.div>
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Levels...</p>
  </div>
);