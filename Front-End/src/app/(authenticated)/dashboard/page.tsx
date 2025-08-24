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
      <div className="w-full h-screen">
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
          <CopyLink
            title="Copy Your Profile Link"
            Link={`/profile/${user.username}`}
          />
        </motion.div>
      </div>
    </motion.main>
  );
}
