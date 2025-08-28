"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api, { ImageApiSend } from "@/lib/axios";
import { Post } from "@/types/Auth";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "@/components/Loading";
import { Animate, FadeUp } from "@/animation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
  // track whether preview URL was created via createObjectURL (so we only revoke those)
  const previewUrlRef = useRef<string | null>(null);

  const MyPost = user?.username === post?.author;
  const didRun = useRef(false);

  useEffect(() => {
    if (loading || postLoading) return;
    if (didRun.current) return;

    const isMyPost = user?.username === post?.author;
    didRun.current = true;

    if (!isMyPost) {
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
  }, [
    router,
    user?.gender,
    loading,
    postLoading,
    post?.author,
    user?.username,
  ]);

  useEffect(() => {
    if (!id) return;

    setPostLoading(true);
    api
      .get(`/api/post/${id}`, { withCredentials: true })
      .then((res) => {
        setPost(res.data);
        setDescription(res.data.description ?? "");
        if (res.data.image?.url) {
          setPreview(res.data.image.url);
          previewUrlRef.current = null;
        }
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to fetch post");
      })
      .finally(() => setPostLoading(false));
  }, [id]);

  // cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        try {
          URL.revokeObjectURL(previewUrlRef.current);
        } catch {
          /* ignore */
        }
        previewUrlRef.current = null;
      }
    };
  }, []);

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    const file = e.target.files?.[0] ?? null;
    if (!file) {
      // user cleared file input
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setImageFile(null);
      setPreview(post?.image?.url ?? null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      // file too big -> show error and don't set preview/file
      setImageFile(null);
      // revoke previous created preview (if any)
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setPreview(post?.image?.url ?? null);

      const msg = "Image is too large. Max file size is 10MB.";
      setError(msg);
      toast("Image too large", {
        description: msg,
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
      e.currentTarget.value = "";
      return;
    }

    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setImageFile(file);
    setPreview(url);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const formData = new FormData();
      formData.append("description", description ?? "");
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await ImageApiSend.put(`/api/post/${id}`, formData, {
        withCredentials: true,
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

      // revoke preview created by createObjectURL
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }

      router.push(`/posts/${id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? err.message);
      } else if (err instanceof Error) {
        setError(err.message);
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
          <motion.textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="defaultInput"
            rows={4}
          />
        </label>

        {/* Image Upload */}
        <label>
          <motion.span {...FadeUp} {...Animate} className="defaultLabel">Upload Image (less than 10MB)</motion.span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="defaultInput cursor-pointer"
          />
        </label>

        {/* Preview */}
        {preview && (
          <motion.img 
          {...FadeUp}{...Animate}
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
