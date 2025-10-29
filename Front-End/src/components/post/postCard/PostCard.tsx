"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types/Auth";
import { Animate, FadeLeft, FadeRight, FadeUp, opacity } from "@/animation";
import {
  Edit,
  Ellipsis,
  MessageCircleWarning,
  Save,
  Trash,
  X,
} from "lucide-react";
import Avatar from "../../ui/Avatar";
import { AccountAge } from "@/hooks/AccountAge";
import { Button } from "../../ui/button";
import LikeButton from "./LikeButton";
import { usePathname, useRouter } from "next/navigation";
import { useDetectLanguage } from "@/hooks/Language";
import { SimpleAnimatedImage } from "../../ui/AnimatedImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeletePost from "./DeletePost";
import { cloudinaryOptimize } from "@/hooks/cloudinaryOptimize";
import SavePost from "./SavePost";
import RePost from "./Repost";

const MotionLink = motion.create(Link);

interface props {
  post: Post;
  AnimateIt?: boolean;
}

const PostCard: React.FC<props> = ({ post, AnimateIt = false }) => {
  const { user } = useAuth();
  const pathName = usePathname();
  const router = useRouter();
  const lang = useDetectLanguage(post.description);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);

  const [hidePost, setHidePost] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  const isPostMine = user?.username === post?.author.username;
  useEffect(() => {
    if (!isDeleted) return;
    const timer = setTimeout(() => {
      setHidePost(true);
      if (pathName.slice(0, 6) === "/posts") {
        router.push(`/profile/${user?.username}`);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isDeleted, router, pathName]);

  useEffect(() => {
    if (showImage) {
      window.document.body.classList.add("overflow-hidden");
    } else {
      window.document.body.classList.remove("overflow-hidden");
    }
  }, [showImage]);

  useEffect(() => {
    document.body.style.overflow = warning ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [warning]);

  const ImgHandler =
    cloudinaryOptimize(post.image.url, 600) || "/No image found.png";

  if (isDeleted)
    return (
      <AnimatePresence>
        {!hidePost ? (
          <motion.div
            {...opacity}
            {...Animate}
            className="w-full min-h-52 lg:min-w-xl max-w-2xl relative flex flex-col justify-center items-center text-2xl border rounded-2xl gap-5 "
          >
            Deleted Successfully
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  return (
    <>
      {" "}
      <AnimatePresence>
        {warning && (
          <DeletePost
            Deleted={() => setIsDeleted(true)}
            PostId={post._id}
            close={() => setWarning(false)}
          />
        )}
      </AnimatePresence>
      <div className="w-full min-h-52 lg:min-w-xl max-w-2xl relative flex flex-col gap-5 ">
        <motion.div
          {...(AnimateIt && FadeRight)}
          {...(AnimateIt && Animate)}
          className="absolute right-0 top-2 grid grid-cols-2 gap-2"
        >
          <SavePost postId={post._id} IsSaved={post.Saved} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="third"
                className="py-6"
                NoAnimate={AnimateIt ? false : true}
              >
                <Ellipsis size={30} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isPostMine ? (
                <>
                  <DropdownMenuItem
                    onClick={() => setWarning(true)}
                    className="cursor-pointer"
                  >
                    <Trash /> Delete
                  </DropdownMenuItem>

                  <Link href={`/posts/${post._id}/update`}>
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit /> Edit
                    </DropdownMenuItem>
                  </Link>
                </>
              ) : (
                <>
                  <DropdownMenuItem>
                    <MessageCircleWarning />
                    Report
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
        <div>
          <MotionLink
            href={`/profile/${post.author.username}`}
            {...(AnimateIt && FadeLeft)}
            {...(AnimateIt && Animate)}
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
            {...(AnimateIt && FadeLeft)}
            animate={{
              ...(AnimateIt && Animate.animate),
              transition: { duration: 0.4, delay: 0.2 },
            }}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`text-lg  `}
          >
            {post.description}{" "}
          </motion.h1>
          <motion.p
            {...(AnimateIt && FadeLeft)}
            animate={{
              ...(AnimateIt && Animate.animate),
              transition: { duration: 0.4, delay: 0.3 },
            }}
            className="text-xs"
          >
            {AccountAge(post.createdAt)}
          </motion.p>
        </div>

        <div
          className="relative select-none"
          onClick={() => setShowImage(true)}
        >
          <SimpleAnimatedImage
            src={ImgHandler}
            alt="post image"
            noAnimate={AnimateIt ? false : true}
            className="w-full max-w-[650px]  max-h-[650px] object-cover aspect-auto rounded-2xl"
          />
        </div>

        <div className="grid grid-cols-5 gap-x-1.5 lg:gap-x-5 ">
          <div className="row-span-2 row-start-1">
            <LikeButton
              liked={post.Liked}
              likesCount={post.LikesCount}
              postId={post._id}
              NoAnimate={AnimateIt ? false : true}
            />
          </div>
          <div className="col-span-2">
            <div>{post.commentsCount} Comments</div>

            <Link href={`/posts/${post._id}`}>
              <Button
                variant="third_2"
                className="w-full "
                NoAnimate={AnimateIt ? false : true}
              >
                Comment
              </Button>
            </Link>
          </div>
          <div className="row-span-2 col-span-2 ">
            <RePost
              postId={post._id}
              RePostsCount={post.RePostCount}
              RePosted={post.RePosted}
            />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showImage && (
          <motion.div
            {...opacity}
            {...Animate}
            className="fixed top-0 left-0 w-full h-screen px-4 flex justify-center items-center z-50"
          >
            <div
              className="absolute top-0 left-0 w-full h-full bg-black opacity-70 -z-10"
              onClick={() => setShowImage(false)}
            />
            <div className="py-20">
              <button
                className="absolute top-20 right-0 lg:right-20 rounded-2xl bg-primary text-third p-2 z-20  "
                onClick={() => setShowImage(false)}
              >
                <X size={50} />
              </button>
              <img
                src={ImgHandler}
                alt="post image"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl border"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCard;
