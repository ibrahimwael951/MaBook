"use client";
import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/axios";
import { Post } from "@/types/Auth";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Animate, FadeLeft, FadeRight, FadeUp, opacity } from "@/animation";
import { Edit, Ellipsis, Trash, X } from "lucide-react";

import NotFound from "@/components/post/NotFound";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import Link from "next/link";
import { toast } from "sonner";
import { AccountAge } from "@/hooks/AccountAge";
import Avatar from "@/components/ui/Avatar";


const MotionLink = motion.create(Link)

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [warning, setWarning] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/api/post/${id}`)
      .then((res) => {
        setPost(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const isPostMine = post?.author.username === user?.username;

  const deletePost = async () => {
    try {
      await api.delete(`/api/post/${id}`);
      router.push(`/profile/${user?.username}`);
      toast(`Deleted`, {
        description: "You have been deleted your Post",
        classNames: {
          toast: "!bg-green-600 !text-white rounded-xl border border-red-700",
          description: "!text-white text-sm opacity-90",
          actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
    } catch (err) {
      console.error(err);
      toast(`Deleted Failed`, {
        description: `Try again letter  : ${error} `,
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
      setError("Failed to delete post");
    }
  };

  if (loading) return <Loading />;
  if (!post) return <NotFound />;
  return (
    <section className=" mt-28 flex justify-center items-center ">
      <AnimatePresence>
        {warning && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <motion.div
              {...opacity}
              animate={{ ...Animate, opacity: 0.5 }}
              className="absolute top-0 left-0 w-full h-full bg-black"
            />
            <motion.div
              {...FadeUp}
              {...Animate}
              className="relative flex flex-col justify-center items-center gap-5 p-16 rounded-2xl text-third dark:text-primary bg-primary dark:bg-third overflow-hidden z-20 mx-5 select-none"
            >
              <button
                className="absolute top-0 left-0 text-white bg-red-600 rounded-br-2xl "
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
                  variant="third_2"
                  className="h-fit text-xl  "
                >
                  No, keep post alone
                </Button>
                <Button
                  onClick={deletePost}
                  variant="secondary_2"
                  className="h-fit text-xl !text-white !bg-red-600 !hover:bg-red-600 !border-red-600  hover:border-red-600"
                >
                  Yes, Delete this Post
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full min-h-[500px] sm:w-fit lg:min-w-xl max-w-full relative flex flex-col gap-5 ">
        {isPostMine && (
          <motion.div
            {...FadeRight}
            {...Animate}
            className="absolute top-0 right-0 p-4 rounded-md font-semibold text-xl z-20"
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
          <MotionLink
          href={`/profile/${post.author.username}`}
            {...FadeLeft}
            {...Animate}
            className="font-semibold flex justify-center items-center gap-2 w-fit mb-2"
          >
            <Avatar
              gender={post.author.gender}
              fullName={post.author.fullName}
              avatar={post.author.avatar}
            />
            <div>
              <p>{post.author.username}</p>
              <h1>{post.author.fullName}</h1>
            </div>
          </MotionLink>
          <motion.h1
            {...FadeLeft}
            animate={{
              ...Animate.animate,
              transition: { duration: 0.4, delay: 0.2 },
            }}
            className="text-lg"
          >
            {post.description}
          </motion.h1>
          <motion.p
            {...FadeLeft}
            animate={{
              ...Animate.animate,
              transition: { duration: 0.4, delay: 0.3 },
            }}
            className="text-xs"
          >
            {AccountAge(post.createdAt)}
          </motion.p>
        </div>
        {post.image && (
          <div className="relative select-none">
            <div className="absolute top-0 left-0 w-full h-full z-10" />
            <motion.img
              {...FadeUp}
              animate={{
                ...Animate.animate,
                transition: { duration: 0.4, delay: 0.4 },
              }}
              src={post.image.url}
              alt="post image"
              className=" w-full aspect-square max-w-xl object-cover rounded-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}
