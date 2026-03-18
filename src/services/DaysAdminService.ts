import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

export const DaysAdminService = {
  // Read
  getDays: async () => {
    const q = query(collection(db, "days_of_week"), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // Create
  addDay: async (dayData: {
    name: string;
    fact: string;
    color: string;
    order: number;
  }) => {
    return await addDoc(collection(db, "days_of_week"), dayData);
  },

  // Update
  updateDay: async (id: string, updates: any) => {
    await updateDoc(doc(db, "days_of_week", id), updates);
  },

  // Delete
  deleteDay: async (id: string) => {
    await deleteDoc(doc(db, "days_of_week", id));
  },
};
