import React, { createContext, useState, type ReactNode, useContext } from "react";
        import type { Review } from "../types/Review";
        import { addReview, onReviewsForBook } from "../types/Review";
        import { AuthContext } from "./AuthContext";

        interface ReviewsContextType {
            reviewsByBook: Record<string, Review[]>;
            addReviewForBook: (bookId: string, rating: number, comment: string) => Promise<void>;
            subscribe: (bookId: string) => void;
        }

        export const ReviewsContext = createContext<ReviewsContextType>({
            reviewsByBook: {},
            addReviewForBook: async () => {},
            subscribe: () => {}
        });

        export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
            const { user } = useContext(AuthContext);
            const [reviewsByBook, setReviewsByBook] = useState<Record<string, Review[]>>({});

            const addReviewForBook = async (bookId: string, rating: number, comment: string) => {
                if (!user) throw new Error("Not logged in");
                await addReview({ bookId, userId: user.id, rating, comment });
            };

            const subscribe = (bookId: string) => {
                const unsubscribe = onReviewsForBook(bookId, revs => {
                    setReviewsByBook(prev => ({ ...prev, [bookId]: revs }));
                });
                return unsubscribe;
            };

            return (
                <ReviewsContext.Provider value={{ reviewsByBook, addReviewForBook, subscribe }}>
                    {children}
                </ReviewsContext.Provider>
            );
        };