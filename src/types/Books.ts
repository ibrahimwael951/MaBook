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
    };
    saleInfo?: {
      buyLink?: string;
      listPrice?: {
        amount: number;
        currencyCode: string;
      };
    };
  }
  export interface GoogleBooksResponse {
    items: Book[];
    totalItems: number;
  }