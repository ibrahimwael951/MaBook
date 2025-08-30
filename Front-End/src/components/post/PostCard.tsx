import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types/Auth";
import { Animate, FadeLeft, FadeRight, FadeUp } from "@/animation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Ellipsis } from "lucide-react";
import Avatar from "../ui/Avatar";
import { AccountAge } from "@/hooks/AccountAge";

const MotionLink = motion.create(Link);

interface props {
  post: Post;
}

const PostCard: React.FC<props> = ({ post }) => {
  const { user } = useAuth();
  const isPostMine = user?.username === post?.author.username;
  return (
    <div className="w-full min-h-52 lg:min-w-xl max-w-2xl relative flex flex-col gap-5 ">
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
            <PopoverContent className="bg-black flex flex-col"></PopoverContent>
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
            className=" w-full aspect-square  object-cover rounded-2xl"
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
