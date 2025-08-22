"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/types/Auth";
import Loading from "@/components/Loading";
import Info from "@/components/profile/Info";
import { useRouter } from "next/navigation";
import UserPosts from "@/components/profile/UserPosts";
import { SquareX } from "lucide-react";
import { motion } from "framer-motion";
import { Animate, FadeUp } from "@/animation";

export default function Page() {
  const { GetUser, user, loading } = useAuth();
  const { username } = useParams<{ username: string }>();
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [UserProfile, setUserProfile] = useState<UserProfile | null>(null);
  const route = useRouter();

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const result = await GetUser(username);
        setUserProfile(result);
        setProfileLoading(false);
      } catch (err) {
        console.error(err);
        setProfileLoading(false);
        setError(true);
      }
    };

    fetchUser();
  }, [username, GetUser]);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const result = await GetUser(username);
        setUserProfile(result);
        setProfileLoading(false);
      } catch (err) {
        console.error(err);
        setProfileLoading(false);
        setError(true);
      }
    };

    fetchUser();
  }, [username, GetUser]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      route.push("/login");
      return;
    }

    if (UserProfile && UserProfile.username === user.username) {
      route.push("/profile");
    }
  }, [loading, user, UserProfile, route]);

  if (profileLoading || loading) return <Loading />;
  if (error || !UserProfile)
    return (
      <motion.section {...FadeUp} {...Animate} className="flex flex-col items-center justify-center min-h-screen text-5xl">
        <SquareX size={50}/>
        no user Found
      </motion.section>
    );
    return (
      <main className="min-h-screen mt-20">
        <Info {...UserProfile} />

        {/* ----------------Posts Section------------- */}

        <section className="relative mt-5">
          <hr className="w-10/12 mx-auto" />
          <UserPosts username={username} />
        </section>
      </main>
    );
}
