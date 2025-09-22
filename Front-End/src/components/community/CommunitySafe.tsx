"use client";
import React from "react";
import { HowTOSaveIt } from "@/data/CommunityFeatures";
import { FadeLeft, ViewPort } from "@/animation";
import { motion } from "framer-motion";
import { AnimatedImage } from "../ui/AnimatedImage";
const CommunitySafe = () => {
  return (
    <section className="">
      <motion.h1
        {...FadeLeft}
        {...ViewPort}
        className="text-6xl font-semibold mb-3"
      >
        How We Keep Our Community <span> Safe</span>
      </motion.h1>
      <motion.p className="text-2xl mb-10">
        We’re committed to creating a <span> respectful </span> and secure
        environment for everyone. Here’s how we do it:
      </motion.p>
      <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-10">
        <AnimatedImage
          alt="image sly-smiling-bearded-man-business-clothes-pointing"
          src="/sly-smiling-bearded-man-business-clothes-pointing-camera.jpg"
          className="w-full h-72 lg:h-[550px] lg:w-2/4 lg:max-w-xl rounded-2xl"
        />
        <div className="space-y-10 lg:max-w-2xl w-full lg:w-2/4">
          {HowTOSaveIt.map((item, i) => (
            <motion.div
              key={i}
              {...FadeLeft}
              {...ViewPort}
              className=" w-full space-y-2"
            >
              <h1 className="text-2xl font-medium flex items-center gap-2">
                <item.icon size={30} />
                {item.title}
              </h1>
              <p className="ml-5 text-lg">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySafe;
