"use client";
import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Star,
  Calendar,
  Globe,
  ShoppingCart,
  Heart,
  ExternalLink,
  Download,
  Share2,
  BookText,
  User,
  AlertCircle,
  Tag,
} from "lucide-react";
import { motion } from "framer-motion";
import { Book } from "@/types/Books";
import Loading from "@/components/Loading";
import { googleBooksApi } from "@/lib/googleBooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Animate, FadeLeft, FadeRight } from "@/animation";
import { useDetectLanguage } from "@/hooks/Language";
import { useAuth } from "@/contexts/AuthContext";
import { SimpleAnimatedImage } from "@/components/ui/AnimatedImage";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  const { user } = useAuth();
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string>("");

  // resolve the dir
  const text = book?.volumeInfo.description || "";
  const descriptionLang = useDetectLanguage(text);

  function ProtectLinks(item: string) {
    return user ? item : "/login";
  }

  // Resolve params and set id
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch book data when id is available
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      setError("");

      googleBooksApi
        .get(`/${id}`)
        .then((res) => setBook(res.data))
        .catch((err) => setError(err.message || "Failed to fetch book details"))
        .finally(() => setLoading(false));
    };

    fetchBook();
  }, [id]);

  if (loading) return <Loading />;

  if (!book) {
    return (
      <section className="min-h-screen flex justify-center items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white dark:bg-third rounded-2xl shadow-xl p-8 text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              No Book Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The requested book could not be found in our database.
            </p>
            <Link href="/books" className="">
              <Button variant="secondary">Browse All Books</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex justify-center items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="bg-white dark:bg-third rounded-2xl shadow-xl p-8 text-center">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Oops! Something went wrong
            </h1>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              className="mx-auto w-fit"
            >
              Try Again
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  const {
    title,
    authors = [],
    publisher,
    publishedDate,
    description,
    pageCount,
    categories = [],
    averageRating,
    ratingsCount,
    language,
    infoLink,
  } = book.volumeInfo;

  const bookImage =
    book.volumeInfo.imageLinks?.extraLarge ||
    book.volumeInfo.imageLinks?.large ||
    book.volumeInfo.imageLinks?.medium ||
    book.volumeInfo.imageLinks?.thumbnail ||
    book.volumeInfo.imageLinks?.smallThumbnail ||
    "/No image found.png";

  return (
    <main className="min-h-screen mt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden  ">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Book Cover Section */}
            <motion.div
              {...FadeLeft}
              {...Animate}
              className="lg:col-span-1 max-w-xl mx-auto lg:mx-0"
            >
              <div className="bg-white dark:bg-third rounded-2xl shadow-2xl p-6 sticky top-24">
                <div className="relative group">
                  <SimpleAnimatedImage
                    src={bookImage.replace("http://", "https://")}
                    alt={`Cover of ${title}`}
                    width={1000}
                    height={1000}
                    noAnimate={false}
                    className="relative rounded-xl shadow-lg w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Quick Stats */}
                <div className="mt-6 space-y-3">
                  {averageRating && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                          {averageRating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {ratingsCount?.toLocaleString()} reviews
                      </span>
                    </div>
                  )}

                  {pageCount && (
                    <div className="flex items-center justify-between p-3 bg-secondary/10 dark:bg-secondary/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-secondary" />
                        <span className="font-semibold text-secondary">
                          {pageCount.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        pages
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Book Information Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Author */}
              <div className="space-y-4">
                <motion.h1
                  {...FadeRight}
                  {...Animate}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-gray-100"
                >
                  {title}
                </motion.h1>

                {authors.length > 0 && (
                  <motion.div
                    {...FadeRight}
                    {...Animate}
                    className="flex items-center gap-2 text-xl text-gray-600 dark:text-gray-400"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">by {authors.join(", ")}</span>
                  </motion.div>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                  <motion.div
                    {...FadeRight}
                    {...Animate}
                    className="flex flex-wrap gap-2"
                  >
                    {categories.slice(0, 3).map((category, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-secondary/20 to-secondaryHigh/20 text-secondary border border-secondary/30"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        {category}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Rating Stars */}
                {averageRating && (
                  <motion.div
                    className="flex items-center gap-3"
                    {...FadeRight}
                    {...Animate}
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        >
                          <Star
                            className={`w-6 h-6 ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                      {averageRating} out of 5
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Book Details Grid */}
              <motion.div
                {...FadeLeft}
                animate={{
                  ...Animate.animatenly,
                  transition: {
                    duration: Animate.transition.duration,
                    delay: 0.3,
                  },
                }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
              >
                {publisher && (
                  <div className="bg-white dark:bg-third border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      Publisher
                    </div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {publisher}
                    </div>
                  </div>
                )}
                {publishedDate && (
                  <div className="bg-white dark:bg-third border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Published
                    </div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {publishedDate}
                    </div>
                  </div>
                )}
                {pageCount && (
                  <div className="bg-white dark:bg-third border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      Pages
                    </div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {pageCount.toLocaleString()}
                    </div>
                  </div>
                )}
                {language && (
                  <div className="bg-white dark:bg-third border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Globe className="w-4 h-4" />
                      Language
                    </div>
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {language.toUpperCase()}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                {...FadeLeft}
                animate={{
                  ...Animate.animatenly,
                  transition: {
                    duration: Animate.transition.duration,
                    delay: 0.4,
                  },
                }}
                className="flex flex-wrap gap-3"
              >
                {book.saleInfo?.buyLink && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={`${ProtectLinks(book.saleInfo.buyLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px]"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Book
                    </Button>
                  </motion.a>
                )}

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 min-w-[200px]"
                >
                  <Link
                    href={`${ProtectLinks(`/my-books/b/${id}`)}`}
                    className="block"
                  >
                    <Button variant="third" className="w-full" NoAnimate>
                      <Heart className="w-4 h-4 mr-2" />
                      Add to Library
                    </Button>
                  </Link>
                </motion.div>

                {infoLink && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={`${ProtectLinks(infoLink)}`}>
                      <Button NoAnimate variant="third">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        More Info
                      </Button>
                    </Link>
                  </motion.div>
                )}

                {book.accessInfo?.webReaderLink && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`${ProtectLinks(book.accessInfo?.webReaderLink)}`}
                    >
                      <Button NoAnimate variant="third">
                        <BookText className="w-4 h-4 mr-2" />
                        Read Online
                      </Button>
                    </Link>
                  </motion.div>
                )}

                {book.accessInfo?.pdf.acsTokenLink && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={`${ProtectLinks(
                        book.accessInfo?.pdf.acsTokenLink
                      )}`}
                    >
                      <Button variant="third" NoAnimate>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </Link>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {description && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            {...FadeLeft}
            animate={{
              ...Animate.animatenly,
              transition: {
                duration: Animate.transition.duration,
                delay: 0.5,
              },
            }}
            className="bg-white dark:bg-third rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 p-8 lg:p-10"
          >
            <h3 className="text-3xl font-bold mb-6 flex items-center text-gray-900 dark:text-gray-100">
              <BookOpen className="w-7 h-7 mr-3 text-secondary" />
              About This Book
            </h3>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div
                className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg"
                dir={descriptionLang === "ar" ? "rtl" : "ltr"}
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
