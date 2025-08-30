import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getBookById } from "@/lib/googleBooks";
import { Book } from "@/types/Books";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book: Book | null = await getBookById(id);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found.",
    };
  }

  return {
    title: `${book.volumeInfo.title} - Book Details`,
    description:
      book.volumeInfo.description?.substring(0, 160) ||
      `Details about ${book.volumeInfo.title} by ${
        book.volumeInfo.authors?.join(", ") || "Unknown Author"
      }`,
    openGraph: {
      title: book.volumeInfo.title,
      description: book.volumeInfo.description?.substring(0, 160),
      images: book.volumeInfo.imageLinks?.thumbnail
        ? [book.volumeInfo.imageLinks.thumbnail]
        : [],
    },
  };
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book: Book | null = await getBookById(id);

  if (!book) {
    notFound();
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
            <div className=" md:w-1/3 lg:w-1/4 p-6 ">
              {bookImage ? (
                <Image
                  src={bookImage}
                  alt={`Cover of ${title}`}
                  width={300}
                  height={400}
                  draggable={false}
                  className=" rounded-lg shadow-md max-w-full h-auto"
                  priority
                />
              ) : (
                <div className="w-64 h-96   rounded-lg flex items-center justify-center">
                  <span className="  text-sm">No Cover Available</span>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="md:w-2/3 lg:w-3/4 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold   mb-2">{title}</h1>

                {authors.length > 0 && (
                  <p className="text-xl   mb-2">by {authors.join(", ")}</p>
                )}

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating */}
                {averageRating && (
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(averageRating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {averageRating} ({ratingsCount} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* Book Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold   mb-3">
                    Book Information
                  </h3>
                  <div className="space-y-2">
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
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-lg font-semibold   mb-3">Actions</h3>
                  <div className="space-y-2">
                    {book.saleInfo?.buyLink && (
                      <a
                        href={book.saleInfo.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors ml-2"
                      >
                        Buy Book
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {description && (
                <div>
                  <h3 className="text-lg font-semibold   mb-3">Description</h3>
                  <div
                    className="  leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
