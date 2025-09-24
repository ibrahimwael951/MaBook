"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Animate, FadeUp, opacity } from "@/animation";
import api from "@/lib/axios";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface props {
  PostId: string;
  close: () => void;
  Deleted: () => void;
}

const DeletePost: React.FC<props> = ({ PostId, Deleted, close }) => {
  const [deleting, setDeleting] = useState<boolean>(false);

  const deletePost = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/post/${PostId}`);
      Deleted();
      close();
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
      close();
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
  return (
    <>
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
            onClick={() => close()}
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
                <div className="flex flex-col md:flex-row justify-center items-center gap-5 ">
                  <Button
                    NoAnimate
                    onClick={() => close()}
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
    </>
  );
};

export default DeletePost;
