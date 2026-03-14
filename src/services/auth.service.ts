import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User
} from "firebase/auth";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"; 
import { auth, db } from "../lib/firebase"; 

export const AuthService = {

  register: async (email: string, pass: string, name: string): Promise<User> => {
    // 1. Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    try {
      if (user) {
        // 2. Update Firebase Auth Profile (DisplayName)
        await updateProfile(user, { 
          displayName: name 
        });

        // 3. Initialize User Document in Firestore
        // We use the auth UID as the document ID for a direct 1-to-1 link
        const userRef = doc(db, "users", user.uid);
        
        await setDoc(userRef, {
          uid: user.uid,
          displayName: name,
          email: email,
          role: "user",        // Default role for new signups
          score: 0,            // Starting points
          rank: "Rookie",      // Starting rank
          level: 1,            // Progression level
          xp: 0,               // Experience points
          completedLevels: [], // Array to track progress
          isBlocked: false,    // For Admin ban/unban logic
          createdAt: serverTimestamp(),
          stats: {
            totalAnomaliesFound: 0,
            wrongPicks: 0
          }
        });
        
        console.log("User registered, profile updated, and Firestore record initialized.");
      }
    } catch (backgroundError) {
      // We catch errors here so the user still gets logged in even if Firestore fails
      console.error("Post-registration tasks failed:", backgroundError);
    }
    
    return user;
  },

  login: async (email: string, pass: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  },

  updateUserProfile: async (newName: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user found");

    // Update Auth Profile
    await updateProfile(user, { displayName: newName });

    // Update Firestore Document
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      displayName: newName // Changed from 'name' to 'displayName' for consistency
    });
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  getCurrentUser: () => {
    return auth.currentUser;
  }
};