// import React, { useState, useEffect } from 'react';
// import { db } from '@/lib/firebase';
// import { 
//   collection, getDocs, deleteDoc, doc, 
//   updateDoc, query, orderBy, setDoc 
// } from 'firebase/firestore';
// import { evaluate } from 'mathjs';
// import { 
//   Save, Trash2, Edit3, Plus, Calculator, 
//   CheckCircle2, AlertCircle, Hash, Layers 
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const MathAdmin = () => {
//   const [problems, setProblems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   // Form State
//   const [formData, setFormData] = useState({
//     expression: "",
//     levelNumber: 1,
//     hint: "",
//     points: 10
//   });

//   const [previewAnswer, setPreviewAnswer] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const mathCollectionRef = collection(db, "math_challenges");

//   // --- Real-time Math Validation ---
//   useEffect(() => {
//     if (!formData.expression) {
//       setPreviewAnswer(null);
//       setError(null);
//       return;
//     }
//     try {
//       // Replace {} and [] with () for mathjs evaluation
//       const cleanExpr = formData.expression
//         .replace(/{/g, '(').replace(/}/g, ')')
//         .replace(/\[/g, '(').replace(/\]/g, ')');
      
//       const result = evaluate(cleanExpr);
//       setPreviewAnswer(result);
//       setError(null);
//     } catch (err) {
//       setError("Invalid math sequence");
//       setPreviewAnswer(null);
//     }
//   }, [formData.expression]);

//   // --- Firebase CRUD ---
//   const fetchProblems = async () => {
//     setLoading(true);
//     const q = query(mathCollectionRef, orderBy("levelNumber", "asc"));
//     const data = await getDocs(q);
//     setProblems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//     setLoading(false);
//   };

//   useEffect(() => { fetchProblems(); }, []);

//   const handleSave = async () => {
//     if (error || !previewAnswer) return alert("Please fix the math expression first!");
//     setLoading(true);
//     try {
//       const payload = { ...formData, answer: previewAnswer };
//       if (editingId) {
//         await updateDoc(doc(db, "math_challenges", editingId), payload);
//       } else {
//         await setDoc(doc(db, "math_challenges", `math_lvl_${formData.levelNumber}`), payload);
//       }
//       resetForm();
//       fetchProblems();
//     } catch (err) { console.error(err); }
//     setLoading(false);
//   };

//   const handleDelete = async (id: string) => {
//     if (window.confirm("Remove this math challenge?")) {
//       await deleteDoc(doc(db, "math_challenges", id));
//       fetchProblems();
//     }
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({ expression: "", levelNumber: problems.length + 1, hint: "", points: 10 });
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      
//       {/* SIDEBAR: CHALLENGE LIST */}
//       <aside className="w-96 bg-white border-r border-slate-200 p-8 overflow-y-auto">
//         <div className="flex items-center gap-3 mb-10">
//           <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-200">
//             <Calculator size={24}/>
//           </div>
//           <h2 className="font-black uppercase italic text-lg tracking-tighter text-slate-800">Math Lab Admin</h2>
//         </div>

//         <button onClick={resetForm} className="w-full mb-8 py-4 bg-purple-50 rounded-2xl text-xs font-black uppercase text-purple-600 hover:bg-purple-100 transition-all flex items-center justify-center gap-2 border-2 border-dashed border-purple-200">
//           <Plus size={16}/> New Math Level
//         </button>

//         <div className="space-y-4">
//           {problems.map((prob) => (
//             <div key={prob.id} className={`group p-5 rounded-[2rem] border-2 transition-all ${editingId === prob.id ? 'border-purple-500 bg-purple-50/30' : 'border-slate-50 hover:border-slate-200 bg-white'}`}>
//               <div className="flex justify-between items-start">
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2">
//                     <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-black text-slate-500">LVL {prob.levelNumber}</span>
//                     <span className="text-[10px] font-bold text-purple-500 uppercase">{prob.points} PTS</span>
//                   </div>
//                   <h4 className="font-black text-slate-800 text-lg tracking-tight font-mono">{prob.expression}</h4>
//                 </div>
//                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <button onClick={() => { setEditingId(prob.id); setFormData(prob); }} className="p-2 text-slate-400 hover:text-purple-600 transition-colors"><Edit3 size={18}/></button>
//                   <button onClick={() => handleDelete(prob.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </aside>

//       {/* MAIN EDITOR */}
//       <main className="flex-1 p-12 bg-slate-50/50">
//         <div className="max-w-3xl mx-auto">
//           <header className="mb-12 flex justify-between items-center">
//             <div>
//               <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
//                 {editingId ? "Modify" : "Create"} <span className="text-purple-600">Quest</span>
//               </h1>
//               <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-xs">Hierarchy of Operations Designer</p>
//             </div>
//             <button 
//               disabled={loading || !!error || !formData.expression}
//               onClick={handleSave}
//               className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase italic shadow-2xl hover:bg-purple-600 transition-all active:scale-95 disabled:opacity-30 flex items-center gap-3"
//             >
//               <Save size={20}/> {loading ? "Syncing..." : "Publish Level"}
//             </button>
//           </header>

//           <div className="grid gap-8">
//             {/* LIVE PREVIEW CARD */}
//             <div className={`p-10 rounded-[3rem] border-4 transition-all duration-500 ${error ? 'bg-red-50 border-red-100' : 'bg-white border-white shadow-xl'}`}>
//                <div className="flex justify-between items-center mb-6">
//                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Live Solver Preview</span>
//                   {previewAnswer !== null && (
//                     <div className="flex items-center gap-2 text-green-500 font-black italic">
//                       <CheckCircle2 size={16}/> Correct Answer: {previewAnswer}
//                     </div>
//                   )}
//                   {error && (
//                     <div className="flex items-center gap-2 text-red-500 font-black italic">
//                       <AlertCircle size={16}/> {error}
//                     </div>
//                   )}
//                </div>
//                <input 
//                   type="text"
//                   placeholder="e.g. {10 + [5 * (2+2)]}"
//                   value={formData.expression}
//                   onChange={(e) => setFormData({...formData, expression: e.target.value})}
//                   className="w-full bg-transparent text-5xl font-black text-slate-800 placeholder:text-slate-200 outline-none font-mono"
//                />
//             </div>

//             {/* SETTINGS GRID */}
//             <div className="grid grid-cols-2 gap-8">
//               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
//                 <label className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">
//                   <Hash size={14}/> Level Rank
//                 </label>
//                 <input 
//                   type="number"
//                   value={formData.levelNumber}
//                   onChange={(e) => setFormData({...formData, levelNumber: parseInt(e.target.value)})}
//                   className="w-full text-2xl font-black text-slate-800 focus:outline-none"
//                 />
//               </div>
//               <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
//                 <label className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">
//                   <Layers size={14}/> Points Reward
//                 </label>
//                 <input 
//                   type="number"
//                   value={formData.points}
//                   onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
//                   className="w-full text-2xl font-black text-slate-800 focus:outline-none"
//                 />
//               </div>
//             </div>

//             {/* HINT SYSTEM */}
//             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
//                <label className="text-xs font-black uppercase text-slate-400 mb-4 block tracking-widest text-center">Educational Hint (Teaches the child how to solve it)</label>
//                <textarea 
//                   placeholder="Explain the order: 'First solve the inner ( ) then the [ ] ...'"
//                   value={formData.hint}
//                   onChange={(e) => setFormData({...formData, hint: e.target.value})}
//                   className="w-full bg-slate-50 p-6 rounded-3xl border-none focus:ring-2 focus:ring-purple-400 font-bold text-slate-600 min-h-[120px]"
//                />
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MathAdmin;






// import { useState, useEffect } from 'react';
// import { db } from '@/lib/firebase';
// import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, setDoc } from 'firebase/firestore';
// import { evaluate } from 'mathjs';
// import { 
//   Save, Trash2, Edit3, Plus, Calculator, CheckCircle2, 
//   AlertCircle, Hash, Layers, ChevronRight, X 
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// // Shadcn UI Imports (Make sure these are installed/available)
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";

// const MathAdmin = () => {
//   const [problems, setProblems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     expression: "",
//     levelNumber: 1,
//     hint: "",
//     points: 10
//   });

//   const [previewAnswer, setPreviewAnswer] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const mathCollectionRef = collection(db, "math_challenges");

//   useEffect(() => {
//     if (!formData.expression) {
//       setPreviewAnswer(null);
//       setError(null);
//       return;
//     }
//     try {
//       const cleanExpr = formData.expression
//         .replace(/{/g, '(').replace(/}/g, ')')
//         .replace(/\[/g, '(').replace(/\]/g, ')');
//       const result = evaluate(cleanExpr);
//       setPreviewAnswer(result);
//       setError(null);
//     } catch (err) {
//       setError("Syntax Error");
//       setPreviewAnswer(null);
//     }
//   }, [formData.expression]);

//   const fetchProblems = async () => {
//     setLoading(true);
//     const q = query(mathCollectionRef, orderBy("levelNumber", "asc"));
//     const data = await getDocs(q);
//     setProblems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//     setLoading(false);
//   };

//   useEffect(() => { fetchProblems(); }, []);

//   const handleSave = async () => {
//     if (error || previewAnswer === null) return;
//     setLoading(true);
//     try {
//       const payload = { ...formData, answer: previewAnswer };
//       if (editingId) {
//         await updateDoc(doc(db, "math_challenges", editingId), payload);
//       } else {
//         await setDoc(doc(db, "math_challenges", `math_lvl_${formData.levelNumber}`), payload);
//       }
//       resetForm();
//       fetchProblems();
//     } catch (err) { console.error(err); }
//     setLoading(false);
//   };

//   const confirmDelete = async () => {
//     if (deleteId) {
//       await deleteDoc(doc(db, "math_challenges", deleteId));
//       setDeleteId(null);
//       fetchProblems();
//     }
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({ expression: "", levelNumber: problems.length + 1, hint: "", points: 10 });
//     if (window.innerWidth < 1024) setIsSidebarOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col lg:flex-row font-sans">
      
//       {/* SHADCN DELETE CONFIRMATION */}
//       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent className="bg-slate-900 border-slate-800 text-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete this challenge?</AlertDialogTitle>
//             <AlertDialogDescription className="text-slate-400">
//               This action cannot be undone. This level will be removed from the children's view immediately.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-slate-800 hover:bg-slate-700 border-none">Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* MOBILE HEADER */}
//       <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
//         <h2 className="font-black italic text-indigo-400">MATH LAB ADMIN</h2>
//         <Button variant="ghost" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
//           <Layers size={24} />
//         </Button>
//       </div>

//       {/* SIDEBAR: CHALLENGE LIST */}
//       <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-800 p-6 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-2 text-indigo-400 font-black italic">
//             <Calculator size={20}/>
//             <span>LEVELS</span>
//           </div>
//           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden"><X size={20}/></button>
//         </div>

//         <Button 
//           onClick={resetForm} 
//           className="w-full mb-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex gap-2 py-6"
//         >
//           <Plus size={18}/> Add Problem
//         </Button>

//         <div className="space-y-3">
//           {problems.map((prob) => (
//             <div key={prob.id} className={`p-4 rounded-2xl border transition-all ${editingId === prob.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}>
//               <div className="flex justify-between items-start">
//                 <div className="cursor-pointer" onClick={() => { setEditingId(prob.id); setFormData(prob); setIsSidebarOpen(false); }}>
//                   <p className="text-[10px] font-black text-indigo-400 mb-1">LVL {prob.levelNumber}</p>
//                   <h4 className="font-mono font-bold text-sm truncate w-40">{prob.expression}</h4>
//                 </div>
//                 <div className="flex gap-1">
//                   <button onClick={() => setDeleteId(prob.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </aside>

//       {/* MAIN EDITOR */}
//       <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
//         <div className="max-w-3xl mx-auto">
//           <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h1 className="text-3xl lg:text-5xl font-black uppercase italic tracking-tighter">
//                 {editingId ? "Edit" : "New"} <span className="text-indigo-500">Problem</span>
//               </h1>
//               <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Order of Operations Designer</p>
//             </div>
//             <Button 
//               disabled={loading || !!error || !formData.expression}
//               onClick={handleSave}
//               className="w-full md:w-auto bg-white text-black hover:bg-indigo-500 hover:text-white px-8 py-6 rounded-2xl font-black italic transition-all disabled:opacity-20"
//             >
//               <Save size={18} className="mr-2"/> {loading ? "Saving..." : "Publish Level"}
//             </Button>
//           </header>

//           <div className="grid gap-6">
//             {/* INPUT CARD */}
//             <div className={`p-6 lg:p-10 rounded-[2rem] border-2 transition-all duration-300 ${error ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900 border-slate-800 shadow-2xl'}`}>
//                <div className="flex justify-between items-center mb-4">
//                   <span className="text-[10px] font-black uppercase text-slate-500">Equation Input</span>
//                   {previewAnswer !== null && (
//                     <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold italic">
//                       <CheckCircle2 size={14}/> Result: {previewAnswer}
//                     </div>
//                   )}
//                   {error && (
//                     <div className="flex items-center gap-2 text-red-400 text-xs font-bold italic">
//                       <AlertCircle size={14}/> {error}
//                     </div>
//                   )}
//                </div>
//                <input 
//                   type="text"
//                   placeholder="{10 + [5 * (2+2)]}"
//                   value={formData.expression}
//                   onChange={(e) => setFormData({...formData, expression: e.target.value})}
//                   className="w-full bg-transparent text-3xl lg:text-5xl font-black text-white placeholder:text-slate-700 outline-none font-mono"
//                />
//             </div>

//             {/* CONFIGURATION */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
//                 <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block">Level Rank</label>
//                 <div className="flex items-center gap-3">
//                   <Hash size={18} className="text-indigo-500"/>
//                   <input 
//                     type="number"
//                     value={formData.levelNumber}
//                     onChange={(e) => setFormData({...formData, levelNumber: parseInt(e.target.value)})}
//                     className="bg-transparent text-xl font-black text-white outline-none w-full"
//                   />
//                 </div>
//               </div>
//               <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
//                 <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block">Points Reward</label>
//                 <div className="flex items-center gap-3">
//                   <Layers size={18} className="text-emerald-500"/>
//                   <input 
//                     type="number"
//                     value={formData.points}
//                     onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
//                     className="bg-transparent text-xl font-black text-white outline-none w-full"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* HINT */}
//             <div className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800">
//                <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block">Educational Hint</label>
//                <textarea 
//                   placeholder="Explain the step-by-step logic..."
//                   value={formData.hint}
//                   onChange={(e) => setFormData({...formData, hint: e.target.value})}
//                   className="w-full bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-slate-300 font-medium text-sm min-h-[100px] outline-none focus:border-indigo-500 transition-colors"
//                />
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MathAdmin;










// import { useState, useEffect } from 'react';
// import { db } from '@/lib/firebase';
// import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, setDoc } from 'firebase/firestore';
// import { evaluate } from 'mathjs';
// import { 
//   Save, Trash2, Edit3, Plus, Calculator, CheckCircle2, 
//   AlertCircle, Hash, Layers, X, Menu 
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Button } from "@/components/ui/button";

