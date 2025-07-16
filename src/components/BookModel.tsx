import { Book } from '@/types/Books';
import Image from 'next/image';

interface BookModalProps {
  book: Book;
  onClose: () => void;
}

export default function BookModal({ book, onClose }: BookModalProps) {
  const { volumeInfo, saleInfo } = book;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{volumeInfo.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="flex gap-6 mb-6">
            {volumeInfo.imageLinks?.thumbnail && (
              <div className="flex-shrink-0">
                <Image
                  src={volumeInfo.imageLinks.thumbnail}
                  alt={volumeInfo.title}
                  width={150}
                  height={200}
                  className="rounded object-cover"
                />
              </div>
            )}
            
            <div className="flex-1">
              {volumeInfo.authors && (
                <p className="text-lg text-gray-700 mb-2">
                  by {volumeInfo.authors.join(', ')}
                </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-600">
                {volumeInfo.publisher && (
                  <p><strong>Publisher:</strong> {volumeInfo.publisher}</p>
                )}
                {volumeInfo.publishedDate && (
                  <p><strong>Published:</strong> {volumeInfo.publishedDate}</p>
                )}
                {volumeInfo.pageCount && (
                  <p><strong>Pages:</strong> {volumeInfo.pageCount}</p>
                )}
                {volumeInfo.language && (
                  <p><strong>Language:</strong> {volumeInfo.language}</p>
                )}
                {volumeInfo.averageRating && (
                  <p><strong>Rating:</strong> ⭐ {volumeInfo.averageRating} ({volumeInfo.ratingsCount} reviews)</p>
                )}
              </div>
              
              {volumeInfo.categories && (
                <div className="mt-3">
                  <strong className="text-sm text-gray-600">Categories:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {volumeInfo.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {volumeInfo.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {volumeInfo.description.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          )}
          
          {saleInfo?.buyLink && (
            <div className="mt-6 pt-6 border-t">
              <a
                href={saleInfo.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Buy Book
                {saleInfo.listPrice && (
                  <span className="ml-2">
                    ({saleInfo.listPrice.amount} {saleInfo.listPrice.currencyCode})
                  </span>
                )}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
