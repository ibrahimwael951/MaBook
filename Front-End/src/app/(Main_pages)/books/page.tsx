"use client";
import { useEffect, useState, Suspense, useCallback } from "react";
import { Book, GoogleBooksResponse } from "@/types/Books";
import {
  Search,
  BookOpen,
  AlertCircle,
  RefreshCw,
  Loader2,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchBooks } from "@/lib/googleBooks";
import SearchBar from "@/components/Books/SearchBar";
import BookCard from "@/components/Books/BookCard";
import Loading from "@/components/Loading";
import { FadeDown, FadeUp, Animate } from "@/animation";
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

      <div className="mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            {...FadeUp}
            {...Animate}
            className="inline-flex items-center gap-3 mb-6"
          >
            <BookOpen className="w-12 h-12 md:w-16 md:h-16 text-secondary" />
          </motion.div>
          <motion.h1
            {...FadeUp}
            {...Animate}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            Book <span>Search</span>
          </motion.h1>
          <motion.p
            {...FadeDown}
            {...Animate}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Discover millions of books across all genres and authors
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-3xl mx-auto">
          <SearchBar delay={0.2} onSearch={handleSearch} loading={loading} />
        </div>

  
        <AnimatePresence>
          {!q && (
            <motion.div {...FadeUp} {...Animate} className="text-center  ">
              <div className="bg-white dark:bg-third rounded-2xl shadow-xl  p-8 md:p-12 max-w-4xl mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-secondary/20 to-secondaryHigh/20 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-secondary" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  Ready to discover books?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto text-lg">
                  Search for your favorite books, authors, or explore new
                  genres. We'll help you find exactly what you're looking for.
                </p>

                {/* Category Pills */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">Popular Categories</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        href={`/books?q=${encodeURIComponent(
                          `subject:${cat.toLowerCase()}`
                        )}`}
                        aria-label={`Search category ${cat}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button NoAnimate variant="secondary_2">
                            {cat}
                          </Button>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8 max-w-2xl mx-auto"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={handleRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results State */}
        {showNoResults && (
          <motion.div {...FadeUp} {...Animate} className="text-center py-12">
            <div className="bg-white dark:bg-third rounded-2xl shadow-xl  p-8 md:p-12 max-w-2xl mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                We couldn't find any books matching your search.
              </p>
              <div className="space-y-3 text-left max-w-md mx-auto">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Try:</strong>
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
                  <li>Checking your spelling</li>
                  <li>Using different keywords</li>
                  <li>Searching for related topics</li>
                  <li>Browsing popular categories above</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Grid */}
        {showGrid && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Found{" "}
                <span className="font-semibold text-secondary">
                  {totalItems.toLocaleString()}
                </span>{" "}
                books
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}

        {/* Load More Button */}
        {showGrid && books.length < totalItems && !error && (
          <div className="text-center mt-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={loadMore}
                disabled={loading}
                className="flex items-center gap-2 mx-auto min-w-[200px] justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-5 h-5" />
                    Load More Books
                  </>
                )}
              </Button>
            </motion.div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              Showing {books.length} of {totalItems.toLocaleString()} books
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && !showGrid && (
          <motion.div {...FadeUp} {...Animate} className="text-center py-16">
            <div className="inline-flex flex-col items-center gap-4">
              <Loader2 className="w-16 h-16 animate-spin text-secondary" />
              <div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  Searching for books...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  This won't take long
                </p>
              </div>
            </div>
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
