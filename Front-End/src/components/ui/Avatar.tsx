import React from "react";
import AnimatedImage from "./AnimatedImage";
interface props {
  fullName: string;
  gender: string;
  avatar?: string;
}
const Avatar: React.FC<props> = ({ fullName, avatar, gender }) => {
  const classname = "rounded-full w-16 h-16 ";
  return avatar ? (
    <AnimatedImage
      alt={`${fullName} Avatar`}
      src={avatar}
      icon
      noAnimate
      className={classname}
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
      className={classname}
    />
  );
};

export default Avatar;
