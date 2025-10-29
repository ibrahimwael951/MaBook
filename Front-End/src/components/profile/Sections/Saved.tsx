import { Animate, opacity } from "@/animation";
import { AccountAge } from "@/hooks/AccountAge";
import { cloudinaryOptimize } from "@/hooks/cloudinaryOptimize";
import { useIsMobile } from "@/hooks/useIsMobile";
import { motion } from "framer-motion";
import { FileX2 } from "lucide-react";
import React from "react";
import Link from "next/link";
import { SavedPost } from "@/types/Auth";

interface props {
  SavedPosts: SavedPost[] | null;
}
const Saved: React.FC<props> = ({ SavedPosts }) => {
  const isMobile = useIsMobile();

  if (!SavedPosts)
    return (
      <div className="flex flex-col gap-5 justify-center items-center ">
        <div className="inline-block animate-spin rounded-full h-40 w-40 border-b-2  border-third dark:border-primary"></div>
        Loading....
      </div>
    );
  if (SavedPosts.length === 0)
    return (
      <div className="flex flex-col justify-center items-center gap-2 min-h-96 ">
        <FileX2 size={isMobile ? 20 : 75} />{" "}
        <h1 className="text-4xl">
          no <span> posts </span> yet
        </h1>
      </div>
    );
  const MotionLink = motion.create(Link);

  return (
    <div className="w-full grid gap-2 sm:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-4 ">
      {SavedPosts.map((item) => (
        <MotionLink
          key={item._id}
          {...opacity}
          {...Animate}
          href={`/posts/${item.postId._id}`}
          className={`relative text-2xl  border border-secondaryHigh rounded-2xl bg-secondary text-white min-h-52 overflow-hidden cursor-pointer`}
        >
          <motion.img
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.2 }}
            src={
              cloudinaryOptimize(item.postId.image.url, 200) ||
              "/No image found.png"
            }
            alt={`image - ${item.postId.description}`}
            width={200}
            height={200}
            loading="lazy"
            className="w-full h-72 object-cover rounded-2xl "
          />
          <p className="text-xs absolute bottom-0 right-0 bg-secondary !text-white p-2 rounded-tl-2xl ">
            Saved {AccountAge(item.createdAt)}
          </p>
        </MotionLink>
      ))}
    </div>
  );
};
export default Saved;
