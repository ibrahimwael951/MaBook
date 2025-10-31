import { useState, useEffect } from "react";
import { Shelf, Book } from "@/types/shelf";

const STORAGE_KEY = "bookshelf_data";

const initialShelves: Shelf[] = [
  {
    id: "shelf-1",
    name: "Fiction",
    width: "full",
    position: 0,
    books: [
      {
        id: "book-1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        color: "blue",
        width: 60,
        shelfId: "shelf-1",
        position: 0,
      },
      {
        id: "book-2",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        color: "red",
        width: 65,
        shelfId: "shelf-1",
        position: 1,
      },
      {
        id: "book-3",
        title: "1984",
        author: "George Orwell",
        color: "green",
        width: 55,
        shelfId: "shelf-1",
        position: 2,
      },
      {
        id: "book-4",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        color: "purple",
        width: 70,
        shelfId: "shelf-1",
        position: 3,
      },
    ],
  },
  {
    id: "shelf-2",
    name: "Science & Technology",
    width: "full",
    position: 1,
    books: [
      {
        id: "book-5",
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        color: "indigo",
        width: 62,
        shelfId: "shelf-2",
        position: 0,
      },
      {
        id: "book-6",
        title: "The Selfish Gene",
        author: "Richard Dawkins",
        color: "teal",
        width: 58,
        shelfId: "shelf-2",
        position: 1,
      },
      {
        id: "book-7",
        title: "Sapiens",
        author: "Yuval Noah Harari",
        color: "amber",
        width: 68,
        shelfId: "shelf-2",
        position: 2,
      },
    ],
  },
  {
    id: "shelf-3",
    name: "Biography",
    width: "half",
    position: 2,
    books: [
      {
        id: "book-8",
        title: "Steve Jobs",
        author: "Walter Isaacson",
        color: "rose",
        width: 72,
        shelfId: "shelf-3",
        position: 0,
      },
      {
        id: "book-9",
        title: "Einstein",
        author: "Walter Isaacson",
        color: "blue",
        width: 66,
        shelfId: "shelf-3",
        position: 1,
      },
    ],
  },
];

export const useBookStorage = () => {
  const [shelves, setShelves] = useState<Shelf[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialShelves;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shelves));
  }, [shelves]);

  const moveBook = (bookId: string, newShelfId: string, newPosition: number) => {
    setShelves((prevShelves) => {
      const newShelves = [...prevShelves];
      
      // Find the book and its current shelf
      let book: Book | undefined;
      let oldShelfIndex = -1;
      let oldBookIndex = -1;

      for (let i = 0; i < newShelves.length; i++) {
        const bookIndex = newShelves[i].books.findIndex((b) => b.id === bookId);
        if (bookIndex !== -1) {
          book = newShelves[i].books[bookIndex];
          oldShelfIndex = i;
          oldBookIndex = bookIndex;
          break;
        }
      }

      if (!book) return prevShelves;

      // Remove from old shelf
      newShelves[oldShelfIndex].books.splice(oldBookIndex, 1);

      // Update positions in old shelf
      newShelves[oldShelfIndex].books = newShelves[oldShelfIndex].books.map(
        (b, idx) => ({ ...b, position: idx })
      );

      // Add to new shelf
      const newShelfIndex = newShelves.findIndex((s) => s.id === newShelfId);
      if (newShelfIndex !== -1) {
        book = { ...book, shelfId: newShelfId, position: newPosition };
        newShelves[newShelfIndex].books.splice(newPosition, 0, book);

        // Update positions in new shelf
        newShelves[newShelfIndex].books = newShelves[newShelfIndex].books.map(
          (b, idx) => ({ ...b, position: idx })
        );
      }

      return newShelves;
    });
  };

  const addShelf = (name: string) => {
    setShelves((prevShelves) => {
      const newShelf: Shelf = {
        id: `shelf-${Date.now()}`,
        name,
        books: [],
        width: "full",
        position: prevShelves.length,
      };
      return [...prevShelves, newShelf];
    });
  };

  const deleteShelf = (shelfId: string) => {
    setShelves((prevShelves) => {
      const filtered = prevShelves.filter((s) => s.id !== shelfId);
      return filtered.map((s, idx) => ({ ...s, position: idx }));
    });
  };

  const updateShelfWidth = (shelfId: string, width: 'full' | 'half') => {
    setShelves((prevShelves) =>
      prevShelves.map((s) => (s.id === shelfId ? { ...s, width } : s))
    );
  };

  const updateShelfName = (shelfId: string, name: string) => {
    setShelves((prevShelves) =>
      prevShelves.map((s) => (s.id === shelfId ? { ...s, name } : s))
    );
  };

  const reorderShelves = (startIndex: number, endIndex: number) => {
    setShelves((prevShelves) => {
      const result = Array.from(prevShelves);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((s, idx) => ({ ...s, position: idx }));
    });
  };

  const resetShelves = () => {
    setShelves(initialShelves);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialShelves));
  };

  return { 
    shelves, 
    moveBook, 
    addShelf, 
    deleteShelf, 
    updateShelfWidth, 
    updateShelfName,
    reorderShelves,
    resetShelves 
  };
};
