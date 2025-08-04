"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

import { DashboardLinks } from "@/data/Quick_Links";

import { Animate, FadeUp, opacity } from "@/animation";
import { LogOut, PanelRightOpen } from "lucide-react";
import { SideBarButton } from "./SideBarButton";
import { useIsMobile } from "@/hooks/useIsMobile";

const MotionPanelRightOpen = motion(PanelRightOpen);

interface Props {
  isSideBarOpened: boolean;
  setIsSideBarOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar: React.FC<Props> = ({ isSideBarOpened, setIsSideBarOpened }) => {
  const { logout } = useAuth();

  const [isLogoutPopOpened, setIsLogoutPopOpened] = useState<boolean>(false);

  const isMobile = useIsMobile();

  return (
    <>
      <AnimatePresence>
        {isSideBarOpened && isMobile && (
          <motion.div
            {...opacity}
            onClick={() => setIsSideBarOpened(!isSideBarOpened)}
            animate={{ opacity: 0.6 }}
            className="fixed top-0 left-0 w-full h-screen bg-black  z-40"
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ width: "100px" }}
        animate={{
          x: isMobile ? (isSideBarOpened ? 0 : "-100%") : 0,
          width: isSideBarOpened ? "200px" : "80px",
        }}
        transition={{ duration: 0.2 }}
        className={`space-y-5 ${
          !isSideBarOpened && " items-center"
        } absolute top-0 left-0  h-screen flex flex-col items-start justify-between bg-secondary  px-5 py-20  select-none  z-40`}
      >
        <div className="relative w-full">
          <button
            onClick={() => setIsSideBarOpened((prev) => !prev)}
            className={`absolute top-2/4 -translate-y-2/4 ${
              isSideBarOpened ? "translate-x-0" : " translate-x-5"
            } left-[120%] cursor-pointer duration-100 z-10  `}
          >
            <div className="absolute top-2/4 -translate-y-2/4 -left-4 w-full h-full bg-secondary p-5 px-7 rounded-r-xl -z-10" />
            <MotionPanelRightOpen
              initial={{ rotate: 0 }}
              animate={{ rotate: isSideBarOpened ? 0 : 180 }}
              size={30}
            />
          </button>

          <SideBarButton
            title="Ma Book"
            href="/"
            Icon="/open-book.png"
            isMenuOpened={isSideBarOpened}
            WithAnimation={false}
          />
        </div>

        <div className="space-y-5 ">
          {DashboardLinks.map((item, i) => (
            <SideBarButton
              key={i}
              title={item.title}
              href={item.href}
              Icon={item.icon}
              isMenuOpened={isSideBarOpened}
              className="relative text-2xl gap-2 flex items-center my-5"
            />
          ))}
        </div>

        <SideBarButton
          Icon={LogOut}
          isMenuOpened={isSideBarOpened}
          title="Logout"
          className="text-red-600"
          onCLick={() => setIsLogoutPopOpened(true)}
        />
      </motion.div>

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
                  Are u sure you want to{" "}
                  <span className="!text-red-600 dark:!text-red-600">
                    {" "}
                    Logout{" "}
                  </span>{" "}
                  ??
                </h1>
                <p>
                  make sure you saved the password and username , cuz there is
                  no reset password function {":("}
                </p>
              </div>
              <div className="w-full flex justify-evenly items-center gap-5">
                <motion.button
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  onClick={() => setIsLogoutPopOpened(false)}
                  className="bg-primary dark:bg-third rounded-xl  p-2 text-xl cursor-pointer"
                >
                  No, stay Login
                </motion.button>
                <motion.button
                  onClick={logout}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95, y: 0 }}
                  className="bg-red-600 text-white rounded-xl  p-2 text-xl cursor-pointer"
                >
                  Yes, Logout
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideBar;
