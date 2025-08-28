import React from "react";
import AnimatedImage from "./AnimatedImage";
import { cn } from "@/lib/utils";

interface Props {
  fullName: string;
  gender: string;
  avatar?: string;
  className?: string;
}

const Avatar: React.FC<Props> = ({ fullName, avatar, gender, className }) => {
  const baseClass = "rounded-full w-16 h-16";

  return avatar ? (
    <AnimatedImage
      alt={`${fullName} Avatar`}
      src={avatar}
      icon
      noAnimate
      className={cn(baseClass, className)}
    />
  ) : (
    <AnimatedImage
      alt={`${fullName} Avatar`}
      src={
        gender === "male"
          ? "/Avatars/Normal_men.jpg"
          : "/Avatars/Blonde_Girl .jpg"
      }
      icon
      noAnimate
      className={cn(baseClass, className)}
    />
  );
};

export default Avatar;
