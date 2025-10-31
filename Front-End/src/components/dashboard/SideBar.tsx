"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

import { DashboardLinks } from "@/data/Quick_Links";

import { Animate, FadeUp, opacity } from "@/animation";

import { SideBarButton } from "./SideBarButton";
import { X, LogOut, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { SimpleAnimatedImage } from "../ui/AnimatedImage";
import Link from "next/link";

interface Props {
  isSideBarOpened: boolean;
  setIsSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<Props> = ({ isSideBarOpened, setIsSideBarOpened }) => {
  const { logout } = useAuth();
  const { user } = useAuth();
  const [isLogoutPopOpened, setIsLogoutPopOpened] = useState<boolean>(false);

  const isMobile = useIsMobile();

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isSideBarOpened && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSideBarOpened(!isSideBarOpened)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ width: "100px" }}
        animate={{
          x: isMobile ? (isSideBarOpened ? 0 : "-100%") : 0,
          width: isSideBarOpened ? "280px" : "80px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-screen flex flex-col bg-gradient-to-b from-secondary via-secondaryHigh to-secondary text-white shadow-2xl z-40  mr-10 "
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSideBarOpened((prev) => !prev)}
          className={`absolute ${
            isMobile ? "top-4 -right-12" : "top-8 -right-12"
          } w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-secondary hover:scale-110 transition-transform z-50`}
        >
          <motion.div
            animate={{ rotate: !isSideBarOpened ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight size={20} className="text-third dark:text-primary" />
          </motion.div>
        </button>

        {/* Logo Section */}
        <div className="py-6 pl-6 border-b border-white/10">
          <SideBarButton
            title="Ma Book"
            href="/"
            Icon="/open-book.png"
            isMenuOpened={isSideBarOpened}
            WithAnimation={false}
            className="flex items-center gap-3"
          />
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-2 overflow-hidden">
          {DashboardLinks.map((item, i) => (
            <SideBarButton
              key={i}
              title={item.title}
              href={item.href}
              Icon={item.icon}
              isMenuOpened={isSideBarOpened}
              className="relative flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/10 transition-all group"
            />
          ))}
        </div>

        {/* User Section & Logout */}
        <Link
          href={`/profile/${user?.username}`}
          className="p-4 border-t border-white/10 space-y-3 overflow-hidden"
        >
          {user && isSideBarOpened && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                <SimpleAnimatedImage
                  alt="Profile Image"
                  src={
                    user.avatar
                      ? user.avatar
                      : user.gender === "male"
                      ? "/Avatars/Normal_men.jpg"
                      : "/Avatars/Blonde_Girl .jpg"
                  }
                  className="rounded-full w-10 h-10"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="!text-white font-semibold text-sm truncate">
                  {user.fullName}
                </p>
                <p className="text-xs !text-white/70 truncate">
                  @{user.username}
                </p>
              </div>
            </motion.div>
          )}

          <SideBarButton
            Icon={LogOut}
            isMenuOpened={isSideBarOpened}
            title="Logout"
            className="flex items-center gap-3 px-3 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-red-100 transition-all"
            onClick={() => setIsLogoutPopOpened(true)}
          />
        </Link>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutPopOpened && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutPopOpened(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-50"
            >
              <div className="bg-primary dark:bg-third rounded-3xl shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogOut className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-center">
                    Confirm Logout
                  </h2>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                  <p className="text-center text-gray-700 dark:text-gray-300 leading-relaxed">
                    Are you sure you want to logout? Make sure you've saved your
                    password and username.
                  </p>

                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Note:</strong> There is currently no password
                        reset function available.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 p-6 pt-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsLogoutPopOpened(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    Logout
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideBar;
