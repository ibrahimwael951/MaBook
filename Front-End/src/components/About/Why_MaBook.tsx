"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeLeft, FadeUp, ViewPort } from "@/animation";
import Image from "next/image";
const MotionImage = motion(Image);
const Why_MaBook = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row gap-10 lg:gap-5 overflow-x-hidden ">
      <MotionImage
        {...FadeLeft}
        {...ViewPort}
        src="/young-man-examinating-book.jpg"
        alt="man reading book"
        width={1000}
        height={1000}
        className="rounded-2xl w-full md:w-2/4 object-cover"
      />
      <div className=" space-y-5 w-full md:w-2/4">
        <motion.h1 {...FadeLeft} {...ViewPort} className="text-5xl lg:text-7xl">
          Why <span> MaBook </span>?
        </motion.h1>
        <div className="ml-5 space-y-5">
          <motion.p
            {...FadeLeft}
            {...ViewPort}
            className="text-xl lg:text-2xl mt-2"
          >
            Because books deserve more than just dusty shelves or hidden reading
            logs. MaBook is where:
          </motion.p>
          <ul className="text-lg lg:text-2xl list-inside list-disc">
            {[
              "You get congrats for finishing a book",
              "You store your life as a reader",
              "You encourage others to start their reading journey",
            ].map((item) => (
              <motion.li {...FadeLeft} {...ViewPort} key={item}>
                {item}
              </motion.li>
            ))}
          </ul>
          <motion.p {...FadeUp} {...ViewPort} className="text-lg lg:text-xl">
            Whether you're looking to inspire or get inspired, MaBook helps you
            connect through stories.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default Why_MaBook;
