"use client";
import React from "react";
import { motion } from "framer-motion";
import { features } from "@/data/Features";
import { FadeUp, ViewPort } from "@/animation";
const Features = () => {
  return (
    <section className="max-w-7xl mx-auto mt-20">
      <motion.h1
        {...FadeUp}
        {...ViewPort}
        className="text-5xl lg:text-6xl mb-5"
      >
        Platform <span> Features </span>
      </motion.h1>

      <div className="space-y-5">
        {features.map((item, i) => (
          <motion.div
            key={i}
            {...FadeUp}
            {...ViewPort}
            whileHover={{
              scale: 1.01,
              y: -2,
            }}
            className="w-full  space-y-2 border-dashed border-2 p-4 rounded-2xl "
          >
            <h1 className="flex items-center gap-2 text-4xl">
              <item.icon size={50} />
              {item.title}
            </h1>
            <p className="text-xl ml-4">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
