"use client";
import React from "react";
import { motion } from "framer-motion";
import { AnimatedImage } from "../ui/AnimatedImage";
import { FadeLeft, ViewPort } from "@/animation";
import { Features } from "@/data/CommunityFeatures";

const CommunityFeatures = () => {
  return (
    <section>
      <motion.h1
        {...FadeLeft}
        {...ViewPort}
        className="text-6xl font-semibold mb-10"
      >
        What Makes Our <span> Community </span> Special?
      </motion.h1>
      <div className="flex flex-col lg:flex-row justify-center  items-center gap-0  lg:gap-10">
        <div className="w-full lg:w-2/4 lg:h-[600px] flex flex-col gap-10 py-10 ">
          {Features.map((item, i) => (
            <motion.div
              key={i}
              {...FadeLeft}
              {...ViewPort}
              className="h-1/4 w-full"
            >
              <h1 className="text-3xl font-medium flex items-center gap-2">
                <item.icon size={25} />
                {item.title}
              </h1>
              <p className="ml-5 text-xl">{item.description}</p>
            </motion.div>
          ))}
        </div>
        <AnimatedImage
          src="/Community.avif"
          alt="Community image"
          className="w-full lg:w-2/4 lg:max-w-xl max-h-[600px] rounded-2xl"
        />
      </div>
    </section>
  );
};

export default CommunityFeatures;
