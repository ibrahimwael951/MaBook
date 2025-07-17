"use client";
import { useState } from "react";
import { Book, GoogleBooksResponse } from "@/types/Books";
import { motion, AnimatePresence } from "framer-motion";
import { searchBooks } from "@/lib/googleBooks";
import SearchBar from "@/components/SearchBar";
import BookCard from "@/components/ui/BookCard";

import { FadeDown, FadeLeft, FadeUp, ViewPort } from "@/animation";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const result: GoogleBooksResponse = await searchBooks(query, 20);
      setBooks(result.items || []);
      setTotalResults(result.totalItems || 0);
    } catch (err) {
      setError("Failed to search books. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg -gray-50">
      <div className=" mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <motion.h1
            {...FadeUp}
            {...ViewPort}
            className="text-7xl font-bold  mb-4"
          >
            Book Search
          </motion.h1>
          <motion.p
            {...FadeDown}
            {...ViewPort}
            transition={{ delay: 0.1 }}
            className=" text-lg"
          >
            Search millions of books
          </motion.p>
        </div>

        <div className="mb-8">
          <SearchBar delay={0.2} onSearch={handleSearch} loading={loading} />
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              {...FadeLeft}
              {...ViewPort}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {totalResults > 0 && (
            <motion.div {...FadeLeft} {...ViewPort} className="mb-4 ">
              Found {totalResults.toLocaleString()} results
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div {...FadeUp} {...ViewPort} className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-40 w-40 border-b-2  border-third dark:border-primary"></div>
              <p className="mt-2 text-2xl ">Searching books...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        {books.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-2xl">Search for books to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
