"use client";
import React from 'react'
import { motion  } from "framer-motion";
import { Animate, FadeUp } from "@/animation";

const Loading = () => {
      return (
    <motion.div
      {...FadeUp}
      {...Animate}
      className="text-center py-8 w-full h-screen flex flex-col justify-center items-center "
    >
      <div className="inline-block animate-spin rounded-full h-40 w-40 border-b-2  border-third dark:border-primary"></div>
      <p className="mt-2 text-2xl ">Loading...</p>
    </motion.div>
  );
 
}

export default Loading
