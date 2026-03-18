import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

// 1. Export the missing interface
export interface UserStats {
  xp: number;
  level: number;
  rank: string;
  totalXp?: number; // Aliased for consistency in UI
  score?: number;
  stats?: {
    gamesPlayed: number;
    wrongPicks: number;
    lastActive; // Firestore timestamp
    [key: string]: number; // For dynamic category stats
  };
}

export type StatCategory =
  | "poemsRead"
  | "drawingsCreated"
  | "spellingsMastered"
  | "numbersLearned"
  | "alphabetsLearned"
  | "totalAnomaliesFound"
  | "wrongPicks"
  | "gamesPlayed";

export const StatsService = {
  // Initialize stats for the Index page
  initStats: async (): Promise<UserStats | null> => {
    const user = auth.currentUser;
    if (!user) return null;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        xp: data.xp || 0,
        totalXp: data.xp || 0, // Mapping for UI consistency
        level: data.level || 1,
        rank: data.rank || "Rookie",
        stats: data.stats
      } as UserStats;
    }
    return null;
  },

  updateUserStats: async (
    points: number,
    activityId: string | null,
    isCorrect: boolean,
    category?: StatCategory,
    secondsSpent: number = 0,
  ) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    try {
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      const updateData: any = {
        score: increment(points),
        xp: increment(points),
        "stats.gamesPlayed": increment(1),
        "stats.lastActive": serverTimestamp(),
        "stats.totalTimeSpent": increment(secondsSpent),
        "stats.wrongPicks": isCorrect ? increment(0) : increment(1),
      };

      if (userData?.stats?.lastActive) {
        const lastActive = userData.stats.lastActive.toDate();
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const isSameDay = lastActive.toDateString() === today.toDateString();
        const isYesterday = lastActive.toDateString() === yesterday.toDateString();

        if (!isSameDay) {
          if (isYesterday) {
            updateData["stats.currentStreak"] = increment(1);
          } else {
            updateData["stats.currentStreak"] = 1; // Reset if they missed a day
          }
        }
      } else {
        updateData["stats.currentStreak"] = 1; // First time ever
      }

      if (isCorrect && activityId) {
        updateData.completedLevels = arrayUnion(activityId);
      }

      if (category) {
        updateData[`stats.${category}`] = increment(1);
      }

      await updateDoc(userRef, updateData);
      await StatsService.checkProgression(user.uid);
    } catch (error) {
      console.error("Failed to update user stats:", error);
    }
  },

  checkProgression: async (uid: string) => {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { xp, level } = userSnap.data();
      const XP_PER_LEVEL = 100;
      const newLevel = Math.floor(xp / XP_PER_LEVEL) + 1;

      if (newLevel !== level) {
        let newRank = "Rookie";
        if (newLevel >= 50) newRank = "Legend";
        else if (newLevel >= 20) newRank = "Master";
        else if (newLevel >= 10) newRank = "Scholar";
        else if (newLevel >= 5) newRank = "Explorer";

        await updateDoc(userRef, {
          level: newLevel,
          rank: newRank,
        });
      }
    }
  },
};