// const MathAdmin = () => {
//   const [problems, setProblems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     expression: "",
//     levelNumber: 1,
//     hint: "",
//     points: 10
//   });

//   const [previewAnswer, setPreviewAnswer] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const mathCollectionRef = collection(db, "math_challenges");

//   useEffect(() => {
//     if (!formData.expression) {
//       setPreviewAnswer(null);
//       setError(null);
//       return;
//     }
//     try {
//       const cleanExpr = formData.expression
//         .replace(/{/g, '(').replace(/}/g, ')')
//         .replace(/\[/g, '(').replace(/\]/g, ')');
//       const result = evaluate(cleanExpr);
//       setPreviewAnswer(result);
//       setError(null);
//     } catch (err) {
//       setError("Syntax Error");
//       setPreviewAnswer(null);
//     }
//   }, [formData.expression]);

//   const fetchProblems = async () => {
//     setLoading(true);
//     const q = query(mathCollectionRef, orderBy("levelNumber", "asc"));
//     const data = await getDocs(q);
//     setProblems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//     setLoading(false);
//   };

//   useEffect(() => { fetchProblems(); }, []);

//   const handleSave = async () => {
//     if (error || previewAnswer === null) return;
//     setLoading(true);
//     try {
//       const payload = { ...formData, answer: previewAnswer };
//       if (editingId) {
//         await updateDoc(doc(db, "math_challenges", editingId), payload);
//       } else {
//         await setDoc(doc(db, "math_challenges", `math_lvl_${formData.levelNumber}`), payload);
//       }
//       resetForm();
//       fetchProblems();
//     } catch (err) { console.error(err); }
//     setLoading(false);
//   };

