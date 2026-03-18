import { db } from "../lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const COLLECTION_NAME = 'months';

export const MonthsAdminService = {
  getMonths: async () => {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Firebase Fetch Error:", error);
      throw error;
    }
  },

  addMonth: async (monthData: { name: string; fact: string; color: string; order: number }) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...monthData,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...monthData };
    } catch (error) {
      console.error("Firebase Add Error:", error);
      throw error;
    }
  },

  updateMonth: async (id: string, monthData: any) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...monthData,
        updatedAt: new Date().toISOString()
      });
      return { id, ...monthData };
    } catch (error) {
      console.error("Firebase Update Error:", error);
      throw error;
    }
  },

  deleteMonth: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return id;
    } catch (error) {
      console.error("Firebase Delete Error:", error);
      throw error;
    }
  }
};