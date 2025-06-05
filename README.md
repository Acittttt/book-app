# Book App

## Role: Fullstack Developer

This is a book library application built with React, TypeScript, and Node.js that allows users to manage their book collection, browse books, and track their reading progress.

## Features

- Browse books with grid layout
- Filter books by genre
- Book details page
- Reading progress tracking
- Responsive design

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router DOM
- Lucide Icons

### Backend
- Node.js
- Express
- SQLite (for development)

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
   - Used a 2-column grid layout for better readability
   - Implemented horizontal scrolling for genre filters
   - Added smooth transitions and hover effects
   - Used consistent color scheme with purple accents

2. State Management:
   - Used React's built-in state management with hooks
   - Implemented memoization for performance optimization
   - Maintained separate states for library and browse views

3. Navigation:
   - Implemented proper back navigation from book details
   - Preserved view state when navigating between pages
   - Added route handling for library section

4. Data Structure:
   - Organized book data with clear interfaces
   - Implemented efficient filtering and sorting
   - Used proper typing with TypeScript

## Changelog

### Initial Development
1. **Basic Setup**
   - Created project structure
   - Set up React with TypeScript
   - Configured Tailwind CSS
   - Added basic routing

2. **Core Features Implementation**
   - Added book browsing functionality
   - Implemented book details view
   - Created reading progress tracking
   - Set up basic state management

### UI Improvements
1. **Layout Enhancement**
   ```tsx
   <div className="grid grid-cols-2 gap-4">
     {filteredBooks.map((book) => (
       <Link key={book.id} to={`/books/${book.id}`}>
         // Book card content
       </Link>
     ))}
   </div>
   ```
   - Changed grid layout from 5 to 2 columns for better visibility
   - Improved responsive design for mobile devices
   - Enhanced book card components

2. **Genre Filter Improvements**
   ```tsx
   <div className="flex overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
     <div className="flex space-x-2">
       {genres.map((genre) => (
         <button
           key={genre}
           onClick={() => setSelectedGenre(genre)}
           className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
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
   ```
   - Added horizontal scrolling for genre filters
   - Implemented smooth scrolling behavior
   - Fixed genre filter styling issues

3. **Navigation Enhancements**
   ```tsx
   const handleGoBack = () => {
     navigate('/library', { 
       state: { 
         activeTab: 'library',
         libraryView: 'browse' 
       } 
     });
   };
   ```
   - Fixed back navigation from book details
   - Improved state preservation during navigation
   - Enhanced route handling

### Bug Fixes
1. **Scrollbar Issue**
   ```tsx
   // Before
   <style jsx>{`
     .scrollbar-hide::-webkit-scrollbar {
       display: none;
     }
   `}</style>

   // After
   <style>{`
     .scrollbar-hide::-webkit-scrollbar {
       display: none;
     }
   `}</style>
   ```
   - Removed invalid `jsx` prop from style tag
   - Fixed TypeScript error in BrowseLibrary component
   - Maintained scrollbar hiding functionality

2. **State Management**
   ```tsx
   const [selectedGenre, setSelectedGenre] = useState('all');
   const [sortBy, setSortBy] = useState<'title' | 'rating' | 'author'>('title');
   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
   ```
   - Improved state management for filters
   - Added proper TypeScript types
   - Enhanced sorting functionality

### Documentation
1. **README Updates**
   - Added comprehensive setup instructions
   - Documented design decisions
   - Included tech stack details
   - Added future improvements section

2. **Code Documentation**
   - Added TypeScript interfaces
   - Improved component documentation
   - Added inline comments for complex logic

### Repository Management
1. **Version Control**
   - Initialized Git repository
   - Set up .gitignore
   - Added proper commit messages
   - Successfully pushed to GitHub

## Future Improvements

- Add user authentication
- Implement book search functionality
- Add book recommendations
- Enhance reading progress tracking
- Add dark mode support
