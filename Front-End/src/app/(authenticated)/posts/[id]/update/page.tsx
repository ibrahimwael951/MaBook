"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Post } from "@/types/Auth";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";
import { Animate, FadeUp } from "@/animation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function UpdatePostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [postLoading, setPostLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const MyPost = user?.username === post?.author;
  const didRun = useRef(false);
  useEffect(() => {
    if (loading || postLoading) return;
    if (didRun.current) return;

    const MyPost = user?.username === post?.author;
    didRun.current = true;
    console.log(MyPost);

    if (!MyPost) {
      router.push("/");

      toast("Its not your Post", {
        description: `Be good ${
          user?.gender === "male" ? "boy" : "girl"
        } and leave others posts`,
        classNames: {
          toast: "!bg-red-600 !text-white rounded-xl border border-red-700",
          description: "!text-white text-sm opacity-90",
          actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
    }
  }, [router, user?.gender, loading, postLoading]);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/post/${id}`, { withCredentials: true })
      .then((res) => {
        setPost(res.data);
        setDescription(res.data.description);
        if (res.data.image?.url) {
          setPreview(res.data.image.url);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setPostLoading(false));
  }, [id]);

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("description", description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/api/post/${id}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast("Updated post successfully <3", {
        description:
          "some time we making mistakes , but at least we can correct it :>",
        classNames: {
          toast: "!bg-green-600 !text-white rounded-xl border border-red-700",
          description: "!text-white text-sm opacity-90",
          actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
      router.push(`/posts/${id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }

      toast(`Update Failed`, {
        description: "Check Errors under all Inputs or contact Me ",
        classNames: {
          toast: "!bg-red-600 !text-white rounded-xl border border-red-700",
          description: "!text-white text-sm opacity-90",
          actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
    }
  };

  if (postLoading || loading || !MyPost) return <Loading />;
  if (!post) return <p>Post not found</p>;

  return (
    <section className="mt-20  flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md p-6 rounded-lg shadow"
      >
        <motion.h1 {...FadeUp} {...Animate} className="text-3xl font-bold">
          Update <span> Post</span>
        </motion.h1>

        {error && <p className="text-red-500">{error}</p>}

        {/* Description */}
        <label>
          <motion.span {...FadeUp} {...Animate} className="defaultLabel">
            Description
          </motion.span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="defaultInput"
            rows={4}
          />
        </label>

        {/* Image Upload */}
        <label>
          <span className="defaultLabel">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="defaultInput cursor-pointer"
          />
        </label>

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md border"
          />
        )}

        <Button type="submit" variant="secondary" className="w-full">
          Update
        </Button>
      </form>
    </section>
  );
}
