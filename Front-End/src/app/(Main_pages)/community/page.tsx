import React from "react";
import Hero from "@/components/community/Hero";
import CommunityFeatures from "@/components/community/CommunityFeatures";
import CommunitySafe from "@/components/community/CommunitySafe";

export default function page() {
  return (
    <main className="space-y-20">
      <Hero />
      <CommunityFeatures />
      <CommunitySafe />
    </main>
  );
}
