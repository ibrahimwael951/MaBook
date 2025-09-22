import React from "react";
import { SimpleAnimatedImage } from "./AnimatedImage";
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
    <SimpleAnimatedImage
      alt={`${fullName} Avatar`}
      src={avatar}
      noAnimate
      className={cn(baseClass, className)}
    />
  ) : (
    <SimpleAnimatedImage
      alt={`${fullName} Avatar`}
      src={
        gender === "male"
          ? "/Avatars/Normal_men.jpg"
          : "/Avatars/Blonde_Girl .jpg"
      }
      noAnimate
      className={cn(baseClass, className)}
    />
  );
};

export default Avatar;
