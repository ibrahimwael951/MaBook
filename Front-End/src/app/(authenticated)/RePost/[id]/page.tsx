"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

import Loading from "@/components/Loading";
import { motion } from "framer-motion";
import { RePostpage } from "@/types/Auth";

import Coming_soon_page from "@/components/messages/Coming_soon_page";

export default function RePostDetailsPage() {
  const { id } = useParams();
  const [repost, setRepost] = useState<RePostpage | null>(null);
  const [loading, setLoading] = useState(true);
  const soon = true;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!soon) return;
    const fetchRepost = async () => {
      try {
        const { data } = await api.get(`/api/RePost/${id}`);
        setRepost(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load repost");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRepost();
  }, [id]);

  if (soon) return <Coming_soon_page />;
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-lg font-medium">
        {error}
      </div>
    );

  if (!repost) return null;

  return (
    <section className="min-h-screen mt-24 py-8 flex flex-col items-center px-4">
      {/* Repost text */}
      {repost.RePost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl w-full mb-6 p-5 rounded-2xl bg-card shadow-md border border-border"
        >
          <h1 className="text-lg font-semibold mb-2  ">
            {/* {repost.RePost.userId || "User"} reposted: */}
          </h1>
          <p className="text-muted-foreground whitespace-pre-wrap">
            {repost.RePost.text}
          </p>
        </motion.div>
      )}

      {/* Original Post */}

      {/* Comments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-2xl w-full mt-10"
      >
        {/* <Comment PostId={repost.} /> */}
      </motion.div>
    </section>
  );
}
