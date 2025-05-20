// src/components/RatingStars/RatingStars.tsx
import React from 'react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
                                                   rating,
                                                   maxRating = 5,
                                                   onRate,
                                                   readOnly = false,
                                                 }) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    const filled = i <= rating;
    stars.push(
        <span
            key={i}
            className={
                `text-2xl ` +
                (filled ? 'text-pink-500 ' : 'text-gray-300 ') +
                (!readOnly ? 'cursor-pointer' : '')
            }
            onClick={() => {
              if (!readOnly && onRate) onRate(i);
            }}
        >
        ★
      </span>
    );
  }

  return <div className="flex space-x-1">{stars}</div>;
};

export default RatingStars;