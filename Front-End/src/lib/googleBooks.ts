import axios, { AxiosResponse } from 'axios';
import { Book, GoogleBooksResponse } from "@/types/Books";

const Google_Books_API = "https://www.googleapis.com/books/v1/volumes";

 export const googleBooksApi = axios.create({
  baseURL: Google_Books_API,
  timeout: 10000, 
});

export async function searchBooks(
  query: string,
  maxResults: number = 10,
  startIndex: number = 0
): Promise<GoogleBooksResponse> {
  try {
    const response: AxiosResponse<GoogleBooksResponse> = await googleBooksApi.get('/', {
      params: {
        q: query,
        maxResults: maxResults.toString(),
        startIndex: startIndex.toString(),
        key: process.env.NEXT_PUBLIC_API_BOOKS || "",
      }
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error status: ${error.response?.status || 'Unknown'} - ${error.message}`);
    }
    throw new Error('An unexpected error occurred while searching books');
  }
}

export async function getBookById(bookId: string): Promise<Book> {
  try {
    const response: AxiosResponse<Book> = await googleBooksApi.get(`/${bookId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`HTTP error! status: ${error.response?.status || 'Unknown'} - ${error.message}`);
      throw new Error(`Failed to fetch book: ${error.response?.status || 'Unknown error'}`);
    }
    throw new Error('An unexpected error occurred while fetching the book');
  }
}