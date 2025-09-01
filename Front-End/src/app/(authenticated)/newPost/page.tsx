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

    if (!description && !file) {
      setUpload({
        uploading: false,
        progress: 0,
        error: "Please add a description or an image.",
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
          className="inline-block animate-spin rounded-full h-40 w-40 border-b-2  border-third dark:border-primary"
        />
        <AnimatePresence mode="wait">
          {TookLonger && (
            <motion.div key={TookLonger} {...Animate} {...opacity}>
              {TookLonger}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );
  return (
    <section className="mt-12 sm:mt-16 lg:mt-0 min-h-screen p-4 flex flex-col lg:flex-row justify-evenly gap-10 items-center">
      <div className="w-full lg:w-2/4 max-w-xl">
        <motion.h1
          {...Animate}
          {...FadeLeft}
          className="text-4xl font-semibold mb-4"
        >
          Create New <span> Post </span>
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <motion.div
            {...FadeLeft}
            animate={{
              ...Animate.animatenly,
              transition: { duration: Animate.transition.duration, delay: 0.2 },
            }}
          >
            <label className="defaultLabel">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write something about this post..."
              className="defaultInput"
            />
          </motion.div>

          <motion.div
            {...FadeLeft}
            animate={{
              ...Animate.animatenly,
              transition: { duration: Animate.transition.duration, delay: 0.4 },
            }}
          >
            <label className="defaultLabel">
              Image (optional) (less than 10MB)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="defaultInput cursor-pointer"
            />
            <AnimatePresence>
              {preview && (
                <motion.div
                  {...opacity}
                  {...Animate}
                  className="mt-3 flex items-start gap-3"
                >
                  <Image
                    src={preview}
                    alt="preview"
                    width={200}
                    height={200}
                    unoptimized
                    className="w-52 h-52 object-cover rounded"
                  />
                  <div>
                    <p className="text-lg">Selected image</p>
                    <button
                      type="button"
                      onClick={clearPreview}
                      className="mt-2 underline text-lg cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div>
            <motion.button
              {...FadeLeft}
              animate={{
                ...Animate.animatenly,
                transition: {
                  duration: Animate.transition.duration,
                  delay: 0.6,
                },
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={upload.uploading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondaryHigh focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {upload.uploading ? "Loading....." : "Create Post"}
            </motion.button>
          </div>

          {upload.uploading && (
            <div className="w-full bg-secondaryHigh dark:bg-gray-200 h-2 rounded overflow-hidden">
              <div
                style={{ width: `${upload.progress}%` }}
                className="h-full"
              />
            </div>
          )}
          <AnimatePresence>
            {upload.error && (
              <motion.p
                {...FadeLeft}
                {...Animate}
                className="!text-red-600 text-xl"
              >
                {upload.error}
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </section>
  );
}
