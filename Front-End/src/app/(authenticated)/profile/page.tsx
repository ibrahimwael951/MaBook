"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

import Info from "@/components/profile/Info";
import UserPosts from "@/components/profile/UserPosts";
import WithAuth from "@/middleware/WithAuth";

function PageContent() {
  const { user, loading } = useAuth();
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
export default function Page() {
  return (
    <WithAuth>
      <PageContent />
    </WithAuth>
  );
}
