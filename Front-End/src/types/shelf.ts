export interface Book {
  id: string;
  title: string;
  author: string;
  color: string;
  width: number;
  shelfId: string;
  position: number;
}

export interface Shelf {
  id: string;
  name: string;
  books: Book[];
  width: 'full' | 'half';
  position: number;
}
