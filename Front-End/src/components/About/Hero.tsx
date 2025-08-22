"use client";
import React from "react";
import { motion } from "framer-motion";
import { Animate, FadeLeft } from "@/animation";
import AnimatedImage from "../ui/AnimatedImage";

const Hero = () => {
  return (
    <section className="mt-20 lg:mt-40 mb-40 flex justify-center lg:justify-evenly items-center flex-col md:flex-row gap-10">
      <div className="space-y-4 max-w-xl w-2/4 ">
        <motion.h1 {...FadeLeft} {...Animate} className="text-5xl lg:text-7xl">
          What is <span> MaBook?</span>
        </motion.h1>
        <motion.p
          {...FadeLeft}
          {...Animate}
          className="text-xl lg:text-2xl ml-4"
        >
          MaBook is a simple, friendly, and inspiring platform built for book
          lovers who want to share their reading journey with others. Whether
          you’re reading your first book or your 100th, MaBook gives you a space
          to express, connect, and inspire through books.
        </motion.p>
      </div>

      <AnimatedImage
        src="/Community_about.jpg"
        alt="community image"
        className="object-cover w-full max-w-xl  md:w-2/4 lg:h-2/3 rounded-2xl"
      />
    </section>
  );
};

export default Hero;
