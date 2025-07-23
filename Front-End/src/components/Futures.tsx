"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeLeft, FadeUp, ViewPort } from "@/animation";
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
    <section className=" mb-20 ">
      <motion.h1 {...FadeLeft} {...ViewPort} className="text-7xl mb-10">
        Future
      </motion.h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 w-fit">
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
    </section>
  );
};

export default Futures;
