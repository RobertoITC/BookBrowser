// File: src/components/ReviewForm/ReviewForm.tsx
import React, { useState, useContext } from 'react';
import RatingStars from './RatingStars';
import type { Review } from '../types/Review';
import { AuthContext } from '../context/AuthContext';


interface ReviewFormProps {
  bookId: string;
  onSubmit: (review: Review) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onSubmit }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review.');
      return;
    }
    const review: Review = {
      id: `${bookId}-${user.id}-${Date.now()}`,
      bookId,
      userId: user.id,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    onSubmit(review);
    setRating(0);
    setComment('');
  };

  return (
    <form
      className="flex flex-col space-y-4 p-4 bg-white rounded-md shadow-md"
      onSubmit={handleSubmit}
    >
      <h4 className="text-lg font-semibold">Leave a Review</h4>
      <RatingStars rating={rating} onRate={setRating} />
      <textarea
        className="w-full h-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Write your review..."
        required
      />
      <button
        type="submit"
        className="self-end bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
      >
        Submit
      </button>
    </form>
  );
};

export default ReviewForm;

// File: src/components/ReviewForm/ReviewForm.css
