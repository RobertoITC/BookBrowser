// src/contexts/FavoritesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { AuthContext } from './AuthContext';
import { db } from '../services/firebaseConfig';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (bookId: string) => void;
  removeFavorite: (bookId: string) => void;
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
  logout: () => Promise<void>;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  toggleFavorite: () => {},
  isFavorite: () => false,
  logout: async () => {},
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const { user, logout: authLogout } = useContext(AuthContext);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const updateFavorites = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.id), { favorites });
    } catch (err) {
      console.error('Error writing favorites to Firestore:', err);
    }
  };

  // Fetch or clear favorites when user changes or logout is triggered
  useEffect(() => {
    const fetchFavorites = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.id));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFavorites(data.favorites || []);
          } else {
            setFavorites([]);
            await setDoc(doc(db, 'users', user.id), { favorites: [] });
          }
        } catch (e) {
          console.error('Error fetching favorites from Firestore:', e);
          setFavorites([]);
        }
      } else if (isLoggingOut) {
        // Only clear on explicit logout
        setFavorites([]);
        setIsLoggingOut(false);
      }
      setInitialized(true);
    };

    setInitialized(false);
    fetchFavorites();
  }, [user, isLoggingOut]);

  // Sync favorites to Firestore when changed (after initial load)
  useEffect(() => {
    if (user && initialized) {
      updateFavorites();
    }
  }, [favorites, user, initialized]);

  const addFavorite = (bookId: string) => {
    setFavorites(prev => (prev.includes(bookId) ? prev : [...prev, bookId]));
  };

  const removeFavorite = (bookId: string) => {
    setFavorites(prev => prev.filter(id => id !== bookId));
  };

  const toggleFavorite = (bookId: string) => {
    setFavorites(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const isFavorite = (bookId: string) => {
    return favorites.includes(bookId);
  };

  const logout = async () => {
    setIsLoggingOut(true);
    await authLogout();
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite, logout }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};