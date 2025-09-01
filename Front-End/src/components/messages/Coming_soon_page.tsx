"use client";
import React from "react";
import { motion } from "framer-motion";
import { Animate, FadeUp } from "@/animation";
import Link from "next/link";
import { Button } from "../ui/button";

const Coming_soon_page = () => {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col gap-3 justify-center items-center w-full ">
      <motion.h1
        {...FadeUp}
        animate={{ ...Animate.animate, opacity: 0.1 }}
        className="absolute top-2/4 left-2/4 -translate-2/4 w-fit text-center -rotate-[90deg] sm:rotate-0 text-[60vw] sm:text-[40vw] font-semibold -z-10 select-none"
      >
        Soon
      </motion.h1>
      <motion.h1
        {...FadeUp}
        animate={{
          ...Animate.animatenly,
          transition: { ...Animate.transition, delay: 0.15 },
        }}
        className="text-5xl font-extrabold text-center"
      >
        We’re <span> working </span> on this Page
      </motion.h1>
      <motion.p
        {...FadeUp}
        animate={{
          ...Animate.animatenly,
          transition: { ...Animate.transition, delay: 0.3 },
        }}
        className="text-2xl text-center"
      >
        stay tuned for something awesome
      </motion.p>
      <motion.div
        {...FadeUp}
        animate={{
          ...Animate.animatenly,
          transition: { ...Animate.transition, delay: 0.4 },
        }}
        className="flex justify-center items-center gap-5"
      >
        <Link href="/">
          <Button NoAnimate variant="third_2">
            {" "}
            Home
          </Button>
        </Link>
        <Link href="/contact">
          <Button NoAnimate variant="secondary_2">
            {" "}
            Contact
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default Coming_soon_page;
