export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    pageCount?: number;
    publisher?: string;
    language?: string;
    infoLink?: string;
    previewLink?: string;
  };
  saleInfo?: {
    buyLink?: string;
    isEbook: boolean;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
  accessInfo?: {
    pdf: {
      acsTokenLink?: string;
      isAvailable?: false;
    };
    webReaderLink?: string;
  };
}
export interface GoogleBooksResponse {
  items: Book[];
  totalItems: number;
}
