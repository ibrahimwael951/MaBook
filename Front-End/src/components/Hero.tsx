"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Spotlight } from "./ui/Spotlight";
import { FadeUp, ViewPort } from "@/animation";
const Hero = () => {
  return (
    <section className="overflow-hidden relative flex flex-col justify-center items-center space-y-6 min-h-screen bg- teal-100 w-full">
      <Spotlight className="-top-0 left-0 md0 md:left-60 lg:left-96 " />
      <motion.h1 {...FadeUp} {...ViewPort} transition={{duration:0.4 }}
       className="text-8xl text-center ">
        Latest Book <br />
        Finding Waves
      </motion.h1>
      <motion.p {...FadeUp} {...ViewPort} transition={{duration:0.4,delay:0.2}} className="text-center">
        Engage with leaders, exchange ideas, and build connections that unlock
        new opportunities.
      </motion.p>
      <Button variant="outline">See People Book</Button>
    </section>
  );
};

export default Hero;
