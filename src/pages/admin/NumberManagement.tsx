import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Hash, Plus, Pencil, Trash2, Sparkles, Activity, Save, ListOrdered } from 'lucide-react';
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

interface NumberLevel {
  id: string;
  num: number;
  word: string;
  emoji: string;
  objects: string;
}

export const NumberManagement = () => {
  const [numbers, setNumbers] = useState<NumberLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNumber, setEditingNumber] = useState<NumberLevel | null>(null);

  // Form State
  const [num, setNum] = useState<number>(1);
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('');
  const [objects, setObjects] = useState('');

  useEffect(() => {
    const q = query(collection(db, "numbers"), orderBy("num", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as NumberLevel));
      setNumbers(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !emoji || !objects) return toast.error("NUMERIC DATA INCOMPLETE");

    try {
      const payload = { num: Number(num), word, emoji, objects };
      if (editingNumber) {
        await updateDoc(doc(db, "numbers", editingNumber.id), payload);
        toast.success("NUMBER QUANTITY RECALIBRATED");
      } else {
        await addDoc(collection(db, "numbers"), { ...payload, createdAt: serverTimestamp() });
        toast.success("NEW DIGIT MANIFESTED");
      }
      resetForm();
    } catch (error) {
      toast.error("UPLINK FAILURE");
    }
  };

  const resetForm = () => {
    setNum(numbers.length + 1);
    setWord('');
    setEmoji('');
    setObjects('');
    setEditingNumber(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (n: NumberLevel) => {
    setEditingNumber(n);
    setNum(n.num);
    setWord(n.word);
    setEmoji(n.emoji);
    setObjects(n.objects);
    setIsDialogOpen(true);
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
                <ListOrdered className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl text-white/80 font-black uppercase italic tracking-tighter">Number Station</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Digit & Quantity Archive</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-5 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline font-black uppercase text-xs italic tracking-tighter">Add Number</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[400px] max-h-[85vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Sparkles className="text-blue-400" />
                  {editingNumber ? 'Modify Digit' : 'New Digit'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Value</label>
                      <input type="number" value={num} onChange={e => setNum(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Name</label>
                      <input value={word} onChange={e => setWord(e.target.value)} placeholder="Eleven" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold uppercase outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Emoji Identity</label>
                    <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="1️⃣1️⃣" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xl text-center outline-none focus:border-blue-500/50" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Object Representation</label>
                    <textarea value={objects} onChange={e => setObjects(e.target.value)} placeholder="🍎🍎🍎..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xl outline-none focus:border-blue-500/50 resize-none" />
                  </div>

                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Save size={14} /> Commit Digit
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode='popLayout'>
            {numbers.map((n, idx) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/5 flex items-center justify-center text-3xl shadow-inner shrink-0">
                        {n.emoji}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-blue-400 italic">#{n.num}</span>
                          <h3 className="text-sm font-black uppercase tracking-widest text-white/90">{n.word}</h3>
                        </div>
                        <p className="text-[12px] text-white/40 break-all line-clamp-1">{n.objects}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 self-end sm:self-center">
                      <button onClick={() => handleEdit(n)} className="p-2.5 bg-white/5 hover:text-blue-400 text-white/60 rounded-xl border border-white/10 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <DeleteDialog onConfirm={async () => { await deleteDoc(doc(db, "numbers", n.id)); toast.success("DIGIT ERASED"); }} />
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

const DeleteDialog = ({ onConfirm }: { onConfirm: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="p-2.5 bg-white/5 hover:text-red-500 text-white/60 rounded-xl border border-white/10 transition-colors">
        <Trash2 size={14} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[92%] sm:max-w-md outline-none">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Expunge Digit?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-bold tracking-tight">
          Warning: This will remove the number and its object representation from the curriculum.
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
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Counting Data...</p>
  </div>
);