//   const confirmDelete = async () => {
//     if (deleteId) {
//       await deleteDoc(doc(db, "math_challenges", deleteId));
//       setDeleteId(null);
//       fetchProblems();
//     }
//   };

//   const resetForm = () => {
//     setEditingId(null);
//     setFormData({ expression: "", levelNumber: problems.length + 1, hint: "", points: 10 });
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center font-sans overflow-x-hidden">
      
//       {/* SHADCN DELETE CONFIRMATION */}
//       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent className="bg-slate-950 border-slate-800 text-white max-w-[90vw] rounded-3xl">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Delete Level?</AlertDialogTitle>
//             <AlertDialogDescription className="text-slate-400">
//               Are you sure? This removes the problem from the app.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="bg-slate-800 hover:bg-slate-700 border-none rounded-xl">Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 rounded-xl">Delete</AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* STICKY TOP APP BAR (MOBILE VIEW ON DESKTOP) */}
//       <header className="sticky top-0 z-40 w-full max-w-md bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <div className="p-2 bg-indigo-600 rounded-lg">
//             <Calculator size={18} className="text-white" />
//           </div>
//           <h2 className="font-black italic text-sm tracking-widest text-white uppercase">Math Lab</h2>
//         </div>
//         <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white">
//           <Menu size={24} />
//         </Button>
//       </header>

