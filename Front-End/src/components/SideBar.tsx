"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardLinks } from "@/data/Quick_Links";
import Link from "next/link";
import { LogOut, PanelRightOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Animate, FadeUp, opacity } from "@/animation";
const MotionLink = motion(Link);
const MotionPanelRightOpen = motion(PanelRightOpen);
const SideBar = () => {
  const { logout, user } = useAuth();
  const [isSideBarOpened, setIsSideBarOpened] = useState<boolean>(false);
  const [isLogoutPopOpened, setIsLogoutPopOpened] = useState<boolean>(false);

  return (
    <>
      <AnimatePresence>
        {isLogoutPopOpened && (
          <>
            <motion.div
              {...opacity}
              animate={{ opacity: 0.6 }}
              className=" absolute top-0 left-0 w-full h-screen bg-black opacity-60 z-50"
            />
            <motion.div
              {...FadeUp}
              {...Animate}
              className="absolute top-2/4 left-2/4 -translate-2/4 bg-primary dark:bg-secondary max-w-xl  w-5/6 h-52 rounded-2xl overflow-hidden p-5 flex flex-col justify-between z-50"
            >
              <div>
                <h1 className="text-2xl lg:text-3xl font-semibold ">
                  Are u sure you want to Logout ??
                </h1>
                <p>
                  make sure you saved the password and username , cuz there is
                  no reset password function {":("}
                </p>
              </div>
              <div className="w-full  flex justify-evenly items-center gap-5">
                <motion.button
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  onClick={() => setIsLogoutPopOpened(false)}
                  className="bg-primary dark:bg-third rounded-xl  p-2 text-xl"
                >
                  no, stay Login
                </motion.button>
                <motion.button
                  onClick={logout}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="bg-primary dark:bg-third rounded-xl  p-2 text-xl"
                >
                  Yes, Logout
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ width: "100px" }}
        animate={{ width: isSideBarOpened ? "fit-content" : 80 }}
        transition={{ duration: 0.2 }}
        className={`space-y-5 ${
          !isSideBarOpened && " items-center"
        } absolute top-0 left-0  h-screen flex flex-col bg-secondary p-5 pt-20 `}
      >
        <button
          onClick={() => setIsSideBarOpened((prev) => !prev)}
          className="cursor-pointer"
        >
          <MotionPanelRightOpen
            initial={{ rotate: 0 }}
            animate={{ rotate: isSideBarOpened ? 0 : 180 }}
            size={30}
          />
        </button>
        <div className="flex items-center gap-3">
          <div
            style={{ fontSize: "25px" }}
            className="py-2 p-5 bg-primary text-third rounded-full text-center  "
          >
            {user?.fullName.charAt(0)}
          </div>
          {isSideBarOpened && (
            <div>
              <h1 className="text-2xl">{user?.username}</h1>
              <h2 className="text-xl">{user?.fullName}</h2>
            </div>
          )}
        </div>

        <div className="space-y-5 ">
          {DashboardLinks.map((item, i) => (
            <MotionLink
              whileHover="hover"
              initial="initial"
              variants={
                isSideBarOpened
                  ? {
                      initial: { x: 0 },
                      hover: { x: 5 },
                    }
                  : { initial: { x: 0 } }
              }
              href={item.href}
              key={i}
              className="relative text-2xl gap-2 flex items-center"
            >
              <item.icon size={30} />
              {isSideBarOpened && item.title}
              {!isSideBarOpened && (
                <motion.div
                  variants={{
                    initial: { opacity: 0, x: 10, pointerEvents: "none" },
                    hover: {
                      opacity: 1,
                      x: 0,
                      pointerEvents: "auto",
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    },
                  }}
                  className="absolute top-2/4 -translate-y-2/4 left-16 w-32 "
                >
                  {item.title}
                </motion.div>
              )}
            </MotionLink>
          ))}
        </div>
        <motion.div
          whileHover="hover"
          initial="initial"
          variants={
            isSideBarOpened
              ? {
                  initial: { x: 0 },
                  hover: { x: 5 },
                }
              : { initial: { x: 0 } }
          }
          onClick={() => setIsLogoutPopOpened(true)}
          className="relative text-red-600 text-2xl flex items-center gap-2 mt-20 "
        >
          <LogOut size={30} />
          {isSideBarOpened && "logout"}
          {!isSideBarOpened && (
            <motion.div
              variants={{
                initial: { opacity: 0, x: 10, pointerEvents: "none" },
                hover: {
                  opacity: 1,
                  x: 0,
                  pointerEvents: "auto",
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                },
              }}
              className="absolute top-2/4 -translate-y-2/4 left-16 w-32 "
            >
              Logout
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default SideBar;
