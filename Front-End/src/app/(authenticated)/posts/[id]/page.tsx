"use client";

import Loading from "@/components/Loading";

import api from "@/lib/axios";
import { Post } from "@/types/Auth";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import NotFound from "@/components/post/NotFound";

import PostCard from "@/components/post/PostCard";
import { toast } from "sonner";
import Comment from "@/components/post/Comments/Comment";

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    let attemptCount = 0;
    const maxAttempts = 3;
    const intervalTime = 15000;

    const fetchPost = () => {
      api
        .get(`/api/post/${id}`)
        .then((res) => {
          setPost(res.data);
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
          toast(`Load Failed`, {
            description: `Try again later: ${errorMessage}`,
            classNames: {
              toast: "!bg-red-600 !text-white rounded-xl border border-red-700",
              description: "!text-white text-sm opacity-90",
              actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
            },
            action: {
              label: "OK",
              onClick: () => console.log("OK"),
            },
          });
        })
        .finally(() => setLoading(false));
    };
    setLoading(true);
    fetchPost();
    attemptCount += 1;

    const intervalId = setInterval(() => {
      if (attemptCount < maxAttempts) {
        fetchPost();
        attemptCount += 1;
      } else {
        clearInterval(intervalId);
      }
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) return <Loading />;
  if (!post) return <NotFound />;
  return (
    <section className="min-h-screen mt-28 py-5 flex flex-col items-center justify-center  ">
      <PostCard post={post} />
      <Comment PostId={post._id} />
    </section>
  );
}
