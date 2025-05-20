

// src/contexts/FavoritesContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (bookId: string) => void;
  removeFavorite: (bookId: string) => void;
  toggleFavorite: (bookId: string) => void;
  isFavorite: (bookId: string) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  toggleFavorite: () => {},
  isFavorite: () => false,
});

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};