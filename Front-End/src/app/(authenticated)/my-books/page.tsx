"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { MyBooks } from "@/types/Auth";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimatedImage from "@/components/ui/AnimatedImage";
import { Plus } from "lucide-react";

export default function Page() {
  const { user } = useAuth();
  const [books, setBooks] = useState<null | MyBooks[]>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;
    api
      .get("/api/myBooks")
      .then((res) => setBooks(res.data))
      .catch((err) => toast(`${err.response.data.message}`))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loading />;
  if (books?.length === 0 || !books)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-5 text-center ">
        <h1 className="text-4xl lg:text-6xl ">
          No <span>books</span> Added
        </h1>
        <p className="text-2xl lg:text-4xl">
          add some books , and become one of Readers
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/books">
            <Button variant="secondary_2">Search Books</Button>
          </Link>
          <Link href="/">
            <Button variant="third_2">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  return (
    <section className="min-h-screen mt-20">
      <div className="mb-10">
        <h1 className="text-4xl lg:text-5xl">
          Hello <span>{user?.firstName}</span>
        </h1>
        <p className="text-xl lg:text-2xl">here is your Books </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 h-fit    ">
        <Link
          href={`/books`}
          className="h-72 p-5 border border-secondaryHigh dark:border-primary rounded-2xl flex flex-col justify-center items-center w-full"
        >
          <Plus size={50} />
          New Book ?
        </Link>
        {books.map((item) => (
          <Link
            href={`/my-books/b/${item.book.BookLink}`}
            key={item._id}
            className="h-72 p-5 border border-secondaryHigh dark:border-primary rounded-2xl flex justify-between items-center gap-2 w-full overflow-hidden"
          >
            <div>
              <AnimatedImage
                noAnimate
                alt={item.book.title}
                src={item.book.url}
                className="w-40"
              />
            </div>
            <div className="p-2 w-full h-full">
              <h1 className="text-xl font-semibold w-full truncate">
                {item.book.title.slice(0, 24) + "...."}
              </h1>
              <div>
                <p>Progress</p>
                <h1>{item.progress.percentage}%</h1>
                <h1>
                  {item.progress.currentPage} -{" "}
                  <span>{item.book.totalPages}</span>
                </h1>
              </div>
              <div>
                <h1 className="flex gap-2">
                  <p>Mood</p> : {item.rate.mood && item.rate.mood}
                </h1>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
