"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Spotlight } from "./ui/Spotlight";
import { FadeUp, Animate } from "@/animation";
import Link from "next/link";
const Hero = () => {
  return (
    <section className="overflow-hidden relative flex flex-col justify-center items-center space-y-6 min-h-screen w-full">
      <Spotlight className="-top-0 left-0 md0 md:left-60 lg:left-96 " />
      <motion.h1
        {...FadeUp}
        {...Animate}
        transition={{ duration: 0.4 }}
        className="text-8xl text-center -px-5 "
      >
        Latest <span> Book</span> <br />
        Finding Waves
      </motion.h1>
      <motion.p
        {...FadeUp}
        {...Animate}
        transition={{ delay: 0.25 }}
        className="text-center"
      >
        Engage with leaders, exchange ideas, and build connections that unlock
        new opportunities.
      </motion.p>
      <motion.div {...FadeUp} {...Animate} transition={{ delay: 0.4 }} className="flex justify-center items-center gap-5">
        <Link href="/register">
          <Button variant="outline" className="text-xl py-4">
            Create Account
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="outline" className="text-xl py-4">
            About Us
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
