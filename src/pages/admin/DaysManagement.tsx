import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Hash, Palette, Info, Edit2, Check, X, LayoutGrid } from 'lucide-react';
import { DaysAdminService } from '@/services/DaysAdminService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Shadcn UI Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DaysManagement = () => {
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    fact: '',
    color: '#6366f1',
    order: 1
  });

  const loadDays = async () => {
    try {
      const data = await DaysAdminService.getDays();
      setDays(data);
    } catch (error) {
      toast.error("Failed to fetch days");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDays(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await DaysAdminService.updateDay(editingId, formData);
        toast.success("Update successful!");
      } else {
        await DaysAdminService.addDay(formData);
        toast.success("Added to the adventure!");
      }
      setFormData({ name: '', fact: '', color: '#6366f1', order: days.length + 1 });
      setEditingId(null);
      loadDays();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await DaysAdminService.deleteDay(itemToDelete);
      toast.success("Segment removed from the chain");
      loadDays();
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const startEdit = (day: any) => {
    setEditingId(day.id);
    setFormData({ name: day.name, fact: day.fact, color: day.color, order: day.order });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 pb-24 font-sans selection:bg-indigo-500/30">
      <div className="max-w-2xl mx-auto space-y-8"> {/* Reduced max-width for better single-column reading */}
        
        {/* Header Section */}
        <div className="relative overflow-hidden bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex flex-col items-center gap-4 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <LayoutGrid size={100} />
          </div>
          <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/30">
            <Calendar size={32} />
          </div>
          <div className="text-center z-10">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">Caterpillar Builder</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Logic & Sequence Management</p>
          </div>
        </div>

        {/* Form Section - Forced Single Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6"> {/* Force 1 column on all screens */}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Day Name</label>
                <input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-indigo-500 transition-all outline-none text-white font-bold" 
                  placeholder="e.g. Monday" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Order</label>
                <input 
                  type="number" 
                  value={formData.order} 
                  onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} 
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-indigo-500 transition-all outline-none text-white font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Child-Friendly Fact</label>
                <textarea 
                  value={formData.fact} 
                  onChange={e => setFormData({...formData, fact: e.target.value})} 
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-indigo-500 transition-all outline-none text-white min-h-[100px] resize-none" 
                  placeholder="Write a fun fact for the kids..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest flex items-center gap-2">
                   <Palette size={12}/> Bubble Color
                </label>
                <div className="flex gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 items-center relative group">
                    <input 
                        type="color" 
                        value={formData.color} 
                        onChange={e => setFormData({...formData, color: e.target.value})} 
                        className="w-14 h-12 rounded-xl bg-transparent border-none cursor-pointer absolute opacity-0 left-0" 
                        id="colorPicker"
                    />
                    <label htmlFor="colorPicker" className="w-12 h-10 rounded-xl border border-slate-700 cursor-pointer flex-shrink-0 transition-transform active:scale-90 shadow-inner" style={{ backgroundColor: formData.color }} />
                    <input 
                        type="text"
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        className="bg-transparent text-sm font-mono text-slate-300 flex-1 outline-none uppercase font-bold tracking-wider"
                    />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase italic py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                  {editingId ? <><Check size={20}/> Update Day</> : <><Plus size={20}/> Add Segment</>}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setFormData({name:'', fact:'', color:'#6366f1', order:1}); }} className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl border border-slate-700 font-bold uppercase text-xs tracking-widest hover:bg-slate-700 transition-all">
                    Cancel Editing
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>

        {/* List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="font-black text-slate-600 uppercase tracking-[0.3em] text-[10px]">Caterpillar Chain</h3>
            <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-indigo-400 font-black">{days.length} DAYS</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode='popLayout'>
              {days.map((day, index) => (
                <motion.div 
                  key={day.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-[2rem] flex flex-col gap-4 hover:bg-slate-800/40 hover:border-slate-700 transition-all shadow-xl"
                >
                  <div className="flex items-center gap-5 w-full">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-xl shadow-2xl flex-shrink-0" style={{ backgroundColor: day.color, boxShadow: `0 0 25px ${day.color}33` }}>
                      {day.order}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-white uppercase italic tracking-wider text-lg leading-tight">{day.name}</h4>
                      <p className="text-slate-500 text-sm italic line-clamp-2">{day.fact}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-slate-800/50">
                    <button onClick={() => startEdit(day)} className="flex-1 p-3 bg-slate-950 text-slate-400 hover:text-indigo-400 rounded-xl border border-slate-800 flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-widest"><Edit2 size={16} /> Edit</button>
                    <button 
                      onClick={() => { setItemToDelete(day.id); setIsDeleteDialogOpen(true); }} 
                      className="flex-1 p-3 bg-slate-950 text-slate-400 hover:text-red-400 rounded-xl border border-slate-800 flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-widest"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 rounded-[2.5rem] max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-black uppercase italic text-xl">Break the Chain?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 font-medium">
              Are you sure? This segment will be gone from the caterpillar forever.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="bg-slate-800 border-none text-slate-300 rounded-xl hover:bg-slate-700 flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 flex-1">Yes, Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DaysManagement;