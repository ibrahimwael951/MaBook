"use client";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Image,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import api, { ImageApiSend } from "@/lib/axios";
import { Post } from "@/types/Auth";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
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

  const previewUrlRef = useRef<string | null>(null);

  const MyPost = user?.username === post?.author.username;
  const didRun = useRef(false);

  useEffect(() => {
    if (loading || postLoading) return;
    if (didRun.current) return;

    const isMyPost = user?.username === post?.author.username;
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
        } catch {}
        previewUrlRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);

    const file = e.target.files?.[0] ?? null;
    if (!file) {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setImageFile(null);
      setPreview(post?.image?.url ?? null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageFile(null);

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
    <section className="mt-20 flex justify-center items-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-third rounded-2xl shadow-xl dark:shadow-white/20 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-secondary to-secondaryHigh p-8 text-white">
            <motion.h1
              {...FadeUp}
              {...Animate}
              className="text-4xl font-bold text-center"
            >
              Update Post
            </motion.h1>
            <motion.p
              {...FadeUp}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.1 },
              }}
              className="text-center mt-2 !text-white/90"
            >
              Edit your post content and image
            </motion.p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                    Error
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    {error}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              {...FadeUp}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.2 },
              }}
            >
              <label
                className="defaultLabel flex items-center gap-2 mb-2"
                htmlFor="description"
              >
                <FileText className="w-4 h-4" />
                Description
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {description.length} characters
                </span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="defaultInput transition-all duration-200 focus:border-secondary focus:ring-secondary resize-none"
                rows={6}
                placeholder="What's on your mind?"
              />
              <p className="mt-2 text-xs text-gray-500">
                Share your thoughts, ideas, or updates with your audience.
              </p>
            </motion.div>

            {/* Image Upload */}
            <motion.div
              {...FadeUp}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.3 },
              }}
            >
              <label className="defaultLabel flex items-center gap-2 mb-2">
                <Image className="w-4 h-4" />
                Update Image
              </label>

              <div className="relative">
                <label
                  htmlFor="imageUpload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-secondary dark:hover:border-secondary transition-colors duration-200 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium !text-gray-700 dark:!text-gray-300">
                    Choose a new image
                  </span>
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG (max. 10MB)
              </p>
            </motion.div>

            {/* Preview */}
            <AnimatePresence>
              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md"
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      const fileInput = document.getElementById(
                        "imageUpload"
                      ) as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                    className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                    <p className="text-white text-sm font-medium flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      New image selected
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              {...FadeUp}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.4 },
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-secondary to-secondaryHigh hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-all duration-200"
              >
                <CheckCircle className="w-5 h-5" />
                Update Post
              </motion.button>
            </motion.div>
          </form>
        </div>

        {/* Helper Text */}
        <motion.p
          {...FadeUp}
          animate={{
            ...Animate.animatenly,
            transition: { ...Animate.transition, delay: 0.5 },
          }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
        >
          Changes will be visible immediately after updating
        </motion.p>
      </div>
    </section>
  );
}
