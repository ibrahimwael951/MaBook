"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

// components
import SideBar from "@/components/dashboard/SideBar";
// import { ModeToggle } from "@/components/ui/ThemeToggle";
import Loading from "@/components/Loading";

// animation
import { Animate, FadeUp } from "@/animation";

// Icons
import { Camera, Mail, User } from "lucide-react";
import CopyLink from "@/components/ui/CopyLink";
import { WobbleCard } from "@/components/ui/wobble-card";
import Link from "next/link";

export default function Page() {
  const { loading, user } = useAuth();
  const [isSideBarOpened, setIsSideBarOpened] = useState<boolean>(false);
  const route = useRouter();
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!loading && !user) {
      route.push("login");
    }
  }, [route, user, loading]);

  if (loading || !user) return <Loading />;
  return (
    <motion.main
      animate={{
        marginLeft:
          !isMobile && isSideBarOpened ? "240px" : isMobile ? "0" : "110px",
      }}
      className="mt-16 lg:mt-5 px-5 lg:px-10  "
    >
      <SideBar
        isSideBarOpened={isSideBarOpened}
        setIsSideBarOpened={setIsSideBarOpened}
      />
      <div className="w-full h-screen">
        <motion.div
          {...FadeUp}
          {...Animate}
          className="static flex justify-between items-center gap-2 "
        >
          <div>
            <h1 className="text-4xl lg:text-6xl 2xl:text-7xl  ">
              Welcome <span> {user.fullName} </span>{" "}
            </h1>
            <p className="text-xl ml-5">{user.email}</p>
          </div>
          <CopyLink
            title="Copy Your Profile Link"
            Link={`/User/${user.username}`}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  mx-auto w-full my-10">
          <div className="col-span-2 relative p-5 w-full bg-red-500">
            <div className=" ">
              <h2 className="max-w-xs text-3xl lg:text-4xl font-semibold text-white">
                {user.bio ? "Your Bio" : "Set Bio?"}
              </h2>
              <p className="mt-2 text-2xl !text-neutral-200 bg-secondaryLow px-5 py-2 rounded-2xl w-full h-full min-h-32">
                {user.bio
                  ? user.bio
                  : "You haven't added a bio yet. Tell others a bit about yourself!"}
              </p>
            </div>
            <Link
              href="/dashboard/update"
              className="absolute  bottom-5 right-5 bg-white text-black px-5 py-2 rounded-xl text-xl cursor-pointer z-10"
            >
              Edit Now
            </Link>
          </div>
          <WobbleCard containerClassName="col-span-1 min-h-[300px] ">
            <h2 className="max-w-80  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              No shirt, no shoes, no weapons.
            </h2>
            <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
              If someone yells “stop!”, goes limp, or taps out, the fight is
              over.
            </p>
          </WobbleCard>
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
            <div className="max-w-sm">
              <h2 className="max-w-sm md:max-w-lg  text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                Signup for blazing-fast cutting-edge state of the art Gippity AI
                wrapper today!
              </h2>
              <p className="mt-4 max-w-[26rem] text-left  text-base/6 text-neutral-200">
                With over 100,000 mothly active bot users, Gippity AI is the
                most popular AI platform for developers.
              </p>
            </div>
            <img
              src="/linear.webp"
              width={500}
              height={500}
              alt="linear demo image"
              className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 object-contain rounded-2xl"
            />
          </WobbleCard>
        </div>
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
    </motion.main>
  );
}
