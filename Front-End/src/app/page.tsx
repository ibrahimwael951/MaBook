"use client";
import Community from "@/components/community/Community";
import Futures from "@/components/Features";
import Hero from "@/components/Hero";
import Loading from "@/components/Loading";
import PostPage from "@/components/post/PostPage";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (user) return <PostPage />;
  return (
    <main>
      <Hero />
      <Futures />
      <Community />
    </main>
  );
}
