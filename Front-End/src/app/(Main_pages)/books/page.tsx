"use client";
import { useEffect, useState, Suspense, useRef, useCallback } from "react";
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
const EMPTY_PAGE_THRESHOLD = 2;

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const isFetchingRef = useRef(false);
  const fetchedStartIndicesRef = useRef(new Set<number>());
  const consecutiveEmptyPagesRef = useRef(0);

  const q = searchParams
    ? new URLSearchParams(searchParams.toString()).get("q") || ""
    : "";

  const handleSearch = (query: string) => {
    const params = query.includes("=")
      ? query
      : `q=${encodeURIComponent(query)}`;

    setBooks([]);
    setPage(0);
    setHasMore(true);
    fetchedStartIndicesRef.current.clear();
    consecutiveEmptyPagesRef.current = 0;
    setError(null);
    router.push(`/books?${params}`);
  };

  const fetchBooks = useCallback(
    async (pageIndex: number) => {
      if (!q) return;
      const startIndex = pageIndex * PAGE_SIZE;

      if (fetchedStartIndicesRef.current.has(startIndex)) {
        return;
      }

      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      fetchedStartIndicesRef.current.add(startIndex);
      setLoading(true);
      setError(null);

      try {
        const result: GoogleBooksResponse = await searchBooks(
          q,
          PAGE_SIZE,
          startIndex
        );
        const items = result.items || [];

        let uniqueNewCount = 0;
        setBooks((prev) => {
          const existingIds = new Set(prev.map((b) => b.id));
          const uniqueNew = items.filter(
            (it) => !!it.id && !existingIds.has(it.id)
          );
          uniqueNewCount = uniqueNew.length;

          return pageIndex === 0 ? uniqueNew : [...prev, ...uniqueNew];
        });

        const totalItems =
          typeof result.totalItems === "number" ? result.totalItems : null;
        const newTotalFetched = startIndex + items.length;

        if (totalItems !== null) {
          setHasMore(newTotalFetched < totalItems);
        } else {
          if (uniqueNewCount === 0) {
            consecutiveEmptyPagesRef.current += 1;
          } else {
            consecutiveEmptyPagesRef.current = 0;
          }

          if (consecutiveEmptyPagesRef.current >= EMPTY_PAGE_THRESHOLD) {
            setHasMore(false);
          } else {
            setHasMore(items.length === PAGE_SIZE || uniqueNewCount > 0);
          }
        }
      } catch (err) {
        console.error("Search error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch books. Please try again."
        );
        fetchedStartIndicesRef.current.delete(startIndex);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [q]
  );

  const handleRetry = () => {
    setError(null);
    setPage(0);
    fetchedStartIndicesRef.current.clear();
    consecutiveEmptyPagesRef.current = 0;
    fetchBooks(0);
  };

  useEffect(() => {
    setBooks([]);
    setPage(0);
    setHasMore(true);
    fetchedStartIndicesRef.current.clear();
    consecutiveEmptyPagesRef.current = 0;
    setError(null);

    if (q) {
      fetchBooks(0);
    }
  }, [q, fetchBooks]);

  useEffect(() => {
    if (page === 0) return;
    fetchBooks(page);
  }, [page, fetchBooks]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting && !loading && !isFetchingRef.current && hasMore) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [loading, hasMore, q]);

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
            className="text-7xl font-bold mb-4"
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
                    href={`/books?q=${encodeURIComponent(cat)}`}
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

        {loading && (
          <motion.div {...FadeUp} {...Animate} className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-2 border-third dark:border-primary"></div>
            <p className="mt-2 text-xl">Loading more...</p>
          </motion.div>
        )}

        <div ref={sentinelRef} className="h-10" />
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
