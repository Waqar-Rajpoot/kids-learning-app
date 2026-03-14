import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Role verification failed:", error);
        setIsAdmin(false);
      }
    };

    checkRole();
  }, []);

  if (isAdmin === null) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-white/20 font-black text-xs tracking-widest uppercase animate-pulse">
          Verifying Credentials...
        </div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};