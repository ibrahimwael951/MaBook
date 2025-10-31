"use client";
import { motion } from "framer-motion";
import { Star, Calendar, BookOpen, Tag } from "lucide-react";
import { Book } from "@/types/Books";
import { opacity, ViewPort } from "@/animation";
import Link from "next/link";
import { SimpleAnimatedImage } from "../ui/AnimatedImage";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { volumeInfo } = book;
  const img = book.volumeInfo.imageLinks?.thumbnail || "/No image found.png";

  return (
    <Link href={`/books/${book.id}`} className="w-full overflow-hid den">
      <motion.div
        {...opacity}
        viewport={{
          amount: ViewPort.viewport.amount,
        }}
        whileInView={{
          ...ViewPort.whileInView,
          transition: { duration: 0.172 },
        }}
        whileHover={{ scale: 1.02, y: -4 }}
        className=" min-h-64 h-full flex gap-5 rounded-2xl p-5 border-2 dark:border-primary/30 border-third/30 hover:border-secondary dark:hover:border-secondary cursor-pointer bg-white dark:bg-third shadow-md hover:shadow-xl transition-all duration-300"
      >
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <div className="relative h-full w-36 group">
            <SimpleAnimatedImage
              src={img.replace("http://", "https://")}
              alt={volumeInfo.title || "Book cover"}
              noAnimate
              className="rounded-lg object-cover h-full w-full shadow-lg ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-secondary transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          {/* Title and Published Date */}
          <div className="space-y-3">
            <h3 className="font-bold text-xl line-clamp-2 text-gray-900 dark:text-gray-100 leading-tight">
              {volumeInfo.title}
            </h3>

            {volumeInfo.authors && volumeInfo.authors.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                by {volumeInfo.authors.join(", ")}
              </p>
            )}

            {volumeInfo.publishedDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published {volumeInfo.publishedDate}</span>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
              {volumeInfo.description
                ? volumeInfo.description.replace(/<[^>]*>/g, "")
                : "No description available"}
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Rating */}
            {volumeInfo.averageRating && (
              <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                  {volumeInfo.averageRating}
                </span>
              </div>
            )}

            {/* Page Count */}
            {volumeInfo.pageCount && (
              <div className="flex items-center gap-1.5 bg-secondary/10 dark:bg-secondary/20 px-3 py-1.5 rounded-lg border border-secondary/30">
                <BookOpen className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  {volumeInfo.pageCount} pages
                </span>
              </div>
            )}

            {/* Category */}
            {volumeInfo.categories && volumeInfo.categories[0] && (
              <div className="flex items-center gap-1.5 bg-third dark:bg-primary px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 max-w-[150px]">
                <Tag className="w-3.5 h-3.5 text-primary dark:text-neutral-900 flex-shrink-0" />
                <span className="text-xs font-medium !text-primary -700 dark:!text-neutral-900 truncate">
                  {volumeInfo.categories[0]}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BookCard;
