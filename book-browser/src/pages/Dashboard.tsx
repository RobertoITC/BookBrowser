// src/pages/Dashboard/Dashboard.tsx
import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { ReviewsContext } from '../context/ReviewsContext';
import { SavedItemsContext } from '../context/SavedItemsContext';
import { getBookById } from '../services/googleBooks';
import type { Book } from '../types/Book';
import BookCard from '../components/BookCard';

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const { reviewsByBook } = useContext(ReviewsContext);
  const { lists } = useContext(SavedItemsContext);

  // Flatten all reviews into one array
  const allReviews = useMemo(() => Object.values(reviewsByBook).flat(), [reviewsByBook]);

  // Compute unique book IDs needed (favorites + reviews + saved lists)
  const allBookIds = useMemo(() => {
    const ids = new Set<string>();
    favorites.forEach(id => ids.add(id));
    allReviews.forEach(r => ids.add(r.bookId));
    lists.readBooks.forEach(id => ids.add(id));
    lists.queuedBooks.forEach(id => ids.add(id));
    lists.wishlist.forEach(id => ids.add(id));
    return Array.from(ids);
  }, [favorites, allReviews, lists]);

  // Cache fetched Book objects
  const [bookCache, setBookCache] = useState<Record<string, Book>>({});
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [errorBooks, setErrorBooks] = useState<string | null>(null);

  // Fetch any books not already in cache
  useEffect(() => {
    const toFetch = allBookIds.filter(id => !bookCache[id]);
    if (toFetch.length === 0) return;

    setLoadingBooks(true);
    setErrorBooks(null);
    Promise.all(toFetch.map(id => getBookById(id).then(b => [id, b] as const)))
      .then(results => {
        setBookCache(prev => {
          const next = { ...prev };
          for (const [id, book] of results) {
            next[id] = book;
          }
          return next;
        });
      })
      .catch(e => {
        setErrorBooks((e as Error).message);
      })
      .finally(() => {
        setLoadingBooks(false);
      });
  }, [allBookIds, bookCache]);

  // Compute lists of Book objects for each category
  const favoriteBooks = useMemo(
    () => favorites.map(id => bookCache[id]).filter(Boolean),
    [favorites, bookCache]
  );
  const readBooksList = useMemo(
    () => lists.readBooks.map(id => bookCache[id]).filter(Boolean),
    [lists.readBooks, bookCache]
  );
  const queuedBooksList = useMemo(
    () => lists.queuedBooks.map(id => bookCache[id]).filter(Boolean),
    [lists.queuedBooks, bookCache]
  );
  const wishlistBooksList = useMemo(
    () => lists.wishlist.map(id => bookCache[id]).filter(Boolean),
    [lists.wishlist, bookCache]
  );

  // Compute review stats
  const totalReviews = allReviews.length;
  const averageRating =
    totalReviews > 0
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '—';

  // Prepare recent reviews with full Book objects
  const recentReviews = useMemo(() => {
    return allReviews
      .slice()
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 4)
      .map(review => ({ review, book: bookCache[review.bookId] }))
      .filter(item => !!item.book);
  }, [allReviews, bookCache]);

  // If not logged in, prompt to log in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-700">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Favorites</h3>
          <p className="mt-2 text-3xl font-bold text-pink-500">
            {favorites.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Reviews</h3>
          <p className="mt-2 text-3xl font-bold text-pink-500">
            {totalReviews}
          </p>
        </div>
        <div className="bg-white p-6 rounded-md shadow-md">
          <h3 className="text-lg font-medium text-gray-700">Avg. Rating</h3>
          <p className="mt-2 text-3xl font-bold text-pink-500">
            {averageRating}
          </p>
        </div>
      </div>

      {/* Error or Loading */}
      {errorBooks && (
        <p className="text-center text-red-500">{errorBooks}</p>
      )}
      {loadingBooks && (
        <p className="text-center text-gray-700">Loading book data…</p>
      )}

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Recent Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentReviews.map(({ review, book }) => (
              <div
                key={review.id}
                className="bg-white p-4 rounded-md shadow-sm space-y-2"
              >
                <BookCard book={book!} />
                {review.comment && (
                  <p className="text-gray-600 line-clamp-2">
                    {review.comment}
                  </p>
                )}
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Favorite Books */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Your Favorite Books
        </h2>
        {favoriteBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">
            You haven’t added any favorites yet.
          </p>
        )}
      </section>

      {/* Read Books */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Read Books</h2>
        {readBooksList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {readBooksList.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">
            No books marked as read yet.
          </p>
        )}
      </section>

      {/* Queued Books */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Queued Books</h2>
        {queuedBooksList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {queuedBooksList.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">
            Your queue is empty.
          </p>
        )}
      </section>

      {/* Wishlist */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Wishlist</h2>
        {wishlistBooksList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistBooksList.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">
            Your wishlist is empty.
          </p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;