"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, UserRoundPen } from "lucide-react";
import { X } from "lucide-react";
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
import Avatar from "./ui/Avatar";
import { Button } from "./ui/button";
import { useIsTablet } from "@/hooks/useIsMobile";
const Navbar = () => {
  const { loading, user } = useAuth();
  const Pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const linksToRender = !user ? NavLinks : Navbar_Logged_In;
  const isMobile = useIsTablet();
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  useEffect(() => {
    if (!isMobile) return;
    document.body.style.overflow = isMenuOpened ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpened, isMobile]);

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

  const PathNameRight = Pathname.slice(0, 10) === "/dashboard";

  if (loading) return null;
  return (
    <motion.nav
      initial={PathNameRight ? { y: 0 } : { y: "-100%" }}
      animate={PathNameRight ? { y: "-100%" } : { y: 0 }}
      exit={PathNameRight ? { y: 0 } : { y: "-100%" }}
      transition={{ duration: 0.36 }}
      className={`fixed top-0 left-0 right-0 py-4 px-4 md:px-6 lg:px-8 z-50 transition-all duration-300 
        ${hasScrolled && "bg-white/80 dark:bg-third/80 "}
        `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        {!user ? (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondaryHigh rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Image
                alt="logo"
                src="/open-book.png"
                width={40}
                height={40}
                className="relative"
              />
            </div>
            <span className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-secondary to-secondaryHigh bg-clip-text text-transparent hidden sm:inline">
              Ma Book
            </span>
          </Link>
        ) : (
          <div className="w-10"></div>
        )}

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-2 bg-gray-100 dark:bg-third p-1.5 rounded-2xl shadow-inner">
          {linksToRender.map((item, i) => (
            <Link key={i} title={item.title} href={item.href}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  Pathname === item.href && {
                    y: -3,
                    transition: { duration: 0.2 },
                  }
                }
                className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                  Pathname === item.href
                    ? "bg-gradient-to-r from-secondary to-secondaryHigh dark:text-white !text-white shadow-lg"
                    : "hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <item.icon size={20} strokeWidth={1.5} />
                {user ? null : <>{item.title}</>}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex lg:hidden items-center gap-1 bg-gray-100 dark:bg-third p-1 rounded-xl">
          {linksToRender.map((item, i) => (
            <Link key={i} title={item.title} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  Pathname === item.href
                    ? "bg-gradient-to-r from-secondary to-secondaryHigh text-white"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <item.icon size={22} strokeWidth={1.5} />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Right Section - User Menu / Login */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex">
            {loading ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-third rounded-xl">
                <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Loading...</span>
              </div>
            ) : user ? (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Avatar
                        fullName={user.username}
                        gender={user.gender}
                        avatar={user.avatar}
                        className="w-9 h-9 ring-2 ring-gray-200 dark:ring-gray-700"
                      />
                      <span className="text-sm font-semibold hidden xl:inline">
                        {user.username}
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-2 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px]">
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
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-secondary to-secondaryHigh text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            onClick={() => setIsMenuOpened((prev) => !prev)}
          >
            <Menu size={24} strokeWidth={2} />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpened && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMenuOpened(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm lg:hidden bg-white dark:bg-third shadow-2xl overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <Image
                    alt="logo"
                    src="/open-book.png"
                    width={32}
                    height={32}
                  />
                  <span className="text-xl font-bold">Ma Book</span>
                </div>
                <div className="flex items-center gap-3">
                  <ModeToggle />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMenuOpened(false)}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    <X size={24} />
                  </motion.button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* User Section */}
                {user && (
                  <Link
                    href={`/profile/${user.username}`}
                    onClick={() => setIsMenuOpened(false)}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-secondary/10 to-secondaryHigh/10 rounded-2xl hover:from-secondary/20 hover:to-secondaryHigh/20 transition-colors"
                  >
                    <Avatar
                      fullName={user.username}
                      gender={user.gender}
                      avatar={user.avatar}
                      className="w-14 h-14 ring-2 ring-secondary/20"
                    />
                    <div>
                      <p className="font-semibold text-lg">{user.fullName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        @{user.username}
                      </p>
                    </div>
                  </Link>
                )}

                {/* Quick Links Section */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                    Quick Links
                  </h2>
                  <div className="space-y-2">
                    {(user ? Navbar_Logged_In : NavLinks).map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setIsMenuOpened(false)}
                      >
                        <motion.div
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                            Pathname === item.href
                              ? "bg-gradient-to-r from-secondary to-secondaryHigh text-white shadow-lg"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          <item.icon size={22} strokeWidth={1.5} />
                          <>{item.title}</>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Profile Section */}
                {user && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                      Profile
                    </h2>
                    <div className="space-y-2">
                      {DashboardLinks.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          onClick={() => setIsMenuOpened(false)}
                        >
                          <motion.div
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                              Pathname === item.href
                                ? "bg-gradient-to-r from-secondary to-secondaryHigh !text-white shadow-lg"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            <item.icon size={22} strokeWidth={1.5} />
                            <>{item.title}</>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auth Buttons */}
                {!user && (
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Link href="/login" onClick={() => setIsMenuOpened(false)}>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 px-6 bg-gradient-to-r from-secondary to-secondaryHigh text-white font-semibold rounded-xl shadow-lg"
                      >
                        Login
                      </motion.button>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMenuOpened(false)}
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700"
                      >
                        Register
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
        className="group block select-none space-y-1 rounded-xl p-4 leading-none no-underline outline-none transition-all hover:bg-gradient-to-r hover:from-secondary/10 hover:to-secondaryHigh/10 hover:shadow-md"
      >
        <Link href={href}>
          <div className="text-sm font-semibold leading-none text-gray-900 dark:text-gray-100 group-hover:text-secondary transition-colors">
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-gray-600 dark:text-gray-400 mt-2">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default Navbar;
