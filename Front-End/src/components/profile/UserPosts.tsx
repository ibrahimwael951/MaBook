"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Animate, opacity } from "@/animation";
import { useAuth } from "@/contexts/AuthContext";
import { Post, RePost, SavedPost } from "@/types/Auth";
import Loading from "../Loading";
import SavedPage from "./Sections/Saved";
import PostPage from "./Sections/Posts";
import { BookmarkCheck, Grid3x3, Repeat2 } from "lucide-react";
// import RePosts from "./Sections/Reposts";
import api from "@/lib/axios";
import { toast } from "sonner";

const MotionButton = motion(Button);

type PageType = "Posts" | "RePosts" | "Saved";
interface Props {
  username: string;
  isUser?: boolean;
}
const UserPosts: React.FC<Props> = ({ username }) => {
  const [page, setPage] = useState<PageType>("Posts");
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [rePosts, setRePosts] = useState<RePost[] | null>(null);
  const [savedPost, setSavedPost] = useState<SavedPost[] | null>(null);
  const { GetUserPosts, user } = useAuth();

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const result = await GetUserPosts(username);
        if (username === user?.username) {
          api
            .get("/api/RePost")
            .then((res) => setRePosts(res.data))
            .catch((err) => toast.error(`Error : ${err.message}`));

          api
            .get("/api/MySave")
            .then((res) => setSavedPost(res.data))
            .catch((err) => toast.error(`Error : ${err.message}`));
        }

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
  }, [username, GetUserPosts]);
  if (!user) return <Loading />;
  return (
    <section className="my-5 !px-0 lg:!px-10 w-full">
      {/* Tab Navigation */}
      <div className="flex justify-center gap-3 p-4">
        <MotionButton
          variant={page === "Posts" ? "secondary_2" : "third_2"}
          onClick={() => setPage("Posts")}
          animate={{
            opacity: page === "Posts" ? 1 : 0.7,
            y: page === "Posts" ? -4 : 0,
            scale: page === "Posts" ? 1.06 : 1,
          }}
          transition={{ duration: 0.1 }}
          className="text-lg font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Grid3x3 className="w-5 h-5" />
          Posts
        </MotionButton>

        {user.username === username &&
          (["Saved"] as const).map((item) => (
            <MotionButton
              variant={page === item ? "secondary_2" : "third_2"}
              key={item}
              onClick={() => setPage(item)}
              animate={{
                opacity: page === item ? 1 : 0.7,
                y: page === item ? -4 : 0,
                scale: page === item ? 1.06 : 1,
              }}
              transition={{ duration: 0.1 }}
              className="text-lg font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <BookmarkCheck className="w-5 h-5" />
              {item}
            </MotionButton>
          ))}
      </div>

      {/* Content Area */}
      <div className="mt-10">
        <AnimatePresence mode="wait">
          {page === "Posts" && (
            <motion.div
              key={page}
              {...Animate}
              {...opacity}
              transition={{ duration: 0.2 }}
              className="w-full min-h-96"
            >
              <PostPage posts={posts} page={page} />
            </motion.div>
          )}
          {page === "Saved" && (
            <motion.div
              key={page}
              {...Animate}
              {...opacity}
              transition={{ duration: 0.2 }}
              className="w-full min-h-96"
            >
              <SavedPage SavedPosts={savedPost} />
            </motion.div>
          )}

          {/* {page === "RePosts" && (
            <motion.div
              key={page}
              {...Animate}
              {...opacity}
              className="w-full min-h-96"
            >
              <RePosts post={rePosts} />
            </motion.div>
          )} */}
        </AnimatePresence>
      </div>

      {/* End Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full flex justify-center mt-10 mb-5"
      >
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-600"></div>
          <span className="text-sm font-medium">End of content</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-600"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default UserPosts;
