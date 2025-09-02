"use client";

import Loading from "@/components/Loading";

import api from "@/lib/axios";
import { Post } from "@/types/Auth";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import NotFound from "@/components/post/NotFound";

import PostCard from "@/components/post/PostCard";
import { toast } from "sonner";

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/post/${id}`)
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        if (err instanceof Error) {
          toast(`Load Failed`, {
            description: `Try again letter  : ${err.message} `,
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
        } else {
          toast(`Load Failed`, {
            description: `Try again letter  :Unknown error   `,
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
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!post) return <NotFound />;
  return (
    <section className="min-h-screen mt-28 py-5 flex justify-center items-start ">
      <PostCard post={post} />
    </section>
  );
}
