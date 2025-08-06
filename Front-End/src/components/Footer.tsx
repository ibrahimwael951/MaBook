"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Company,
  Navbar,
  socialMedia,
} from "@/data/Quick_Links";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const Footer = () => {
  const pathName = usePathname();

  if (pathName === "/dashboard") return null;
  return (
    <section className="max-w-5xl mx-auto border-t-2 border-secondaryHigh mt-10 p-10 space-y-10">
      <Link
        href="/"
        className="flex items-center gap-1 text-3xl font-extrabold rounded-2xl"
      >
        <Image alt="logo" src="/open-book.png" width={50} height={50} />
        Ma Book
      </Link>
      <div className="  flex flex-wrap justify-between gap-10">
        <div>
          <h1 className="text-2xl font-extrabold">Company</h1>

          <div className="ml-2 mt-4 space-y-3">
            {Company.map((item, i) => (
              <MotionLink
                key={i}
                whileHover={{ x: 5 }}
                href={item.href}
                className="flex items-center gap-2 text-2xl"
              >
                <item.icon size={30} />
                {item.title}
              </MotionLink>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Quick Links</h1>
          <div className="ml-2 mt-4 space-y-3">
            {Navbar.map((item, i) => (
              <MotionLink
                key={i}
                whileHover={{ x: 5 }}
                href={item.href}
                className="flex items-center gap-2 text-2xl"
              >
                <item.icon size={30} />
                {item.title}
              </MotionLink>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-extrabold">Social Links</h1>
          <div className="ml-2 mt-4 space-y-3">
            {socialMedia.map((item, i) => (
              <MotionLink
                key={i}
                whileHover={{ x: 5 }}
                href={item.href}
                className="flex items-center gap-2 text-2xl"
              >
                <item.icon size={30} />
                {item.title}
              </MotionLink>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center gap-20">
        <p>© 2025 Ma Book. All rights reserved.</p>
        <p>
          Made By{" "}
          <Link
            href="https://ibrlolportfoli.vercel.app/"
            className="text-lg font-semibold text-secondaryHigh mx-1"
          >
            Ibrahim Wael
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Footer;
