import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { App as CapApp } from "@capacitor/app";
import { AppSettingsProvider } from "./context/AppSettingsContext";

// Firebase Imports
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./lib/firebase";

// Auth Components
import { LoginForm } from "./components/auth/LoginFrom"; 
import { RegisterForm } from "./components/auth/RegisterForm";

// Page Components
import WelcomePage from "./components/WelcomePage";
import Index from "./pages/Index";
import AnimalsPage from "./pages/AnimalsPage";
import PoemsPage from "./pages/PoemsPage";
import GamesMenuPage from "./pages/GamesMenuPage";
import MemoryMatchPage from "./pages/MemoryMatchPage";
import ColorMatchPage from "./pages/ColorMatchPage";
import ShadowMatchPage from "./pages/ShadowMatchPage";
import OddOneOutPage from "./pages/OddOneOutPage";
import DotConnectPage from "./pages/DotConnectPage";
import AlphabetsPage from "./pages/AlphabetsPage";
import SpellingPage from "./pages/SpellingPage";
import NumbersPage from "./pages/NumbersPage";
import DrawingPage from "./pages/DrawingPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import SettingsPage from "./pages/SettingsPage";
import BackgroundMusic from "./components/BackgroundMusic";
import NotFound from "./pages/NotFound";
import "./lib/androidInit";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const backListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack || showWelcome) {
        CapApp.exitApp();
      } else {
        window.history.back();
      }
    });

    return () => {
      unsubscribe();
      backListener.then(l => l.remove());
    };
  }, [showWelcome]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-pulse text-primary font-black text-2xl tracking-widest uppercase">
          Loading Adventure...
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <BrowserRouter>
        {/* The Outer Wrapper: Swaps background color based on user state */}
        <div className={`min-h-screen flex flex-col items-center justify-start overflow-x-hidden selection:bg-primary/20 transition-colors duration-500 ${!user ? 'bg-[#0f172a]' : 'bg-[#f8f9ff]'}`}>
          <div className={`w-full relative flex flex-col transition-all duration-500 ${
            !user 
              ? 'max-w-none min-h-screen bg-transparent' 
              : 'max-w-[480px] min-h-screen bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)]'
          }`}>
            
            <BackgroundMusic />
            <Toaster />
            <Sonner />
            
            {showWelcome ? (
              <WelcomePage onFinish={() => setShowWelcome(false)} />
            ) : (
              <div className="flex-1 flex flex-col relative overflow-hidden">
                <Routes>
                  {!user ? (
                    <>
                      {/* AUTH ROUTES: No wrappers with bg-slate-50 here anymore */}
                      <Route path="/login" element={<LoginForm />} />
                      <Route path="/register" element={<RegisterForm />} />
                      <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<Index />} />
                      <Route path="/animals" element={<AnimalsPage />} />
                      <Route path="/animals/:category/:id" element={<ItemDetailPage />} />
                      <Route path="/birds" element={<AnimalsPage />} />
                      <Route path="/birds/:category/:id" element={<ItemDetailPage />} />
                      <Route path="/fruits" element={<AnimalsPage />} />
                      <Route path="/fruits/:category/:id" element={<ItemDetailPage />} />
                      <Route path="/poems" element={<PoemsPage />} />
                      <Route path="/puzzles" element={<GamesMenuPage />} />
                      <Route path="/puzzles/memory" element={<MemoryMatchPage />} />
                      <Route path="/puzzles/colors" element={<ColorMatchPage />} />
                      <Route path="/puzzles/shadows" element={<ShadowMatchPage />} />
                      <Route path="/puzzles/odd-one" element={<OddOneOutPage />} />
                      <Route path="/puzzles/dots" element={<DotConnectPage />} />
                      <Route path="/alphabets" element={<AlphabetsPage />} />
                      <Route path="/spelling" element={<SpellingPage />} />
                      <Route path="/numbers" element={<NumbersPage />} />
                      <Route path="/drawing" element={<DrawingPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/login" element={<Navigate to="/" replace />} />
                      <Route path="/register" element={<Navigate to="/" replace />} />
                      <Route path="*" element={<NotFound />} />
                    </>
                  )}
                </Routes>
              </div>
            )}
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <AppContent />
      </AppSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;