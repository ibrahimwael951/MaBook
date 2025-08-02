"use client";
import React from "react";
import { motion } from "framer-motion";
import { FadeLeft, FadeUp, ViewPort } from "@/animation";
import Image from "next/image";
import { features } from "@/data/Features";
const Features = () => {
 

  return (
    <section className=" mb-20    ">
      <motion.h1
        {...FadeLeft}
        {...ViewPort}
        className="text-7xl mb-10 lg:mb-6  "
      >
        What Awaits <span> You </span>
      </motion.h1>
      <motion.div
        {...FadeUp}
        {...ViewPort}
        className="flex flex-col lg:flex-row items-center h-2/3 justify-evenly  gap-4   "
      >
        <div className="overflow-hidden w-full lg:w-2/6 md:max-w-xl h-[450px]  ">
          <Image
            alt="book reader"
            src="/Book-Reader.jpg"
            width={1000}
            height={1000}
            className="rounded-2xl object-cover w-full h-full"
          />
        </div>

        <div className="grid md:grid-cols-2  gap-4 w-fit">
          {features.slice(0,4).map((item, i) => (
            <motion.div
              key={i}
              {...FadeUp}
              {...ViewPort}
              whileHover={{
                scale: 1.01,
                y: -2,
              }}
              className="p-5 text-center py-7 border-dashed border-2 rounded-2xl w-full md:max-w-80"
            >
              <h1 className="text-2xl flex items-center  justify-center gap-2 mb-2 "> 
                <item.icon size={30}/>
                {item.title}</h1>
              <p>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Features;
