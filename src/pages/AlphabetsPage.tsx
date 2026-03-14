import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Volume2, Home, Eraser, Loader2 } from 'lucide-react';
import { speakText } from '@/lib/speech';
import { playTap, playPop, playStar } from '@/lib/sounds';
import { fireBasicConfetti } from '@/lib/confetti';
import { motion } from 'framer-motion';

// Firebase Imports
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const penColors = ['#a855f7', '#f472b6', '#38bdf8', '#4ade80', '#fbbf24', '#f87171'];

const AlphabetsPage = () => {
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeColor, setActiveColor] = useState(penColors[0]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const navigate = useNavigate();

    const currentItem = items[currentIndex];

    // 1. Fetch from the specific 'alphabets' collection
    useEffect(() => {
        const q = query(collection(db, "alphabets"), orderBy("letter", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(fetched);
            setLoading(false);
        }, (error) => {
            console.error("Firestore Error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Canvas Setup
    useEffect(() => {
        if (loading || !currentItem) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.scale(dpr, dpr);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            contextRef.current = ctx;
            drawGuide(ctx, rect.width, rect.height);
        }
    }, [currentIndex, activeColor, loading]);

    const drawGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        ctx.shadowBlur = 0;

        // Tracing Guide
        ctx.font = '900 350px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1e293b'; 
        ctx.fillText(currentItem.letter, width / 2, height / 2 + 15);

        // Dashed outline
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.setLineDash([15, 15]);
        ctx.strokeText(currentItem.letter, width / 2, height / 2 + 15);

        // Pen Config
        ctx.setLineDash([]);
        ctx.strokeStyle = activeColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = activeColor;
        ctx.lineWidth = 22;
    };

    const handleSpeak = () => {
        playTap();
        // Uses the word and phonics from your AlphabetItem interface
        speakText(`${currentItem.letter}... ${currentItem.phonics}... ${currentItem.word}`);
    };

    const goNext = () => {
        if (hasDrawn) {
            fireBasicConfetti();
            playStar();
            speakText("Great job!");
        }
        playPop();
        setCurrentIndex(prev => (prev + 1) % items.length);
        setHasDrawn(false);
    };

    const getCoord = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        const ctx = contextRef.current;
        if (!ctx) return;
        const { x, y } = getCoord(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing || !contextRef.current) return;
        const { x, y } = getCoord(e);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    };

    if (loading) return (
        <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center text-white">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="font-black uppercase tracking-widest text-sm">Loading Alphabet Collection...</p>
        </div>
    );

    return (
        <div className="h-screen bg-[#0f172a] flex flex-col overflow-hidden select-none font-display relative">
            <header className="h-16 bg-white/[0.02] backdrop-blur-md border-b border-white/10 shrink-0 flex items-center px-4 z-50">
                <div className="max-w-md mx-auto w-full flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center text-primary bg-primary/10 rounded-2xl border border-primary/20">
                        <Home className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-black text-white tracking-tight">Tracing</h1>
                        <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em]">{currentItem.letter} is for {currentItem.word}</p>
                    </div>
                    <button onClick={() => { playTap(); drawGuide(contextRef.current!, canvasRef.current!.clientWidth, canvasRef.current!.clientHeight); setHasDrawn(false); }} className="w-10 h-10 flex items-center justify-center text-white/60 bg-white/5 rounded-2xl border border-white/10">
                        <Eraser className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col gap-4 overflow-hidden relative z-10">
                <div className="flex-1 bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 relative flex flex-col overflow-hidden">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-black/40 p-2.5 rounded-full border border-white/10">
                        {penColors.map(color => (
                            <button
                                key={color}
                                onClick={() => { playTap(); setActiveColor(color); }}
                                className={`w-7 h-7 rounded-full transition-all ${activeColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#1e293b]' : 'opacity-30'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    <div className="flex-1 relative touch-none">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full cursor-crosshair relative z-10"
                            onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)}
                            onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)}
                        />
                    </div>

                    <div className="p-6 bg-black/20 border-t border-white/10 flex items-center gap-5 shrink-0 h-32">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-5xl border border-white/10">
                            {currentItem.emoji}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-3xl font-black text-white uppercase italic italic-text-gradient leading-none">
                                {currentItem.word}
                            </h2>
                            <button onClick={handleSpeak} className="flex items-center gap-2 text-primary font-bold text-xs uppercase mt-2 tracking-widest">
                                <Volume2 className="w-4 h-4" /> Listen
                            </button>
                        </div>
                    </div>
                </div>

                <div className="h-20 flex items-center gap-4 shrink-0 mb-2">
                    <button onClick={() => { playPop(); setCurrentIndex(prev => (prev - 1 + items.length) % items.length); setHasDrawn(false); }} className="h-full w-20 bg-white/5 border border-white/10 rounded-[2rem] text-white/40 flex items-center justify-center">
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button onClick={goNext} className="h-full flex-1 bg-primary border border-white/20 rounded-[2rem] text-white font-black text-xl gap-2 uppercase italic tracking-tighter">
                        {hasDrawn ? 'Perfect! Next' : 'Skip'}
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AlphabetsPage;