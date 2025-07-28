"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeLeft, FadeUp, ViewPort } from "@/animation";
import Image from "next/image";
const Futures = () => {
  const future = [
    {
      title: "A lot of Books",
      description:
        "Access a massive collection of books covering every genre, interest, and language.",
    },
    {
      title: "Themes as ur taste",
      description:
        "Customize the look and feel of your reading app with beautiful themes that match your vibe.",
    },
    {
      title: "Awesome Community",
      description:
        "Join a vibrant community of book lovers to share reviews, recommendations, and discussions.",
    },
    {
      title: "Privacy and Auth",
      description:
        "Your data stays safe — robust authentication and privacy settings protect your reading experience.",
    },
  ];

  return (
    <section className=" mb-20  min-h-screen h-scre en">
      <motion.h1
        {...FadeLeft}
        {...ViewPort}
        className="text-7xl mb-10 lg:mb-6  "
      >
        What Awaits <span> You </span>
      </motion.h1>
      <motion.div
        {...FadeUp}
        {...ViewPort}
        className="flex flex-col lg:flex-row items-center h-2/3 justify-evenly  gap-10   "
      >
        <div className="overflow-hidden w-full lg:w-2/5   h-[450px]  ">
          <Image
            alt="book reader"
            src="/Book-Reader.jpg"
            width={1000}
            height={1000}
            className="rounded-2xl object-cover w-full h-full"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:w-2/4 gap-10 w-fit">
          {future.map((item, i) => (
            <motion.div
              key={i}
              {...FadeUp}
              {...ViewPort}
              whileHover={{
                scale: 1.01,
                y: -2,
              }}
              className="p-5 text-center py-7 border-dashed border-2 rounded-2xl"
            >
              <h1 className="text-2xl">{item.title}</h1>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Futures;
