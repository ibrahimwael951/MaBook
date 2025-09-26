"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import SideBar from "@/components/dashboard/SideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSideBarOpened, setIsSideBarOpened] = useState<boolean>(false);

  const isMobile = useIsMobile();

  return (
    <>
      <SideBar
        isSideBarOpened={isSideBarOpened}
        setIsSideBarOpened={setIsSideBarOpened}
      />
      <motion.main
        animate={{
          marginLeft:
            !isMobile && isSideBarOpened ? "240px" : isMobile ? "0" : "110px",
        }}
      >
        {children}
      </motion.main>
    </>
  );
}
