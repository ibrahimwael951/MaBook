"use client";
import React from "react";
import AnimatedImage from "../ui/AnimatedImage";
import { motion } from "framer-motion";
import { Animate, FadeLeft, FadeRight } from "@/animation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MaskContainer } from "../ui/svg-mask-effect";

const Text = {
  title: (
    <>
      A Place Built on <span>Respect</span>, <span>Reading</span>, and Real
      Connections
    </>
  ),
  description: ` We’re a community of readers who support, inspire, and grow together
            through books. Our mission is to build a positive and uplifting
            environment where every reader feels safe, seen, and heard`,
};

const Hero = () => {
  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <section className="min-h-screen mt-20 flex flex-col-reverse justify-center items-center gap-10">
        <AnimatedImage
          alt="image"
          src="/Community_about.jpg"
          className="rounded-xl w-full lg:w-2/4 max-w-xl"
        />
        <div className="w-full lg:w-2/4 text-center space-y-4">
          <motion.h1
            {...FadeRight}
            {...Animate}
            className="text-5xl  font-semibold"
          >
            {Text.title}
          </motion.h1>
          <motion.p {...FadeRight} {...Animate} className="text-2xl">
            {Text.description}
          </motion.p>
        </div>
      </section>
    );
  return (
    <section>
      <motion.h1
        {...FadeLeft}
        {...Animate}
        className="text-xl absolute top-20 left-5 animate-bounce"
      >
        {" "}
        try hover on Text {":>"}
      </motion.h1>

      <div className="flex h-[40rem] w-full items-center justify-center overflow-hidden">
        <MaskContainer
          revealText={
            <p className="mx-auto max-w-4xl text-center text-7xl font-bold text-slate-800 dark:text-white">
              {Text.title}
            </p>
          }
          className="h-[40rem] w-full rounded-md border text-white dark:text-black"
        >
          {Text.description}
        </MaskContainer>
      </div>
    </section>
  );
};

export default Hero;
