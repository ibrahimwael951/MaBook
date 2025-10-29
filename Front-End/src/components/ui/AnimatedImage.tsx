"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
} from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Animate, FadeUp } from "@/animation";

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  icon?: boolean;
  noAnimate?: boolean;
  width?: number;
  height?: number;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  className = "",
  icon = false,
  noAnimate = false,
  width = icon ? 100 : 1000,
  height = icon ? 100 : 1000,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "40px" });
  const controls = useAnimation();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!noAnimate && inView) {
      controls.start("visible");
    }
  }, [inView, controls, noAnimate]);
  const image = src || "/No image found.png";
  const imageProps = {
    src: image,
    alt,
    width,
    height,
    draggable: false,
    onLoad: () => setLoading(false),
    className: cn("w-full h-full object-cover", icon && "object-contain"),
  };

  if (noAnimate) {
    return (
      <div ref={ref} className={cn("relative overflow-hidden", className)}>
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-full h-full left-0 top-0 flex flex-col gap-5 justify-center items-center bg-primary dark:bg-third text-2xl"
            >
              <div className="w-20 h-20 inline-block animate-spin rounded-full border-b-2 border-third dark:border-primary"></div>
              Loading...
            </motion.div>
          )}
        </AnimatePresence>
        <Image {...imageProps} />
        <div className="absolute inset-0 z-10" />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn("relative overflow-hidden", className)}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute w-full h-full left-0 top-0 flex flex-col gap-5 justify-center items-center bg-primary dark:bg-third text-2xl"
          >
            <div className="w-20 h-20 inline-block animate-spin rounded-full border-b-2 border-third dark:border-primary"></div>
            Loading...
          </motion.div>
        )}
      </AnimatePresence>
      <Image {...imageProps} />
      <div className="absolute inset-0 z-10" />
    </motion.div>
  );
};

interface SimpleAnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  noAnimate?: boolean;
}

const SimpleAnimatedImage: React.FC<SimpleAnimatedImageProps> = ({
  src,
  noAnimate = false,
  alt,
  className = "",
  width = 1000,
  height = 1000,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "40px" });
  const controls = useAnimation();

  useEffect(() => {
    if (!noAnimate && inView) {
      controls.start("visible");
    }
  }, [inView, controls]);
  const image = src;
  const imageProps = {
    src: image,
    alt,
    width,
    height,
    draggable: false,
    onLoad: () => setLoading(false),
    className: cn("w-full h-full object-cover"),
  };

  const [loading, setLoading] = useState<boolean>(true);
  if (noAnimate) {
    return (
      <div ref={ref} className={cn("relative overflow-hidden select-none", className)}>
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-full h-full left-0 top-0 flex flex-col gap-5 justify-center items-center bg-primary dark:bg-third text-2xl"
            >
              <div className="w-20 h-20 inline-block animate-spin rounded-full border-b-2 border-third dark:border-primary"></div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          {...FadeUp}
          animate={{
            ...Animate.animate,
            transition: { duration: 0.4, delay: 0.4 },
          }}
          className="absolute top-0 left-0 w-full h-full z-10"
        />
        <img {...imageProps} loading="lazy" />
        <div className="absolute inset-0 z-10" />
      </div>
    );
  }
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
      }}
      className={cn("relative overflow-hidden select-none", className)}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute w-full h-full left-0 top-0 flex flex-col gap-5 justify-center items-center bg-primary dark:bg-third text-2xl"
          >
            <div className="w-20 h-20 inline-block animate-spin rounded-full border-b-2 border-third dark:border-primary"></div>
            Loading...
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        {...FadeUp}
        animate={{
          ...Animate.animate,
          transition: { duration: 0.4, delay: 0.4 },
        }}
        className="absolute top-0 left-0 w-full h-full z-10"
      />
      <motion.img
        {...imageProps}
        animate={{ opacity: loading ? 0 : 1 }}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};

export { AnimatedImage, SimpleAnimatedImage };
