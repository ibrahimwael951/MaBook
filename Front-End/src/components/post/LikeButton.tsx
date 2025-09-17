import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { Animate, FadeLeft } from "@/animation";
interface Props {
  liked: boolean;
}
const MotionButton = motion.create(Button);
const LikeButton: React.FC<Props> = ({ liked }) => {
  return (
    <MotionButton
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-2 flex "
      aria-label={liked ? "Unlike" : "Like"}
      title={liked ? "Unlike" : "Like"}
    >
      <motion.div
        animate={{ scale: liked ? 1.2 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Heart
          size={24}
          fill={liked ? "currentColor" : "none"}
          stroke={liked ? "none" : "currentColor"}
          className="text-red-600"
        />
      </motion.div>
      <AnimatePresence>
        {liked && (
          <motion.p {...FadeLeft} {...Animate}>
            Liked!
          </motion.p>
        )}
      </AnimatePresence>
    </MotionButton>
  );
};

export default LikeButton;