//       {/* SIDEBAR OVERLAY (DRAWER) */}
//       <AnimatePresence>
//         {isSidebarOpen && (
//           <>
//             <motion.div 
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setIsSidebarOpen(false)}
//               className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
//             />
//             <motion.aside 
//               initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
//               className="fixed inset-y-0 right-0 z-[70] w-[85%] max-w-sm bg-slate-900 shadow-2xl p-6 border-l border-slate-800 overflow-y-auto"
//             >
//               <div className="flex justify-between items-center mb-8">
//                 <span className="font-black italic text-indigo-400 uppercase tracking-tighter">Manage Levels</span>
//                 <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}><X size={20}/></Button>
//               </div>

//               <Button onClick={resetForm} className="w-full bg-indigo-600 hover:bg-indigo-700 mb-6 py-6 rounded-2xl font-bold gap-2">
//                 <Plus size={18}/> New Problem
//               </Button>

//               <div className="space-y-4">
//                 {problems.map((prob) => (
//                   <div key={prob.id} className={`p-4 rounded-2xl border-2 transition-all ${editingId === prob.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-800 bg-slate-950'}`}>
//                     <div className="flex justify-between items-center">
//                       <div className="flex-1 cursor-pointer" onClick={() => { setEditingId(prob.id); setFormData(prob); setIsSidebarOpen(false); }}>
//                         <p className="text-[10px] font-black text-indigo-400 uppercase">Level {prob.levelNumber}</p>
//                         <h4 className="font-mono font-bold text-sm truncate">{prob.expression}</h4>
//                       </div>
//                       <button onClick={() => setDeleteId(prob.id)} className="p-2 text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </motion.aside>
//           </>
//         )}
//       </AnimatePresence>

