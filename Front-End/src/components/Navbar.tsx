"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Navbar as NavLinks } from "@/data/Quick_Links";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { Animate, FadeDown } from "@/animation";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const Pathname = usePathname();
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  return (
    <motion.nav
      {...FadeDown}
      {...Animate}
      transition={{ duration: 0.36 }}
      className="fixed top-0 left-0 lg:left-2/4 lg:-translate-x-2/4 py-3 w-full flex items-center justify-between max-w-6xl  px-5 md:px-10 z-50 "
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-2xl font-extrabold p-1.5 rounded-2xl"
      >
        <Image alt="logo" src="/open-book.png" width={50} height={50} />
        {/* <BookOpenText size={40} /> */}
        Ma Book
      </Link>
      <div className="hidden lg:flex items-center gap-x-2 dark:bg-third dark:text-primary p-1.5 rounded-2xl ">
        {NavLinks.map((item, i) => (
          <Link key={i} href={item.href}>
            <motion.div
              animate={
                Pathname === item.href && {
                  translateY: -3,
                  transition: { duration: 0.2 },
                }
              }
              className={`${
                Pathname === item.href && "bg-secondary text-white "
              }  py-1 px-2 rounded-xl md:text-xl`}
            >
              {item.title}
            </motion.div>
          </Link>
        ))}
      </div>
      <button
        className="lg:hidden cursor-pointer dark:bg-third dark:text-primary p-1.5 rounded-2xl"
        onClick={() => setIsMenuOpened((prev) => !prev)}
      >
        <Menu size={40} />
      </button>

      <AnimatePresence>
        {isMenuOpened && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="absolute top-0 left-0  lg:hidden h-screen w-full bg-primary dark:bg-third py-5 px-10 space-y-10"
          >
            <div className="flex w-full justify-between  ">
              <ModeToggle />

              <button
                onClick={() => setIsMenuOpened((prev) => !prev)}
                className=""
              >
                <Menu size={40} />
              </button>
            </div>
            <div className="">
              <h1 className="text-3xl font-extrabold">Quick Links</h1>
              <div className="space-y-5 mt-5">
                {NavLinks.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setIsMenuOpened((prev) => !prev)}
                  >
                    <motion.div
                      animate={
                        Pathname === item.href && {
                          translateY: -3,
                          transition: { duration: 0.2 },
                        }
                      }
                      className={`${
                        Pathname === item.href && "bg-secondary my-2 text-white "
                      } flex items-center gap-2 text-3xl font-semibold ml-4 px-3 py-1 rounded-xl`}
                    >
                      <item.icon size={30} />

                      {item.title}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hidden lg:inline">
        <ModeToggle />
      </div>
    </motion.nav>
  );
};

export default Navbar;
