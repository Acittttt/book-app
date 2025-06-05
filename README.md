# Book App

## Role: Fullstack Developer

This is a book library application built with React, TypeScript, and Node.js that allows users to manage their book collection, browse books, and track their reading progress.

## Features

- Browse books with grid layout
- Filter books by genre
- Book details page
- Reading progress tracking
- Library management (add/remove books)
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

## Future Improvements

- Add user authentication
- Implement book search functionality
- Add book recommendations
- Enhance reading progress tracking
- Add dark mode support



