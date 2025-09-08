"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/useIsMobile";

// components
import SideBar from "@/components/dashboard/SideBar";
import CopyLink from "@/components/ui/CopyLink";
import Loading from "@/components/Loading";

// animation
import { Animate, FadeUp } from "@/animation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ThemeToggle";

export default function Page() {
  const { loading, user } = useAuth();
  const [isSideBarOpened, setIsSideBarOpened] = useState<boolean>(false);

  const isMobile = useIsMobile();

  if (loading || !user) return <Loading />;
  return (
    <motion.main
      animate={{
        marginLeft:
          !isMobile && isSideBarOpened ? "240px" : isMobile ? "0" : "110px",
      }}
      className="mt-16 lg:mt-5 px-5 lg:px-10  "
    >
      <SideBar
        isSideBarOpened={isSideBarOpened}
        setIsSideBarOpened={setIsSideBarOpened}
      />
      <div className="w-full h-screen   ">
        <motion.div
          {...FadeUp}
          {...Animate}
          className="static flex justify-between items-center gap-2 "
        >
          <div>
            <h1 className="text-4xl lg:text-6xl 2xl:text-7xl  ">
              Welcome <span> {user.fullName} </span>{" "}
            </h1>
            <p className="text-xl ml-5">{user.email}</p>
          </div>
        </motion.div>
        <div className="grid grid-cols-4 gap-5 mt-10 select-none">
          <div className="w-full col-span-4 md:col-span-2 border rounded-2xl flex justify-between items-center p-5">
            <h1 className="text-2xl md:text-3xl lg:text-5xl">Change Theme</h1>

            <ModeToggle />
          </div>
          <div className="w-full col-span-4 md:col-span-2 border rounded-2xl flex justify-between items-center p-5">
            <h1 className="text-2xl md:text-3xl lg:text-5xl">
              Change Language
            </h1>
            <p>coming soon</p>
          </div>
          <Link
            href={`/Update_User_profile`}
            className="  w-full col-span-4 md:col-span-2 "
          >
            <motion.div
              initial="rest"
              whileHover="hover"
              className="relative overflow-hidden w-full col-span-4 md:col-span-2 space-y-6 border rounded-2xl p-5"
            >
              <motion.div
                variants={{
                  rest: { opacity: 0 },
                  hover: { opacity: 0.6 },
                }}
                whileTap={{
                  opacity: 0.2,
                }}
                className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-6xl text-white bg-black cursor-pointer"
              >
                Click To Edit
              </motion.div>
              <h1 className="text-4xl lg:text-5xl">
                Edit Your <span>Profile</span> ?
              </h1>
              <div className="text-2xl">
                <p>
                  <span>First Name </span>: {user.firstName}
                </p>
                <p>
                  <span>Last Name </span>: {user.lastName}
                </p>
                <p>
                  <span>Bio</span>: {user.bio}
                </p>
              </div>
            </motion.div>
          </Link>

          <motion.div
            initial="rest"
            whileHover="hover"
            className="relative overflow-hidden w-full col-span-4 md:col-span-2 space-y-6 border rounded-2xl p-5"
          >
            <motion.div
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 0.6 },
              }}
              whileTap={{
                opacity: 0.2,
              }}
              className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-6xl text-white bg-black cursor-pointer"
            >
              Coming Soon
            </motion.div>
            <h1 className="text-4xl lg:text-5xl">
              My <span>Achievement</span>
            </h1>
            <div className="text-2xl">
              <p>Coming Soon</p>
            </div>
          </motion.div>

          <motion.div
            initial="rest"
            whileHover="hover"
            className="relative overflow-hidden w-full col-span-4 md:col-span-2 space-y-6 border rounded-2xl p-5"
          >
            <motion.div
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 0.6 },
              }}
              whileTap={{
                opacity: 0.2,
              }}
              className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-6xl text-white bg-black cursor-pointer"
            >
              Coming Soon
            </motion.div>
            <h1 className="text-4xl lg:text-5xl">
              Edit Your <span>Email</span> ?
            </h1>
            <div className="text-2xl">Your email : {user.email}</div>
          </motion.div>
          <motion.div
            initial="rest"
            whileHover="hover"
            className="relative overflow-hidden w-full col-span-4 md:col-span-2 space-y-6 border rounded-2xl p-5"
          >
            <motion.div
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 0.6 },
              }}
              whileTap={{
                opacity: 0.2,
              }}
              className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-6xl text-white bg-black cursor-pointer"
            >
              Coming Soon
            </motion.div>
            <h1 className="text-4xl lg:text-5xl">
              Reset your <span>Password</span> ?
            </h1>
          </motion.div>
          <div className="relative overflow-hidden w-full border col-span-2 rounded-2xl p-5 bg-red-600 text-white text-4xl cursor-pointer">
            Delete Account
          </div>
        </div>
      </div>
    </motion.main>
  );
}
