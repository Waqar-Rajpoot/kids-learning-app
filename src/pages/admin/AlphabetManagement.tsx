import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Languages, Plus, Pencil, Trash2, Sparkles, Activity, Save, Type, Mic2 } from 'lucide-react';
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

interface AlphabetItem {
  id: string;
  letter: string;
  word: string;
  emoji: string;
  phonics: string;
}

export const AlphabetManagement = () => {
  const [alphabets, setAlphabets] = useState<AlphabetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AlphabetItem | null>(null);

  // Form State
  const [letter, setLetter] = useState('');
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('');
  const [phonics, setPhonics] = useState('');

  useEffect(() => {
    const q = query(collection(db, "alphabets"), orderBy("letter", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as AlphabetItem));
      setAlphabets(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letter || !word || !emoji || !phonics) return toast.error("PHONETIC DATA INCOMPLETE");

    try {
      const payload = { 
        letter: letter.toUpperCase().slice(0, 1), 
        word: word.trim(), 
        emoji: emoji.trim(), 
        phonics: phonics.toLowerCase().trim() 
      };

      if (editingItem) {
        await updateDoc(doc(db, "alphabets", editingItem.id), payload);
        toast.success("ALPHABET UNIT UPDATED");
      } else {
        await addDoc(collection(db, "alphabets"), { ...payload, createdAt: serverTimestamp() });
        toast.success("NEW CHARACTER MANIFESTED");
      }
      resetForm();
    } catch (error) {
      toast.error("CLOUD SYNC FAILURE");
    }
  };

  const resetForm = () => {
    setLetter('');
    setWord('');
    setEmoji('');
    setPhonics('');
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: AlphabetItem) => {
    setEditingItem(item);
    setLetter(item.letter);
    setWord(item.word);
    setEmoji(item.emoji);
    setPhonics(item.phonics);
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
                <Languages className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl text-white/80 md:text-3xl font-black uppercase italic tracking-tighter">Alphabet Archive</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Core Phonics Registry</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-5 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline font-black uppercase text-xs italic tracking-tighter">Add Letter</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[400px] max-h-[85vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Sparkles className="text-blue-400" />
                  {editingItem ? 'Edit Character' : 'Manifest Character'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1 text-center">Letter</label>
                      <input value={letter} onChange={e => setLetter(e.target.value)} placeholder="A" maxLength={1} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-2xl text-center font-black uppercase outline-none focus:border-blue-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1 text-center">Emoji</label>
                      <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🍎" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-2xl text-center outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Associated Word</label>
                    <div className="relative">
                      <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                      <input value={word} onChange={e => setWord(e.target.value)} placeholder="Apple" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Phonics Sound</label>
                    <div className="relative">
                      <Mic2 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                      <input value={phonics} onChange={e => setPhonics(e.target.value)} placeholder="ah" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-xs font-bold lowercase italic outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Save size={14} /> Commit Character
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <AnimatePresence mode='popLayout'>
            {alphabets.map((item, idx) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#020617] border border-white/5 flex items-center justify-center relative overflow-hidden shrink-0">
                         <span className="text-3xl z-10">{item.emoji}</span>
                         <span className="absolute -bottom-1 -right-1 text-4xl font-black text-white/[0.03] italic">{item.letter}</span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black uppercase tracking-widest text-white/90">{item.word}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-blue-400 italic">/{item.phonics}/</span>
                           <div className="w-1 h-1 rounded-full bg-white/20" />
                           <span className="text-[10px] font-black text-white/40 uppercase">Letter {item.letter}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleEdit(item)} className="p-2.5 bg-white/5 hover:text-blue-400 text-white/60 rounded-xl border border-white/10 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <DeleteDialog onConfirm={async () => { await deleteDoc(doc(db, "alphabets", item.id)); toast.success("CHARACTER REMOVED"); }} />
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
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Expunge Character?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-bold tracking-tight">
          This will permanently remove the phonetic unit from the cloud database.
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
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Scanning Phonemes...</p>
  </div>
);