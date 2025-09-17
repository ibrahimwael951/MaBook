"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Book } from "@/types/Books";
import {
  Star,
  Calendar,
  BookOpen,
  Globe,
  ShoppingCart,
  ExternalLink,
  Heart,
  Share2,
  Download,
  BookText,
  UserPen,
} from "lucide-react";

import Loading from "@/components/Loading";
import { googleBooksApi } from "@/lib/googleBooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Animate, FadeLeft, FadeRight } from "@/animation";
import { useDetectLanguage } from "@/hooks/Language";
import { useAuth } from "@/contexts/AuthContext";

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
      <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            No Book Found
          </h1>
          <p className="text-gray-600">
            The requested book could not be found.
          </p>
        </motion.div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-50 to-red-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <div className="w-24 h-24 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-red-600">{error}</p>
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
      {/* Hero Section with Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0  " />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Book Cover Section */}
            <motion.div
              {...FadeLeft}
              {...Animate}
              className="lg:col-span-1 flex justify-center"
            >
              <div className="relative group">
                <div className="relative">
                  <div className="absolute rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <Image
                    src={bookImage}
                    alt={`Cover of ${title}`}
                    width={1000}
                    height={1000}
                    draggable={false}
                    quality={85}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="/placeholder-book.webp"
                    className="relative rounded-2xl shadow-2xl max-w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                  />
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
                  className="text-4xl sm:text-5xl font-bold leading-tight"
                >
                  {title}
                </motion.h1>

                {authors.length > 0 && (
                  <motion.p
                    {...FadeRight}
                    {...Animate}
                    className="text-xl text-gray-600 font-medium"
                  >
                    by {authors.join(", ")}
                  </motion.p>
                )}

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 3).map((category, index) => (
                      <motion.span
                        key={index}
                        {...FadeRight}
                        animate={{
                          ...Animate.animatenly,
                          transition: {
                            duration: Animate.transition.duration,
                            delay: index * 0.1,
                          },
                        }}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 !text-third border border-blue-200"
                      >
                        {category}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Rating */}
                {averageRating && (
                  <motion.div
                    className="flex items-center space-x-2"
                    {...FadeRight}
                    {...Animate}
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              i < Math.floor(averageRating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {averageRating} ({ratingsCount?.toLocaleString()} reviews)
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
                className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {publisher && (
                  <div className="border border-secondary backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <div className=" text-sm font-medium mb-1 flex items-center">
                      <UserPen className="w-4 h-4 mr-1" />
                      Publisher
                    </div>
                    <div className="font-semibold text-sm">{publisher}</div>
                  </div>
                )}
                {publishedDate && (
                  <div className="border border-secondary backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <div className=" text-sm font-medium mb-1 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Published
                    </div>
                    <div className="font-semibold text-sm">{publishedDate}</div>
                  </div>
                )}
                {pageCount && (
                  <div className="border border-secondary backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <div className=" text-sm font-medium mb-1 flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      Pages
                    </div>
                    <div className="font-semibold text-sm">
                      {pageCount.toLocaleString()}
                    </div>
                  </div>
                )}
                {language && (
                  <div className="border border-secondary backdrop-blur-sm rounded-xl p-4 shadow-sm">
                    <div className=" text-sm font-medium mb-1 flex items-center">
                      <Globe className="w-4 h-4 mr-1" />
                      Language
                    </div>
                    <div className="font-semibold text-sm">
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
                  <a
                    href={`${ProtectLinks(book.saleInfo.buyLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-fit"
                  >
                    <Button className="w-full bg-green-600 text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Book
                    </Button>
                  </a>
                )}

                <Link
                  href={`${ProtectLinks(`/my-books/b/${id}`)}`}
                  className="flex-1 min-w-fit"
                >
                  <Button variant="third" className="w-full" NoAnimate>
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Library
                  </Button>
                </Link>

                {infoLink && (
                  <Link
                    href={`${ProtectLinks(infoLink)}`}
                    className="flex-1 min-w-fit"
                  >
                    <Button NoAnimate variant="third" className="w-full">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      More Info
                    </Button>
                  </Link>
                )}

                {book.accessInfo?.webReaderLink && (
                  <Link
                    href={`${ProtectLinks(book.accessInfo?.webReaderLink)}`}
                    className="flex-1 min-w-fit"
                  >
                    <Button NoAnimate variant="third" className="w-full">
                      <BookText className="w-4 h-4 mr-2" />
                      Read Online
                    </Button>
                  </Link>
                )}

                {book.accessInfo?.pdf.acsTokenLink && (
                  <Link
                    href={`${ProtectLinks(book.accessInfo?.pdf.acsTokenLink)}`}
                    className="flex-1 min-w-fit"
                  >
                    <Button variant="third" NoAnimate className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </Link>
                )}

                <Button className="bg-white/80 text-gray-700 border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 px-4">
                  <Share2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      {description && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div
            {...FadeLeft}
            animate={{
              ...Animate.animatenly,
              transition: {
                duration: Animate.transition.duration,
                delay: 0.5,
              },
            }}
            className="border border-secondary rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 " />
              About This Book
            </h3>
            <div className="leading-relaxed">
              <div
                className="!text-white text-xl"
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
