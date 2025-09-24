"use client";
import { useEffect, useState, Suspense, useCallback } from "react";
import { Book, GoogleBooksResponse } from "@/types/Books";
import { motion, AnimatePresence } from "framer-motion";
import { searchBooks } from "@/lib/googleBooks";
import SearchBar from "@/components/Books/SearchBar";
import BookCard from "@/components/Books/BookCard";
import Loading from "@/components/Loading";
import { FadeDown, FadeLeft, FadeUp, Animate } from "@/animation";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ScrollToTopButton from "@/components/ui/Scroll_Top_Button";

const PAGE_SIZE = 20;

const CATEGORIES = [
  "Fiction",
  "Science",
  "Technology",
  "History",
  "Art",
  "Business",
  "Health",
  "Philosophy",
];

function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams
    ? new URLSearchParams(searchParams.toString()).get("q") || ""
    : "";

  const handleSearch = (query: string) => {
    const params = `q=${encodeURIComponent(query)}`;

    setBooks([]);
    setError(null);
    fetchBooks();
    router.push(`/books?${params}`);
  };

  const fetchBooks = useCallback(async () => {
    if (!q) return;

    setLoading(true);
    setError(null);

    try {
      const result: GoogleBooksResponse = await searchBooks(q, PAGE_SIZE, 0);
      const items = result.items || [];

      setBooks(items);
      setTotalItems(result.totalItems || 0);
    } catch (err) {
      console.error("Search error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [q]);

  const loadMore = useCallback(async () => {
    if (loading || books.length >= totalItems) return;

    setLoading(true);
    setError(null);

    const nextIndex = books.length;

    try {
      const result: GoogleBooksResponse = await searchBooks(
        q,
        PAGE_SIZE,
        nextIndex
      );
      const items = result.items || [];

      setBooks((prev) => [...prev, ...items]);
      setTotalItems(result.totalItems || 0);
    } catch (err) {
      console.error("Load more error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load more books. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [q, loading, books.length, totalItems]);
  const handleRetry = () => {
    setError(null);
    fetchBooks();
  };

  useEffect(() => {
    setBooks([]);
    setError(null);

    if (q) {
      fetchBooks();
    }
  }, [q, fetchBooks]);

  const showNoResults = q && books.length === 0 && !loading && !error;
  const showGrid = books.length > 0;

  return (
    <div className="min-h-screen mt-20">
      <ScrollToTopButton />

      <div className="mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <motion.h1
            {...FadeUp}
            {...Animate}
            className="text-6xl lg:text-7xl font-bold mb-4"
          >
            Book <span> Search </span>
          </motion.h1>
          <motion.p
            {...FadeDown}
            {...Animate}
            transition={{ delay: 0.1 }}
            className="text-lg"
          >
            Search millions of books
          </motion.p>
        </div>

        <div className="mb-8">
          <SearchBar delay={0.2} onSearch={handleSearch} loading={loading} />
        </div>
        <AnimatePresence>
          {!q && (
            <motion.div {...FadeUp} {...Animate} className="text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Ready to discover books?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Search for your favorite books, authors, or explore new genres.
                We’ll help you find exactly what you’re looking for.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    href={`/books?q=${encodeURIComponent(
                      `subject:${cat.toLowerCase()}`
                    )}`}
                    aria-label={`Search category ${cat}`}
                  >
                    <Button NoAnimate variant="secondary_2">
                      {cat}
                    </Button>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              {...FadeLeft}
              {...Animate}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center"
            >
              {error}
              <Button variant="outline" className="ml-4" onClick={handleRetry}>
                Retry
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {showNoResults && (
          <motion.div {...FadeUp} {...Animate} className="text-center py-8">
            <div className="text-6xl mb-4">📚❌</div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try a different search term, check your spelling, or use related
              keywords.
            </p>
          </motion.div>
        )}

        {showGrid && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}

        {showGrid && books.length < totalItems && !error && (
          <div className="text-center w-fit mx-auto mt-8">
            <Button onClick={loadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}

        {loading && (
          <motion.div {...FadeUp} {...Animate} className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-2 border-third dark:border-primary"></div>
            <p className="mt-2 text-xl">Loading...</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Home />
    </Suspense>
  );
}
