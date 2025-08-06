import { opacity } from "@/animation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
interface Props {
  Message: string;
  Span: string;
  TimeOut?: number;
}
export default function WelcomeMessage({
  Message,
  Span,
  TimeOut = 2000,
}: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), TimeOut);
    return () => clearTimeout(timer);
  }, [TimeOut]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...opacity}
          animate={{
            y: 0,
            x: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
          }}
          transition={{ duration: 0.5 }}
          className="fixed top-2/4 left-2/4 -translate-2/4 text-9xl"
        >
          {Message} <span> {Span} </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
