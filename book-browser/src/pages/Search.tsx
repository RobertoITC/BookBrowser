// src/pages/Search/Search.tsx
import React, { useState, useEffect, useCallback } from 'react';
import BookCard from '../components/BookCard';
import { debounce } from '../utils/debounce';
import { searchBooks } from '../services/googleBooks';
import type { Book } from '../types/Book';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (q: string) => {
    if (!q.trim()) {
      setBooks([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const items = await searchBooks(q);
      setBooks(items);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return (
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        {/* Search bar */}
        <div className="flex justify-center">
          <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full max-w-lg p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Status messages */}
        {loading && (
            <p className="text-center text-gray-700">Loading...</p>
        )}
        {error && (
            <p className="text-center text-red-500">{error}</p>
        )}

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
              <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
  );
};

export default Search;