import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, where, getDocs } from 'firebase/firestore';
import { Eye, Plus, Pencil, Trash2, Sparkles, Activity, Save, PlusCircle, AlertTriangle, ScanSearch } from 'lucide-react';
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

interface AnomalyLevel {
  id: string;
  items: string[];
  odd: number;
  msg: string;
  order: number;
}

export const AnomalyManagement = () => {
  const [levels, setLevels] = useState<AnomalyLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<AnomalyLevel | null>(null);

  // Form State
  const [order, setOrder] = useState<number>(1);
  const [msg, setMsg] = useState('');
  const [oddIndex, setOddIndex] = useState<number>(0);
  const [items, setItems] = useState<string[]>(['🦁', '🦁', '🦁', '🐯']);

  useEffect(() => {
    const q = query(collection(db, "anomalyLevels"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as AnomalyLevel));
      setLevels(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg || items.some(i => !i)) return toast.error("PROTOCOL INCOMPLETE");

    try {
      const payload = { 
        order: Number(order), 
        msg, 
        items, 
        odd: oddIndex 
      };

      if (editingLevel) {
        await updateDoc(doc(db, "anomalyLevels", editingLevel.id), payload);
        toast.success("ANOMALY RECALIBRATED");
      } else {
        await addDoc(collection(db, "anomalyLevels"), { ...payload, createdAt: serverTimestamp() });
        toast.success("NEW ANOMALY ARCHIVED");
      }
      resetForm();
    } catch (error) {
      toast.error("DATABASE UPLINK FAILED");
    }
  };

  const resetForm = () => {
    setOrder(levels.length + 1);
    setMsg('');
    setOddIndex(3);
    setItems(['', '', '', '']);
    setEditingLevel(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lv: AnomalyLevel) => {
    setEditingLevel(lv);
    setOrder(lv.order);
    setMsg(lv.msg);
    setOddIndex(lv.odd);
    setItems(lv.items);
    setIsDialogOpen(true);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-24 selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <ScanSearch className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl text-white/80 md:text-3xl font-black uppercase italic tracking-tighter">Anomaly Admin</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Pattern Disruption Lab</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-4 md:px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline font-black uppercase text-xs italic tracking-tighter">New Anomaly</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[450px] max-h-[90vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <AlertTriangle className="text-blue-400" />
                  {editingLevel ? 'Modify Pattern' : 'Initialize Pattern'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Order</label>
                      <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Odd Index (0-3)</label>
                      <input type="number" min="0" max="3" value={oddIndex} onChange={e => setOddIndex(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Detection Message</label>
                    <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Intruder detected in sector 7G..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-blue-500/50" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1 text-center block">Item Matrix (Select Odd One)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {items.map((item, idx) => (
                        <div key={idx} className={`relative p-1 rounded-2xl border transition-all ${oddIndex === idx ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/5 bg-white/5'}`}>
                          <input 
                            value={item} 
                            onChange={e => handleItemChange(idx, e.target.value)} 
                            className="w-full bg-transparent text-center text-2xl p-2 outline-none"
                            placeholder="?"
                          />
                          <button 
                            type="button"
                            onClick={() => setOddIndex(idx)}
                            className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black ${oddIndex === idx ? 'bg-blue-500 text-black' : 'bg-white/10 text-white/40'}`}
                          >
                            {oddIndex === idx ? '✓' : idx}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Save size={14} /> Commit Anomaly
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <AnimatePresence mode='popLayout'>
            {levels.map((lv, idx) => (
              <motion.div key={lv.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group">
                  <CardHeader className="p-6 pb-2 flex-row justify-between items-center space-y-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black italic text-[10px]">A{lv.order}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Anomaly Log</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(lv)} className="p-2 bg-white/5 hover:text-blue-400 text-white/70 rounded-xl border border-white/10 transition-colors"><Pencil size={14} /></button>
                      <DeleteDialog onConfirm={async () => { await deleteDoc(doc(db, "anomalyLevels", lv.id)); toast.success("LOG DELETED"); }} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="space-y-4">
                      <div className="flex justify-between bg-[#020617] p-4 rounded-2xl border border-white/5">
                        {lv.items.map((item, i) => (
                          <div key={i} className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg ${lv.odd === i ? 'bg-blue-500/20 ring-1 ring-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : ''}`}>
                            {item}
                          </div>
                        ))}
                      </div>
                      <div className="px-1">
                        <p className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1">Alert Message</p>
                        <p className="text-[10px] font-bold text-blue-100 uppercase italic tracking-tight line-clamp-1">"{lv.msg}"</p>
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
      <button className="p-2 bg-white/5 hover:text-red-500 text-white/70 rounded-xl border border-white/10 transition-colors"><Trash2 size={14} /></button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[92%] sm:max-w-md outline-none">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Expunge Anomaly?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-bold tracking-tight">
          This record will be permanently wiped from the anomaly history.
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
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><ScanSearch className="w-10 h-10" /></motion.div>
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Scanning Patterns...</p>
  </div>
);