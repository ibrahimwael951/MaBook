"use client";
import Community from "@/components/Community";
import Futures from "@/components/Features";
import Hero from "@/components/Hero";
import Loading from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user)
    return (
      <section className="min-h-screen flex items-center justify-center">
        Hello guys here u will see Posts look like any social media platform
      </section>
    );
  return (
    <main>
      <Hero />
      <Futures />
      <Community />
    </main>
  );
}
