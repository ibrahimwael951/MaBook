"use client";
import { motion } from "framer-motion";
import { Book } from "@/types/Books";
import Image from "next/image";
import { opacity, ViewPort } from "@/animation";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { volumeInfo } = book;
  const img = book.volumeInfo.imageLinks?.smallThumbnail;
  const [imgSrc, setImgSrc] = useState(img || "/No image found.png");
  return (
    <Link href={`/books/${book.id}`}>
      <motion.div
        {...opacity}
        viewport={{
          amount: ViewPort.viewport.amount,
        }}
        whileInView={{
          ...ViewPort.whileInView,
          transition: { duration: 0.172 },
        }}
        className=" h-60 flex gap-4 rounded-2xl p-4 border dark:border-primary border-third cursor-pointer  "
      >
        <div className="flex-shrink-0">
          <div className="relative  h-full w-fit">
            <Image
              src={imgSrc}
              alt={volumeInfo.title || "image without title"}
              width={1000}
              height={1000}
              draggable={false}
              placeholder="blur"
              blurDataURL="/placeholder-book.webp"
              className="rounded object-cover h-full w-32"
              priority={false}
              onError={() => setImgSrc("/No image found.png")}
            />
          </div>
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
              <h4 className="flex items-center gap-1 text-xl">
                <Star size={20} className="text-yellow-600" />{" "}
                {volumeInfo.averageRating}
              </h4>
            )}
            {volumeInfo.pageCount && (
              <h4 className="bg-secondary !text-primary rounded px-2 py-1">
                {volumeInfo.pageCount} pages
              </h4>
            )}
            {volumeInfo.categories && volumeInfo.categories[0] && (
              <h4 className=" bg-third  dark:bg-primary !text-primary dark:!text-third  px-2 py-1 rounded truncate">
                {volumeInfo.categories[0]}
              </h4>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default BookCard;
