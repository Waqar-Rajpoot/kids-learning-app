import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export interface ActivityEntry {
  id: string;
  label: string;
  points: number;
  timestamp: Date | null;
}

const MAX_ITEMS = 10;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useRecentActivity() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const since = Timestamp.fromMillis(Date.now() - WINDOW_MS);
    const q = query(
      collection(db, "users", user.uid, "activities"),
      where("timestamp", ">=", since),
      orderBy("timestamp", "desc"),
      limit(MAX_ITEMS),
    );

    // Live-updates the feed as new activity is logged, so the dashboard
    // doesn't need a manual refresh after finishing a lesson.
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setActivities(
          snap.docs.map((d) => ({
            id: d.id,
            label: d.data().label,
            points: d.data().points ?? 0,
            timestamp: d.data().timestamp?.toDate() ?? null,
          })),
        );
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load recent activity:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { activities, loading };
}
