import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Move, Plus, Pencil, Trash2, Sparkles, Activity, Save, PlusCircle, Target } from 'lucide-react';
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

interface Dot {
  x: number;
  y: number;
}

interface VectorLevel {
  id: string;
  name: string;
  order: number;
  dots: Dot[];
}

export const VectorManagement = () => {
  const [levels, setLevels] = useState<VectorLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<VectorLevel | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [dots, setDots] = useState<Dot[]>([{ x: 100, y: 100 }]);

  useEffect(() => {
    const q = query(collection(db, "vectorLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as VectorLevel));
      setLevels(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddDot = () => setDots([...dots, { x: 100, y: 100 }]);
  const handleRemoveDot = (index: number) => setDots(dots.filter((_, i) => i !== index));
  const updateDot = (index: number, axis: 'x' | 'y', val: number) => {
    const newDots = [...dots];
    newDots[index] = { ...newDots[index], [axis]: val };
    setDots(newDots);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || dots.length < 3) return toast.error("MINIMUM 3 DOTS REQUIRED FOR A SHAPE");

    try {
      const payload = { name, order: Number(order), dots };
      if (editingLevel) {
        await updateDoc(doc(db, "vectorLevels", editingLevel.id), payload);
        toast.success("GEOMETRY RECALIBRATED");
      } else {
        await addDoc(collection(db, "vectorLevels"), { ...payload, createdAt: serverTimestamp() });
        toast.success("VECTOR BLUEPRINT SAVED");
      }
      resetForm();
    } catch (error) {
      toast.error("COORDINATE UPLINK ERROR");
    }
  };

  const resetForm = () => {
    setName('');
    setOrder(levels.length + 1);
    setDots([{ x: 100, y: 40 }, { x: 160, y: 160 }, { x: 40, y: 160 }]);
    setEditingLevel(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lv: VectorLevel) => {
    setEditingLevel(lv);
    setName(lv.name);
    setOrder(lv.order);
    setDots(lv.dots);
    setIsDialogOpen(true);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-24 selection:bg-blue-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Move className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl text-white/80 font-black uppercase italic tracking-tighter">Vector Lab</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Coordinate Registry</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-4 md:px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline font-black uppercase text-xs italic tracking-tighter">New Shape</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[450px] max-h-[90vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Target className="text-blue-400" />
                  {editingLevel ? 'Edit Blueprint' : 'Draw Shape'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Live Preview Canvas */}
                  <div className="w-full aspect-square bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 200 200" className="absolute inset-0">
                       <polygon 
                        points={dots.map(d => `${d.x},${d.y}`).join(' ')} 
                        className="fill-blue-500/20 stroke-blue-500 stroke-2"
                      />
                      {dots.map((d, i) => (
                        <circle key={i} cx={d.x} cy={d.y} r="3" fill="white" />
                      ))}
                    </svg>
                    <span className="absolute bottom-2 right-2 text-[8px] font-black text-white/20 uppercase tracking-widest">Live Preview (200x200)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Order</label>
                      <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500/50" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Name</label>
                      <input value={name} onChange={e => setName(e.target.value)} placeholder="Hexagon" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold uppercase outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Dot Coordinates</label>
                    {dots.map((dot, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 px-2">
                            <span className="text-[10px] text-blue-400 font-bold">X</span>
                            <input type="number" value={dot.x} onChange={e => updateDot(idx, 'x', Number(e.target.value))} className="w-full bg-transparent text-xs font-bold outline-none" />
                          </div>
                          <div className="flex items-center gap-2 px-2">
                            <span className="text-[10px] text-blue-400 font-bold">Y</span>
                            <input type="number" value={dot.y} onChange={e => updateDot(idx, 'y', Number(e.target.value))} className="w-full bg-transparent text-xs font-bold outline-none" />
                          </div>
                        </div>
                        {dots.length > 3 && (
                          <button type="button" onClick={() => handleRemoveDot(idx)} className="p-2 text-red-500/50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={handleAddDot} className="w-full border border-white/5 bg-white/5 hover:bg-white/10 py-3 rounded-xl font-black uppercase text-[8px] tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                      <PlusCircle size={14} /> Add Dot
                    </button>
                  </div>

                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Save size={14} /> Sync Blueprint
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <AnimatePresence mode='popLayout'>
            {levels.map((lv, idx) => (
              <motion.div key={lv.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group">
                  <CardHeader className="p-6 pb-2 flex-row justify-between items-center space-y-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black italic text-[10px]">V{lv.order}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{lv.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(lv)} className="p-2 bg-white/5 hover:text-blue-400 text-white/70 rounded-xl border border-white/10 transition-colors"><Pencil size={14} /></button>
                      <DeleteDialog onConfirm={async () => { await deleteDoc(doc(db, "vectorLevels", lv.id)); toast.success("DATA PURGED"); }} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-[#020617] rounded-2xl border border-white/5 p-2 flex items-center justify-center shrink-0">
                        <svg width="100%" height="100%" viewBox="0 0 200 200">
                          <polygon points={lv.dots.map(d => `${d.x},${d.y}`).join(' ')} className="fill-blue-500/20 stroke-blue-50 stroke-1" />
                        </svg>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1">Nodes Detected</p>
                        <div className="flex flex-wrap gap-1">
                          {lv.dots.map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                          ))}
                        </div>
                        <p className="mt-2 text-[10px] font-bold text-white/60">{lv.dots.length} Points Mapping</p>
                      </div>
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
      <button className="p-2 bg-white/5 hover:text-red-500 text-white/70 rounded-xl border border-white/10 transition-colors">
        <Trash2 size={14} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[92%] sm:max-w-md outline-none">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Deconstruct Vector?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-bold tracking-tight">
          This will permanently remove the coordinate mapping from the lab.
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
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><Target className="w-10 h-10" /></motion.div>
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Plotting Coordinates...</p>
  </div>
);