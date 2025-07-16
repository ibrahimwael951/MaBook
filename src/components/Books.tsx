"use client";
import { useState } from 'react';
import { Book, GoogleBooksResponse } from '@/types/Books';
import { searchBooks } from '@/lib/googleBooks';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/ui/BookCard';
import BookModal from '@/components/BookModel';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result: GoogleBooksResponse = await searchBooks(query, 20);
      setBooks(result.items || []);
      setTotalResults(result.totalItems || 0);
    } catch (err) {
      setError('Failed to search books. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg -gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Search
          </h1>
          <p className="text-gray-600 text-lg">
            Search millions of books using Google Books API
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {totalResults > 0 && (
          <div className="mb-4 text-gray-600">
            Found {totalResults.toLocaleString()} results
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Searching books...</p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={() => setSelectedBook(book)}
            />
          ))}
        </div>

        {books.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Search for books to get started!
            </p>
          </div>
        )}

        {selectedBook && (
          <BookModal
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </div>
  );
}
