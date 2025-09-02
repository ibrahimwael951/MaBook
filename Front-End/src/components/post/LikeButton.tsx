import React  from "react";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Animate, opacity } from "@/animation";
import AnimatedImage from "../ui/AnimatedImage";

const HeartOne = motion.create(Heart);
const Image = motion.create(AnimatedImage);

interface props {
  liked: boolean;
}
const LikeButton: React.FC<props> = ({ liked }) => {
  return (
    <Button variant="third_2" className="w-full">
      <AnimatePresence>
        {liked && (
          <Image
            {...opacity}
            animate={{ ...Animate.animatenly, transition: { duration: 0.2 } }}
            alt="heart"
            src="/Heart.svg"
            className="w-5 h-5"
            noAnimate
          />
        )}
        {!liked && (
          <HeartOne
            {...opacity}
            animate={{ ...Animate.animatenly, transition: { duration: 0.2 } }}
          />
        )}
      </AnimatePresence>
    </Button>
  );
};

export default LikeButton;
