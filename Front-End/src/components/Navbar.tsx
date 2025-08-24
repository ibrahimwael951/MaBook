"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, UserRoundPen } from "lucide-react";
import {
  DashboardLinks,
  Navbar_Logged_In,
  Navbar as NavLinks,
} from "@/data/Quick_Links";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
const Navbar = () => {
  const { loading, user } = useAuth();
  const Pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

  const linksToRender = !user ? NavLinks : Navbar_Logged_In;

  useEffect(() => {
    const handleScroll = () => {
      const offset = 0;
      if (window.scrollY > offset) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const ProfileLink = {
    title: "Profile",
    href: `/profile/${user?.username}`,
    icon: UserRoundPen,
    description: "View and edit your personal information",
  };

  if (loading) return null;
  return (
    <motion.nav
      initial={Pathname === "/dashboard" ? { y: 0 } : { y: "-100%" }}
      animate={Pathname === "/dashboard" ? { y: "-100%" } : { y: 0 }}
      exit={Pathname === "/dashboard" ? { y: 0 } : { y: "-100%" }}
      transition={{ duration: 0.36 }}
      className={`fixed top-0 left-0 lg:left-2/4 lg:-translate-x-2/4 py-3 w-full flex items-center justify-between max-w-6xl  px-5 md:px-10 z-50 ${
        hasScrolled && "bg-primary dark:bg-third"
      }`}
    >
      <Link
        href="/"
        className="flex items-center gap-1 text-2xl font-extrabold p-1.5 rounded-2xl"
      >
        <Image alt="logo" src="/open-book.png" width={50} height={50} />
        Ma Book
      </Link>
      <div className="hidden lg:flex items-center gap-x-2 dark:bg-third dark:text-primary p-1.5 rounded-2xl ">
        {linksToRender.map((item, i) => (
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
            transition={{ duration: 0.15 }}
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
                        Pathname === item.href &&
                        "bg-secondary my-2 text-white "
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
        {loading ? (
          <div className=" py-2 px-5 bg-third text-primary dark:bg-primary dark:text-third rounded-lg border border-third dark:border-primary duration-100">
            {" "}
            Loading
          </div>
        ) : user ? (
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <div className="relative  w-12 h-12 text-2xl font-medium rounded-full dark:text-third text-primary  bg-third dark:bg-primary ">
                    <h1 className="absolute top-2/4 left-2/4 -translate-2/4">
                      {user.fullName.charAt(0)}
                    </h1>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {DashboardLinks.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                    <ListItem
                      key={ProfileLink.title}
                      title={ProfileLink.title}
                      href={ProfileLink.href}
                    >
                      {ProfileLink.description}
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        ) : (
          <Link
            href="/login"
            className=" py-2 px-5 bg-third text-primary dark:bg-primary dark:text-third rounded-lg hover:bg-transparent dark:hover:bg-transparent hover:text-primary dark:hover:text-primary border border-third dark:border-primary duration-100"
          >
            Login
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        asChild
        className="bg-primary hover:bg-primLow dark:bg-third dark:hover:bg-secondaryLow hover:text-white group"
      >
        <Link href={href}>
          <div className="text-lg font-medium">{title}</div>
          <p className=" group-hover:!text-white">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
export default Navbar;
