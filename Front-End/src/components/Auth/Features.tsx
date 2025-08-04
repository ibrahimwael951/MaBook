import { features } from "@/data/Features";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Animate, FadeRight } from "@/animation";

const Features = () => {
  return (
    <motion.section
      {...FadeRight}
      {...Animate}
      className="max-w-md lg:max-w-2xl mx-auto w-full"
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-2xl font-extrabold py-1.5  rounded-2xl"
      >
        <Image alt="logo" src="/open-book.png" width={50} height={50} />
        Ma Book
      </Link>
      <div>
        {features.map((item, i) => (
          <div key={i} className="flex items-start gap-4 space-y-4 my-5">
            <item.icon size={25} />
            <div className=" ">
              <h1 className="text-lg">{item.title}</h1>
              <p>
                {item.description.split(" ").slice(0, 10).join(" ") + "...."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default Features;
