"use client";
import React from "react";
import { motion } from "framer-motion";
import AnimatedImage from "../ui/AnimatedImage";
import { AccountAge } from "@/hooks/AccountAge";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "../Loading";
import { UserProfile } from "@/types/Auth";
import { Animate, FadeLeft, FadeUp } from "@/animation";

interface InfoProps extends UserProfile {}

const Info: React.FC<InfoProps> = (props) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  return (
    <section>
      <div className="relative flex flex-col sm:flex-row gap-5 justify-center items-center sm:items-start text-center sm:text-start">
        <div className="flex flex-col justify-center items-center gap-5">
          <AnimatedImage
            src={
              props.gender === "male"
                ? "/Avatars/Normal_men.jpg"
                : "/Avatars/Blonde_Girl .jpg"
            }
            alt={`${props.fullName}Avatar`}
            className="rounded-full max-w-40 "
          />
          <motion.div
            {...FadeLeft}
            {...Animate}
            className="bg-secondary p-2 rounded-xl text-white "
          >
            Reader since {props.createdAt && AccountAge(props.createdAt)}
          </motion.div>
        </div>
        <div className="lg:mt-5 space-y-2">
          <motion.p
            {...FadeUp}
            {...Animate}
            className="text-2xl font-semibold "
          >
            #{props.username}
          </motion.p>

          <motion.h1
            {...FadeUp}
            {...Animate}
            className="text-4xl font-semibold"
          >
            {props.fullName}
          </motion.h1>

          <motion.p {...FadeUp} {...Animate}>
            {props.bio
              ? props.bio
              : `${
                  props.gender === "male" ? "He" : "She"
                } is too busy reading to write a bio.`}
          </motion.p>

          <motion.div
            {...FadeUp}
            {...Animate}
            className="flex justify-center items-center gap-10 text-center mt-5"
          >
            <div>
              <p>Followers</p>
              <p>{props.followers ? props.followers : 0}</p>
            </div>
            <div>
              <p>Following</p>
              <p>{props.following ? props.following : 0}</p>
            </div>
            <div>
              <p>Posts</p>
              <p>{props.posts ? props.posts : 0}</p>
            </div>
          </motion.div>

          {user?.username != props.username && (
            <motion.div
              {...FadeUp}
              {...Animate}
              className="flex justify-center items-center gap-5 mt-5"
            >
              <Button variant="outline">Follow</Button>
              <Button variant="outline">
                {props.gender === "male" ? "His" : "Her"} Books
              </Button>
              {props.gender === user?.gender && (
                <Button variant="outline">Send Good message</Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div>
          
        </div>
      </div>
    </section>
  );
};

export default Info;
