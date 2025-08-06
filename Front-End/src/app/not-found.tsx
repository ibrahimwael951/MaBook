"use client";
import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Not_found() {
  const pathName = usePathname();
  return (
    <main className="relative min-h-screen w-full flex flex-col justify-center items-center gap-5 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.24 }}
        className="absolute top-2/4 left-2/4 -translate-2/4 text-[30vw] font-bold text-secondaryHigh opacity-25 -z-10 "
      >
        404
      </motion.div>
      <h1 className="text-8xl font-semibold">Page Not Found</h1>
      <p className="text-3xl">
        there is no page with that name :{" "}
        <span className="text-2xl font-semibold ">{pathName.slice(1)}</span>
      </p>
    <div className="flex items-center gap-4">
    <Link href="/">
        <Button variant="outline">Back to home</Button>
      </Link>
      <Link href="/support">
        <Button variant="outline">Support</Button>
      </Link>
    </div>
    </main>
  );
}
