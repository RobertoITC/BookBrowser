// src/pages/Home/Home.tsx
import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { searchBooks } from '../services/googleBooks';
import type { Book } from '../types/Book';
import '../index.css';

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await searchBooks('programming');
        setBooks(items);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-pink-600">Browse Books</h1>
          <p className="text-lg text-gray-600">
            Discover, save, and review books from our collection
          </p>
        </header>

        {loading && (
            <p className="text-center text-gray-700">Loading...</p>
        )}
        {error && (
            <p className="text-center text-red-500">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(book => (
              <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
  );
};

export default Home;