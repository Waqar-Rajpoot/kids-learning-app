import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Music, Plus, Pencil, Trash2, Sparkles, Activity, Save, Palette, AlignLeft, X } from 'lucide-react';
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

interface Poem {
  id: string;
  title: string;
  emoji: string;
  color: string;
  lines: string[];
}

export const PoemManagement = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState('from-blue-400 to-indigo-500');
  const [lines, setLines] = useState<string[]>(['']);

  useEffect(() => {
    const q = query(collection(db, "poems"), orderBy("title", "asc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Poem));
      setPoems(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLineChange = (index: number, value: string) => {
    const newLines = [...lines];
    newLines[index] = value;
    setLines(newLines);
  };

  const addLine = () => setLines([...lines, '']);
  const removeLine = (index: number) => setLines(lines.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredLines = lines.filter(l => l.trim() !== '');
    if (!title || !emoji || filteredLines.length === 0) return toast.error("POETIC STRUCTURE INCOMPLETE");

    try {
      const payload = { title, emoji, color, lines: filteredLines };
      if (editingPoem) {
        await updateDoc(doc(db, "poems", editingPoem.id), payload);
        toast.success("VERSE REVISED");
      } else {
        await addDoc(collection(db, "poems"), { ...payload, createdAt: serverTimestamp() });
        toast.success("NEW POEM ARCHIVED");
      }
      resetForm();
    } catch (error) {
      toast.error("STANZAS FAILED TO UPLOAD");
    }
  };

  const resetForm = () => {
    setTitle('');
    setEmoji('');
    setColor('from-blue-400 to-indigo-500');
    setLines(['']);
    setEditingPoem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (poem: Poem) => {
    setEditingPoem(poem);
    setTitle(poem.title);
    setEmoji(poem.emoji);
    setColor(poem.color);
    setLines(poem.lines);
    setIsDialogOpen(true);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-24 selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Music className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl text-white/80 md:text-3xl font-black uppercase italic tracking-tighter">Verse Vault</h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">Lyric & Rhyme Repository</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="bg-blue-500 hover:bg-blue-600 text-black px-5 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                <Plus size={18} strokeWidth={3} />
                <span className="hidden sm:inline font-black uppercase text-xs italic tracking-tighter">New Poem</span>
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[450px] max-h-[90vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Sparkles className="text-blue-400" />
                  {editingPoem ? 'Refine Verse' : 'Compose Poem'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Visual Preview */}
                  <div className={`w-full p-4 rounded-2xl bg-gradient-to-br ${color} flex items-center gap-4 border border-white/20 shadow-lg`}>
                    <div className="text-3xl bg-black/10 p-3 rounded-xl backdrop-blur-md">{emoji || '❓'}</div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase text-black/40 italic">Live Preview</p>
                      <h4 className="font-black uppercase italic text-black leading-none">{title || 'Poem Title'}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Poem Title</label>
                      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Humpty Dumpty" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold uppercase outline-none focus:border-blue-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Emoji</label>
                      <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🥚" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xl text-center outline-none focus:border-blue-500/50" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest px-1">Gradient Classes</label>
                      <input value={color} onChange={e => setColor(e.target.value)} placeholder="from-red-400 to-orange-500" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[9px] font-mono outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[8px] font-black uppercase text-white/30 tracking-widest">Stanzas / Lines</label>
                      <button type="button" onClick={addLine} className="text-blue-400 text-[8px] font-black uppercase flex items-center gap-1 hover:text-blue-300 transition-colors">
                        <Plus size={10} /> Add Line
                      </button>
                    </div>
                    <div className="space-y-2">
                      {lines.map((line, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            value={line} 
                            onChange={e => handleLineChange(idx, e.target.value)} 
                            placeholder={`Line ${idx + 1}`}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-[11px] font-bold outline-none focus:border-blue-500/50"
                          />
                          {lines.length > 1 && (
                            <button type="button" onClick={() => removeLine(idx)} className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors">
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <Save size={14} /> Commit Verse
                  </button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode='popLayout'>
            {poems.map((poem, idx) => (
              <motion.div key={poem.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm group">
                  <CardHeader className="p-6 pb-2 flex-row justify-between items-center space-y-0">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${poem.color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-2xl">{poem.emoji}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(poem)} className="p-2.5 bg-white/5 hover:text-blue-400 text-white/70 rounded-xl border border-white/10 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <DeleteDialog onConfirm={async () => { await deleteDoc(doc(db, "poems", poem.id)); toast.success("POEM DELETED"); }} />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <div className="space-y-3">
                      <h3 className="text-lg font-black uppercase italic tracking-tighter text-white/90">{poem.title}</h3>
                      <div className="space-y-1 border-l-2 border-blue-500/30 pl-4 py-1">
                        {poem.lines.slice(0, 2).map((line, lIdx) => (
                          <p key={lIdx} className="text-[10px] text-white/50 font-bold uppercase tracking-tight line-clamp-1 italic">
                            {line}
                          </p>
                        ))}
                        {poem.lines.length > 2 && <p className="text-[8px] text-blue-400/40 font-black">+{poem.lines.length - 2} MORE LINES</p>}
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
      <button className="p-2.5 bg-white/5 hover:text-red-500 text-white/70 rounded-xl border border-white/10 transition-colors">
        <Trash2 size={14} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[92%] sm:max-w-md outline-none">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">Discard Verse?</AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-[10px] uppercase font-bold tracking-tight">
          This poem will be removed from the nursery archives.
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
      <Music className="w-10 h-10" />
    </motion.div>
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse italic">Tuning Rhymes...</p>
  </div>
);