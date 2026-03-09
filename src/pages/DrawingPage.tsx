import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eraser, Trash2, Download, Minus, Plus, Smile, Palette, Home, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { speakText } from '@/lib/speech';
import { playTap, playPop, playWhoosh, playStar } from '@/lib/sounds';
import { motion, AnimatePresence } from 'framer-motion';

const colors = [
  '#f43f5e', '#fb923c', '#fbbf24', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#334155'
];

const colorNames: Record<string, string> = {
  '#f43f5e': 'Rose Red',
  '#fb923c': 'Orange Orbit',
  '#fbbf24': 'Star Yellow',
  '#22c55e': 'Green Nebula',
  '#06b6d4': 'Cyan Core',
  '#3b82f6': 'Blue Moon',
  '#8b5cf6': 'Purple Pulsar',
  '#ec4899': 'Pink Photon',
  '#ffffff': 'Starlight White',
  '#334155': 'Space Slate'
};

const stickers = ['🚀', '🪐', '👨‍🚀', '👽', '🛸', '⭐', '🌈', '💎', '🎨', '🦁', '🦄', '🍭'];

const DrawingPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(12);
  const [isEraser, setIsEraser] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [canvasBg] = useState('#ffffff');
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      const tempUrl = canvas.toDataURL();

      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(scale, scale);
        ctx.fillStyle = canvasBg;
        ctx.fillRect(0, 0, rect.width, rect.height);

        const img = new Image();
        img.src = tempUrl;
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasBg]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? canvasBg : currentColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    playWhoosh();

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, rect.width, rect.height);
    speakText('Canvas cleared!');
    toast.info('Canvas cleared!');
  };

  const handleColorSelect = (color: string) => {
    playTap();
    setCurrentColor(color);
    setIsEraser(false);
    speakText(colorNames[color] || 'Color selected');
  };

  const addSticker = (sticker: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    playPop();
    playStar();

    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const x = 80 + Math.random() * (canvas.width / window.devicePixelRatio - 160);
    const y = 80 + Math.random() * (canvas.height / window.devicePixelRatio - 160);

    ctx.fillText(sticker, x, y);
    setShowStickers(false);
    speakText('Sticker deployed!');
    toast.success('Sticker added to your nebula!');
  };

  const saveToGallery = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `nebula-art-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      speakText('Drawing saved!');
      toast.success('Masterpiece saved to your logs!');
    } catch (err) {
      toast.error('Could not save drawing.');
    }
  };

  return (
    <div className="h-screen bg-[#0f172a] text-white flex flex-col overflow-hidden select-none font-display relative">
      
      {/* 1. Space Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      {/* 2. Command Header */}
      <header className="h-20 bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 shrink-0 flex items-center px-6 z-50">
        <div className="max-w-lg mx-auto w-full flex items-center justify-between">
          <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl active:scale-90 transition-all text-white/70">
            <Home className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Nebula Sketch</h1>
            <div className="flex items-center justify-center gap-1.5">
              <Wand2 className="w-3 h-3 text-blue-400 animate-pulse" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Art Matrix Active</span>
            </div>
          </div>

          <button
            onClick={saveToGallery}
            className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all text-emerald-400"
          >
            <Download className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto px-4 py-4 flex flex-col w-full overflow-hidden gap-4 relative z-10">
        
        {/* 3. The Canvas (The "Window to Space") */}
        <div
          ref={containerRef}
          className="flex-1 bg-white rounded-[3rem] shadow-[0_0_40px_rgba(0,0,0,0.5)] border-[12px] border-white/5 overflow-hidden touch-none relative min-h-0 group"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none cursor-crosshair block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />

          <AnimatePresence>
            {showStickers && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-md p-8 flex flex-col z-20"
              >
                <div className="flex items-center justify-between mb-6">
                   <h2 className="font-black text-white text-2xl italic uppercase tracking-tighter">Sticker Bay</h2>
                   <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                
                <div className="flex-1 grid grid-cols-4 gap-4 items-center justify-center content-start overflow-y-auto pb-4">
                  {stickers.map(s => (
                    <button
                      key={s}
                      onClick={() => addSticker(s)}
                      className="text-5xl aspect-square flex items-center justify-center hover:scale-110 transition-transform active:scale-90 bg-white/5 border border-white/10 rounded-3xl"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowStickers(false)}
                  className="mt-4 py-5 bg-white/5 border border-white/10 rounded-[2rem] font-black text-white/50 uppercase tracking-widest active:bg-white/10 transition-colors"
                >
                  Close Bay
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. Controls Matrix */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-5 border border-white/10 shadow-2xl space-y-5 shrink-0">
          
          {/* Tool Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => { setShowStickers(!showStickers); setIsEraser(false); }}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all border ${
                showStickers
                  ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-white/5 border-white/10 text-white/60'
              }`}
            >
              <Smile className="w-5 h-5" /> Stickers
            </button>
            <button
              onClick={() => { setIsEraser(!isEraser); speakText(isEraser ? 'Brush' : 'Eraser'); }}
              className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest transition-all border ${
                isEraser
                  ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-white/5 border-white/10 text-white/60'
              }`}
            >
              <Eraser className="w-5 h-5" /> Eraser
            </button>
          </div>

          {/* Color Spectrum */}
          <div className="flex flex-wrap gap-2.5 justify-center py-4 border-y border-white/5">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-full transition-all duration-300 ${
                  currentColor === color && !isEraser
                    ? 'ring-4 ring-offset-4 ring-offset-[#0f172a] ring-blue-500 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'border-2 border-white/10 hover:border-white/30'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Calibration & Reset */}
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-2 rounded-[2rem]">
              <button
                onClick={() => setBrushSize(Math.max(4, brushSize - 4))}
                className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center active:scale-90 transition-all text-white/60"
              >
                <Minus className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center min-w-[50px]">
                <div
                  className="rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                  style={{ width: Math.min(brushSize, 24), height: Math.min(brushSize, 24) }}
                />
              </div>

              <button
                onClick={() => setBrushSize(Math.min(40, brushSize + 4))}
                className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center active:scale-90 transition-all text-white/60"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={clearCanvas}
              className="px-6 py-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-2 active:bg-red-500 active:text-white transition-all"
            >
              <Trash2 className="w-5 h-5" /> Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DrawingPage;