import {Book, GoogleBooksResponse } from "@/types/Books";

const Google_Books_API = process.env.NEXT_PUBLIC_API_BOOKS;
export async function searchBooks(
  query: string,
  maxResults: number = 10,
  startIndex: number = 0
): Promise<GoogleBooksResponse> {
  const params = new URLSearchParams({
    q: query,
    maxResults: maxResults.toString(),
    startIndex: startIndex.toString(),
    key: Google_Books_API || "",
  });
  const res = await fetch(`${Google_Books_API}?${params}`);

  if (!res.ok) {
    throw new Error(`Error status:${res.status}`);
  }
  const data = await res.json();
  return data;
}

export async function getBookById(bookId: string): Promise<Book> {
  const res = await fetch(`${Google_Books_API}/${bookId}`);

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data;
}