//       {/* MAIN CONTENT AREA - CENTERED APP VIEW */}
//       <main className="w-full max-w-md p-6 flex-1 space-y-8 pb-24">
        
//         <div className="space-y-1">
//           <h1 className="text-4xl font-black italic uppercase tracking-tighter">
//             {editingId ? "Update" : "Create"} <span className="text-indigo-500">Quest</span>
//           </h1>
//           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Administrator Dashboard</p>
//         </div>

//         {/* EXPRESSION INPUT CARD */}
//         <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 shadow-2xl ${error ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900 border-slate-800'}`}>
//            <div className="flex justify-between items-center mb-4">
//               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Equation</span>
//               {previewAnswer !== null && (
//                 <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black italic">
//                   <CheckCircle2 size={12}/> RESULT: {previewAnswer}
//                 </div>
//               )}
//            </div>
//            <input 
//               type="text"
//               autoFocus
//               placeholder="{10 + [5 * 2]}"
//               value={formData.expression}
//               onChange={(e) => setFormData({...formData, expression: e.target.value})}
//               className="w-full bg-transparent text-4xl font-black text-white placeholder:text-slate-800 outline-none font-mono"
//            />
//            {error && <p className="text-red-500 text-[10px] font-bold mt-2 italic flex items-center gap-1"><AlertCircle size={10}/> {error}</p>}
//         </div>

