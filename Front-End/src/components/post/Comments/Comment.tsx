"use client";
import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { Comments } from "@/types/Auth";
import { AccountAge } from "@/hooks/AccountAge";
import SendComment from "./SendComment";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import Link from "next/link";

interface Props {
  PostId: string;
}

const Comment: React.FC<Props> = ({ PostId }) => {
  const [comments, setComments] = useState<Comments[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = () => {
    api
      .get(`/api/post/${PostId}/comments`)
      .then((res) => setComments(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!PostId) return;

    let attemptCount = 0;
    const maxAttempts = 3;
    const intervalTime = 15000;

    setLoading(true);
    fetchComments();
    attemptCount += 1;

    const intervalId = setInterval(() => {
      if (attemptCount < maxAttempts) {
        fetchComments();
        attemptCount += 1;
      } else {
        clearInterval(intervalId);
      }
    }, intervalTime);

    return () => clearInterval(intervalId);
  }, [PostId]);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <section id="Comments" className="relative w-fit max-w-3xl min-h-96 pt-24">
      <h1 className="text-5xl lg:text-6xl font-semibold mb-10">Comments</h1>
      <div className="my-10 ">
        <SendComment onSuccess={fetchComments} PostId={PostId} />
      </div>
      {comments.length === 0 ? (
        <p className="min-h-52 w-full text-center text-2xl">
          There are no comments yet
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((item) => (
            <CommentCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Comment;

const CommentCard = ({ item }: { item: Comments }) => {
  const [loading, setLoading] = useState(false);
  const [Deleted, setDeleted] = useState(false);
  const { user } = useAuth();

  const deleteComment = (id: string) => {
    setLoading(true);
    api
      .delete(`/api/Comments/${id}`)
      .then(() => {
        setDeleted(true);
        toast.success("Deleted successfully", {
          classNames: { toast: "!bg-green-600 !text-white" },
        });
      })
      .catch((err) => toast(`error :${err.message}`))
      .finally(() => setLoading(false));
  };
  if (Deleted) return null;
  return (
    <div className="relative p-5 rounded-2xl border border-secondary w-full flex items-center justify-between overflow-hidden">
      <div className="space-y-5">
        <Link href={`/profile/${item.author}`} className="text-2xl">
          {item.author}
        </Link>
        <h1 className="text-3xl">{item.text}</h1>
      </div>
      <div>
        {item.author === user?.username && (
          <button
            onClick={() => deleteComment(item._id)}
            className="absolute w-10 h-10 top-0 right-0 bg-red-600 text-white p-2 rounded-bl-2xl"
          >
            {loading ? (
              <div className="inline-block animate-spin rounded-full h-full w-full border-b-2  border-third dark:border-primary"></div>
            ) : (
              <Trash2 />
            )}
          </button>
        )}
        <p className="text-sm text-gray-500">{AccountAge(item.createdAt)}</p>
      </div>
    </div>
  );
};
