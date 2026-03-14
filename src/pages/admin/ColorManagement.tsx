import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Palette, Plus, Pencil, Trash2, Sparkles, Activity, Save, PlusCircle, Paintbrush } from 'lucide-react';
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

interface ColorItem {
  hex: string;
  name: string;
}

interface ColorLevel {
  id: string;
  order: number;
  colors: string[];
  names: string[];
}

export const ColorManagement = () => {
  const [levels, setLevels] = useState<ColorLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<ColorLevel | null>(null);

  // Form State
  const [order, setOrder] = useState<number>(1);
  const [colorPairs, setColorPairs] = useState<ColorItem[]>([
    { hex: '#FF0000', name: 'Red' }
  ]);

  useEffect(() => {
    const q = query(collection(db, "colorLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ColorLevel));
      setLevels(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAddPair = () => setColorPairs([...colorPairs, { hex: '#000000', name: '' }]);
  
  const handleRemovePair = (index: number) => setColorPairs(colorPairs.filter((_, i) => i !== index));

  const updatePair = (index: number, field: keyof ColorItem, value: string) => {
    const newPairs = [...colorPairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setColorPairs(newPairs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (colorPairs.some(p => !p.hex || !p.name)) return toast.error("ALL FIELDS REQUIRED");

    try {
      const payload = {
        order: Number(order),
        colors: colorPairs.map(p => p.hex),
        names: colorPairs.map(p => p.name)
      };

      if (editingLevel) {
        await updateDoc(doc(db, "colorLevels", editingLevel.id), payload);
        toast.success("SPECTRUM RECALIBRATED");
      } else {
        await addDoc(collection(db, "colorLevels"), { ...payload, createdAt: serverTimestamp() });
        toast.success("NEW COLOR HUB DEPLOYED");
      }
      resetForm();
    } catch (error) {
      toast.error("DATABASE UPLINK FAILED");
    }
  };

  const resetForm = () => {
    setOrder(levels.length + 1);
    setColorPairs([{ hex: '#FF0000', name: 'Red' }]);
    setEditingLevel(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lv: ColorLevel) => {
    setEditingLevel(lv);
    setOrder(lv.order);
    const pairs = lv.colors.map((hex, i) => ({ hex, name: lv.names[i] }));
    setColorPairs(pairs);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "colorLevels", id));
    toast.success("OBJECT PURGED");
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-24 selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Palette className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl text-white/80 font-black uppercase italic tracking-tighter">Color Admin</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Chromatic Logic Engine</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-4 md:px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline font-black uppercase text-xs italic tracking-tighter">Create Level</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[450px] max-h-[85vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Sparkles className="text-blue-400" />
                  {editingLevel ? 'Edit Spectrum' : 'New Spectrum'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-2 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Level Order</label>
                    <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500/50" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Color Mappings</label>
                    {colorPairs.map((pair, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
                        {/* Interactive Color Box */}
                        <div className="relative w-10 h-10 shrink-0">
                          <input 
                            type="color" 
                            value={pair.hex} 
                            onChange={(e) => updatePair(idx, 'hex', e.target.value.toUpperCase())}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div 
                            className="w-full h-full rounded-xl border border-white/20 shadow-inner" 
                            style={{ backgroundColor: pair.hex }} 
                          />
                        </div>

                        <input 
                          value={pair.hex} 
                          onChange={e => updatePair(idx, 'hex', e.target.value.toUpperCase())} 
                          placeholder="#000000" 
                          className="w-20 bg-[#020617] border border-white/10 rounded-lg p-2 text-[10px] uppercase font-mono outline-none focus:border-blue-500/30" 
                        />
                        
                        <input 
                          value={pair.name} 
                          onChange={e => updatePair(idx, 'name', e.target.value)} 
                          placeholder="Color Name" 
                          className="flex-1 bg-[#020617] border border-white/10 rounded-lg p-2 text-[10px] uppercase font-bold outline-none focus:border-blue-500/30" 
                        />

                        {colorPairs.length > 1 && (
                          <button type="button" onClick={() => handleRemovePair(idx)} className="p-2 text-red-500/50 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button type="button" onClick={handleAddPair} className="w-full border border-white/10 hover:bg-white/5 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2">
                      <PlusCircle size={14} /> Add Color
                    </button>
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      <Save size={14} /> Commit Matrix
                    </button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode='popLayout'>
            {levels.map((lv, idx) => (
              <motion.div key={lv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group">
                  <CardHeader className="p-6 pb-2 flex-row justify-between items-center space-y-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black italic text-[10px]">L{lv.order}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Spectrum Hub</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(lv)} className="p-2 bg-white/5 hover:text-blue-400 text-white/70 rounded-xl border border-white/10 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <DeleteDialog onConfirm={() => handleDelete(lv.id)} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2 bg-[#020617]/50 p-4 rounded-2xl border border-white/5">
                      {lv.colors.map((color, i) => (
                        <div key={i} className="group relative">
                          <div className="w-8 h-8 rounded-full border border-white/10 shadow-lg" style={{ backgroundColor: color }} />
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 text-white group-hover:opacity-100 transition-opacity bg-black text-[8px] uppercase px-1.5 py-0.5 rounded border border-white/10 z-20 whitespace-nowrap">
                            {lv.names[i]}
                          </div>
                        </div>
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

// --- SUB COMPONENTS ---

const DeleteDialog = ({ onConfirm }: { onConfirm: () => void }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="p-2 bg-white/5 hover:text-red-500 text-white/70 rounded-xl border border-white/10 transition-colors">
        <Trash2 size={14} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[90vw] md:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Purge Spectrum?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-xs uppercase tracking-tight">
          THIS ACTION WILL PERMANENTLY REMOVE THIS COLOR SEQUENCE FROM THE FIREBASE CORE.
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
      <Paintbrush className="w-10 h-10" />
    </motion.div>
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Mixing Pigments...</p>
  </div>
);