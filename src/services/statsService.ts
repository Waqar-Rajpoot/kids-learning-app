// import {
//   doc,
//   updateDoc,
//   increment,
//   arrayUnion,
//   serverTimestamp,
//   getDoc,
// } from "firebase/firestore";
// import { db, auth } from "../lib/firebase";

// // 1. Export the missing interface
// export interface UserStats {
//   xp: number;
//   level: number;
//   rank: string;
//   totalXp?: number; // Aliased for consistency in UI
//   score?: number;
//   stats?: {
//     gamesPlayed: number;
//     wrongPicks: number;
//     lastActive; // Firestore timestamp
//     [key: string]: number; // For dynamic category stats
//   };
// }

// export type StatCategory =
//   | "poemsRead"
//   | "drawingsCreated"
//   | "spellingsMastered"
//   | "numbersLearned"
//   | "alphabetsLearned"
//   | "totalAnomaliesFound"
//   | "wrongPicks"
//   | "gamesPlayed";

// export const StatsService = {
//   // Initialize stats for the Index page
//   initStats: async (): Promise<UserStats | null> => {
//     const user = auth.currentUser;
//     if (!user) return null;

//     const userRef = doc(db, "users", user.uid);
//     const userSnap = await getDoc(userRef);

//     if (userSnap.exists()) {
//       const data = userSnap.data();
//       return {
//         xp: data.xp || 0,
//         totalXp: data.xp || 0, // Mapping for UI consistency
//         level: data.level || 1,
//         rank: data.rank || "Rookie",
//         stats: data.stats
//       } as UserStats;
//     }
//     return null;
//   },

//   updateUserStats: async (
//     points: number,
//     activityId: string | null,
//     isCorrect: boolean,
//     category?: StatCategory,
//     secondsSpent: number = 0,
//   ) => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const userRef = doc(db, "users", user.uid);

//     try {
//       const userSnap = await getDoc(userRef);
//       const userData = userSnap.data();

//       const updateData: any = {
//         score: increment(points),
//         xp: increment(points),
//         "stats.gamesPlayed": increment(1),
//         "stats.lastActive": serverTimestamp(),
//         "stats.totalTimeSpent": increment(secondsSpent),
//         "stats.wrongPicks": isCorrect ? increment(0) : increment(1),
//       };

//       if (userData?.stats?.lastActive) {
//         const lastActive = userData.stats.lastActive.toDate();
//         const today = new Date();
//         const yesterday = new Date();
//         yesterday.setDate(yesterday.getDate() - 1);

//         const isSameDay = lastActive.toDateString() === today.toDateString();
//         const isYesterday = lastActive.toDateString() === yesterday.toDateString();

//         if (!isSameDay) {
//           if (isYesterday) {
//             updateData["stats.currentStreak"] = increment(1);
//           } else {
//             updateData["stats.currentStreak"] = 1; // Reset if they missed a day
//           }
//         }
//       } else {
//         updateData["stats.currentStreak"] = 1; // First time ever
//       }

//       if (isCorrect && activityId) {
//         updateData.completedLevels = arrayUnion(activityId);
//       }

//       if (category) {
//         updateData[`stats.${category}`] = increment(1);
//       }

//       await updateDoc(userRef, updateData);
//       await StatsService.checkProgression(user.uid);
//     } catch (error) {
//       console.error("Failed to update user stats:", error);
//     }
//   },

//   checkProgression: async (uid: string) => {
//     const userRef = doc(db, "users", uid);
//     const userSnap = await getDoc(userRef);

//     if (userSnap.exists()) {
//       const { xp, level } = userSnap.data();
//       const XP_PER_LEVEL = 100;
//       const newLevel = Math.floor(xp / XP_PER_LEVEL) + 1;

//       if (newLevel !== level) {
//         let newRank = "Rookie";
//         if (newLevel >= 50) newRank = "Legend";
//         else if (newLevel >= 20) newRank = "Master";
//         else if (newLevel >= 10) newRank = "Scholar";
//         else if (newLevel >= 5) newRank = "Explorer";

//         await updateDoc(userRef, {
//           level: newLevel,
//           rank: newRank,
//         });
//       }
//     }
//   },
// };







import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  serverTimestamp,
  getDoc,
  collection,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";

// Friendly labels per stat category — used to render the recent-activity feed
// without touching every page's call site.
const CATEGORY_LABELS: Record<string, string> = {
  poemsRead: "Read a poem",
  drawingsCreated: "Created a drawing",
  spellingsMastered: "Spelled a word correctly",
  numbersLearned: "Learned a number",
  alphabetsLearned: "Traced a letter",
  totalAnomaliesFound: "Found the odd one out",
  gamesPlayed: "Played a game",
};

// Fallback for calls that don't pass a category (ColorMatch, MemoryMatch) —
// infer from the activityId's known prefixes instead.
const ID_PREFIX_LABELS: [prefix: string, label: string][] = [
  ["color_", "Matched the colors"],
  ["memory_", "Matched a memory pair"],
  ["vector_", "Connected the dots"],
  ["explore_", "Explored something new"],
];

function describeActivity(category: string | undefined, activityId: string | null): string {
  if (category && CATEGORY_LABELS[category]) return CATEGORY_LABELS[category];
  if (activityId) {
    const match = ID_PREFIX_LABELS.find(([prefix]) => activityId.startsWith(prefix));
    if (match) return match[1];
  }
  return "Completed an activity";
}

async function logActivity(uid: string, label: string, points: number, activityId: string | null) {
  try {
    await addDoc(collection(db, "users", uid, "activities"), {
      label,
      points,
      activityId: activityId || null,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

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

      // Only log real completions to the feed — never wrongPicks, never
      // zero-point tracking calls. isCorrect === false intentionally skips this.
      if (isCorrect) {
        await logActivity(user.uid, describeActivity(category, activityId), points, activityId);
      }

      // Streak just changed (day boundary crossed) — worth its own feed entry,
      // separate from the completion that triggered it.
      if (typeof updateData["stats.currentStreak"] === "number" && updateData["stats.currentStreak"] > 1) {
        await logActivity(
          user.uid,
          `${updateData["stats.currentStreak"]}-day streak! 🔥`,
          0,
          null,
        );
      }

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

        await logActivity(uid, `Reached Level ${newLevel} — ${newRank}! ⭐`, 0, null);
      }
    }
  },
};