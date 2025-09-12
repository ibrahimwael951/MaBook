"use client";
import { Animate, FadeLeft, FadeRight } from "@/animation";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { googleBooksApi } from "@/lib/googleBooks";
import { Book } from "@/types/Books";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Mood options with emojis
const moodOptions = [
  { value: "loved", label: "❤️ Loved it", color: "bg-red-500" },
  { value: "liked", label: "😊 Liked it", color: "bg-green-500" },
  { value: "neutral", label: "😐 It was okay", color: "bg-yellow-500" },
  { value: "disliked", label: "😞 Didn't like it", color: "bg-orange-500" },
  { value: "hated", label: "😡 Hated it", color: "bg-red-700" },
];

export default function page() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string>("");

  // New state for user interactions
  const [pagesRead, setPagesRead] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const [showMoodSelector, setShowMoodSelector] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      setError("");

      googleBooksApi
        .get(`/${id}`)
        .then((res) => {
          setBook(res.data);
          api
            .get(`/api/myBooks/${id}/isSaved`)
            .then(() => setIsSaved(true))
            .catch(() => setIsSaved(false));
        })
        .catch((err) => setError(err.message || "Failed to fetch book details"))
        .finally(() => setLoading(false));
    };

    fetchBook();
  }, [id]);

  const DeleteHandler = () => {
    setDeleteLoading(true);
    api
      .delete(`/api/myBooks/${id}`)
      .then(() => {
        toast("Deleted successfully", {
          classNames: {
            toast: "!bg-green-600 !text-white",
          },
        });
        setIsSaved(false);
      })
      .catch((err) =>
        toast(err.response.data.message, {
          closeButton: true,
          classNames: {
            toast: "!bg-red-600 !text-white",
          },
        })
      )
      .finally(() => setDeleteLoading(false));
  };
  // Save book progress and data
  const saveBookData = () => {
    if (!book || !id) return;

    const bookData = {
      book: {
        BookLink: id,
        url: imageLinks?.thumbnail || "",
        title: book.volumeInfo.title,
        totalPages: book.volumeInfo.pageCount || 0,
      },
      progress: {
        percentage: progressPercentage.toFixed(1),
        currentPage: pagesRead,
      },
      rate: {
        mood: selectedMood,
        comment: "",
      },
    };
    api
      .post(`/api/myBooks`, { ...bookData })
      .then((res) => {
        console.log(res.data);
        setIsSaved(true);
        toast("Your New Book Saved successfully", {
          closeButton: true,
          classNames: {
            toast: "!bg-green-600 !text-white",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        console.log(err.response.data.message);
        toast(err.response.data.message, {
          classNames: {
            toast: "!bg-red-600 !text-white",
          },
        });
      });
  };

  // Handle pages read input
  const handlePagesReadChange = (value: string) => {
    const pages = parseInt(value) || 0;
    const maxPages = book?.volumeInfo.pageCount || 1000;
    setPagesRead(Math.min(pages, maxPages));
  };

  // Calculate reading progress percentage
  const getProgressPercentage = () => {
    if (!book?.volumeInfo.pageCount) return 0;
    return Math.min((pagesRead / book.volumeInfo.pageCount) * 100, 100);
  };

  if (loading) return <Loading />;
  if (!book) {
    return (
      <section className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-600">No Book Found</h1>
          <p className="text-gray-500 mt-4">
            The requested book could not be found.
          </p>
          <p>error : {error}</p>
        </div>
      </section>
    );
  }

  const { title, description, pageCount, imageLinks } = book.volumeInfo;
  const bookImage = imageLinks?.thumbnail;
  const progressPercentage = getProgressPercentage();

  return (
    <section className="max-w-4xl min-h-screen mt-32 mx-auto flex flex-col lg:flex-row gap-5 justify-center items-start px-4">
      <motion.div {...Animate} {...FadeLeft} className="w-full lg:w-2/4 ">
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
          <div className="w-64 h-96   rounded-lg flex items-center justify-center mx-auto">
            <span className="text-sm">No Cover Available</span>
          </div>
        )}
      </motion.div>

      <div className="w-full lg:w-2/4 space-y-6">
        <motion.h1
          {...FadeRight}
          animate={{
            ...Animate.animatenly,
            transition: {
              duration: Animate.transition.duration,
              delay: 0.2,
            },
          }}
          className="text-3xl lg:text-5xl font-bold mb-2"
        >
          {title}
        </motion.h1>

        <motion.p
          {...FadeRight}
          animate={{
            ...Animate.animatenly,
            transition: {
              duration: Animate.transition.duration,
              delay: 0.3,
            },
          }}
          className=""
        >
          {description?.slice(0, 200) + "....."}
        </motion.p>

        {pageCount && (
          <motion.p
            {...FadeRight}
            animate={{
              ...Animate.animatenly,
              transition: {
                duration: Animate.transition.duration,
                delay: 0.4,
              },
            }}
            className="text-2xl bg-secondaryHigh !text-white w-fit rounded-2xl p-2"
          >
            <span className="font-medium !text-white">Total Pages:</span>{" "}
            {pageCount}
          </motion.p>
        )}

        {!isSaved && (
          <>
            {/* Reading Progress Section */}
            <motion.div
              {...FadeRight}
              animate={{
                ...Animate.animatenly,
                transition: {
                  duration: Animate.transition.duration,
                  delay: 0.5,
                },
              }}
              className="space-y-4   p-6 rounded-lg"
            >
              <h1 className="text-2xl font-semibold">
                Reading <span> Progress </span>
              </h1>

              {/* Pages Read Input */}
              <div className="space-y-2">
                <label htmlFor="pagesRead" className="defaultLabel">
                  Pages Read:
                </label>
                <input
                  type="number"
                  id="pagesRead"
                  max={pageCount || 1000}
                  value={pagesRead}
                  onChange={(e) => handlePagesReadChange(e.target.value)}
                  className="w-full defaultInput"
                  placeholder="Enter pages read"
                />
              </div>

              {/* Progress Bar */}
              {pageCount && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full   rounded-full h-4">
                    <div
                      className="bg-secondaryHigh h-4 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="">
                    {pagesRead} of {pageCount} pages ({pageCount - pagesRead}{" "}
                    pages remaining)
                  </p>
                </div>
              )}
            </motion.div>

            {/* Mood Rating Section */}
            <motion.div
              {...FadeRight}
              animate={{
                ...Animate.animatenly,
                transition: {
                  duration: Animate.transition.duration,
                  delay: 0.6,
                },
              }}
              className=" p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold  ">
                My <span> Mood </span> About This Book
              </h3>

              <Button
                variant="secondary"
                onClick={() => setShowMoodSelector(!showMoodSelector)}
                className="w-full text-2xl my-2"
              >
                {selectedMood
                  ? `Selected: ${
                      moodOptions.find((m) => m.value === selectedMood)?.label
                    }`
                  : "Select Your Mood"}
              </Button>

              {showMoodSelector && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => {
                        setSelectedMood(mood.value);
                        setShowMoodSelector(false);
                      }}
                      className={`p-3 rounded-lg text-white transition-all ${
                        selectedMood === mood.value
                          ? `${mood.color} ring-2 ring-offset-2 ring-gray-400`
                          : `${mood.color} hover:opacity-90`
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
        <div className="space-y-5">
          {isSaved ? (
            <>
              <motion.div
                {...FadeRight}
                animate={{
                  ...Animate.animatenly,
                  transition: {
                    duration: Animate.transition.duration,
                    delay: 0.4,
                  },
                }}
                className={`w-full font-semibold`}
              >
                <Link href={`/my-books/`}>
                  <Button
                    NoAnimate
                    variant="secondary"
                    className="w-full text-lg"
                  >
                    My Books
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                {...FadeRight}
                animate={{
                  ...Animate.animatenly,
                  transition: {
                    duration: Animate.transition.duration,
                    delay: 0.4,
                  },
                }}
                className={`w-full font-semibold`}
              >
                <Link href={`/my-books/b/${id}/update`}>
                  <Button
                    NoAnimate
                    variant="third"
                    className="w-full text-lg"
                  >
                    Update
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                {...FadeRight}
                animate={{
                  ...Animate.animatenly,
                  transition: {
                    duration: Animate.transition.duration,
                    delay: 0.4,
                  },
                }}
                onClick={() =>
                  toast("Are you sure ?", {
                    closeButton: true,
                    classNames: {
                      toast: "!bg-red-600 text-3xl !text-white",
                      actionButton:
                        "bg-white text-red-600 px-2 py-1 rounded-md",
                    },
                    action: {
                      label: "delete",
                      onClick: DeleteHandler,
                    },
                  })
                }
                className={`w-full font-semibold`}
              >
                <Button
                  NoAnimate
                  variant="secondary"
                  className="bg-red-600 hover:border hover:!border-red-600 dark:hover:!text-white hover:ring hover:!ring-red-600 focus:ring focus:ring-red-600 w-full text-lg"
                >
                  {deleteLoading ? "Deleting...." : " Delete"}
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div
              {...FadeRight}
              animate={{
                ...Animate.animatenly,
                transition: {
                  duration: Animate.transition.duration,
                  delay: isSaved ? 0.5 : 0.7,
                },
              }}
              onClick={saveBookData}
              className={`w-full font-semibold`}
            >
              <Button
                NoAnimate
                disabled={isSaved ? true : false}
                variant="secondary"
                className="w-full text-lg"
              >
                {isSaved ? "✓ Saved to My Shelf" : "📚 Save Book to My Shelf"}
              </Button>
            </motion.div>
          )}

          {/* Save Button */}
        </div>
        {/* Summary Card */}
        {(pagesRead > 0 || selectedMood) && (
          <motion.div
            {...FadeRight}
            animate={{
              ...Animate.animatenly,
              transition: {
                duration: Animate.transition.duration,
                delay: 0.8,
              },
            }}
            className="  p-6 rounded-2xl border   shadow-md"
          >
            <h4 className="font-bold text-blue-900 mb-4 text-xl flex items-center gap-2">
              📊 Reading Summary
            </h4>
            <div className="space-y-3">
              {pagesRead > 0 && (
                <div className="flex items-center gap-3 text-blue-800">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="font-medium">
                    Read{" "}
                    <span className="font-bold text-blue-900">{pagesRead}</span>{" "}
                    pages ({progressPercentage.toFixed(1)}% complete)
                  </p>
                </div>
              )}
              {selectedMood && (
                <div className="flex items-center gap-3 font-semibold">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="font-medium">
                    Mood:{" "}
                    <span className="font-bold text-purple-900">
                      {moodOptions.find((m) => m.value === selectedMood)?.label}
                    </span>
                  </p>
                </div>
              )}
              {progressPercentage === 100 && (
                <div className="flex items-center gap-3 !text-green-100 bg-green-600 p-3 rounded-lg">
                  <span className="text-2xl">🎉</span>
                  <p className="font-bold">
                    Congratulations! You've finished this book!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
