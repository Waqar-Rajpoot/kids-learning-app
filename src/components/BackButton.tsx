import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { playTap } from '@/lib/sounds';

interface BackButtonProps {
  showHome?: boolean;
}

const BackButton = ({ showHome = true }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    playTap();
    navigate(-1);
  };

  const handleHome = () => {
    playTap();
    navigate('/');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleBack}
        className="bg-card text-foreground p-3 rounded-2xl border border-border
          shadow-sm touch-target flex items-center justify-center 
          hover:bg-muted transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      {showHome && (
        <button
          onClick={handleHome}
          className="bg-primary text-primary-foreground p-3 rounded-2xl 
            shadow-sm touch-target flex items-center justify-center 
            hover:opacity-90 transition-opacity"
          aria-label="Go home"
        >
          <Home className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default BackButton;
