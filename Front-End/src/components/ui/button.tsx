"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import React from "react";
import { Animate, FadeUp } from "@/animation";

const buttonVariants = cva(
  "inline items-center justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 shadow-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed ",
  {
    variants: {
      variant: {
        primary:
          "w-fit flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium  focus:outline-none focus:ring-2 ring focus:ring-offset-2",
        outline:
          "w-fit flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondaryHigh focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh ",
        secondary:
          "w-fit flex justify-center py-2 px-4 ring-secondary rounded-md shadow-sm text-sm font-medium text-white hover:text-secondary dark:hover:text-secondaryHigh bg-secondary hover:bg-transparent focus:outline-none focus:ring-2 hover:ring focus:ring-offset-2  ",

        secondary_2:
          "w-fit flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium dark:bg-primary bg-third hover:bg-transparent dark:hover:bg-transparent text-primary dark:text-third hover:text-third dark:hover:text-primary   focus:outline-none focus:ring-2 hover:ring focus:ring-offset-2  ",

        third:
          "w-fit flex justify-center py-2 px-4 ring dark:ring-primary ring-secondary rounded-md shadow-sm text-sm font-medium hover:text-white dark:text-primary text-secondary hover:bg-secondary bg-transparent focus:outline-none focus:ring-2 dark:focus:ring-secondary dark:hover:ring-secondary focus:ring-offset-2  ",
        third_2:
          "w-fit flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-third dark:hover:bg-primary hover:text-primary dark:hover:text-third ring ring-third dark:ring-primary  focus:outline-none focus:ring-2 hover:ring focus:ring-offset-2  ",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type NativeButtonProps = Omit<
  React.ComponentProps<"button">,
  // Avoid conflicts with Framer Motion's onDrag handlers
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
>;

interface ButtonProps
  extends NativeButtonProps,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  NoAnimate?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, NoAnimate = false, ...props },
    ref
  ) => {
    const motionProps: HTMLMotionProps<"button"> = NoAnimate
      ? {}
      : {
          ...FadeUp,
          ...Animate,
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.95 },
        };

    const classNames = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      return (
        <Slot
          ref={ref as unknown as React.Ref<HTMLButtonElement>}
          className={classNames}
          {...props}
        />
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classNames}
        {...motionProps}
        {...(props as Omit<React.ComponentProps<"button">, keyof HTMLMotionProps<"button">>)}
      />
    );
  }
);

Button.displayName = "Button";
