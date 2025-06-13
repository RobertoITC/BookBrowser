import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export type ListType = "readBooks"|"queuedBooks"|"wishlist";

// Toggle a book in one of the lists
export async function toggleInList(userId: string, bookId: string, list: ListType) {
    const userRef = doc(db, "users", userId);

    const userSnap = await getDoc(userRef);
    const data = userSnap.data() || {};
    const current: string[] = data[list] || [];

    if (current.includes(bookId)) {
        await updateDoc(userRef, { [list]: arrayRemove(bookId) });
    } else {
        await updateDoc(userRef, { [list]: arrayUnion(bookId) });
    }
}

// Fetch all lists for the user
export async function fetchUserLists(userId: string) {
    const userSnap = await getDoc(doc(db, "users", userId));
    const data = userSnap.data() || {};
    return {
        readBooks: data.readBooks || [],
        queuedBooks: data.queuedBooks || [],
        wishlist: data.wishlist || []
    };
}