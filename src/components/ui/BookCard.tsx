import { Book } from '@/types/Books';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  const { volumeInfo } = book;
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {volumeInfo.imageLinks?.thumbnail ? (
            <Image
              src={volumeInfo.imageLinks.thumbnail}
              alt={volumeInfo.title}
              width={80}
              height={120}
              className="rounded object-cover"
            />
          ) : (
            <div className="w-20 h-30 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">No Image</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-900 truncate">
            {volumeInfo.title}
          </h3>
          
          {volumeInfo.authors && (
            <p className="text-gray-600 text-sm mt-1">
              by {volumeInfo.authors.join(', ')}
            </p>
          )}
          
          {volumeInfo.publishedDate && (
            <p className="text-gray-500 text-xs mt-1">
              Published: {volumeInfo.publishedDate}
            </p>
          )}
          
          {volumeInfo.description && (
            <p className="text-gray-700 text-sm mt-2 line-clamp-3">
              {volumeInfo.description.replace(/<[^>]*>/g, '')}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            {volumeInfo.averageRating && (
              <span>⭐ {volumeInfo.averageRating}</span>
            )}
            {volumeInfo.pageCount && (
              <span>{volumeInfo.pageCount} pages</span>
            )}
            {volumeInfo.categories && volumeInfo.categories[0] && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {volumeInfo.categories[0]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}