import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CalendarDays, Palette, Edit2, Check, X, LayoutGrid, Loader2 } from 'lucide-react';
import { MonthsAdminService } from '@/services/MonthsAdminService'; // Adjust path if needed
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

const MonthsManagement = () => {
  const [months, setMonths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Modal State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    fact: '',
    color: '#ec4899', // Default pinkish for months
    order: 1
  });

  const loadMonths = async () => {
    try {
      setLoading(true);
      const data = await MonthsAdminService.getMonths();
      setMonths(data);
    } catch (error) {
      toast.error("Failed to fetch months");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMonths(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await MonthsAdminService.updateMonth(editingId, formData);
        toast.success("Month updated successfully!");
      } else {
        await MonthsAdminService.addMonth(formData);
        toast.success("New month added to the calendar!");
      }
      // Reset form
      setFormData({ name: '', fact: '', color: '#ec4899', order: months.length + 2 });
      setEditingId(null);
      loadMonths();
    } catch (error) {
      toast.error("Process failed. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await MonthsAdminService.deleteMonth(itemToDelete);
      toast.success("Month removed from the system");
      loadMonths();
    } catch (error) {
      toast.error("Failed to delete the month");
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const startEdit = (month: any) => {
    setEditingId(month.id);
    setFormData({ name: month.name, fact: month.fact, color: month.color, order: month.order });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-4 md:p-8 pb-24 font-sans selection:bg-pink-500/30">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="relative overflow-hidden bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] flex flex-col items-center gap-4 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <LayoutGrid size={100} />
          </div>
          <div className="p-4 bg-pink-500/20 rounded-2xl text-pink-400 border border-pink-500/30">
            <CalendarDays size={32} />
          </div>
          <div className="text-center z-10">
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-white">Month Manager</h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Annual Cycle Configuration</p>
          </div>
        </div>

        {/* Form Section - Vertical Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl shadow-pink-500/5"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Month Name</label>
                <input 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-pink-500 transition-all outline-none text-white font-bold" 
                  placeholder="e.g. January" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Chronological Order</label>
                <input 
                  type="number" 
                  value={formData.order} 
                  onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} 
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-pink-500 transition-all outline-none text-white font-bold" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest">Seasonal Fun Fact</label>
                <textarea 
                  value={formData.fact} 
                  onChange={e => setFormData({...formData, fact: e.target.value})} 
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-pink-500 transition-all outline-none text-white min-h-[100px] resize-none" 
                  placeholder="In January, some animals sleep all winter!..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2 tracking-widest flex items-center gap-2">
                   <Palette size={12}/> Month Theme Color
                </label>
                <div className="flex gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 items-center relative group">
                    <input 
                        type="color" 
                        value={formData.color} 
                        onChange={e => setFormData({...formData, color: e.target.value})} 
                        className="w-14 h-12 rounded-xl bg-transparent border-none cursor-pointer absolute opacity-0 left-0" 
                        id="monthColor"
                    />
                    <label htmlFor="monthColor" className="w-12 h-10 rounded-xl border border-slate-700 cursor-pointer flex-shrink-0" style={{ backgroundColor: formData.color }} />
                    <input 
                        type="text"
                        value={formData.color}
                        onChange={e => setFormData({...formData, color: e.target.value})}
                        className="bg-transparent text-sm font-mono text-slate-400 flex-1 outline-none uppercase font-bold tracking-widest"
                    />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-500 text-white font-black uppercase italic py-4 rounded-2xl shadow-lg shadow-pink-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                  {editingId ? <><Check size={20}/> Update Month</> : <><Plus size={20}/> Add Month</>}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setFormData({name:'', fact:'', color:'#ec4899', order:1}); }} className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl border border-slate-700 font-bold uppercase text-xs tracking-widest hover:bg-slate-700 transition-all">
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </motion.div>

        {/* Dynamic Month List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="font-black text-slate-600 uppercase tracking-[0.3em] text-[10px]">Configured Months</h3>
            <span className="text-[10px] bg-slate-800 px-3 py-1 rounded-full text-pink-400 font-black border border-pink-500/20">{months.length} TOTAL</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode='popLayout'>
              {months.map((month) => (
                <motion.div 
                  key={month.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900/40 border border-slate-800/50 p-5 rounded-[2rem] flex flex-col gap-4 hover:bg-slate-800/40 transition-all"
                >
                  <div className="flex items-center gap-5 w-full">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl flex-shrink-0 rotate-3" style={{ backgroundColor: month.color, boxShadow: `0 10px 30px ${month.color}22` }}>
                      {month.order}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-white uppercase italic tracking-wider text-xl leading-tight">{month.name}</h4>
                      <p className="text-slate-500 text-sm font-medium line-clamp-2">{month.fact}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2 border-t border-slate-800/50">
                    <button onClick={() => startEdit(month)} className="flex-1 p-3 bg-slate-950 text-slate-400 hover:text-pink-400 rounded-xl border border-slate-800 flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-tighter"><Edit2 size={14} /> Edit</button>
                    <button 
                      onClick={() => { setItemToDelete(month.id); setIsDeleteDialogOpen(true); }} 
                      className="flex-1 p-3 bg-slate-950 text-slate-400 hover:text-red-400 rounded-xl border border-slate-800 flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-tighter"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && <div className="flex justify-center py-10"><Loader2 className="animate-spin text-pink-500" size={40} /></div>}
            
            {months.length === 0 && !loading && (
              <div className="text-center py-20 bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-[2rem]">
                <p className="text-slate-600 font-bold italic uppercase tracking-widest text-xs">No months found in the system</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shadcn UI Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-slate-800 rounded-[2.5rem] max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-black uppercase italic text-xl">Delete Month?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 font-medium">
              This action cannot be undone. This month will be removed from the kids' learning path.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="bg-slate-800 border-none text-slate-300 rounded-xl hover:bg-slate-700 flex-1">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 flex-1">Confirm Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MonthsManagement;