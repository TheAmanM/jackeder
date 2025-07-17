// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface GymStatus {
  userId: string;
  date: string;
  attended: boolean;
  updatedAt: Date;
}

// Firebase Auth functions
export const firebaseAuth = {
  signUp: async (email: string, password: string, username: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email!,
          username,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to create account",
      };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      return {
        success: true,
        user: {
          id: user.uid,
          email: user.email!,
          username: userData?.username || "User",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Invalid credentials",
      };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to sign out",
      };
    }
  },

  getCurrentUser: (): FirebaseUser | null => {
    return auth.currentUser;
  },
};

// Firestore functions
export const firestore = {
  updateGymStatus: async (userId: string, date: string, attended: boolean) => {
    try {
      const statusRef = doc(db, "gymStatuses", `${userId}_${date}`);
      await setDoc(
        statusRef,
        {
          userId,
          date,
          attended,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to update gym status",
      };
    }
  },

  getGymStatuses: async (date: string) => {
    try {
      const q = query(collection(db, "gymStatuses"), where("date", "==", date));
      const querySnapshot = await getDocs(q);

      const statuses: Record<string, boolean> = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        statuses[data.userId] = data.attended;
      });

      return { success: true, data: statuses };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch gym statuses",
      };
    }
  },

  getUserProfile: async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        return { success: false, error: "User not found" };
      }

      const userData = userDoc.data();
      return {
        success: true,
        user: {
          id: userId,
          username: userData.username,
          email: userData.email,
          createdAt: userData.createdAt?.toDate() || new Date(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch user profile",
      };
    }
  },

  getAllUsers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users: User[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          username: data.username,
          email: data.email,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      return { success: true, users };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch users",
      };
    }
  },

  getUserGymHistory: async (userId: string, limit = 30) => {
    try {
      const q = query(
        collection(db, "gymStatuses"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);

      const history: { date: string; attended: boolean }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          date: data.date,
          attended: data.attended,
        });
      });

      // Sort by date descending and limit results
      history.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return { success: true, history: history.slice(0, limit) };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch gym history",
      };
    }
  },
};
