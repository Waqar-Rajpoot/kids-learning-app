import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ghost, Radio, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-6 text-white overflow-hidden relative font-display">
      
      {/* 1. Deep Space Environment */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]" />
        {/* Subtle Star Particles */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      <div className="text-center z-10 max-w-md w-full">
        
        {/* 2. The Lost Signal Icon */}
        <div className="relative mb-12 inline-block">
          {/* Radar Pulse Effect */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-150 opacity-20" />
          <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse scale-125 opacity-30" />
          
          <motion.div 
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-white/5 backdrop-blur-xl p-10 rounded-[3.5rem] border border-white/10 shadow-3xl"
          >
            <Ghost className="w-32 h-32 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
            <div className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-xl animate-bounce shadow-lg shadow-red-500/40">
              <Radio className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        </div>

        {/* 3. Glitch Text Section */}
        <div className="space-y-4 mb-12">
          <h1 className="text-[120px] font-black leading-none italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none">
            404
          </h1>
          <div className="space-y-1">
            <h2 className="text-2xl font-black uppercase tracking-widest text-blue-400 italic">
              Sector Not Found
            </h2>
            <p className="text-sm font-bold text-white/30 uppercase tracking-[0.4em]">
              Your shuttle has drifted off course
            </p>
          </div>
        </div>

        {/* 4. Action Button */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="group relative flex items-center gap-4 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-[2rem] font-black italic tracking-widest shadow-[0_0_40px_rgba(37,99,235,0.3)] transition-all active:scale-95"
          >
            <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-2" />
            RE-ENTRY TO BASE
            <div className="absolute -inset-1 bg-blue-400/20 rounded-[2.2rem] blur-lg group-hover:opacity-100 opacity-0 transition-opacity" />
          </button>

          <button 
            onClick={() => navigate(-1)}
            className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] hover:text-white/60 transition-colors flex items-center gap-2"
          >
            <Rocket className="w-3 h-3" />
            Return to previous coordinates
          </button>
        </div>
      </div>

      {/* Decorative Navigation UI */}
      <div className="absolute bottom-8 left-8 hidden md:block border-l border-white/10 pl-4 py-2 opacity-30">
        <p className="text-[10px] font-black tracking-widest uppercase mb-1">Status: Lost</p>
        <p className="text-[10px] font-black tracking-widest uppercase">Location: Unknown_Sector_04</p>
      </div>
    </div>
  );
};

export default NotFound;