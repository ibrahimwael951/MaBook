"use client";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import Loading from "@/components/Loading";
import { RePost } from "@/types/Auth";
import { Animate, opacity } from "@/animation";
import { cloudinaryOptimize } from "@/hooks/cloudinaryOptimize";
import { AccountAge } from "@/hooks/AccountAge";

const MotionLink = motion.create(Link);
interface props {
  post: RePost[] | null;
}
const RePosts: React.FC<props> = ({ post }) => {
  if (!post) return <Loading />;

  return (
    <div className="w-full grid gap-2 sm:grid-cols-2 lg:grid-cols-3  2xl:grid-cols-4 ">
      {post.map((item) => (
        <MotionLink
          key={item._id}
          {...opacity}
          {...Animate}
          href={`/RePost/${item._id}`}
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

export default RePosts;
