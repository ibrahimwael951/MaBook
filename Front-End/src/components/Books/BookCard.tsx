"use client";
import { motion } from "framer-motion";
import { Book } from "@/types/Books";
import Image from "next/image";
import { FadeUp, ViewPort } from "@/animation";
import { Star } from "lucide-react";
import Link from "next/link";
interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { volumeInfo } = book;

  return (
    <Link href={`/books/${book.id}`}>
      <motion.div
        {...FadeUp}
        {...ViewPort}
        className="  rounded-2xl p-4 border dark:border-primary border-third cursor-pointer  "
      >
        <div className=" flex gap-4">
          <div className="flex-shrink-0">
            {volumeInfo.imageLinks?.thumbnail ? (
              <div className="relative  h-full w-fit">
                <Image
                  src={volumeInfo.imageLinks.thumbnail}
                  alt={volumeInfo.title || "image without title"}
                  width={80}
                  height={120}
                  className="rounded object-cover h-full w-32"
                />
                <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-b from-25% to-70% to-primary dark:to-third" />
              </div>
            ) : (
              <div className="w-20 h-30  rounded flex items-center justify-center">
                <span className=" text-xs">No Image</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0  max-w-96 space-y-4">
            <h3 className="font-semibold text-lg truncate   w-40 lg:w-full ">
              {volumeInfo.title}
            </h3>

            {volumeInfo.publishedDate && (
              <p className=" text-xs mt-1">
                Published: {volumeInfo.publishedDate}
              </p>
            )}
            <p className="text-gray-700 text-sm mt-2 line-clamp-3">
              {volumeInfo.description
                ? volumeInfo.description.replace(/<[^>]*>/g, "")
                : "no Description found"}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs ">
              {volumeInfo.averageRating && (
                <span className="flex items-center">
                  <Star size={10} /> {volumeInfo.averageRating}
                </span>
              )}
              {volumeInfo.pageCount && (
                <span className="bg-secondary text-primary rounded px-2 py-1">
                  {volumeInfo.pageCount} pages
                </span>
              )}
              {volumeInfo.categories && volumeInfo.categories[0] && (
                <span className="bg-third text-primary dark:bg-primary dark:text-third px-2 py-1 rounded truncate">
                  {volumeInfo.categories[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
