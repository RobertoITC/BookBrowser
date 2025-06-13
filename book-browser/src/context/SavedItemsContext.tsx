import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { toggleInList, fetchUserLists, type ListType } from "../services/savedItems";

interface SavedItemsContextType {
    lists: Record<ListType, string[]>;
    toggle: (bookId: string, list: ListType) => Promise<void>;
    isInList: (bookId: string, list: ListType) => boolean;
}

export const SavedItemsContext = createContext<SavedItemsContextType>({
    lists: { readBooks: [], queuedBooks: [], wishlist: [] },
    toggle: async () => {},
    isInList: () => false
});

export const SavedItemsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [lists, setLists] = useState<Record<ListType, string[]>>({
        readBooks: [], queuedBooks: [], wishlist: []
    });

    useEffect(() => {
        if (!user) return;
        fetchUserLists(user.id).then(data => setLists(data));
    }, [user]);

    const toggle = async (bookId: string, list: ListType) => {
        if (!user) throw new Error("Not logged in");
        await toggleInList(user.id, bookId, list);
        // update local state immediately (optimistic)
        setLists(prev => {
            const arr = prev[list];
            const next = arr.includes(bookId)
                ? arr.filter(id => id !== bookId)
                : [...arr, bookId];
            return { ...prev, [list]: next };
        });
    };

    const isInList = (bookId: string, list: ListType) =>
        lists[list].includes(bookId);

    return (
        <SavedItemsContext.Provider value={{ lists, toggle, isInList }}>
            {children}
        </SavedItemsContext.Provider>
    );
};