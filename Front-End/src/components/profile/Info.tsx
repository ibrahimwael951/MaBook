"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SimpleAnimatedImage } from "../ui/AnimatedImage";
import { AccountAge } from "@/hooks/AccountAge";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "../Loading";
import { UserProfile } from "@/types/Auth";
import { Animate, FadeLeft, FadeUp } from "@/animation";
import Link from "next/link";
import {
  Calendar,
  UserPlus,
  Edit3,
  Library,
  MessageCircle,
  Share2,
  MoreHorizontal,
  BookMarked,
} from "lucide-react";

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
    <section className="relative">
      <div className="relative max-w-5xl mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <motion.div
            {...FadeLeft}
            {...Animate}
            className="flex-shrink-0 mx-auto sm:mx-0"
          >
            <div className="relative group">
              {/* Avatar Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondaryHigh rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div
                  className="relative bg-white dark:bg-gray-800 p-1.5 rounded-full"
                  title={
                    props.gender === user?.gender
                      ? ""
                      : `You can't see ${props.gender} picture`
                  }
                >
                  <SimpleAnimatedImage
                    src={Avatar}
                    alt={`${props.fullName} Avatar`}
                    className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover ring-4 ring-white dark:ring-gray-700 shadow-xl"
                  />
                </div>
              </div>

              {/* Member Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-secondary to-secondaryHigh text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold whitespace-nowrap flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                {props.createdAt && AccountAge(props.createdAt)}
              </motion.div>
            </div>
          </motion.div>

          {/* Profile Info */}
          <div className="flex-1 space-y-6 text-center sm:text-left min-w-0 mx-auto">
            {/* Name & Username */}
            <div className="space-y-2">
              <motion.div
                {...FadeUp}
                {...Animate}
                className="flex items-center justify-center sm:justify-start gap-3 flex-wrap"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100">
                  {props.fullName}
                </h1>
                {isItMe && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                    You
                  </span>
                )}
              </motion.div>

              <motion.p
                {...FadeUp}
                {...Animate}
                className="text-lg text-gray-600 dark:text-gray-400 font-medium"
              >
                @{props.username}
              </motion.p>
            </div>

            {/* Bio */}
            <motion.div
              {...FadeUp}
              {...Animate}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md dark:shadow-white/5 border border-gray-200 dark:border-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {props.bio
                  ? props.bio
                  : `${
                      props.gender === "male" ? "He" : "She"
                    } is too busy reading to write a bio. 📚`}
              </p>
            </motion.div>

            {/* Stats - Simple & Small */}
            <motion.div
              {...FadeUp}
              {...Animate}
              className="flex justify-center sm:justify-start gap-6 text-center"
            >
              <div className="cursor-pointer hover:opacity-70 transition-opacity">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {props.followers || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Followers
                </p>
              </div>

              <div className="w-px bg-gray-300 dark:bg-gray-700"></div>

              <div className="cursor-pointer hover:opacity-70 transition-opacity">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {props.following || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Following
                </p>
              </div>

              <div className="w-px bg-gray-300 dark:bg-gray-700"></div>

              <div className="cursor-pointer hover:opacity-70 transition-opacity">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {props.posts || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Posts
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            {isItMe ? (
              <motion.div
                {...FadeUp}
                {...Animate}
                className="flex flex-wrap justify-center sm:justify-start gap-3"
              >
                <Link href="/dashboard/Update_User_profile">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-secondaryHigh text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                </Link>

                <Link href="/my-books">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <Library className="w-4 h-4" />
                    My Library
                  </motion.button>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                {...FadeUp}
                {...Animate}
                className="flex flex-wrap justify-center sm:justify-start gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => coming_soon_message()}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-secondaryHigh text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Follow
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => coming_soon_message()}
                  className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <BookMarked className="w-4 h-4" />
                  {props.gender === "male" ? "His" : "Her"} Books
                </motion.button>

                {props.gender === user?.gender && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => coming_soon_message()}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-2 border-gray-200 dark:border-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Info;
