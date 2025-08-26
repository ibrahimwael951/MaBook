"use client";
import api from "@/lib/axios";
import { Post } from "@/types/Auth";
import React, { useEffect, useState } from "react";
import Loading from "../Loading";

interface props {
  id: string;
}
const GetPost: React.FC<props> = ({ id }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState();

  useEffect(() => {
    api
      .get(`/api/post/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !post) return <div>no post found , {error}</div>;
  return (
    <section className="min-h-screen flex justify-center items-center">
      {post.author} 
      {post._id}
      {post._id}
    </section>
  );
};

export default GetPost;
