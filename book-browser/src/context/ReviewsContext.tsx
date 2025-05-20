// src/contexts/ReviewsContext.tsx
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { Review } from '../types/Review';

interface ReviewsContextType {
    reviewsByBook: Record<string, Review[]>;
    addReview: (bookId: string, review: Review) => void;
}

export const ReviewsContext = createContext<ReviewsContextType>({
    reviewsByBook: {},
    addReview: () => {},
});

export const ReviewsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [reviewsByBook, setReviewsByBook] = useState<Record<string, Review[]>>({});

    // Load all reviews from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('all_reviews');
        if (stored) {
            try {
                setReviewsByBook(JSON.parse(stored));
            } catch {
                setReviewsByBook({});
            }
        }
    }, []);

    // Persist whenever reviews change
    useEffect(() => {
        localStorage.setItem('all_reviews', JSON.stringify(reviewsByBook));
    }, [reviewsByBook]);

    const addReview = (bookId: string, review: Review) => {
        setReviewsByBook(prev => {
            const bookReviews = prev[bookId] || [];
            return {
                ...prev,
                [bookId]: [review, ...bookReviews],
            };
        });
    };

    return (
        <ReviewsContext.Provider value={{ reviewsByBook, addReview }}>
            {children}
        </ReviewsContext.Provider>
    );
};