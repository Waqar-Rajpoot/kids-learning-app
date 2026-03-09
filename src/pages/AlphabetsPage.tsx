import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Volume2, Home, Eraser, Sparkles } from 'lucide-react';
import { alphabets } from '@/data/learningData';
import { speakText } from '@/lib/speech';
import { playTap, playPop, playStar } from '@/lib/sounds';
import { fireBasicConfetti } from '@/lib/confetti';
import { motion } from 'framer-motion';

const penColors = [
    '#a855f7', // Hyper Purple
    '#f472b6', // Pink Glow
    '#38bdf8', // Sky Blue
    '#4ade80', // Neon Green
    '#fbbf24', // Sun Amber
    '#f87171', // Soft Red
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
            ctx.lineWidth = 22; 
            ctx.strokeStyle = activeColor;
            // Add a subtle glow to the pen
            ctx.shadowBlur = 10;
            ctx.shadowColor = activeColor;
            contextRef.current = ctx;
            drawGuide(ctx, rect.width, rect.height);
        }
    }, [currentIndex, activeColor]);

    const drawGuide = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        ctx.clearRect(0, 0, width, height);
        ctx.shadowBlur = 0; // Disable shadow for guide text

        // 1. Draw light solid guide (Inner Glow style)
        ctx.font = '900 350px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#1e293b'; // Darker blue for the "track"
        ctx.fillText(currentItem.letter, width / 2, height / 2 + 15);

        // 2. Draw dashed outline (Glowing border)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.setLineDash([15, 15]);
        ctx.strokeText(currentItem.letter, width / 2, height / 2 + 15);

        // 3. Reset Pen state
        ctx.setLineDash([]);
        ctx.strokeStyle = activeColor;
        ctx.shadowBlur = 10;
        ctx.shadowColor = activeColor;
        ctx.lineWidth = 22;

        // 4. Start Hint
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(width / 2 - 40, height / 2 - 80, 10, 0, Math.PI * 2);
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
            speakText("Amazing!");
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

    const stopDrawing = () => {
        if (isDrawing) {
            contextRef.current?.closePath();
            setIsDrawing(false);
        }
    };

    const getCoord = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    return (
        <div className="h-screen bg-[#0f172a] flex flex-col overflow-hidden select-none font-display relative">
            {/* Background Aesthetic Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Glassmorphism Header */}
            <header className="h-16 bg-white/[0.02] backdrop-blur-md border-b border-white/10 shrink-0 flex items-center px-4 z-50">
                <div className="max-w-md mx-auto w-full flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 bg-primary/10 rounded-2xl border border-primary/20">
                        <Home className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-black text-white tracking-tight">Letter Tracing</h1>
                        <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] leading-none">A to Z Magic</p>
                    </div>
                    <button onClick={clearCanvas} className="w-10 h-10 flex items-center justify-center text-white/60 active:scale-95 bg-white/5 rounded-2xl border border-white/10">
                        <Eraser className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-md mx-auto w-full p-4 flex flex-col gap-4 overflow-hidden relative z-10">
                {/* Tracing Area - Dark Mode Card */}
                <div className="flex-1 bg-[#1e293b]/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative flex flex-col overflow-hidden">
                    
                    {/* Floating Color Palette */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-3 z-20 bg-black/40 backdrop-blur-xl p-2.5 rounded-full border border-white/10 shadow-2xl">
                        {penColors.map(color => (
                            <button
                                key={color}
                                onClick={() => { playTap(); setActiveColor(color); }}
                                className={`w-7 h-7 rounded-full transition-all duration-300 ${activeColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#1e293b]' : 'opacity-30 hover:opacity-100'}`}
                                style={{ backgroundColor: color, boxShadow: activeColor === color ? `0 0 15px ${color}` : 'none' }}
                            />
                        ))}
                    </div>

                    <div className="absolute top-8 right-8 text-xs font-black text-white/20 uppercase tracking-widest">
                        {currentIndex + 1} / 26
                    </div>

                    <div className="flex-1 relative touch-none">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full cursor-crosshair relative z-10"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />

                        {!hasDrawn && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20"
                            >
                                <Sparkles className="w-32 h-32 text-primary animate-pulse" />
                            </motion.div>
                        )}
                    </div>

                    {/* Bottom Info Bar - Dark Glass */}
                    <div className="p-6 bg-black/20 border-t border-white/10 flex items-center gap-5 shrink-0 h-32">
                        <motion.div 
                            key={currentItem.emoji}
                            initial={{ scale: 0.5, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-white/10 flex-shrink-0"
                        >
                            {currentItem.emoji}
                        </motion.div>
                        <div className="flex-1 overflow-hidden">
                            <h2 className="text-3xl font-black text-white leading-none truncate uppercase tracking-tighter italic italic-text-gradient">
                                {currentItem.word}
                            </h2>
                            <button onClick={handleSpeak} className="flex items-center gap-2 text-primary font-bold text-xs uppercase mt-2 tracking-widest hover:text-white transition-colors">
                                <Volume2 className="w-4 h-4" />
                                Listen
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cyber-style Navigation */}
                <div className="h-20 flex items-center gap-4 shrink-0 mb-2">
                    <button
                        onClick={goPrev}
                        className="h-full w-20 bg-white/5 border border-white/10 rounded-[2rem] text-white/40 active:scale-95 flex items-center justify-center backdrop-blur-sm"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <button
                        onClick={goNext}
                        className="h-full flex-1 bg-primary hover:bg-primary/90 border border-white/20 rounded-[2rem] text-white shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] active:scale-[0.98] transition-all flex items-center justify-center font-black text-xl gap-2 uppercase italic tracking-tighter"
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

