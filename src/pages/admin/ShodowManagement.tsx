import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Ghost, Plus, Pencil, Trash2, Sparkles, Activity, Hash, Save, PlusCircle, Box } from 'lucide-react';
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

interface ShadowLevel {
  id: string;
  item: string;
  name: string;
  order: number;
}

export const ShadowManagement = () => {
  const [levels, setLevels] = useState<ShadowLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<ShadowLevel | null>(null);

  // Form State
  const [order, setOrder] = useState<number>(1);
  const [item, setItem] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const q = query(collection(db, "shadowLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ShadowLevel));
      setLevels(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !name) return toast.error("DATA CORE INCOMPLETE");

    try {
      const payload = { item, name, order: Number(order) };
      if (editingLevel) {
        await updateDoc(doc(db, "shadowLevels", editingLevel.id), payload);
        toast.success("SHADOW ARCHIVE UPDATED");
      } else {
        await addDoc(collection(db, "shadowLevels"), { ...payload, createdAt: serverTimestamp() });
        toast.success("NEW ENTITY MANIFESTED");
      }
      resetForm();
    } catch (error) {
      toast.error("UPLINK FAILURE");
    }
  };

  const resetForm = () => {
    setOrder(levels.length + 1);
    setItem('');
    setName('');
    setEditingLevel(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lv: ShadowLevel) => {
    setEditingLevel(lv);
    setOrder(lv.order);
    setItem(lv.item);
    setName(lv.name);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "shadowLevels", id));
    toast.success("ENTITY EXPUNGED");
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-24 selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Ghost className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-blue-100">Shadow Hub</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Silhouette Database</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-5 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline font-black uppercase text-xs italic tracking-tighter">Add Entity</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[400px] max-h-[85vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Sparkles className="text-blue-400" />
                  {editingLevel ? 'Modify Entity' : 'New Entity'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Sequence Order</label>
                    <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Target Item</label>
                      <input value={item} onChange={e => setItem(e.target.value)} placeholder="🍎" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-center text-xl outline-none focus:border-blue-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Identity</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="Apple" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      <Save size={14} /> Commit Entry
                    </button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode='popLayout'>
            {levels.map((lv, idx) => (
              <motion.div key={lv.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#020617] border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {lv.item}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-blue-400 italic">#{lv.order}</span>
                          <h3 className="text-xs font-black uppercase tracking-widest text-white/90">{lv.name}</h3>
                        </div>
                        <p className="text-[8px] text-white/30 uppercase font-bold tracking-tighter">Shadow Entity Manifested</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(lv)} className="p-2.5 bg-white/5 hover:text-blue-400 text-white/60 rounded-xl border border-white/10 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <DeleteDialog onConfirm={() => handleDelete(lv.id)} />
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

// --- SUB COMPONENTS ---

const DeleteDialog = ({ onConfirm }: { onConfirm: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="p-2.5 bg-white/5 hover:text-red-500 text-white/60 rounded-xl border border-white/10 transition-colors">
        <Trash2 size={14} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[92%] sm:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Expunge Entity?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-bold tracking-tight">
          Warning: This will permanently erase the shadow data from the cloud repository.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-row gap-2">
        <AlertDialogCancel className="flex-1 bg-white/5 border-white/10 text-white rounded-xl uppercase text-[10px] font-black">Abort</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl uppercase text-[10px] font-black">Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const LoadingState = () => (
  <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-blue-500">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
      <Activity className="w-10 h-10" />
    </motion.div>
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Scanning Shadows...</p>
  </div>
);