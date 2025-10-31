"use client";
import React from "react";
import {
  Palette,
  Globe,
  User,
  Award,
  Mail,
  Lock,
  Trash2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

// components
import Loading from "@/components/Loading";

// animation
import { Animate, FadeUp } from "@/animation";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/ThemeToggle";

export default function Page() {
  const { loading, user } = useAuth();

  if (loading || !user) return <Loading />;
  return (
    <motion.main className="mt-16 lg:mt-5 px-4 lg:px-8 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div {...FadeUp} {...Animate} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-secondary dark:text-secondaryHigh " />
            <h1 className="text-4xl lg:text-5xl font-bold">
              Welcome, <span className="text-secondary">{user.fullName}</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 ml-11">
            {user.email}
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Toggle Card */}
          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.1 },
            }}
            className="bg-white dark:bg-third/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-secondary transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondaryHigh rounded-xl flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Theme
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Change appearance
                  </p>
                </div>
              </div>
              <ModeToggle />
            </div>
          </motion.div>

          {/* Language Card - Coming Soon */}
          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.15 },
            }}
            className="relative bg-white dark:bg-third/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 opacity-60"
          >
            <div className="absolute top-3 right-3 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full">
              Coming Soon
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondaryHigh rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Language
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Switch language
                </p>
              </div>
            </div>
          </motion.div>

          {/* Edit Profile Card */}
          <Link href="/dashboard/Update_User_profile" className="md:col-span-2">
            <motion.div
              {...FadeUp}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.2 },
              }}
              whileHover={{
                scale: 1.002,
                y: -3,
              }}
              transition={{ duration: 0.1 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-secondary/10 to-secondaryHigh/10 dark:from-secondary/20 dark:to-secondaryHigh/20 border-2 border-secondary/30 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondaryHigh rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                      Edit Profile
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Update your personal information
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-secondary group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Name:</span>
                  {user.firstName} {user.lastName}
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Bio:</span>
                  <span className="line-clamp-1">
                    {user.bio || "No bio yet"}
                  </span>
                </p>
              </div>
            </motion.div>
          </Link>

          {/* Achievements Card - Coming Soon */}
          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.25 },
            }}
            className="relative bg-white dark:bg-third/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 opacity-60"
          >
            <div className="absolute top-3 right-3 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full">
              Coming Soon
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondaryHigh rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Achievements
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View your badges
                </p>
              </div>
            </div>
          </motion.div>

          {/* Email Card - Coming Soon */}
          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.3 },
            }}
            className="relative bg-white dark:bg-third/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 opacity-60"
          >
            <div className="absolute top-3 right-3 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full">
              Coming Soon
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondaryHigh rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Change Email
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Password Card - Coming Soon */}
          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.35 },
            }}
            className="relative bg-white dark:bg-third/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 opacity-60"
          >
            <div className="absolute top-3 right-3 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full">
              Coming Soon
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondaryHigh rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Reset Password
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Change your password
                </p>
              </div>
            </div>
          </motion.div>

          {/* Delete Account Card */}
          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.4 },
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-gradient-to-br from-red-500 to-red-600 border-2 border-red-600 rounded-2xl p-6 cursor-pointer hover:shadow-xl transition-all text-white group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">Delete Account</h2>
                <p className="text-sm !text-white/80">
                  Permanently remove your account
                </p>
              </div>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
}
