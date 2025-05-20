// src/pages/Profile/Profile.tsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { getBookById } from '../services/googleBooks';
import type { Book } from '../types/Book';
import BookCard from '../components/BookCard';

const Profile: React.FC = () => {
    const { user, logout } = useContext(AuthContext);
    const { favorites } = useContext(FavoritesContext);
    const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (favorites.length === 0) {
                setFavoriteBooks([]);
                return;
            }
            setLoading(true);
            try {
                const books = await Promise.all(
                    favorites.map(id => getBookById(id))
                );
                setFavoriteBooks(books);
            } catch (e) {
                setError((e as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [favorites]);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-700">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            {/* User Info */}
            <section className="bg-white p-6 rounded-md shadow-md flex flex-col items-center space-y-4">
                {user.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-pink-500 text-white text-3xl font-bold rounded-full">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
                <button
                    onClick={logout}
                    className="mt-2 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
                >
                    Log Out
                </button>
            </section>

            {/* Favorites List */}
            <section className="space-y-4">
                <h3 className="text-xl font-bold text-pink-600">Your Favorites</h3>

                {loading && (
                    <p className="text-center text-gray-700">Loading your favorites…</p>
                )}
                {error && (
                    <p className="text-center text-red-500">{error}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {favoriteBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>

                {!loading && favoriteBooks.length === 0 && (
                    <p className="text-center text-gray-700">
                        You haven’t added any favorites yet.
                    </p>
                )}
            </section>
        </div>
    );
};

export default Profile;