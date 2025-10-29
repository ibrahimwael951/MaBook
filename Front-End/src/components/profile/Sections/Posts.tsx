import { Animate, opacity } from "@/animation";
import Loading from "@/components/Loading";
import { AccountAge } from "@/hooks/AccountAge";
import { cloudinaryOptimize } from "@/hooks/cloudinaryOptimize";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Post } from "@/types/Auth";
import { motion } from "framer-motion";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type PageType = "Posts" | "RePosts" | "Saved";

interface PostPageProps {
  page: PageType;
  posts: Post[] | null;
}

const Posts = ({ posts }: PostPageProps) => {
  const [CornetPosts , setCornetPosts]=useState<Post[]|null>(posts)
  
  const isMobile = useIsMobile();
  if (!posts) return <Loading />;
  if (posts.length === 0)
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
      {posts.map((item) => (
        <MotionLink
          key={item._id}
          {...opacity}
          {...Animate}
          href={`/posts/${item._id}`}
          className={`relative text-2xl  border border-secondaryHigh rounded-2xl bg-secondary text-white min-h-52 overflow-hidden cursor-pointer`}
        >
          <motion.img
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.2 }}
            src={
              cloudinaryOptimize(item.image.url, 200) || "/No image found.png"
            }
            alt={`image - ${item.description}`}
            width={200}
            height={200}
            loading="lazy"
            className="w-full h-72 object-cover rounded-2xl "
          />
          <p className="text-xs absolute bottom-0 right-0 bg-secondary !text-white p-2 rounded-tl-2xl ">
            {AccountAge(item.createdAt)}
          </p>
        </MotionLink>
      ))}
    </div>
  );
};

export default Posts;
