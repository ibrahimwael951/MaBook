"use client";
import React from "react";
import { motion } from "framer-motion";
import { Animate, FadeUp } from "@/animation";
import Link from "next/link";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
const Deleted = () => {
  const { user } = useAuth();
  return (
    <section className="min-h-screen flex flex-col justify-center gap-4 items-center p-6 overflow-hidden">
      <motion.h1
        {...FadeUp}
        animate={{
          ...Animate.animate,
          opacity: 0.1,
          transition: { ...Animate.animate.transition },
        }}
        className="absolute top-2/4 left-2/4 -translate-2/4 text-[40vw] overflow-hidden -z-20 "
      >
        Done
      </motion.h1>
      <motion.h1
        {...FadeUp}
        animate={{
          ...Animate.animate,
          transition: { ...Animate.animate.transition, delay: 0.2 },
        }}
        className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl text-center"
      >
        Your post has been deleted <span> successfully </span>
      </motion.h1>
      <motion.div
        {...FadeUp}
        animate={{
          ...Animate.animate,
          transition: { ...Animate.animate.transition, delay: 0.3 },
        }}
        className="space-x-5 "
      >
        <Link href={`/profile/${user?.username}`}>
          <Button variant="outline" className="text-2xl ">
            Profile
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="text-2xl ">
            {" "}
            Home
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default Deleted;
