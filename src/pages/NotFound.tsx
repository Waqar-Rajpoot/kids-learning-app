import { useNavigate } from "react-router-dom";
import { ArrowLeft, Ghost } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-white overflow-hidden relative">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

      <div className="text-center z-10">
        <div className="glass p-8 rounded-[3rem] bg-white/5 border border-white/10 shadow-2xl mb-10 inline-block">
          <Ghost className="w-24 h-24 text-primary animate-float" />
        </div>

        <h1 className="mb-4 text-6xl font-black font-display uppercase tracking-tighter">404</h1>
        <p className="mb-10 text-xl font-medium text-white/40 font-display uppercase tracking-widest">
          Oops! The magic page disappeared
        </p>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-display font-black shadow-xl hover:scale-105 transition-all active:scale-95"
        >
          <ArrowLeft className="w-6 h-6" />
          GO BACK HOME
        </button>
      </div>
    </div>
  );
};

export default NotFound;
