"use client";

import axios from "axios";
import Loading from "@/components/Loading";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import { Animate, FadeLeft, opacity } from "@/animation";
import { ImageApiSend } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";

type UploadState = {
  uploading: boolean;
  progress: number;
  error?: string | null;
  success?: boolean;
};

export default function CreatePostPage() {
  const router = useRouter();
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [upload, setUpload] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  });
  const { user, loading } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>): void {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      setUpload({
        uploading: false,
        progress: 0,
        error: "Max file size is 10MB",
        success: false,
      });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setUpload((s) => ({ ...s, error: null }));
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();

    setUpload({ uploading: false, progress: 0, error: null, success: false });

    if (!description || !file) {
      setUpload({
        uploading: false,
        progress: 0,
        error: `Please add a ${
          !description && !file
            ? "description or an image"
            : !description
            ? "description"
            : "Image"
        } `,
        success: false,
      });
      return;
    }

    const form = new FormData();
    form.append("description", description);
    if (file) form.append("image", file);

    try {
      setUpload((s) => ({ ...s, uploading: true, progress: 0, error: null }));

      await ImageApiSend.post(`/api/post`, form, {
        withCredentials: true,
        onUploadProgress(progressEvent) {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUpload((s) => ({ ...s, progress: percent }));
          }
        },
      });

      setUpload({
        uploading: false,
        progress: 100,
        error: null,
        success: true,
      });

      toast("You have successfully added a new post!", {
        description: "We hope you get a lot of likes 🎉",
        classNames: {
          toast: "!bg-green-600 !text-white rounded-xl border border-green-700",
          description: "!text-white text-sm opacity-90",
          actionButton: "bg-white text-green-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });

      router.push(`/profile/${user?.username}`);
      setDescription("");
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      let message = "Upload failed";
      if (axios.isAxiosError(err)) {
        const axiosErr = err;
        if (axiosErr.response && axiosErr.response.data) {
          const data = axiosErr.response.data as
            | { error?: string; msg?: string }
            | string;
          if (typeof data === "string") {
            message = data;
          } else {
            message = data?.error ?? data?.msg ?? message;
          }
        } else if (axiosErr.message) {
          message = axiosErr.message;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      setUpload({
        uploading: false,
        progress: 0,
        error: message,
        success: false,
      });
      toast(`Failed to add new post`, {
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
  }

  function clearPreview(): void {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUpload((s) => ({ ...s, error: null }));
  }

  const [TookLonger, setTookLonger] = useState<string>("");
  useEffect(() => {
    if (!upload.uploading) return;
    setTookLonger("Uploading your post.....");
    const timer5s = setTimeout(() => {
      setTookLonger("Almost done...");
    }, 5000);

    const timer15s = setTimeout(() => {
      setTookLonger("Your internet is so slow, please wait...");
    }, 15000);
    return () => {
      clearTimeout(timer5s);
      clearTimeout(timer15s);
    };
  }, [upload.uploading]);

  if (!user || loading || upload.success) return <Loading />;

  if (upload.uploading)
    return (
      <section className="min-h-screen flex flex-col justify-center items-center gap-5">
        <motion.div
          {...Animate}
          {...opacity}
          className="inline-block animate-spin rounded-full h-40 w-40 border-b-2 border-third dark:border-primary"
        />
        <AnimatePresence mode="wait">
          {TookLonger && (
            <motion.div
              key={TookLonger}
              {...Animate}
              {...opacity}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              {TookLonger}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );

  return (
    <section className="mt-12 sm:mt-16 lg:mt-10 min-h-screen p-4 flex flex-col lg:flex-row justify-evenly gap-10 items-center">
      <div className="w-full lg:w-2/4 max-w-2xl">
        <div className="bg-white dark:bg-third rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-secondary to-secondaryHigh p-8 text-white">
            <motion.h1
              {...Animate}
              {...FadeLeft}
              className="text-4xl font-bold text-center"
            >
              Create New Post
            </motion.h1>
            <motion.p
              {...FadeLeft}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.1 },
              }}
              className="text-center mt-2 !text-white/90"
            >
              Share your thoughts with the community
            </motion.p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6" noValidate>
            {/* Description Field */}
            <motion.div
              {...FadeLeft}
              animate={{
                ...Animate.animatenly,
                transition: {
                  duration: Animate.transition.duration,
                  delay: 0.2,
                },
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
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Write something about this post..."
                className="defaultInput transition-all duration-200 focus:border-secondary focus:ring-secondary resize-none"
                rows={6}
              />
              <p className="mt-2 text-xs text-gray-500">
                Share your thoughts, ideas, or updates with your audience.
              </p>
            </motion.div>

            {/* Image Upload Field */}
            <motion.div
              {...FadeLeft}
              animate={{
                ...Animate.animatenly,
                transition: {
                  duration: Animate.transition.duration,
                  delay: 0.4,
                },
              }}
            >
              <label className="defaultLabel flex items-center gap-2 mb-2">
                <ImageIcon className="w-4 h-4" />
                Image (optional)
              </label>

              <div className="relative">
                <label
                  htmlFor="imageUpload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-secondary dark:hover:border-secondary transition-colors duration-200 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {preview ? "Change image" : "Choose an image"}
                  </span>
                </label>
                <input
                  id="imageUpload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG or GIF (max. 10MB)
              </p>

              {/* Image Preview */}
              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mt-4 relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-md"
                  >
                    <Image
                      src={preview}
                      alt="preview"
                      width={200}
                      height={200}
                      unoptimized
                      className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-900"
                    />
                    <button
                      type="button"
                      onClick={clearPreview}
                      className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Image selected
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              {...FadeLeft}
              animate={{
                ...Animate.animatenly,
                transition: {
                  duration: Animate.transition.duration,
                  delay: 0.6,
                },
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={upload.uploading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-secondary to-secondaryHigh hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {upload.uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Post...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Post
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Progress Bar */}
            {upload.uploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Uploading...
                  </span>
                  <span className="text-sm font-medium text-secondary">
                    {upload.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    style={{
                      width: `${upload.progress}%`,
                      transition: "width 300ms ease-out",
                    }}
                    className="h-full bg-gradient-to-r from-secondary to-secondaryHigh rounded-full"
                  />
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {upload.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                      Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {upload.error}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Helper Text */}
        <motion.p
          {...FadeLeft}
          animate={{
            ...Animate.animatenly,
            transition: { ...Animate.transition, delay: 0.7 },
          }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
        >
          Your post will be visible to all users immediately
        </motion.p>
      </div>
    </section>
  );
}
