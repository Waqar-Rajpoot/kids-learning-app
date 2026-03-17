import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export const AuthService = {
  register: async (
    email: string,
    pass: string,
    name: string,
  ): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pass,
    );
    const user = userCredential.user;

    try {
      if (user) {
        await updateProfile(user, { displayName: name });
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          displayName: name,
          email: email,
          role: "user",
          isBlocked: false,
          createdAt: serverTimestamp(),
          score: 0,
          xp: 0,
          level: 1,
          rank: "Rookie",
          completedLevels: [], 
          stats: {
            totalAnomaliesFound: 0,
            wrongPicks: 0, 
            gamesPlayed: 0,
            poemsRead: 0,
            drawingsCreated: 0, 
            spellingsMastered: 0, 
            numbersLearned: 0, 
            alphabetsLearned: 0, 
            lastActive: serverTimestamp(),
            currentStreak: 0, 
            totalTimeSpent: 0,
          },

          badges: [], 
          settings: {
            musicEnabled: true,
            soundEnabled: true,
          },
        });

        console.log("User initialized with full Academy stats.");
      }
    } catch (backgroundError) {
      console.error("Post-registration tasks failed:", backgroundError);
    }

    return user;
  },
  login: async (email: string, pass: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.isBlocked) {
        await signOut(auth);
        throw new Error("Your account has been blocked by the admin. Please contact support.");
      }
    }
    return user;
  },

  updateUserProfile: async (newName: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No user found");
    await updateProfile(user, { displayName: newName });
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      displayName: newName, 
    });
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  deleteAccount: async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No active user found to delete.");

    try {
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);
      await deleteUser(user);
      console.log("User and associated data successfully deleted.");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        throw new Error(
          "For security, please log out and log back in before deleting your account.",
        );
      }
      throw error;
    }
  },

  getCurrentUser: () => {
    return auth.currentUser;
  },
};
