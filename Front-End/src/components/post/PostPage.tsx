"use client";
import React, { useEffect, useRef, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Post } from "@/types/Auth";
import api from "@/lib/axios";
import PostCard from "./postCard/PostCard";
import Loading from "../Loading";

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchedIdsRef = useRef(new Set<string>());

  const fetchPosts = async (cursor?: string | null) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await api.get("/api/posts", {
        params: { limit: 10, cursor },
      });

      const fetched: Post[] = res.data.posts ?? [];
      const unique = fetched.filter((p) => !fetchedIdsRef.current.has(p._id));
      unique.forEach((p) => fetchedIdsRef.current.add(p._id));

      setPosts((prev) => [...prev, ...unique]);
      setNextCursor(res.data.nextCursor ?? null);
      setHasMore(Boolean(res.data.hasMore));
    } catch (err) {
      console.error("fetch posts error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(null);
  }, []);

  if (!posts.length && loading) return <Loading />;
  return (
    <section className="min-h-screen mt-20 !px-0">
      <Virtuoso
        style={{
          height: "100vh",
          width: "100%",
          scrollbarWidth: "none",
        }}
        totalCount={posts.length}
        itemContent={(index) => (
          <div className="p-2 my-5 w-full flex justify-center items-center">
            <PostCard
              key={posts[index]._id}
              post={posts[index]}
              AnimateIt={false}
            />
          </div>
        )}
        endReached={() => fetchPosts(nextCursor)}
        components={{
          Footer: () =>
            loading ? <div className="py-4 text-center">Loading...</div> : null,
        }}
        className="[&::-webkit-scrollbar]:hidden"
      />
    </section>
  );
};

export default PostPage;
