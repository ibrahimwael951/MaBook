"use client";
import { Animate, FadeLeft, FadeRight } from "@/animation";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { googleBooksApi } from "@/lib/googleBooks";
import { MyBooks } from "@/types/Auth";
import { Book } from "@/types/Books";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Mood options with emojis
const moodOptions = [
  {
    value: "loved",
    label: "❤️ Loved it",
    border: "border-red-500",
    bg: "bg-red-500",
  },
  {
    value: "liked",
    label: "😊 Liked it",
    border: "border-green-500",
    bg: "bg-green-500",
  },
  {
    value: "neutral",
    label: "😐 It was okay",
    border: "border-yellow-500",
    bg: "bg-yellow-500",
  },
  {
    value: "disliked",
    label: "😞 Didn't like it",
    border: "border-orange-500",
    bg: "bg-orange-500",
  },
  {
    value: "hated",
    label: "😡 Hated it",
    border: "border-red-700",
    bg: "bg-red-700",
  },
];

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string>("");
  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [showUpdatePage, setShowUpdatePage] = useState<boolean>(false);
  // New state for user interactions
  const [pagesRead, setPagesRead] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // User's existing book data
  const [userBookData, setUserBookData] = useState<MyBooks | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = () => {
      setLoading(true);
      setError("");

      googleBooksApi
        .get(`/${id}`)
        .then((res) => {
          setBook(res.data);
          api
            .get(`/api/myBooks/${id}`)
            .then((res) => {
              setIsSaved(true);
              setUserBookData(res.data);
              setPagesRead(res.data.progress.currentPage);
              setSelectedMood(res.data.progress.mood);
            })
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
        setUserBookData(null);
        setPagesRead(0);
        setSelectedMood("");
      })
      .catch((err) =>
        toast(err.response?.data?.message || "Failed to delete", {
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

    setSaveLoading(true);
    const bookData = {
      book: {
        BookLink: id,
        url: book.volumeInfo.imageLinks?.thumbnail || "",
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
    if (showUpdatePage) {
      api.patch(`/api/myBooks/${id}`, { ...bookData }).then(() => {
        setShowUpdatePage(false);
        toast("Updated Successfully", {
          classNames: { toast: "!bg-green-600 !text-white" },
        });
      });
    } else {
      api
        .post(`/api/myBooks`, { ...bookData })
        .then((res) => {
          setIsSaved(true);
          setUserBookData(res.data);
          toast("Your New Book Saved successfully", {
            closeButton: true,
            classNames: {
              toast: "!bg-green-600 !text-white",
            },
          });
        })
        .catch((err) => {
          toast(err.response?.data?.message || "Failed to save book", {
            classNames: {
              toast: "!bg-red-600 !text-white",
            },
          });
        })
        .finally(() => setSaveLoading(false));
    }
  };

  // Handle pages read input
  const handlePagesReadChange = (value: string) => {
    const pages = parseInt(value, 10);
    if (isNaN(pages) || pages < 0) {
      setPagesRead(0);
      return;
    }
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
          {error && <p className="text-red-500 mt-2">Error: {error}</p>}
        </div>
      </section>
    );
  }

  const { title, description, pageCount, imageLinks } = book.volumeInfo;
  const bookImage = imageLinks?.thumbnail;
  const progressPercentage = getProgressPercentage();

  return (
    <section className="max-w-4xl min-h-screen mt-32 mx-auto flex flex-col lg:flex-row gap-5 justify-center items-start px-4 pb-10">
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
          <div className="w-64 h-96 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
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

        <motion.div
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
          <p
            className="leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: description?.slice(0, 200) + ".....",
            }}
          />
        </motion.div>

        {/* Show current progress if book is saved */}
        {isSaved && userBookData && (
          <motion.div
            {...FadeRight}
            animate={{
              ...Animate.animatenly,
              transition: {
                duration: Animate.transition.duration,
                delay: 0.45,
              },
            }}
            className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📖 Your Current Progress
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-blue-700 dark:text-blue-300">
                <span>Progress</span>
                <span>{userBookData.progress?.percentage || 0}%</span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-950 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${userBookData.progress?.percentage || 0}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-blue-700 dark:text-blue-300">
                <span>
                  Pages: {userBookData.progress?.currentPage || 0}/{pageCount}
                </span>
                {userBookData.rate?.mood && (
                  <span>
                    Mood:{" "}
                    {
                      moodOptions.find(
                        (m) => m.value === userBookData.rate.mood
                      )?.label
                    }
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
        <AnimatePresence>
          {(!isSaved || showUpdatePage) && (
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
                className="space-y-4 p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-third"
              >
                <h1 className="text-2xl font-semibold">
                  📖 Reading <span className="text-blue-600">Progress</span>
                </h1>

                {/* Pages Read Input */}
                <div className="space-y-2">
                  <label htmlFor="pagesRead" className="defaultLabel">
                    Pages Read:
                  </label>
                  <input
                    type="number"
                    id="pagesRead"
                    min="0"
                    max={pageCount || 1000}
                    value={pagesRead || ""}
                    onChange={(e) => handlePagesReadChange(e.target.value)}
                    className="w-full defaultInput"
                    placeholder="Enter pages read"
                  />
                </div>

                {/* Progress Bar */}
                {pageCount && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Progress</span>
                      <span className="font-semibold">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-secondaryHigh h-4 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                        style={{ width: `${progressPercentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white bg-opacity-20 animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {pagesRead} of {pageCount} pages • {pageCount - pagesRead}{" "}
                      remaining
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
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-third"
              >
                <h3 className="text-xl font-semibold mb-4">
                  💭 My <span className="text-purple-600">Mood</span> About This
                  Book
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => {
                        setSelectedMood(mood.value);
                      }}
                      className={`p-4 rounded-xl font-medium shadow-md hover:shadow-lg duration-100 
                        ${` border-2   ${mood.border}  `}
                        ${
                          selectedMood === mood.value &&
                          ` ${mood.bg} text-white ring-4 ring-offset-2 ring-gray-300`
                        }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Action Buttons */}
        <div className="space-y-4">
          <AnimatePresence>
            {isSaved ? (
              !showUpdatePage ? (
                <>
                  <motion.div
                    {...FadeRight}
                    animate={{
                      ...Animate.animatenly,
                      transition: {
                        duration: Animate.transition.duration,
                        delay: 0.75,
                      },
                    }}
                  >
                    <Button
                      NoAnimate
                      variant="third"
                      className="w-full text-lg"
                      onClick={() => setShowUpdatePage((prev) => !prev)}
                    >
                      ✏️ Update Progress
                    </Button>
                  </motion.div>

                  <motion.div
                    {...FadeRight}
                    animate={{
                      ...Animate.animatenly,
                      transition: {
                        duration: Animate.transition.duration,
                        delay: 0.7,
                      },
                    }}
                  >
                    <Link href={`/my-books/`}>
                      <Button
                        NoAnimate
                        variant="secondary"
                        className="w-full text-lg"
                      >
                        📚 My Books
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    {...FadeRight}
                    animate={{
                      ...Animate.animatenly,
                      transition: {
                        duration: Animate.transition.duration,
                        delay: 0.8,
                      },
                    }}
                    onClick={() =>
                      toast("⚠️ Are you sure you want to delete this book?", {
                        closeButton: true,
                        duration: 5000,
                        classNames: {
                          toast: "!bg-red-600 !text-white",
                          actionButton:
                            "bg-white !text-red-600 px-4 py-2 rounded-md font-semibold",
                        },
                        action: {
                          label: "Delete",
                          onClick: DeleteHandler,
                        },
                      })
                    }
                  >
                    <Button
                      NoAnimate
                      variant="secondary"
                      disabled={deleteLoading}
                      className="bg-red-600 hover:bg-red-700 hover:border-red-600 dark:hover:!text-white hover:ring-red-600 focus:ring-red-600 w-full text-lg text-white"
                    >
                      {deleteLoading
                        ? "🗑️ Deleting..."
                        : "🗑️ Delete from Shelf"}
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    {...FadeRight}
                    animate={{
                      ...Animate.animatenly,
                      transition: {
                        duration: Animate.transition.duration,
                        delay: 0.7,
                      },
                    }}
                  >
                    <Button
                      NoAnimate
                      onClick={saveBookData}
                      disabled={saveLoading}
                      variant="secondary"
                      className="w-full text-lg relative"
                    >
                      {saveLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        "📚 Update Book"
                      )}
                    </Button>
                  </motion.div>
                  <motion.div
                    {...FadeRight}
                    animate={{
                      ...Animate.animatenly,
                      transition: {
                        duration: Animate.transition.duration,
                        delay: 0.7,
                      },
                    }}
                  >
                    <Button
                      NoAnimate
                      onClick={() => setShowUpdatePage(false)}
                      disabled={saveLoading}
                      variant="secondary"
                      className="w-full text-lg relative"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </>
              )
            ) : (
              <motion.div
                {...FadeRight}
                animate={{
                  ...Animate.animatenly,
                  transition: {
                    duration: Animate.transition.duration,
                    delay: 0.7,
                  },
                }}
              >
                <Button
                  NoAnimate
                  onClick={saveBookData}
                  disabled={saveLoading}
                  variant="secondary"
                  className="w-full text-lg relative"
                >
                  {saveLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    "📚 Save Book to My Shelf"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Summary Card - Only show when adding new book */}
        {!isSaved && (pagesRead > 0 || selectedMood) && (
          <motion.div
            {...FadeRight}
            animate={{
              ...Animate.animatenly,
              transition: {
                duration: Animate.transition.duration,
                delay: 0.8,
              },
            }}
            className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
          >
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 text-xl flex items-center gap-2">
              📊 Preview Summary
            </h4>
            <div className="space-y-3">
              {pagesRead > 0 && (
                <div className="flex items-center gap-3 text-blue-800 dark:text-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="font-medium">
                    Read{" "}
                    <span className="font-bold text-blue-900 dark:text-blue-100">
                      {pagesRead}
                    </span>{" "}
                    pages ({progressPercentage.toFixed(1)}% complete)
                  </p>
                </div>
              )}
              {selectedMood && (
                <div className="flex items-center gap-3 font-semibold text-purple-800 dark:text-purple-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="font-medium">
                    Mood:{" "}
                    <span className="font-bold text-purple-900 dark:text-purple-100">
                      {moodOptions.find((m) => m.value === selectedMood)?.label}
                    </span>
                  </p>
                </div>
              )}
              {progressPercentage === 100 && (
                <div className="flex items-center gap-3 !text-white bg-green-600 p-3 rounded-lg">
                  <span className="text-2xl">🎉</span>
                  <p className="font-bold">
                    Congratulations! You’ve finished this book!
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
