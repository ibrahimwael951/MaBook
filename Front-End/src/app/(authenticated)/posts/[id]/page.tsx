"use client";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { Post } from "@/types/Auth";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Animate, FadeLeft, FadeRight, FadeUp, opacity } from "@/animation";
import { Edit, Ellipsis, Trash, X } from "lucide-react";

import Deleted from "@/components/post/Deleted";
import NotFound from "@/components/post/NotFound";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import Link from "next/link";

export default function Page() {
  const { user } = useAuth();
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [warning, setWarning] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [deleted, setDeleted] = useState<boolean>(false);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<Post>(`/api/post/${id}`)
      .then((res) => setPost(res.data))
      .catch((err: unknown) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isPostMine = post?.author === user?.username;

  const deletePost = async () => {
    try {
      await api.delete(`/api/post/${id}`);
      setDeleted(true);
    } catch (err) {
      console.error(err);
      setError("Failed to delete post");
    }
  };

  if (loading) return <Loading />;
  if (!post) return <NotFound />;
  if (deleted) return <Deleted />;
  return (
    <section className="min-h-screen flex justify-center items-center  !px-0">
      <AnimatePresence>
        {warning && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <motion.div
              {...opacity}
              animate={{ ...Animate, opacity: 0.5 }}
              className="absolute top-0 left-0 w-full h-full bg-black"
            ></motion.div>
            <motion.div
              {...FadeUp}
              {...Animate}
              className="relative flex flex-col justify-center items-center gap-5 p-16 rounded-2xl bg-secondaryHigh overflow-hidden z-20 mx-5"
            >
              <button
                className="absolute top-0 left-0 bg-red-600 rounded-br-2xl "
                onClick={() => setWarning(false)}
              >
                <X size={40} />
              </button>
              <h1 className="text-2xl text-center ">
                Are you sure you want to delete this post?{" "}
              </h1>
              <div className="flex justify-center items-center gap-5 ">
                <Button
                  onClick={() => setWarning(false)}
                  variant="outline"
                  className="text-xl text-black bg-white hover:!bg-transparent hover:!text-white"
                >
                  No, keep post alone
                </Button>
                <Button
                  onClick={deletePost}
                  variant="outline"
                  className="text-xl text-white bg-red-600 !border-red-600  hover:border-white"
                >
                  Yes, I hate this Post
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {error && (
        <motion.div
          {...FadeLeft}
          {...Animate}
          className="absolute top-20 left-5 p-3 rounded-2xl !text-white bg-red-600"
        >
          <h1 className="text-2xl font-semibold">Failed To Delete Post</h1>
          <p className="!text-white">
            try to refresh the page or logout then login again
          </p>
        </motion.div>
      )}
      <div className="relative flex flex-col lg:flex-row justify-center items-center gap-5 p-16 w-10/12 rounded-2xl border-2 border-dashed border-third dark:border-primary  ">
        {isPostMine && (
          <motion.div
            {...FadeRight}
            {...Animate}
            className="absolute top-0 right-0 p-4 rounded-md font-semibold text-xl"
          >
            <Popover>
              <PopoverTrigger className=" ">
                <Ellipsis size={50} />
              </PopoverTrigger>
              <PopoverContent className="bg-black flex flex-col">
                <button
                  onClick={() => setWarning(true)}
                  className="  p-4 text-white rounded-md font-semibold text-xl"
                >
                  <Trash />
                </button>
                <Link
                  href={`/posts/${post._id}/update`}
                  className="  p-4 text-white rounded-md font-semibold text-xl"
                >
                  <Edit />
                </Link>
              </PopoverContent>
            </Popover>
          </motion.div>
        )}
        <div>
          <p className="font-semibold">{post.author}</p>
          <h1 className="text-lg">{post.description}</h1>
        </div>
        {post.image && (
          <img
            src={post.image.url}
            alt="post image"
            className="w-72 object-cover rounded-md"
          />
        )}
      </div>
    </section>
  );
}
