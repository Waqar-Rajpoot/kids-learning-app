import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore"; // Added for database updates
import { auth, db } from "../lib/firebase"; // Ensure db is exported from your firebase.ts

export const AuthService = {

  register: async (email: string, pass: string, name: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    
    if (userCredential.user) {
      await updateProfile(userCredential.user, { 
        displayName: name 
      });
    }
    
    return userCredential.user;
  },

  login: async (email: string, pass: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return userCredential.user;
  },

  updateUserProfile: async (newName: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user found");

    // 1. Update the Auth Display Name (for current session)
    await updateProfile(user, { displayName: newName });

    // 2. Update the Firestore Document (for permanent storage)
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      name: newName
    });
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  getCurrentUser: () => {
    return auth.currentUser;
  }
};