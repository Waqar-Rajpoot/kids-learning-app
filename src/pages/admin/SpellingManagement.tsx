import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { SpellCheck, Plus, Pencil, Trash2, Sparkles, Activity, Save, Type, MessageSquareDashed } from 'lucide-react';
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

interface SpellingWord {
  id: string;
  word: string;
  emoji: string;
  hint: string;
}

export const SpellingManagement = () => {
  const [words, setWords] = useState<SpellingWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<SpellingWord | null>(null);

  // Form State
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('');
  const [hint, setHint] = useState('');

  useEffect(() => {
    // Ordering by createdAt or word alphabetically
    const q = query(collection(db, "spellingWords"), orderBy("word", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as SpellingWord));
      setWords(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !emoji || !hint) return toast.error("LEXICON DATA INCOMPLETE");

    try {
      const payload = { 
        word: word.toUpperCase().trim(), 
        emoji: emoji.trim(), 
        hint: hint.trim() 
      };

      if (editingWord) {
        await updateDoc(doc(db, "spellingWords", editingWord.id), payload);
        toast.success("WORD UPDATED IN ARCHIVE");
      } else {
        await addDoc(collection(db, "spellingWords"), { ...payload, createdAt: serverTimestamp() });
        toast.success("NEW WORD MANIFESTED");
      }
      resetForm();
    } catch (error) {
      toast.error("UPLINK FAILURE");
    }
  };

  const resetForm = () => {
    setWord('');
    setEmoji('');
    setHint('');
    setEditingWord(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (sw: SpellingWord) => {
    setEditingWord(sw);
    setWord(sw.word);
    setEmoji(sw.emoji);
    setHint(sw.hint);
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
                <SpellCheck className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Lexicon Forge</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Spelling Core Database</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-5 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline font-black uppercase text-xs italic tracking-tighter">Add Word</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[400px] max-h-[85vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Sparkles className="text-blue-400" />
                  {editingWord ? 'Refine Word' : 'Forge Word'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Target Word</label>
                    <div className="relative">
                       <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                       <input value={word} onChange={e => setWord(e.target.value)} placeholder="GIRAFFE" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-xs font-mono font-bold uppercase outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Emoji Representation</label>
                    <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🦒" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-2xl text-center outline-none focus:border-blue-500/50" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Hint / Clue</label>
                    <div className="relative">
                      <MessageSquareDashed className="absolute left-3 top-3 text-white/20 w-4 h-4" />
                      <textarea value={hint} onChange={e => setHint(e.target.value)} placeholder="Long necked animal..." rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-xs font-bold outline-none focus:border-blue-500/50 resize-none" />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Save size={14} /> Commit Lexicon
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode='popLayout'>
            {words.map((sw, idx) => (
              <motion.div key={sw.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                <Card className="bg-white/5 border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#020617] border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform shrink-0">
                        {sw.emoji}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-sm font-mono font-black uppercase tracking-widest text-white/90">{sw.word}</h3>
                        <p className="text-[9px] text-blue-400/60 uppercase font-black italic flex items-center gap-1">
                          <MessageSquareDashed size={10} /> {sw.hint}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(sw)} className="p-2.5 bg-white/5 hover:text-blue-400 text-white/60 rounded-xl border border-white/10 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <DeleteDialog onConfirm={async () => { await deleteDoc(doc(db, "spellingWords", sw.id)); toast.success("WORD EXPUNGED"); }} />
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
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Deconstruct Word?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-bold tracking-tight">
          Warning: Removing this word will immediately erase it from all spelling challenges.
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
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Scanning Lexicon...</p>
  </div>
);