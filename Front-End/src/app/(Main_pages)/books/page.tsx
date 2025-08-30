"use client";
import { useEffect, useState, Suspense } from "react";
import { Book, GoogleBooksResponse } from "@/types/Books";
import { motion, AnimatePresence } from "framer-motion";
import { searchBooks } from "@/lib/googleBooks";
import SearchBar from "@/components/Books/SearchBar";
import BookCard from "@/components/Books/BookCard";

import Loading from "@/components/Loading";

import { FadeDown, FadeLeft, FadeUp, Animate } from "@/animation";
import { useRouter, useSearchParams } from "next/navigation";

function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const searchString = searchParams ? searchParams.toString() : "";

  const handleSearch = async (query: string) => {
    const params = query.includes("=")
      ? query
      : `q=${encodeURIComponent(query)}`;

    router.push(`/books?${params}`);
  };

  useEffect(() => {
    if (!searchString) {
      setBooks([]);
      setError(null);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const result: GoogleBooksResponse = await searchBooks(searchString, 20);

        if (!mounted) return;
        setBooks(result.items || []);
      } catch (err) {
        if (!mounted) return;
        setError("Failed to search books. Please try again.");
        console.error("Search error:", err);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [searchString]);

  return (
    <div className="min-h-screen mt-20">
      <div className=" mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <motion.h1
            {...FadeUp}
            {...Animate}
            className="text-7xl font-bold  mb-4"
          >
            Book <span> Search </span>
          </motion.h1>
          <motion.p
            {...FadeDown}
            {...Animate}
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
              {...Animate}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div {...FadeUp} {...Animate} className="text-center py-8">
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

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Home />
    </Suspense>
  );
}
