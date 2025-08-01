"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { Animate, FadeUp } from "@/animation";
import Loading from "@/components/Loading";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import { Camera, Mail, User } from "lucide-react";

export default function Page() {
  const { loading, user } = useAuth();
  const route = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      route.push("login");
    }
  }, [route, user, loading]);

  if (loading || !user) return <Loading />;
  return (
    <main className="">
      <SideBar />
      <div className="w-full h-screen flex justify-center items-center flex-col">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <motion.div
            {...FadeUp}
            {...Animate}
            className="flex items-center space-x-4"
          >
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 hover:bg-blue-700 transition-colors">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.fullName}
              </h3>
              <p className="text-sm text-gray-600">@{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </motion.div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>{user?.gender}</span>
            </div>
          </div>
        </div>
      </div>
      <ModeToggle />
    </main>
  );
}
