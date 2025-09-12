"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Book } from "@/types/Books";

import Loading from "@/components/Loading";
import { googleBooksApi } from "@/lib/googleBooks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Animate, FadeLeft, FadeRight } from "@/animation";

interface BookDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function BookDetailsPage({ params }: BookDetailsPageProps) {
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string>("");

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
      <section className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-600">No Book Found</h1>
          <p className="text-gray-500 mt-4">
            The requested book could not be found.
          </p>
        </div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
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
    imageLinks,
  } = book.volumeInfo;

  const bookImage = imageLinks?.thumbnail;

  return (
    <main className="mt-12 flex justify-center items-center">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className=" rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Book Cover */}
            <motion.div
              {...FadeLeft}
              {...Animate}
              className="md:w-1/3 lg:w-1/4 p-6 "
            >
              {bookImage ? (
                <Image
                  src={bookImage}
                  alt={`Cover of ${title}`}
                  width={300}
                  height={400}
                  draggable={false}
                  className="rounded-lg shadow-md max-w-full h-auto mx-auto"
                  priority
                />
              ) : (
                <div className="w-64 h-96  rounded-lg flex items-center justify-center mx-auto">
                  <span className=" text-sm">No Cover Available</span>
                </div>
              )}
            </motion.div>

            {/* Book Details */}
            <div className="md:w-2/3 lg:w-3/4 p-6">
              <div className="mb-6">
                <motion.h1
                  {...FadeRight}
                  {...Animate}
                  className="text-3xl font-bold  mb-2"
                >
                  {title}
                </motion.h1>

                {authors.length > 0 && (
                  <motion.p
                    {...FadeRight}
                    {...Animate}
                    className="text-xl  mb-2"
                  >
                    by {authors.join(", ")}
                  </motion.p>
                )}

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category, index) => (
                      <motion.span
                        key={index}
                        {...FadeRight}
                        {...Animate}
                        className="inline-block bg-blue-100 !text-blue-950 text-sm px-3 py-1 rounded-full"
                      >
                        {category}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Rating */}
                {averageRating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <motion.svg
                          key={i}
                          {...FadeLeft}
                          animate={{
                            ...Animate.animatenly,
                            transition: {
                              duration: Animate.transition.duration,
                              delay: 0.1,
                            },
                          }}
                          className={`w-5 h-5 ${
                            i < Math.floor(averageRating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </motion.svg>
                      ))}
                    </div>
                    <motion.span
                      {...FadeLeft}
                      animate={{
                        ...Animate.animatenly,
                        transition: {
                          duration: Animate.transition.duration,
                          delay: 0.2,
                        },
                      }}
                      className="ml-2 text-sm  "
                    >
                      {averageRating} ({ratingsCount} reviews)
                    </motion.span>
                  </div>
                )}
              </div>

              {/* Book Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <motion.h3
                    {...FadeLeft}
                    animate={{
                      ...Animate.animatenly,
                      transition: {
                        duration: Animate.transition.duration,
                        delay: 0.3,
                      },
                    }}
                    className="text-lg font-semibold   mb-3"
                  >
                    Book Information
                  </motion.h3>
                  <motion.div
                    {...FadeLeft}
                    animate={{
                      ...Animate.animatenly,
                      transition: {
                        duration: Animate.transition.duration,
                        delay: 0.4,
                      },
                    }}
                    className="space-y-2  "
                  >
                    {publisher && (
                      <p>
                        <span className="font-medium">Publisher:</span>{" "}
                        {publisher}
                      </p>
                    )}
                    {publishedDate && (
                      <p>
                        <span className="font-medium">Published:</span>{" "}
                        {publishedDate}
                      </p>
                    )}
                    {pageCount && (
                      <p>
                        <span className="font-medium">Pages:</span> {pageCount}
                      </p>
                    )}
                    {language && (
                      <p>
                        <span className="font-medium">Language:</span>{" "}
                        {language.toUpperCase()}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Actions */}
                <motion.div {...FadeLeft} {...Animate}>
                  <h3 className="text-lg font-semibold  mb-3">Actions</h3>
                  <div className="flex  items-center gap-5">
                    {book.saleInfo?.buyLink && (
                      <a
                        href={book.saleInfo.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="third">Buy Book</Button>
                      </a>
                    )}
                    <Link href={`/my-books/b/${id}`}>
                      <Button NoAnimate variant="secondary">
                        Add to My Books
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Description */}
              {description && (
                <motion.div
                  {...FadeLeft}
                  animate={{
                    ...Animate.animatenly,
                    transition: {
                      duration: Animate.transition.duration,
                      delay: 0.4,
                    },
                  }}
                >
                  <h3 className="text-lg font-semibold   mb-3">Description</h3>
                  <p
                    className="  leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
