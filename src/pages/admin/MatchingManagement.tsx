import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  Layers,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  Activity,
  X,
  LayoutGrid,
  Save,
  PlusCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Shadcn UI Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// --- TYPES ---
interface PuzzleItem {
  id: string;
  emoji: string;
  name: string;
}

interface MatchingPuzzle {
  id: string;
  items: PuzzleItem[];
}

export const MatchingManagement = () => {
  const [puzzles, setPuzzles] = useState<MatchingPuzzle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPuzzle, setEditingPuzzle] = useState<MatchingPuzzle | null>(
    null,
  );

  // Form State: A puzzle is a list of items
  const [items, setItems] = useState<PuzzleItem[]>([
    { id: "1", emoji: "", name: "" },
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "matchingPuzzles"),
      (snap) => {
        const list = snap.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as MatchingPuzzle,
        );
        setPuzzles(list);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  const handleAddItemRow = () => {
    setItems([...items, { id: Date.now().toString(), emoji: "", name: "" }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemField = (
    index: number,
    field: keyof PuzzleItem,
    value: string,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.some((it) => !it.emoji || !it.name)) {
      return toast.error("ALL FIELDS REQUIRED");
    }

    try {
      const payload = { items };
      if (editingPuzzle) {
        await updateDoc(doc(db, "matchingPuzzles", editingPuzzle.id), payload);
        toast.success("PUZZLE CONFIG REWRITTEN");
      } else {
        await addDoc(collection(db, "matchingPuzzles"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success("NEURAL MATCHING DEPLOYED");
      }
      resetForm();
    } catch (error) {
      toast.error("UPLINK FAILURE");
    }
  };

  const resetForm = () => {
    setItems([{ id: "1", emoji: "", name: "" }]);
    setEditingPuzzle(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (puzzle: MatchingPuzzle) => {
    setEditingPuzzle(puzzle);
    setItems(puzzle.items);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "matchingPuzzles", id));
    toast.success("OBJECT PURGED");
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-24 md:pb-12 selection:bg-blue-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Layers className="text-blue-400 w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl text-white/80 font-black uppercase italic tracking-tighter">
                Matching Hub
              </h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold italic px-1">
              Pattern Recognition Matrix
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button
                onClick={resetForm}
                className="bg-blue-500 hover:bg-blue-600 px-4 md:px-4 py-2 md:py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              >
                <Plus size={14} strokeWidth={3} />
                <span className="font-bold uppercase text-[10px] md:text-xs italic">
                  Create Matrix
                </span>
              </button>
            </DialogTrigger>

            <DialogContent className="bg-[#020617] border border-white/10 text-white rounded-[2rem] w-[92%] sm:max-w-[450px] max-h-[85vh] overflow-hidden flex flex-col p-0 outline-none">
              <DialogHeader className="p-5 md:p-6 pb-2">
                <DialogTitle className="text-base md:text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                  <Sparkles className="text-blue-400 w-4 h-4 md:w-5 md:h-5" />
                  {editingPuzzle ? "Modify Matrix" : "Initialize Matrix"}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-3 md:p-6 pt-0 custom-scrollbar">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 md:space-y-6"
                >
                  <div className="space-y-2 md:space-y-3">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex flex-row items-center gap-1.5 md:gap-3 bg-white/5 p-2.5 md:p-4 rounded-2xl border border-white/5"
                      >
                        {/* Emoji - Reduced width for mobile */}
                        <div className="w-12 md:w-20 space-y-1">
                          <label className="text-[6px] md:text-[7px] font-black uppercase text-white/30 tracking-widest px-1 block truncate">
                            Emoji
                          </label>
                          <input
                            value={item.emoji}
                            onChange={(e) =>
                              updateItemField(index, "emoji", e.target.value)
                            }
                            placeholder="🍎"
                            className="w-full bg-[#020617] border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 text-center text-base md:text-lg outline-none focus:border-blue-500/50 transition-colors"
                          />
                        </div>

                        {/* Identity - Flexible width */}
                        <div className="flex-1 space-y-1">
                          <label className="text-[6px] md:text-[7px] font-black uppercase text-white/30 tracking-widest px-1 block truncate">
                            Identity
                          </label>
                          <input
                            value={item.name}
                            onChange={(e) =>
                              updateItemField(index, "name", e.target.value)
                            }
                            placeholder="Name"
                            className="w-full bg-[#020617] border border-white/10 rounded-lg md:rounded-xl p-2 md:p-3 text-[9px] md:text-xs font-bold tracking-widest uppercase outline-none focus:border-blue-500/50 transition-colors"
                          />
                        </div>

                        {/* Delete Button - Scaled down for mobile */}
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItemRow(index)}
                            className="mt-3 p-2 md:p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg md:rounded-xl transition-all active:scale-90 shrink-0"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pb-2">
                    <button
                      type="button"
                      onClick={handleAddItemRow}
                      className="flex-1 border border-white/10 hover:bg-white/5 py-3 md:py-4 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <PlusCircle size={14} /> Add
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-500 hover:bg-blue-400 text-black py-3 md:py-4 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    >
                      <Save size={14} /> Save
                    </button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {puzzles.map((puzzle, idx) => (
              <motion.div
                key={puzzle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/30 transition-all backdrop-blur-sm">
                  <CardHeader className="p-6 pb-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <LayoutGrid size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                          Dataset Alpha
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(puzzle)}
                          className="p-2.5 bg-white/5 hover:text-blue-400 text-white/70 rounded-xl border border-white/10 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <DeleteDialog
                          onConfirm={() => handleDelete(puzzle.id)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-3 bg-[#020617]/50 p-4 rounded-[1.5rem] border border-white/5">
                      {puzzle.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col items-center gap-1"
                        >
                          <span className="text-2xl">{item.emoji}</span>
                          <span className="text-[7px] font-black uppercase text-white/30 truncate w-full text-center">
                            {item.name}
                          </span>
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
      <button className="p-2.5 bg-white/5 hover:text-red-500 text-white/70 rounded-xl border border-white/10 transition-colors">
        <Trash2 size={16} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-[2rem] w-[90vw] md:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter">
          Decommission Dataset?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-white/40 text-xs">
          THIS ACTION WILL REMOVE THIS MATCHING MATRIX PERMANENTLY FROM THE
          SYSTEM.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex-col md:flex-row gap-2">
        <AlertDialogCancel className="bg-white/5 border-white/10 text-white rounded-xl uppercase text-[10px] font-black">
          Abort
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-red-500 hover:bg-red-600 text-white rounded-xl uppercase text-[10px] font-black"
        >
          Confirm Purge
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

const LoadingState = () => (
  <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-blue-500">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
    >
      <Activity className="w-10 h-10" />
    </motion.div>
    <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
      Syncing Matrix...
    </p>
  </div>
);
