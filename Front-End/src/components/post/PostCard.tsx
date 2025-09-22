import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Post } from "@/types/Auth";
import { Animate, FadeLeft, FadeRight, FadeUp, opacity } from "@/animation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Edit, Ellipsis, Trash, X } from "lucide-react";
import Avatar from "../ui/Avatar";
import { AccountAge } from "@/hooks/AccountAge";
import { Button } from "../ui/button";
import LikeButton from "./LikeButton";
import api from "@/lib/axios";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useDetectLanguage } from "@/hooks/Language";
import { SimpleAnimatedImage } from "../ui/AnimatedImage";

const MotionLink = motion.create(Link);

interface props {
  post: Post;
}

interface data {
  data: {
    liked: boolean;
  };
}

const PostCard: React.FC<props> = ({ post }) => {
  const { user } = useAuth();
  const pathName = usePathname();
  const router = useRouter();

  const lang = useDetectLanguage(post.description);

  const [showImage, setShowImage] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [hidePost, setHidePost] = useState<boolean>(false);
  const [Liked, setLiked] = useState<boolean>(post.Liked);
  const [postLikes, setPostLikes] = useState<number>(post.LikesCount);
  const handleLike = async () => {
    try {
      setLiked(!Liked);
      await api.post(`/api/${post._id}/like`).then((data: data) => {
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

  const isPostMine = user?.username === post?.author.username;

  const deletePost = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/post/${post._id}`);
      setIsDeleted(true);
      setWarning(false);
      toast(`Deleted`, {
        description: "You have been deleted your Post",
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
    } catch (err) {
      setDeleting(false);
      setWarning(false);
      console.error(err);
      toast(`Deleted Failed`, {
        description: `Try again letter  : ${err} `,
        classNames: {
          toast: "!bg-red-600 !text-white rounded-xl border border-red-700",
          description: "!text-white text-sm opacity-90",
          actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
    }
  };

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
      <AnimatePresence>
        {warning && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <motion.div
              {...opacity}
              animate={{ ...Animate, opacity: 0.5 }}
              className="absolute top-0 left-0 w-full h-full bg-black"
            />
            <motion.div
              {...FadeUp}
              animate={{
                ...Animate.animate,
                height: deleting ? "400px" : "260px",
              }}
              className={`
                relative w-[560px] p-16 flex flex-col  justify-center items-center rounded-2xl text-third dark:text-primary bg-primary dark:bg-third overflow-hidden z-20 mx-5 select-none 
                `}
            >
              <motion.button
                disabled={deleting}
                animate={{ opacity: deleting ? 0.1 : 1 }}
                className="absolute top-0 left-0 text-white bg-red-600 rounded-br-2xl "
                onClick={() => setWarning(false)}
              >
                <X size={40} />
              </motion.button>

              <AnimatePresence>
                {deleting ? (
                  <motion.div
                    {...FadeUp}
                    {...Animate}
                    className="w-full h-full text-2xl flex flex-col gap-5 justify-center items-center"
                  >
                    <div className="inline-block animate-spin rounded-full h-40 w-40 border-b-2  border-third dark:border-primary"></div>
                    Deleting ...
                  </motion.div>
                ) : (
                  <motion.div
                    {...FadeUp}
                    {...Animate}
                    className="flex flex-col justify-center items-center gap-5"
                  >
                    <h1 className="text-2xl text-center ">
                      Are you sure you want to delete this post?{" "}
                    </h1>
                    <div className="flex justify-center items-center gap-5 ">
                      <Button
                        NoAnimate
                        onClick={() => setWarning(false)}
                        variant="third_2"
                        className="h-fit text-xl  "
                      >
                        No, keep post alone
                      </Button>
                      <Button
                        NoAnimate
                        onClick={deletePost}
                        variant="secondary_2"
                        className="h-fit text-xl !text-white !bg-red-600 !hover:bg-red-600 !border-red-600  hover:border-red-600"
                      >
                        Yes, Delete this Post
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="w-full min-h-52 lg:min-w-xl max-w-2xl relative flex flex-col gap-5 ">
        <motion.div
          {...FadeRight}
          {...Animate}
          className="absolute top-0 right-0 p-4 rounded-md font-semibold text-xl z-20"
        >
          <Popover>
            <PopoverTrigger className=" ">
              <Ellipsis size={50} />
            </PopoverTrigger>
            <PopoverContent className="bg-black flex flex-col">
              {isPostMine ? (
                <>
                  <button
                    onClick={() => setWarning(true)}
                    className="  p-4 text-white rounded-md font-semibold text-xl"
                  >
                    <Trash />
                  </button>
                  <Link
                    href={`/posts/${post._id}/update`}
                    className="  p-4 text-white rounded-md font-semibold text-xl"
                  >
                    <Edit />
                  </Link>
                </>
              ) : (
                <button className="  p-4 text-white rounded-md font-semibold text-xl">
                  Report
                </button>
              )}
            </PopoverContent>
          </Popover>
        </motion.div>

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
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`text-lg  `}
          >
            {post.description}{" "}
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
          <div
            className="relative select-none"
            onClick={() => setShowImage(true)}
          >
            <div className="absolute top-0 left-0 w-full h-full z-10" />
            <motion.img
              {...FadeUp}
              animate={{
                ...Animate.animate,
                transition: { duration: 0.4, delay: 0.4 },
              }}
              src={post.image.url}
              alt="post image"
              className="w-full max-w-[650px]  max-h-[650px] object-cover aspect-square rounded-2xl"
            />
          </div>
        )}
        <div className="grid grid-cols-5 gap-x-5 ">
          <div className="col-span-1">{postLikes} Likes</div>
          <div className="col-span-2">{post.commentsCount} Comments</div>
          <div className="col-span-2">{0} Reposts</div>

          <div onClick={handleLike}>
            <LikeButton liked={Liked} />
          </div>

          <Link href={`/posts/${post._id}`} className="col-span-2">
            <Button variant="third_2" className="w-full ">
              Comment
            </Button>
          </Link>

          <Button variant="third_2" className="w-full col-span-2">
            Repost
          </Button>
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
                className="absolute top-20 right-5 lg:right-20 rounded-2xl bg-primary text-third p-2  "
                onClick={() => setShowImage(false)}
              >
                <X size={50} />
              </button>
              <SimpleAnimatedImage
                src={post.image.url}
                alt="post image"
                noAnimate={false}
                className=" w-full max-w-3xl h-auto max-h-[90vh] object-contain border rounded-2xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCard;
