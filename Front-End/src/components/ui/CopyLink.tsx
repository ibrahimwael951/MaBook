"use client";
import { useState } from "react";
import { AnimatePresence, hover, motion } from "framer-motion";
import { CheckCheck, ExternalLink } from "lucide-react";
import { Animate, FadeUp, opacity } from "@/animation";

const MotionCheckCheck = motion(CheckCheck);
const MotionExternalLink = motion(ExternalLink);
interface Props {
  Link: string;
  title: string;
}
export default function CopyLink({ Link, title }: Props) {
  const [copied, setCopied] = useState(false);
  const SavedLink = `${window.location.origin}${Link}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(SavedLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <>
      <motion.div
        title={title}
        onClick={handleCopyLink}
        className="cursor-pointer border border-secondaryHigh rounded-xl p-2 select-none"
      >
        <AnimatePresence>
          {copied ? (
            <MotionCheckCheck
              {...opacity}
              {...Animate}
              size={30}
              className="text-secondaryHigh"
            />
          ) : (
            <MotionExternalLink {...opacity} {...Animate} size={30} />
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {copied && (
          <motion.div
            {...FadeUp}
            {...Animate}
            className="fixed left-2/4 top-5 -translate-x-2/4 text-xl px-4 py-2 rounded-xl bg-green-500 text-white select-none"
          >
            Copied to your Clipboard
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
