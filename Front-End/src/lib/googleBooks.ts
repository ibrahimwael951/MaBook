import axios, { AxiosResponse } from "axios";
import { Book, GoogleBooksResponse } from "@/types/Books";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export const googleBooksApi = axios.create({
  baseURL: GOOGLE_BOOKS_API,
  timeout: 15000, // Increased timeout for better reliability
});

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ");
}

export async function searchBooks(
  query: string,
  maxResults: number = 10,
  startIndex: number = 0,
  langRestrict?: string
): Promise<GoogleBooksResponse> {
  const apiKey = process.env.NEXT_PUBLIC_API_BOOKS;
  if (!apiKey) {
    throw new Error("Google Books API key is missing. Please check environment variables.");
  }

  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    throw new Error("Search query cannot be empty.");
  }

  async function doRequest(params: Record<string, string>, retryCount = 0): Promise<GoogleBooksResponse> {
    const MAX_RETRIES = 2;
    try {
      const response: AxiosResponse<GoogleBooksResponse> = await googleBooksApi.get("/", { params });
      const result = response.data;
      return {
        ...result,
        items: result.items || [], // Ensure items is always an array
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 429 && retryCount < MAX_RETRIES) {
          // Retry on rate-limiting with exponential backoff
          await new Promise((resolve) => setTimeout(resolve, 1000 * (retryCount + 1)));
          return doRequest(params, retryCount + 1);
        }
        if (status === 403) {
          throw new Error("Invalid API key. Please verify your Google Books API key.");
        }
        throw new Error(`Error status: ${status || "Unknown"} - ${error.message}`);
      }
      throw new Error("An unexpected error occurred while searching books");
    }
  }

  try {
    const baseParams: Record<string, string> = {
      q: normalizedQuery,
      maxResults: maxResults.toString(),
      startIndex: startIndex.toString(),
      key: apiKey,
    };

    // Add language restriction for Arabic queries from the start
    if (isArabic(normalizedQuery)) {
      baseParams.langRestrict = langRestrict || "ar";
    } else if (langRestrict) {
      baseParams.langRestrict = langRestrict;
    }

    let result = await doRequest(baseParams);

    // Fallback 1: Try intitle: if no results
    if (!result.items?.length) {
      const intitleParams = { ...baseParams, q: `intitle:${normalizedQuery}` };
      result = await doRequest(intitleParams);
    }

    // Fallback 2: If still no results and Arabic, try without intitle but with langRestrict
    if (!result.items?.length && isArabic(normalizedQuery)) {
      const arabicParams = { ...baseParams, q: normalizedQuery, langRestrict: "ar" };
      result = await doRequest(arabicParams);
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch books: ${error.message}. Try refining your search query.`);
    }
    throw new Error("An unexpected error occurred while searching books");
  }
}

export async function getBookById(bookId: string): Promise<Book> {
  if (!bookId) {
    throw new Error("Book ID is required.");
  }

  try {
    const response: AxiosResponse<Book> = await googleBooksApi.get(`/${bookId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      console.error(`HTTP error! status: ${status || "Unknown"} - ${error.message}`);
      throw new Error(
        `Failed to fetch book: ${status || "Unknown error"}. Please try again later.`
      );
    }
    throw new Error("An unexpected error occurred while fetching the book");
  }
}