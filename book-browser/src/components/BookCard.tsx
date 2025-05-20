import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../components/RatingStars';
import type { Book } from '../types/Book';

interface BookCardProps {
    book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const { volumeInfo } = book;
    const { title, authors, imageLinks } = volumeInfo;

    return (
        <Link to={`/book/${book.id}`} className="block">
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-xs">
                {imageLinks?.thumbnail && (
                    <img
                        className="w-full h-auto"
                        src={imageLinks.thumbnail}
                        alt={`Cover of ${title}`}
                    />
                )}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    {authors && <p className="text-sm text-gray-600">{authors.join(', ')}</p>}
                    <div className="mt-2">
                        <RatingStars
                            rating={Math.round(volumeInfo.averageRating ?? 0)}
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BookCard;