"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
 
import Info from "@/components/profile/Info";

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

      <section className="relative mt-5">
        <hr className="w-10/12 mx-auto" />
      </section>
    </main>
  );
}
