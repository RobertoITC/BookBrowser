// src/services/authService.ts
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import type { User } from "../types/User";

const googleProvider = new GoogleAuthProvider();

const mapFirestoreUserToAppUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  email: data.email,
  avatarUrl: data.avatarUrl,
  favorites: data.favorites || [],
});

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const userRef = doc(db, "users", fbUser.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const newUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || "",
        email: fbUser.email || "",
        avatarUrl: fbUser.photoURL || "",
        favorites: [],
      };
      await setDoc(userRef, newUser);
      return newUser;
    } else {
      return mapFirestoreUserToAppUser(userDoc.data());
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = result.user;
    const userRef = doc(db, "users", fbUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return mapFirestoreUserToAppUser(userDoc.data());
    } else {
      const newUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || "",
        email: fbUser.email || "",
        avatarUrl: fbUser.photoURL || "",
        favorites: [],
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const fbUser = result.user;
    const newUser: User = {
      id: fbUser.uid,
      name,
      email: fbUser.email || "",
      avatarUrl: "",
      favorites: [],
    };
    await setDoc(doc(db, "users", fbUser.uid), newUser);
    return newUser;
  } catch (error) {
    console.error("Error registering with email:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getUserRole = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      // @ts-ignore
      return data.role || "customer";
    }
    return "customer";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "customer";
  }
};

export const updateUserRole = async (userId: string, role: string) => {
  try {
    await updateDoc(doc(db, "users", userId), { role });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
  return auth.onAuthStateChanged(callback);
};