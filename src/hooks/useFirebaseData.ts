import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export const useFirebaseData = (
  collectionName: string,
  categoryFilter?: string,
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, collectionName));

    if (categoryFilter) {
      q = query(q, where("category", "==", categoryFilter));
    }

    // Sort logic
    if (collectionName === "alphabets") {
      q = query(q, orderBy("order", "asc"));
    } else if (collectionName === "numbers") {
      q = query(q, orderBy("num", "asc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, categoryFilter]);

  return { data, loading };
};
