import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eraser, Trash2, Download, Minus, Plus, Smile, Palette, Home } from 'lucide-react';
import { toast } from 'sonner';
import { speakText } from '@/lib/speech';
import { playTap, playPop, playWhoosh, playStar } from '@/lib/sounds';

const colors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#171717'
];

const colorNames: Record<string, string> = {
  '#ef4444': 'Red',
  '#f97316': 'Orange',
  '#eab308': 'Yellow',
  '#22c55e': 'Green',
  '#06b6d4': 'Cyan',
  '#3b82f6': 'Blue',
  '#8b5cf6': 'Purple',
  '#ec4899': 'Pink',
  '#ffffff': 'White',
  '#171717': 'Black'
};

const stickers = ['⭐', '🌈', '🎨', '🦁', '🐶', '🦄', '🚀', '🍭', '🍦', '💎', '🌸', '🎀'];

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
    toast.success('Canvas cleared!');
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
    speakText('Sticker added!');
    toast.success('Sticker added!');
  };

  const saveToGallery = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const { Capacitor } = await import('@capacitor/core');
      const isNative = Capacitor.isNativePlatform();

      if (isNative) {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const base64Data = dataUrl.split(',')[1];
        const fileName = `art-${Date.now()}.png`;

        try {
          await Filesystem.writeFile({
            path: `KidLearing/${fileName}`,
            data: base64Data,
            directory: Directory.Documents,
            recursive: true
          });

          speakText('Saved to gallery!');
          toast.success('Saved to "KidLearing" folder!');
        } catch (error) {
          console.error('File save error:', error);
          const { Share } = await import('@capacitor/share');
          await Share.share({
            title: 'My Kid Learing Art',
            url: dataUrl,
            dialogTitle: 'Save your masterpiece'
          });
        }
      } else {
        const link = document.createElement('a');
        link.download = `kid-learing-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        speakText('Downloaded!');
        toast.success('Masterpiece downloaded!');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Could not save drawing.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-orange-50 flex flex-col overflow-hidden">
      {/* Header - Back Button Removed */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm shrink-0 h-16 flex items-center">
        <div className="max-w-md mx-auto px-5 py-3 flex items-center justify-between w-full">
          <button onClick={() => navigate('/')} className="p-2 text-amber-600 active:scale-95 bg-amber-50 rounded-xl">
            <Home className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-black text-gray-900">Art Studio</h1>
          </div>
          <button
            onClick={saveToGallery}
            className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all font-display"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto px-4 py-4 flex flex-col w-full overflow-hidden gap-4">
        {/* Canvas */}
        <div
          ref={containerRef}
          className="flex-1 bg-white rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden touch-none relative min-h-0"
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

          {showStickers && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm p-6 flex flex-col z-20 animate-fade-in">
              <p className="text-center font-black text-gray-900 text-lg mb-4">Pick a Sticker!</p>
              <div className="flex-1 flex flex-wrap gap-4 items-center justify-center content-center overflow-y-auto">
                {stickers.map(s => (
                  <button
                    key={s}
                    onClick={() => addSticker(s)}
                    className="text-5xl p-2 hover:scale-125 transition-transform active:scale-90 bg-gray-100 rounded-[1.5rem]"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowStickers(false)}
                className="mt-4 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 active:bg-gray-200"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Tools Panel */}
        <div className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-lg space-y-4 shrink-0 animate-speed-in">
          {/* Tool Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setShowStickers(!showStickers); setIsEraser(false); }}
              className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all ${showStickers
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              <Smile className="w-5 h-5" /> Stickers
            </button>
            <button
              onClick={() => { setIsEraser(!isEraser); speakText(isEraser ? 'Brush' : 'Eraser'); }}
              className={`flex-1 py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-sm transition-all ${isEraser
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600'
                }`}
            >
              <Eraser className="w-5 h-5" /> Eraser
            </button>
          </div>

          {/* Colors */}
          <div className="flex flex-wrap gap-2.5 justify-center py-3 border-y border-gray-100">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-full transition-all duration-200 ${currentColor === color && !isEraser
                    ? 'ring-4 ring-offset-2 ring-gray-800 scale-110'
                    : 'shadow-md border-2 border-white'
                  }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Size & Clear */}
          <div className="flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setBrushSize(Math.max(4, brushSize - 4))}
                className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center active:scale-90 transition-all font-display"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex flex-col items-center min-w-[40px]">
                <div
                  className="rounded-full bg-gray-800"
                  style={{ width: brushSize, height: brushSize, maxWidth: 24, maxHeight: 24 }}
                />
              </div>
              <button
                onClick={() => setBrushSize(Math.min(40, brushSize + 4))}
                className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center active:scale-90 transition-all"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <button
              onClick={clearCanvas}
              className="px-5 py-3 bg-red-100 text-red-600 rounded-2xl font-black text-sm flex items-center gap-2 active:bg-red-500 active:text-white transition-all"
            >
              <Trash2 className="w-5 h-5" /> Clear
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DrawingPage;