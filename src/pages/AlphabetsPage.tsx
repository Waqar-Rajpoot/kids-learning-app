import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Volume2, Home, Eraser, Sparkles, Palette } from 'lucide-react';
import { alphabets } from '@/data/learningData';
import { speakText } from '@/lib/speech';
import { playTap, playPop, playStar } from '@/lib/sounds';
import { fireBasicConfetti } from '@/lib/confetti';
import { motion, AnimatePresence } from 'framer-motion';

const penColors = [
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#ef4444', // Red
];

const AlphabetsPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeColor, setActiveColor] = useState(penColors[0]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const navigate = useNavigate();
    const currentItem = alphabets[currentIndex];

    // Initialize Canvas
    useEffect(() => {
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
            ctx.lineWidth = 20; // Thick enough for easy tracing
            ctx.strokeStyle = activeColor;
            contextRef.current = ctx;
            drawGuide(ctx, rect.width, rect.height);
        }
    }, [currentIndex, activeColor]);

    const drawGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);

        // 1. Draw light solid guide
        ctx.font = '900 320px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(currentItem.letter, width / 2, height / 2 + 15);

        // 2. Draw dashed outline
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 4;
        ctx.setLineDash([15, 15]);
        ctx.strokeText(currentItem.letter, width / 2, height / 2 + 15);

        // 3. Reset Pen state
        ctx.setLineDash([]);
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 20;

        // 4. Add "Start" dot hint (Simplified logic: always top-ish center for first stroke feel)
        ctx.fillStyle = '#10b981'; // Green start dot
        ctx.beginPath();
        ctx.arc(width / 2 - 40, height / 2 - 80, 8, 0, Math.PI * 2);
        ctx.fill();
    };

    const clearCanvas = () => {
        playTap();
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (ctx && canvas) {
            const rect = canvas.getBoundingClientRect();
            drawGuide(ctx, rect.width, rect.height);
            setHasDrawn(false);
        }
    };

    const handleSpeak = () => {
        playTap();
        speakText(`${currentItem.letter}... ${currentItem.phonics}... ${currentItem.word}`);
    };

    const goNext = () => {
        if (hasDrawn) {
            fireBasicConfetti();
            playStar();
            speakText("Great job!");
        }
        playPop();
        setCurrentIndex(prev => (prev + 1) % alphabets.length);
        setHasDrawn(false);
    };

    const goPrev = () => {
        playPop();
        setCurrentIndex(prev => (prev - 1 + alphabets.length) % alphabets.length);
        setHasDrawn(false);
    };

    // Improved Tracing Logic
    const startDrawing = (e: any) => {
        e.preventDefault();
        const ctx = contextRef.current;
        if (!ctx) return;

        const { x, y } = getCoord(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
    };

    const draw = (e: any) => {
        e.preventDefault();
        if (!isDrawing || !contextRef.current) return;

        const { x, y } = getCoord(e);
        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (isDrawing) {
            contextRef.current?.closePath();
            setIsDrawing(false);
        }
    };

    const getCoord = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col overflow-hidden select-none font-display">
            {/* Optimized Header */}
            <header className="h-16 bg-white border-b border-slate-100 shrink-0 flex items-center px-4 z-50">
                <div className="max-w-md mx-auto w-full flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 bg-primary/5 rounded-xl">
                        <Home className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-black text-slate-800">Letter Tracing</h1>
                        <p className="text-[8px] font-bold text-primary uppercase tracking-widest leading-none">A to Z Magic</p>
                    </div>
                    <button onClick={clearCanvas} className="w-10 h-10 flex items-center justify-center text-slate-400 active:scale-95 bg-slate-50 rounded-xl border border-slate-100">
                        <Eraser className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col gap-4 overflow-hidden relative">
                {/* Tracing Area */}
                <div className="flex-1 bg-white rounded-[2.5rem] border-8 border-white shadow-2xl relative flex flex-col overflow-hidden">
                    {/* Pen Color Selector */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full border border-slate-100 shadow-sm">
                        {penColors.map(color => (
                            <button
                                key={color}
                                onClick={() => { playTap(); setActiveColor(color); }}
                                className={`w-6 h-6 rounded-full transition-all ${activeColor === color ? 'scale-125 ring-2 ring-slate-100 ring-offset-2 shadow-sm' : 'opacity-40'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>

                    <div className="absolute top-6 right-8 text-[10px] font-black text-slate-300 uppercase">
                        {currentIndex + 1} / 26
                    </div>

                    {/* The Drawing Board */}
                    <div className="flex-1 relative touch-none">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full cursor-crosshair relative z-10"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />

                        {!hasDrawn && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                                <Sparkles className="w-24 h-24 text-primary animate-pulse" />
                            </div>
                        )}
                    </div>

                    {/* Bottom Info Bar - Responsive Size */}
                    <div className="p-6 bg-slate-50 border-t-4 border-white flex items-center gap-4 shrink-0 h-32">
                        <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center text-5xl shadow-sm border border-slate-100 flex-shrink-0 animate-bounce">
                            {currentItem.emoji}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h2 className="text-2xl font-black text-slate-800 leading-none truncate uppercase tracking-tighter italic">
                                {currentItem.word}
                            </h2>
                            <button onClick={handleSpeak} className="flex items-center gap-2 text-primary font-black text-[10px] uppercase mt-1">
                                <Volume2 className="w-3.5 h-3.5" />
                                Listen & Learn
                            </button>
                        </div>
                    </div>
                </div>

                {/* Big Nav Controls - Simplified for one hand */}
                <div className="h-20 flex items-center gap-4 shrink-0 mb-2">
                    <button
                        onClick={goPrev}
                        className="h-full w-20 bg-white border-4 border-slate-100 rounded-3xl text-slate-300 active:scale-95 flex items-center justify-center shadow-lg"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        onClick={goNext}
                        className="h-full flex-1 bg-primary border-4 border-primary/20 rounded-3xl text-white shadow-xl shadow-primary/30 active:scale-95 flex items-center justify-center font-black text-xl gap-2 uppercase italic"
                    >
                        {hasDrawn ? 'Perfect! Next' : 'Skip Letter'}
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AlphabetsPage;
