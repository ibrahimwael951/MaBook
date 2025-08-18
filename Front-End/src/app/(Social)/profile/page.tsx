"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

import Info from "@/components/profile/Info";
import UserPosts from "@/components/profile/UserPosts";

export default function Page() {
  const { user, loading } = useAuth();
  const route = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      route.push("login");
    }
  }, [route, user, loading]);

  if (!user || loading) return <Loading />;

  return (
    <main className="min-h-screen mt-20">
      <Info {...user} />
      {/* ----------------Posts Section------------- */}
      <hr className="max-w-2xl mx-10  md:mx-auto my-10" />
      <UserPosts username={user.username} />
    </main>
  );
}
