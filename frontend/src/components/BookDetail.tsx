import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, ArrowLeft, BookOpen, Calendar, Hash } from 'lucide-react';
import api from '../services/api';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  pages: number;
  genre: string;
  status: 'read' | 'reading' | 'want-to-read';
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await api.get<Book>(`/api/books/${id}`);
        setBook(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch book details. Please try again later.');
        console.error('Error fetching book:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: Book['status']) => {
    if (!book) return;

    try {
      const response = await api.put<Book>(`/api/books/${book.id}`, {
        ...book,
        status: newStatus,
      });
      setBook(response.data);
    } catch (err) {
      console.error('Error updating book status:', err);
      setError('Failed to update book status. Please try again.');
    }
  };

  const handleGoBack = () => {
    navigate('/library', { 
      state: { 
        activeTab: 'library',
        libraryView: 'browse' 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Book not found'}</p>
        <button
          onClick={handleGoBack}
          className="mt-4 text-blue-500 hover:text-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      // Back Button
      <button
        onClick={handleGoBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          // Book Cover
          <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-purple-100 p-6">
            <div className="aspect-[3/4] rounded-lg flex items-center justify-center bg-white/50">
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <BookOpen className="text-blue-500" size={64} />
              )}
            </div>
          </div>

          // Book Details
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-4">by {book.author}</p>
              </div>
              <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                <Star className="text-yellow-500 mr-1" size={16} />
                <span className="text-yellow-700 font-medium">{book.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <BookOpen size={16} className="mr-2" />
                <span>{book.pages} pages</span>
              </div>
              <div>
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {book.genre}
                </span>
              </div>
            </div>

            // Reading Status
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Reading Status</h2>
              <div className="flex space-x-2">
                {(['want-to-read', 'reading', 'read'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      book.status === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'want-to-read'
                      ? 'Want to Read'
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail; 