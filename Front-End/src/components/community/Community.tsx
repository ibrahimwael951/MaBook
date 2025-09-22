"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeLeft, ViewPort } from "@/animation";
import Link from "next/link";
import { Button } from "../ui/button";
import { AnimatedImage } from "../ui/AnimatedImage";
const Community = () => {
  return (
    <section className="flex flex-col lg:flex-row items-center justify-evenly gap-10">
      <div className="text-center  max-w-2xl  space-y-7">
        <motion.h1 {...FadeLeft} {...ViewPort} className="text-6xl">
          Attend for the <span> Inspiration </span>, Stay for the Community
        </motion.h1>
        <motion.p {...FadeLeft} {...ViewPort} className="text-xl">
          Gain insights from leading speakers and connect with a community that
          fuels your growth. Eventverse is more than just events – it’s where
          meaningful relationships begin.
        </motion.p>
        <div className=" flex justify-center items-center gap-5">
          <Link href="/register">
            <Button variant="third_2" className="text-xl py-4">
              Join Us
            </Button>
          </Link>
          <Link href="/community">
            <Button variant="secondary_2" className="text-xl py-4">
              Our Community
            </Button>
          </Link>
        </div>
      </div>

      <AnimatedImage
        src="/Community.avif"
        alt="Community image"
        className="w-full md:w-2/4 lg:w-2/5 max-w-2xl rounded-2xl"
      />
    </section>
  );
};

export default Community;
