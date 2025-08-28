"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Animate, opacity } from "@/animation";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types/Auth";
import Loading from "../Loading";
import { FileX2 } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { AccountAge } from "@/hooks/AccountAge";
import Link from "next/link";

const MotionButton = motion(Button);

type PageType = "Posts" | "RePosts" | "Saved";
interface Props {
  username: string;
  isUser?: boolean;
}
const UserPosts: React.FC<Props> = ({ username }) => {
  const [page, setPage] = useState<PageType>("Posts");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const { GetUserPosts, user } = useAuth();

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const result = await GetUserPosts(username);

        const sortedPosts = result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [username]);
  if (!user) return <Loading />;
  return (
    <section className="mt-5 !px-0 lg:!px-10 w-full">
      <div className="flex justify-center gap-5 p-3">
        {(["Posts", "RePosts"] as const).map((item) => (
          <MotionButton
            variant={"outline"}
            key={item}
            onClick={() => setPage(item)}
            animate={{
              opacity: page === item ? 1 : 0.7,
              y: page === item ? -4 : 0,
              scale: page === item ? 1.06 : 1,
            }}
            transition={{ duration: 0.1 }}
            className="text-lg"
          >
            {item}
          </MotionButton>
        ))}
        {user.username === username && (
          <MotionButton
            variant={"outline"}
            onClick={() => setPage("Saved")}
            animate={{
              opacity: page === "Saved" ? 1 : 0.7,
              y: page === "Saved" ? -4 : 0,
              scale: page === "Saved" ? 1.06 : 1,
            }}
            transition={{ duration: 0.1 }}
            className="text-lg"
          >
            Saved
          </MotionButton>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          {...Animate}
          {...opacity}
          transition={{ duration: 0.2 }}
          className="w-full min-h-96"
        >
          <PostPage posts={posts} page={page} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default UserPosts;

interface PostPageProps {
  page: PageType;
  posts?: Post[] | null;
}

function PostPage({ posts }: PostPageProps) {
  const isMobile = useIsMobile();
  if (!posts) return <Loading />;
  if (posts.length === 0)
    return (
      <div className="flex flex-col justify-center items-center gap-2 min-h-96 ">
        <FileX2 size={isMobile ? 20 : 75} />{" "}
        <h1 className="text-4xl">no posts yet</h1>
      </div>
    );
  const MotionLink = motion.create(Link);
  return (
    <div className="w-full grid gap-5 sm:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-4 ">
      {posts.map((item) => (
        <MotionLink
          key={item._id}
          href={`/posts/${item._id}`}
          initial="rest"
          whileHover="hover"
          variants={{
            hover: { y: -5 },
            rest: { y: 0 },
          }}
          className={`relative text-2xl p-3 pb-8 rounded-2xl bg-secondary text-white min-h-52 overflow-hidden cursor-pointer`}
        >
          <h1 className="mb-3">{item.description}</h1>
          {item.image?.url && (
            <img
              src={item.image.url}
              alt={`image - ${item.description}`}
              className="w-full h-72 object-cover rounded-2xl "
            />
          )}

          <p className="text-xs absolute bottom-2 right-2 ">
            {AccountAge(item.createdAt)}
          </p>
          <motion.div
            variants={{
              rest: { opacity: 0 },
              hover: { opacity: 0.4 },
            }}
            className="absolute top-0 left-0 w-full h-full bg-white dark:bg-black"
          />
        </MotionLink>
      ))}
    </div>
  );
}
