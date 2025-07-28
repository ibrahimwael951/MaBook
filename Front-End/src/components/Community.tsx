"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { FadeLeft, FadeRight, ViewPort } from "@/animation";
import Link from "next/link";
import { Button } from "./ui/button";
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
        <Link href="/login">
          <Button variant="outline" className="text-xl py-4">Join Us</Button>
        </Link>
      </div>
      <motion.div
        {...FadeRight}
        {...ViewPort}
        className="w-full md:w-2/4 lg:w-2/5 max-w-2xl"
      >
        <Image
          src="/Community.avif"
          alt="Community image"
          width={1000}
          height={1000}
          className="w-full rounded-2xl"
        />
      </motion.div>
    </section>
  );
};

export default Community;
