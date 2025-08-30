"use client";
import React, { useEffect, useRef, useState } from "react";
import { Post } from "@/types/Auth";
import api from "@/lib/axios";
import PostCard from "./PostCard";

const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchedIdsRef = useRef(new Set<string>());

  const fetchPosts = async (cursor?: string | null) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get("/api/posts", {
        params: { limit: 10, cursor },
      });

      const fetched: Post[] = res.data.posts ?? [];
      const unique = fetched.filter((p) => !fetchedIdsRef.current.has(p._id));
      unique.forEach((p) => fetchedIdsRef.current.add(p._id));

      console.log(res.data);
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
  return (
    <div>
      <div className="mt-20 max-w-2xl mx-auto space-y-4 p-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

        {hasMore ? (
          <div className="flex justify-center">
            <button
              onClick={() => fetchPosts(nextCursor)}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Loading..." : "Load more"}
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No more posts</p>
        )}
      </div>
    </div>
  );
};

export default PostPage;
