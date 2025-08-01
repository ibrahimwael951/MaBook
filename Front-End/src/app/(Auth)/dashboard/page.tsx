"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar"
export default function Page() {
  const { loading, user } = useAuth();
  const route = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      route.push("login");
    }
  }, [route, user, loading]);

  if (loading || !user) return;
  <div>Loading</div>;
  return (
    <main className="">
      <SideBar/>
      <div className="w-full h-screen flex justify-center items-center flex-col">
        
      <h1>{user?._id}</h1>
      <h1>{user?.fullName}</h1>
      <h1>{user?.firstName}</h1>
      <h1>{user?.lastName}</h1>
      <h1> {user?.username}</h1>
      <h1>{user?.email}</h1>
      <h1>{user?.gender}</h1>
      <h1>{user?.avatar || "there is no image here "}</h1>
      </div>
    </main>
  );
}
