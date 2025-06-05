# Book App

## Role: Fullstack Developer

This is a book library application built with React, TypeScript, and Node.js that allows users to manage their book collection, browse books, and track their reading progress.

## Features

- Browse books with grid layout
- Filter books by genre, search by title/author/genre, and sort by title/author/rating
- Book details page with status management
- Responsive design
- CORS-enabled API for cross-origin requests

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Lucide Icons
- React Query

### Backend
- Flask
- JSON file storage

## How to Run

1. Clone the repository:
```bash
git clone https://github.com/Acittttt/book-app.git
cd book-app
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend development server (from frontend directory)
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Design Decisions

1. UI/UX:
   - Used a 2-column grid layout in BrowseLibrary for better readability on mobile devices.
   - Implemented horizontal scrolling for genre filters with hidden scrollbar for a cleaner look.
   - Added smooth transitions and hover effects on buttons and cards.
   - Consistent color scheme with purple/pink accents for a modern aesthetic.

2. State Management:
   - Used React's built-in state management with hooks (useState, useEffect).
   - Implemented React.useMemo for optimizing genre list generation in BrowseLibrary.
   - Maintained navigation state using useLocation to preserve tab and view state when navigating back from book details.

3. Navigation:
   - Added route for book details (/books/:id) to support detailed book views.
   - Implemented proper back navigation from book details to library with state preservation.
   - Used Link components for navigation to book details from browse view.

4. Data Structure:
   - Extended Book interface with optional fields (description, published_date, isbn) for future scalability.
   - Implemented server-side filtering and sorting to reduce frontend processing.
   - Used JSON file for persistent storage in development.

5. API:
   - Added /api/books/search endpoint for advanced search, filter, and sort capabilities.
   - Added /api/books/<id> GET endpoint to fetch individual book details.
   - Configured CORS with environment variables for flexible origin control. 

## Changelog

### Initial Development
1. **Basic Setup**
   - Created project structure with separate frontend (React) and backend (Flask).
   - Set up React with TypeScript, Tailwind CSS, and React Router.
   - Configured Flask with CORS and JSON file storage.
   - Added basic routing for home and library views.

2. **Core Features Implementation**
   - Added book browsing functionality with BrowseLibrary component.
   - Set up state management for library and browse views.

### Recent Improvements
## Backend Enhancements
1. **Search and Filter Endpoint**
   ```py
   @app.route('/api/books/search', methods=['GET'])
   def search_books():
    query = request.args.get('query', '').lower()
    genre = request.args.get('genre', '').lower()
    sort_by = request.args.get('sort_by', 'title')  # title, rating, author
    sort_order = request.args.get('sort_order', 'asc')  # asc, desc
    
    # Filter books based on search query and genre
    filtered_books = books
    
    if query:
        filtered_books = [
            book for book in filtered_books
            if query in book['title'].lower() or 
               query in book['author'].lower() or
               query in book['genre'].lower()
        ]
    
    if genre and genre != 'all':
        filtered_books = [
            book for book in filtered_books
            if book['genre'].lower() == genre
        ]
    
    # Sort books
    reverse = sort_order == 'desc'
    if sort_by == 'rating':
        filtered_books = sorted(filtered_books, key=lambda x: x['rating'], reverse=reverse)
    elif sort_by == 'author':
        filtered_books = sorted(filtered_books, key=lambda x: x['author'].lower(), reverse=reverse)
    else:  # default sort by title
        filtered_books = sorted(filtered_books, key=lambda x: x['title'].lower(), reverse=reverse)
    
    return jsonify(filtered_books)
   ```
   - Added /api/books/search endpoint to support searching by title, author, or genre, filtering by genre, and sorting by title, author, or rating.
   - Reduces frontend processing by handling filtering and sorting server-side.

2. **Book Detail Endpoint**
   ```py
   @app.route('/api/books/<int:book_id>', methods=['GET'])
   def get_book(book_id):
    book = next((book for book in books if book['id'] == book_id), None)
    if book:
        return jsonify(book)
    return jsonify({'error': 'Book not found'}), 404
   ```
   - Added /api/books/<id> GET endpoint to fetch individual book details.
   - Supports the new book details page by providing book data by ID.

## Frontend Enhancements

1. **Book Details Page**
   ```tsx
   const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [book, setBook] = useState<Book | null>(null);
    # ... (fetch book and render details)
    return (
        <div className="max-w-4xl mx-auto p-4">
            # Back button and book details
        </div>
    );
  };
   ```
   - Added BookDetail component to display detailed book information (title, author, cover, rating, pages, genre, status).
   - Supports updating reading status via API calls.
   - Includes responsive design with a two-column layout for larger screens.

2. **Improved Book Card Rendering**
   ```tsx
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
   ```
    - Updated BookCard to conditionally render book cover images if available, falling back to a placeholder icon.
    - Standardized color scheme (purple/pink gradients) across all variants.
    - Improved rating display with Star icon instead of plain text.

3. **Enhanced Browse Library**
   ```tsx
   const response = await api.get<Book[]>('/api/books/search', {
    params: {
        query: searchTerm,
        genre: selectedGenre,
        sort_by: sortBy,
        sort_order: sortOrder
    }
   });
   ```
   ```tsx
   <div className="grid grid-cols-2 gap-4">
    {filteredBooks.map((book) => (
        <Link key={book.id} to={`/books/${book.id}`}>
            # Book card content
        </Link>
    ))}
   </div>
   ```
    - Moved filtering and sorting to backend via /api/books/search endpoint.
    - Changed layout from vertical list to 2-column grid for better readability.
    - Added navigation to book details page via Link components.
    - Optimized genre filter with React.useMemo for performance.

4. **Navigation Improvements**
   ```tsx
   useEffect(() => {
    if (location.state?.activeTab) {
        setActiveTab(location.state.activeTab);
    }
    if (location.state?.libraryView) {
        setLibraryView(location.state.libraryView);
    }
   }, [location.state]);
   ```
    - Added useEffect in Index.tsx to preserve navigation state when returning from book details.
    - Ensures correct tab and library view are restored.

5. **Routing Enhancements**
   ```tsx
   <Route path="/library" element={<Index />} />
   <Route path="/books/:id" element={<BookDetail />} />
   ```
    - Added routes for /library and /books/:id to support library and book detail views.
    - Improved navigation flow with proper state management.

6. **Styling Improvements**
   ```css
   @layer utilities {
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
   }
   ```
    - Added Tailwind utility to hide scrollbars for genre filter in BrowseLibrary.
    - Applied to horizontal scrolling container for a cleaner UI.

### Bug Fixes
1. **Scrollbar Styling**
   - Fixed scrollbar hiding by moving styles to global index.css and using Tailwind utility.
   - Ensured cross-browser compatibility with -ms-overflow-style and scrollbar-width.

2. **Type Safety**
   ```tsx
   const [sortBy, setSortBy] = useState<'title' | 'rating' | 'author'>('title');
   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
   ```
   - Added TypeScript types for sortBy and sortOrder to improve type safety.
   - Extended Book interface with optional fields for future compatibility.