//         {/* CONFIGURATION GRID */}
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
//             <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Level Rank</label>
//             <div className="flex items-center gap-3">
//               <Hash size={16} className="text-indigo-500"/>
//               <input 
//                 type="number"
//                 value={formData.levelNumber}
//                 onChange={(e) => setFormData({...formData, levelNumber: parseInt(e.target.value)})}
//                 className="bg-transparent text-xl font-black text-white outline-none w-full"
//               />
//             </div>
//           </div>
//           <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
//             <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Points</label>
//             <div className="flex items-center gap-3">
//               <Layers size={16} className="text-emerald-500"/>
//               <input 
//                 type="number"
//                 value={formData.points}
//                 onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
//                 className="bg-transparent text-xl font-black text-white outline-none w-full"
//               />
//             </div>
//           </div>
//         </div>

//         {/* HINT AREA */}
//         <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
//           <label className="text-[10px] font-black uppercase text-slate-500 mb-3 block">Step-by-Step Hint</label>
//           <textarea 
//             placeholder="Explain the order of operations..."
//             value={formData.hint}
//             onChange={(e) => setFormData({...formData, hint: e.target.value})}
//             className="w-full bg-slate-950/50 p-4 rounded-2xl border border-slate-800 text-slate-300 font-medium text-sm min-h-[120px] outline-none focus:border-indigo-500"
//           />
//         </div>

//         {/* BOTTOM ACTION BAR */}
//         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
//           <Button 
//             disabled={loading || !!error || !formData.expression}
//             onClick={handleSave}
//             className="w-full bg-white text-black hover:bg-indigo-500 hover:text-white py-8 rounded-3xl font-black uppercase italic shadow-2xl transition-all disabled:opacity-20"
//           >
//             <Save size={20} className="mr-2"/> {loading ? "Syncing..." : (editingId ? "Update Level" : "Publish Quest")}
//           </Button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MathAdmin;







