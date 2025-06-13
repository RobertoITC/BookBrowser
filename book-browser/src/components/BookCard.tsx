import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import type { Book } from '../types/Book';
import { SavedItemsContext } from '../context/SavedItemsContext.tsx';

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const { toggle, isInList } = useContext(SavedItemsContext);
    const inRead = isInList(book.id, "readBooks");
    const inQueue = isInList(book.id, "queuedBooks");
    const inWishlist = isInList(book.id, "wishlist");
    const { volumeInfo } = book;
    const { title, authors, imageLinks } = volumeInfo;

    return (
        <Link to={`/book/${book.id}`} className="block">
            <div className="bg-white shadow-md rounded-lg overflow-hidden h-[100%] max-w-xs">
                {imageLinks?.thumbnail && (
                    <img
                        className="w-full h-auto"
                        src={imageLinks.thumbnail}
                        alt={`Cover of ${title}`}
                    />
                )}
                <div className="p-4 flex flex-col justify-between h-fit">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    {authors && <p className="text-sm text-gray-600">{authors.join(', ')}</p>}
                    <div className="mt-2">
                        <RatingStars
                            rating={Math.round(volumeInfo.averageRating ?? 0)}
                            readOnly
                        />
                    </div>
                    <div className="flex space-x-2 mt-4">
                        {/* Read */}
                        <button
                            onClick={() => toggle(book.id, 'readBooks')}
                            className={`px-2 py-1 rounded ${
                                inRead
                                    ? 'bg-green-500 text-white'
                                    : 'border border-green-500 text-green-500'
                            }`}
                        >
                            {inRead ? '✓ Read' : 'Mark Read'}
                        </button>

                        {/* Queued */}
                        <button
                            onClick={() => toggle(book.id, 'queuedBooks')}
                            className={`px-2 py-1 rounded ${
                                inQueue
                                    ? 'bg-blue-500 text-white'
                                    : 'border border-blue-500 text-blue-500'
                            }`}
                        >
                            {inQueue ? '✓ Queued' : 'Queue'}
                        </button>

                        {/* Wishlist */}
                        <button
                            onClick={() => toggle(book.id, 'wishlist')}
                            className={`px-2 py-1 rounded ${
                                inWishlist
                                    ? 'bg-pink-500 text-white'
                                    : 'border border-pink-500 text-pink-500'
                            }`}
                        >
                            {inWishlist ? '✓ Wishlisted' : 'Wishlist'}
                        </button>
                    </div>



                </div>
            </div>
        </Link>
    );
};

export default BookCard;