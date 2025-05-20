// src/pages/BookDetails/BookDetails.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getBookById } from '../services/googleBooks';
import type { Book } from '../types/Book';
import { FavoritesContext } from '../context/FavoritesContext';
import { ReviewsContext } from '../context/ReviewsContext';
import RatingStars from '../components/RatingStars';
import ReviewForm from '../components/ReviewForm';
import type { Review } from '../types/Review';
import '../index.css';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const { reviewsByBook, addReview } = useContext(ReviewsContext);
  const reviews = id ? reviewsByBook[id] || [] : [];
  const [rating, setRating] = useState<number>(0);

  // Fetch book details
  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      setLoading(true);
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!book) return <p className="text-center text-gray-400">Book not found.</p>;

  const {
    volumeInfo: {
      title,
      authors,
      description,
      publishedDate,
      publisher,
      pageCount,
      categories,
      averageRating,
      imageLinks,
    },
  } = book;

  return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {imageLinks?.thumbnail && (
              <img
                  src={imageLinks.thumbnail}
                  alt={`Cover of ${title}`}
                  className="w-48 h-auto rounded-md shadow"
              />
          )}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold text-pink-600">{title}</h1>
            {authors && <p className="text-sm text-gray-600">{authors.join(', ')}</p>}
            <button
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
                onClick={() => toggleFavorite(book.id)}
            >
              {isFavorite(book.id) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <div className="mt-2">
              <RatingStars rating={rating} onRate={setRating} />
            </div>
          </div>
        </div>

        {description && (
            <div
                className="prose max-w-none text-gray-700 text-justify"
                dangerouslySetInnerHTML={{ __html: description }}
            />
        )}

        <ReviewForm
            bookId={book.id}
            onSubmit={(review: Review) => {
              addReview(book.id, review);
            }}
        />

        {reviews.length > 0 && (
            <section className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">Reviews</h2>
              {reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-700 pb-4">
                    <RatingStars rating={r.rating} readOnly />
                    {r.comment && <p className="mt-2 text-gray-700">{r.comment}</p>}
                    <span className="text-xs text-gray-500">
                {new Date(r.createdAt).toLocaleString()}
              </span>
                  </div>
              ))}
            </section>
        )}

        <ul className="mt-6 space-y-2 text-gray-300">
          {publishedDate && <li><strong className="w-24 inline-block">Published:</strong> {publishedDate}</li>}
          {publisher && <li><strong className="w-24 inline-block">Publisher:</strong> {publisher}</li>}
          {pageCount && <li><strong className="w-24 inline-block">Pages:</strong> {pageCount}</li>}
          {categories && <li><strong className="w-24 inline-block">Categories:</strong> {categories.join(', ')}</li>}
          {averageRating != null && <li><strong className="w-24 inline-block">Avg. Rating:</strong> {averageRating}</li>}
        </ul>
      </div>
  );
};

export default BookDetails;