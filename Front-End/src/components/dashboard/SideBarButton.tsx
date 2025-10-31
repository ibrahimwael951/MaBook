"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeLeft } from "@/animation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  href?: string;
  onClick?: () => void;
  title: string;
  Icon: LucideIcon | string;
  isMenuOpened: boolean;
  className?: string;
  WithAnimation?: boolean;
}

export const SideBarButton: React.FC<Props> = ({
  isMenuOpened,
  title,
  Icon,
  href,
  onClick,
  className,
  WithAnimation = true,
}) => {
  const renderButton = () => (
    <motion.div
      whileHover="hover"
      initial="initial"
      variants={
        isMenuOpened
          ? {
              initial: { x: 0 },
              hover: { x: 5 },
            }
          : { initial: { x: 0 } }
      }
      className={cn(
        "relative text-2xl flex items-center gap-2 cursor-pointer w-fit pr-3",
        className
      )}
    >
      {typeof Icon === "string" ? (
        <Image
          alt="logo"
          src={Icon}
          width={50}
          height={50}
          className="w-10 h-10 object-cover"
        />
      ) : (
        <Icon size={30} />
      )}
      <AnimatePresence>
        {isMenuOpened && (
          <motion.div
            {...FadeLeft}
            animate={{
              y: 0,
              x: 0,
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              transition: { duration: 0.2, delay: 0.2 },
            }}
            className="pl-1 absolute top-2/4 -translate-y-2/4 left-full w-40"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>
      {!isMenuOpened && WithAnimation && (
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
          className="absolute top-2/4 -translate-y-2/4 left-16 w-32 text-black dark:text-white"
        >
          {title}
        </motion.div>
      )}
    </motion.div>
  );

  if (href) return <Link href={href}>{renderButton()}</Link>;
  if (onClick) return <div onClick={onClick}>{renderButton()}</div>;
  return renderButton();
};
