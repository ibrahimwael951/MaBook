"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SimpleAnimatedImage } from "../ui/AnimatedImage";
import { AccountAge } from "@/hooks/AccountAge";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "../Loading";
import { UserProfile } from "@/types/Auth";
import { Animate, FadeLeft, FadeUp } from "@/animation";
import Link from "next/link";

//message
import { coming_soon_message } from "../messages/Coming_soon_message";

type InfoProps = UserProfile;

const Info: React.FC<InfoProps> = (props) => {
  const { user, loading } = useAuth();
  const isItMe = user?.username === props.username;

  const [Avatar, setAvatar] = useState<string>(
    props.gender === "male"
      ? "/Avatars/Normal_men.jpg"
      : "/Avatars/Blonde_Girl .jpg"
  );
  useEffect(() => {
    if (loading) return;
    const IsItHalal = props.gender === user?.gender ? true : false;

    if (IsItHalal) {
      setAvatar((prev) => (props.avatar ? props.avatar : prev));
    }
  }, [loading, user, props]);

  if (loading) return <Loading />;
  return (
    <section>
      <div className="relative flex flex-col sm:flex-row gap-5 justify-center items-center sm:items-start text-center sm:text-start">
        <div className="flex flex-col justify-center items-center gap-5">
          <div
            title={
              props.gender === user?.gender
                ? ""
                : `You cant See ${props.gender} Picture `
            }
          >
            <SimpleAnimatedImage
              src={Avatar}
              alt={`${props.fullName}Avatar`}
              className="rounded-full w-40 h-40 "
            />
          </div>
          <motion.div
            {...FadeLeft}
            {...Animate}
            className="bg-secondary p-2 rounded-xl text-white text-center"
          >
            Reader since {props.createdAt && AccountAge(props.createdAt)}
          </motion.div>
        </div>
        <div className="my-5 space-y-2">
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

          {isItMe ? (
            <motion.div
              {...FadeUp}
              {...Animate}
              className="flex justify-center items-center gap-5 mt-5"
            >
              <Link href="/Update_User_profile">
                <Button variant="outline">Edit Profile</Button>
              </Link>
              {/* <Link href="/MyBookShelf"> */}
              <Link href="/my-books">
                <Button variant="outline">My Books</Button>
              </Link>
              {/* </Link> */}
            </motion.div>
          ) : (
            <motion.div
              {...FadeUp}
              {...Animate}
              className="flex justify-center items-center gap-5 mt-5"
            >
              <Button variant="outline" onClick={() => coming_soon_message()}>
                Follow
              </Button>
              <Button variant="outline" onClick={() => coming_soon_message()}>
                {props.gender === "male" ? "His" : "Her"} Books
              </Button>
              {props.gender === user?.gender && (
                <Button variant="outline" onClick={() => coming_soon_message()}>
                  Send Good message
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div></div>
      </div>
    </section>
  );
};

export default Info;
