"use client";

import axios from "axios";
import Loading from "@/components/Loading";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import AnimatedImage from "@/components/ui/AnimatedImage";
import Link from "next/link";
import { Animate, FadeLeft, opacity } from "@/animation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const MotionLink = motion(Link);

type UploadState = {
  uploading: boolean;
  progress: number; // 0-100
  error?: string | null;
  success?: boolean;
};

export default function CreatePostPage() {
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

      await axios.post(`${API_BASE}/api/post`, form, {
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

      // success
      setUpload({
        uploading: false,
        progress: 100,
        error: null,
        success: true,
      });
      setDescription("");
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      // try to extract a message from the axios error
      let message = "Upload failed";
      if (axios.isAxiosError(err)) {
        const axiosErr = err;
        if (axiosErr.response && axiosErr.response.data) {
          // attempt to read server message
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
    }
  }

  function clearPreview(): void {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUpload((s) => ({ ...s, error: null }));
  }

  if (!user || loading) return <Loading />;
  return (
    <section className="mt-12 sm:mt-16 lg:mt-0 min-h-screen p-4 flex flex-col lg:flex-row justify-evenly gap-10 items-center">
      <div className="w-full lg:w-2/4 max-w-xl">
        <h1 className="text-4xl font-semibold mb-4">
          Create New <span> Post </span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="defaultLabel">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write something about this post..."
              className="defaultInput"
            />
          </div>

          <div>
            <label className="defaultLabel">Image (optional)</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="defaultInput cursor-pointer"
            />

            {preview && (
              <div className="mt-3 flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="preview"
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
              </div>
            )}
          </div>

          <div>
            <motion.button
              {...FadeLeft}
              {...Animate}
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

      <div className="w-full lg:w-2/4 max-w-xl text-center">
        <AnimatedImage
          src="/Men_like.jpg"
          alt="Good image"
          className="rounded-2xl"
        />
        <p>
          Be kind. No hate, no offense — just positive vibes for fellow readers.
        </p>
      </div>

      <AnimatePresence>
        {upload.success && (
          <div className="w-full h-full fixed left-2/4 top-2/4 -translate-2/4 flex flex-col justify-center items-center gap-10 z-50">
            <motion.div
              {...opacity}
              animate={{ opacity: 0.5 }}
              className="bg-black w-full h-full absolute top-0 left-0"
            />
            <motion.div
              {...Animate}
              {...opacity}
              className="bg-green-500 p-5 rounded-2xl text-3xl"
            >
              Post created successfully.
            </motion.div>
            <MotionLink
              {...FadeLeft}
              {...Animate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              href="/profile"
              className="w-fit flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondaryHigh focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go to Profile
            </MotionLink>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
