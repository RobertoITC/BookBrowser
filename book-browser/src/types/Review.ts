// src/types/Review.ts
export interface Review {
    id: string;          // unique review ID
    bookId: string;      // Google Books volume ID
    userId: string;      // your User.id
    rating: number;      // e.g. 1–5 stars
    comment?: string;    // optional text review
    createdAt: string;   // ISO timestamp, e.g. new Date().toISOString()
}