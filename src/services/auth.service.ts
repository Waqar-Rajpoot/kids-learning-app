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
          completedLevels: [], // List of unique activity IDs completed

          stats: {
            totalAnomaliesFound: 0, // Used for OddOneOut
            wrongPicks: 0, // Used to measure difficulty
            gamesPlayed: 0,

            poemsRead: 0, // Tracking for PoemsPage
            drawingsCreated: 0, // Tracking for DrawingPage
            spellingsMastered: 0, // Tracking for SpellingPage
            numbersLearned: 0, // Tracking for NumbersPage
            alphabetsLearned: 0, // Tracking for AlphabetsPage

            // Engagement Stats (New)
            lastActive: serverTimestamp(),
            currentStreak: 0, // Days in a row
            totalTimeSpent: 0, // Minutes (estimated)
          },

          // --- ACHIEVEMENTS (New) ---
          badges: [], // e.g., ['first_word', 'math_genius']
          settings: {
            // Store user preferences
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
      displayName: newName, // Changed from 'name' to 'displayName' for consistency
    });
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  },

  deleteAccount: async (): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No active user found to delete.");

    try {
      // 1. Delete Firestore User Document first
      const userRef = doc(db, "users", user.uid);
      await deleteDoc(userRef);

      // 2. Delete Auth Account
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