import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { evaluate } from 'mathjs';
import { 
  Save, Trash2, Edit3, Calculator, CheckCircle2, 
  AlertCircle, Hash, Layers, X, PlusCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
import { Button } from "@/components/ui/button";

const MathAdmin = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    expression: "",
    levelNumber: 1,
    hint: "",
    points: 10
  });

  const [previewAnswer, setPreviewAnswer] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mathCollectionRef = collection(db, "math_challenges");

  useEffect(() => {
    if (!formData.expression) {
      setPreviewAnswer(null);
      setError(null);
      return;
    }
    try {
      const cleanExpr = formData.expression
        .replace(/{/g, '(').replace(/}/g, ')')
        .replace(/\[/g, '(').replace(/\]/g, ')');
      const result = evaluate(cleanExpr);
      setPreviewAnswer(result);
      setError(null);
    } catch (err) {
      setError("Syntax Error");
      setPreviewAnswer(null);
    }
  }, [formData.expression]);

  const fetchProblems = async () => {
    setLoading(true);
    const q = query(mathCollectionRef, orderBy("levelNumber", "asc"));
    const data = await getDocs(q);
    setProblems(data.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => { fetchProblems(); }, []);

  const handleSave = async () => {
    if (error || previewAnswer === null) return;
    setLoading(true);
    try {
      const payload = { ...formData, answer: previewAnswer };
      if (editingId) {
        await updateDoc(doc(db, "math_challenges", editingId), payload);
      } else {
        await setDoc(doc(db, "math_challenges", `math_lvl_${formData.levelNumber}`), payload);
      }
      resetForm();
      fetchProblems();
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteDoc(doc(db, "math_challenges", deleteId));
      setDeleteId(null);
      fetchProblems();
    }
  };

  const handleEditClick = (prob: any) => {
    setEditingId(prob.id);
    setFormData(prob);
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ 
      expression: "", 
      levelNumber: problems.length > 0 ? Math.max(...problems.map(p => p.levelNumber)) + 1 : 1, 
      hint: "", 
      points: 10 
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center font-sans">
      
      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-slate-950 border-slate-800 text-white max-w-[450px] w rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-100">Delete Level?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This will permanently remove this math challenge.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-none rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 rounded-xl">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* COMPACT APP BAR */}
      <header className="sticky top-0 z-40 w-full max-w-md bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Calculator size={16} className="text-white" />
          </div>
          <h2 className="font-black italic text-xs tracking-widest text-white uppercase">Math Admin</h2>
        </div>
        {editingId && (
          <Button variant="ghost" size="sm" onClick={resetForm} className="text-indigo-400 hover:text-indigo-300 font-bold text-[10px] uppercase">
            <PlusCircle size={14} className="mr-1"/> New
          </Button>
        )}
      </header>

      <main className="w-full max-w-md p-6 space-y-10 pb-32">
        
        {/* INPUT SECTION */}
        <section ref={formRef} className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-100">
              {editingId ? "Update" : "Create"} <span className="text-indigo-500">Quest</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">BODMAS Level Creator</p>
          </div>

          {/* MAIN INPUT */}
          <div className={`p-6 rounded-[2rem] border-2 transition-all duration-300 shadow-2xl ${error ? 'bg-red-500/5 border-red-500/20 shadow-red-900/10' : 'bg-slate-900 border-slate-800'}`}>
             <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Equation</span>
                {previewAnswer !== null && (
                  <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black italic">
                    <CheckCircle2 size={12}/> RESULT: {previewAnswer}
                  </div>
                )}
             </div>
             <input 
                type="text"
                placeholder="{10 + [5 * 2]}"
                value={formData.expression}
                onChange={(e) => setFormData({...formData, expression: e.target.value})}
                className="w-full bg-transparent text-3xl font-black text-white placeholder:text-slate-800 outline-none font-mono"
             />
             {error && <p className="text-red-400 text-[10px] font-bold mt-2 italic flex items-center gap-1 animate-pulse"><AlertCircle size={10}/> {error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Level</label>
              <div className="flex items-center gap-2">
                <Hash size={14} className="text-indigo-500"/>
                <input type="number" value={formData.levelNumber} onChange={(e) => setFormData({...formData, levelNumber: parseInt(e.target.value)})} className="bg-transparent font-black text-white outline-none w-full"/>
              </div>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <label className="text-[10px] font-black uppercase text-slate-500 mb-1 block">Reward</label>
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-emerald-500"/>
                <input type="number" value={formData.points} onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})} className="bg-transparent font-black text-white outline-none w-full"/>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block tracking-widest">Educational Hint</label>
            <textarea 
              placeholder="e.g. Solve the curly brackets last..."
              value={formData.hint}
              onChange={(e) => setFormData({...formData, hint: e.target.value})}
              className="w-full bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-slate-300 font-medium text-sm min-h-[80px] outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <Button 
            disabled={loading || !!error || !formData.expression}
            onClick={handleSave}
            className="w-full bg-white text-black hover:bg-indigo-600 hover:text-white py-8 rounded-[2rem] font-black uppercase italic shadow-xl transition-all active:scale-[0.98] disabled:opacity-20"
          >
            <Save size={18} className="mr-2"/> {loading ? "Saving..." : (editingId ? "Update This Problem" : "Publish to Kids App")}
          </Button>
        </section>

        <hr className="border-slate-800" />

        {/* LIST SECTION */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-indigo-400">Added Questions</h3>
            <span className="text-[10px] font-black text-slate-600">{problems.length} Total</span>
          </div>

          <div className="space-y-4">
            {problems.map((prob) => (
              <motion.div 
                layout
                key={prob.id} 
                className={`p-5 rounded-3xl border-2 transition-all ${editingId === prob.id ? 'border-indigo-500 bg-indigo-500/5 ring-4 ring-indigo-500/10' : 'border-slate-900 bg-slate-900/40 hover:border-slate-800'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-black text-slate-400 uppercase">LVL {prob.levelNumber}</span>
                      <span className="text-[9px] font-black text-emerald-500 uppercase">{prob.points} PTS</span>
                    </div>
                    <h4 className="font-mono font-bold text-lg text-white truncate">{prob.expression}</h4>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(prob)} className="h-10 w-10 rounded-full text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10">
                      <Edit3 size={16}/>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(prob.id)} className="h-10 w-10 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-500/10">
                      <Trash2 size={16}/>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MathAdmin;