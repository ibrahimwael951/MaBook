"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "../../ui/button";
import { Animate, FadeLeft } from "@/animation";
import api from "@/lib/axios";
import { toast } from "sonner";
interface Props {
  likesCount: number;
  liked: boolean;
  postId: string;
}
interface data {
  data: {
    liked: boolean;
  };
}

const MotionButton = motion.create(Button);

const LikeButton: React.FC<Props> = ({ likesCount, postId, liked }) => {
  const [Liked, setLiked] = useState<boolean>(liked);
  const [postLikes, setPostLikes] = useState<number>(likesCount);

  const handleLike = async () => {
    try {
      setLiked(!Liked);
      await api.post(`/api/${postId}/like`).then((data: data) => {
        setLiked(data.data.liked);
        setPostLikes((prev) =>
          data.data.liked === true ? prev + 1 : prev - 1
        );
      });
    } catch (err) {
      setLiked((prev) => !prev);
      toast("something goes wrong : try again", {
        description: `error : ${
          err instanceof Error ? err.message : String(err)
        } `,
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
      console.error(
        "Error liking post:",
        err instanceof Error ? err.message : String(err)
      );
    }
  };
  return (
    <>
    <div>
      {postLikes} Likes
    </div>
    <MotionButton
      onClick={ handleLike}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-2 flex "
      aria-label={Liked ? "Unlike" : "Like"}
      title={Liked ? "Unlike" : "Like"}
    >
      <motion.div
        animate={{ scale: Liked ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Heart
          size={24}
          fill={Liked ? "currentColor" : "none"}
          stroke={Liked ? "none" : "currentColor"}
          className="text-red-600"
        />
      </motion.div>
      <AnimatePresence>
        {Liked && (
          <motion.p {...FadeLeft} {...Animate} className="hidden lg:inline">
            Liked!
          </motion.p>
        )}
      </AnimatePresence>
    </MotionButton></>
  );
};

export default LikeButton;
