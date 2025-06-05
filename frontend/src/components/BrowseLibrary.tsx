import { Search, Filter, Star, Plus, ArrowUpDown, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BookCard from './BookCard';
import React from 'react';

// Define the Book interface
interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read';
  description?: string;
  published_date?: string;
  isbn?: string;
}

const BrowseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'rating' | 'author'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch books from the backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book[]>('/api/books/search', {
          params: {
            query: searchTerm,
            genre: selectedGenre,
            sort_by: sortBy,
            sort_order: sortOrder
          }
        });
        setBooks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books. Please try again later.');
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedGenre, sortBy, sortOrder]);

  // Get unique genres from books
  const genres = React.useMemo(() => {
    const uniqueGenres = [...new Set(books.map(book => book.genre))];
    return ['all', ...uniqueGenres.sort()];
  }, [books]);

  // Handle sorting
  const handleSort = (newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  // Filter books based on selected genre
  const filteredBooks = React.useMemo(() => {
    if (selectedGenre === 'all') return books;
    return books.filter(book => book.genre === selectedGenre);
  }, [books, selectedGenre]);

  // Handle adding a book to library
  const handleAddBook = async (bookId: number) => {
    try {
      await api.put(`/api/books/${bookId}`, {
        status: 'want-to-read'
      });
      // Update local state
      setBooks(books.map(book => 
        book.id === bookId 
          ? { ...book, status: 'want-to-read' }
          : book
      ));
    } catch (err) {
      console.error('Error adding book:', err);
      setError('Failed to add book. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Browse Library</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSort('title')}
            className={`p-2 rounded-lg transition-colors ${
              sortBy === 'title' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Sort by title"
          >
            Title <ArrowUpDown size={16} className="inline ml-1" />
          </button>
          <button
            onClick={() => handleSort('author')}
            className={`p-2 rounded-lg transition-colors ${
              sortBy === 'author' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Sort by author"
          >
            Author <ArrowUpDown size={16} className="inline ml-1" />
          </button>
          <button
            onClick={() => handleSort('rating')}
            className={`p-2 rounded-lg transition-colors ${
              sortBy === 'rating' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Sort by rating"
          >
            Rating <ArrowUpDown size={16} className="inline ml-1" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search books by title, author, or genre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Genre Filter */}
      <div className="relative mb-4">
        <div className="flex overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          <div className="flex space-x-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  selectedGenre === genre
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {genre === 'all' ? 'All Genres' : genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styling */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Results Count */}
      <p className="text-sm text-gray-600">
        {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredBooks.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            state={{ from: 'browse' }}
            className="block"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-100 to-pink-100 relative">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="text-purple-400" size={32} />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1">
                  <div className="flex items-center">
                    <Star size={12} className="text-yellow-400" />
                    <span className="text-xs font-medium text-gray-700 ml-1">{book.rating}</span>
                  </div>
                </div>
                {book.status === 'want-to-read' && (
                  <button 
                    className="absolute bottom-2 right-2 bg-white/90 rounded-full p-1.5 text-green-500 hover:text-green-600"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddBook(book.id);
                    }}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-800 line-clamp-1">{book.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{book.author}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                    {book.genre}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default BrowseLibrary;
