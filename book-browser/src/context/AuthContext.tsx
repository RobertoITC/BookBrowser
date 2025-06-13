// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User as LocalUser } from '../types/User';
import { onAuthStateChanged, logout as firebaseLogout } from '../services/authService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

interface AuthContextType {
  user: LocalUser | null;
  login: (userData: LocalUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user document from Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || '',
              email: data.email || firebaseUser.email || '',
              avatarUrl: data.avatarUrl || firebaseUser.photoURL || '',
              favorites: data.favorites || [],
            });
          } else {
            // If no document, create a new one with empty favorites
            const newUser: LocalUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              avatarUrl: firebaseUser.photoURL || '',
              favorites: [],
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch {
          // On error, fallback to minimal user with empty favorites
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || '',
            favorites: [],
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Manual login (for custom user data, e.g. after registration)
  const login = (userData: LocalUser) => {
    setUser(userData);
  };

  const logout = async () => {
    await firebaseLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};