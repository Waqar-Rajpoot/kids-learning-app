import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as CapApp } from "@capacitor/app";

// Firebase & Auth
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./lib/firebase";

// Context & Providers
import { AppSettingsProvider } from "./context/AppSettingsContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Components
import BackgroundMusic from "./components/BackgroundMusic";
import WelcomePage from "./components/WelcomePage";
import { LoginForm } from "./components/auth/LoginFrom";
import { RegisterForm } from "./components/auth/RegisterForm";
import { AdminRoute } from "./components/auth/AdminRoute";
import NotFound from "./pages/NotFound";
import "./lib/androidInit";

// User Pages
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

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UserManagement } from "./pages/admin/UserManagement";
import { AlphabetManagement } from "./pages/admin/AlphabetManagement";
import { MatchingManagement } from "./pages/admin/MatchingManagement";
import { MemoryManagement } from "./pages/admin/MemoryLevel";
import { ColorManagement } from "./pages/admin/ColorManagement";
import { ShadowManagement } from "./pages/admin/ShodowManagement";
import { VectorManagement } from "./pages/admin/VectorManagement";
import { AnomalyManagement } from "./pages/admin/AnomalyManagement";
import { NumberManagement } from "./pages/admin/NumberManagement";
import { SpellingManagement } from "./pages/admin/SpellingManagement";
import { PoemManagement } from "./pages/admin/PoemsManagement";
import { LearningManagement } from "./pages/admin/LearningManagement";

const queryClient = new QueryClient();

const AppContent = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null); // Track user role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            setRole("user");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
      }
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
        <div className="animate-pulse text-primary font-black text-2xl tracking-widest uppercase text-center">
          Loading Adventure...
        </div>
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <TooltipProvider>
      <BrowserRouter>
        <div className={`min-h-screen flex flex-col items-center justify-start overflow-x-hidden selection:bg-primary/20 transition-colors duration-500 ${!user ? 'bg-[#0f172a]' : 'bg-[#f8f9ff]'}`}>
          <div className={`w-full relative flex flex-col transition-all duration-500 ${!user
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
                  {/* --- PUBLIC / AUTH ROUTES --- */}
                  {!user ? (
                    <>
                      <Route path="/login" element={<LoginForm />} />
                      <Route path="/register" element={<RegisterForm />} />
                      <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                  ) : isAdmin ? (
                    /* --- ADMIN ONLY ROUTES --- */
                    <>
                      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                      <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                      <Route path="/admin/alphabets" element={<AdminRoute><AlphabetManagement /></AdminRoute>} />
                      <Route path="/admin/matching" element={<AdminRoute><MatchingManagement /></AdminRoute>} />
                      <Route path="/admin/memory" element={<AdminRoute><MemoryManagement /></AdminRoute>} />
                      <Route path="/admin/colors" element={<AdminRoute><ColorManagement /></AdminRoute>} />
                      <Route path="/admin/shadows" element={<AdminRoute><ShadowManagement /></AdminRoute>} />
                      <Route path="/admin/vectors" element={<AdminRoute><VectorManagement /></AdminRoute>} />
                      <Route path="/admin/anomalies" element={<AdminRoute><AnomalyManagement /></AdminRoute>} />
                      <Route path="/admin/numbers" element={<AdminRoute><NumberManagement /></AdminRoute>} />
                      <Route path="/admin/spellings" element={<AdminRoute><SpellingManagement /></AdminRoute>} />
                      <Route path="/admin/poems" element={<AdminRoute><PoemManagement /></AdminRoute>} />
                      <Route path="/admin/learning" element={<AdminRoute><LearningManagement /></AdminRoute>} />
                      <Route path="/" element={<Navigate to="/admin" replace />} />
                      <Route path="*" element={<Navigate to="/admin" replace />} />
                    </>
                  ) : (
                    /* --- USER ONLY ROUTES --- */
                    <>
                      <Route path="/" element={<Index />} />
                      <Route path="/animals" element={<AnimalsPage />} />
                      <Route path="/birds" element={<AnimalsPage />} />
                      <Route path="/fruits" element={<AnimalsPage />} />
                      <Route path="/:parentPath/:category/:id" element={<ItemDetailPage />} />
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
                      <Route path="/admin/*" element={<Navigate to="/" replace />} />

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
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppSettingsProvider>
      <AppContent />
    </AppSettingsProvider>
  </QueryClientProvider>
);

export default App;