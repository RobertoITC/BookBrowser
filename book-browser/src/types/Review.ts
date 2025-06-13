import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    type DocumentData
} from "firebase/firestore";
import { db } from "../services/firebaseConfig.ts";

export interface Review {
    id: string;
    bookId: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

// Add a review
export async function addReview(r: Omit<Review, "id"|"createdAt">) {
    const col = collection(db, "reviews");
    await addDoc(col, { ...r, createdAt: new Date() });
}

// Listen for reviews for a given book
export function onReviewsForBook(
    bookId: string,
    callback: (reviews: Review[]) => void
) {
    const col = collection(db, "reviews");
    const q = query(
        col,
        where("bookId", "==", bookId),
        orderBy("createdAt", "desc")
    );
    return onSnapshot(q, snap => {
        const data = snap.docs.map(d => ({
            ...(d.data() as DocumentData),
            id: d.id,
            createdAt: d.data().createdAt.toDate()
        })) as Review[];
        callback(data);
    });
}