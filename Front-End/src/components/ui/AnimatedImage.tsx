"use client";
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface props {
  src: string;
  alt: string;
  icon?: boolean;
  className?: string;
}

const AnimatedImage: React.FC<props> = ({ src, alt, className = "", icon }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "40px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

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
      className={cn("relative overflow-hidden ", className)}
    >
      <Image
        src={src}
        alt={alt}
        width={icon ? 100 : 1000}
        height={icon ? 100 : 1000}
        draggable={false}
        className=" w-full h-full object-cover  "
      />
      <div className="absolute top-0 left-0 w-full h-full z-10" />
    </motion.div>
  );
};

export default AnimatedImage;
