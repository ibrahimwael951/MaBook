"use client";

import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AxiosProgressEvent } from "axios";

import { toast } from "sonner";
import { Animate, FadeUp, opacity } from "@/animation";
import api from "@/lib/axios";

type UploadState = {
  uploading: boolean;
  progress: number; // 0 - 100
  error?: string | null;
  success?: boolean;
};

const Update_Avatar: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [file, setFile] = useState<File | null>(null);
  const [TookLonger, setTookLonger] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [upload, setUpload] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  });

  // Revoke any leftover object URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (preview) {
        try {
          URL.revokeObjectURL(preview);
        } catch {
          /* ignore */
        }
      }
    };
  }, [preview]);

  useEffect(() => {
    if (!upload.uploading) return;
    setTookLonger("Uploading your profile...");
    const t5: ReturnType<typeof setTimeout> = setTimeout(
      () => setTookLonger("Almost done..."),
      5000
    );
    const t15: ReturnType<typeof setTimeout> = setTimeout(
      () => setTookLonger("Your internet is so slow, please wait..."),
      15000
    );
    return () => {
      clearTimeout(t5);
      clearTimeout(t15);
      setTookLonger("");
    };
  }, [upload.uploading]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files || !e.target.files[0]) return;
    const f = e.target.files[0];

    if (f.size > 5 * 1024 * 1024) {
      setUpload({
        uploading: false,
        progress: 0,
        error: "Max file size is 5MB",
        success: false,
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
      setFile(null);
      // revoke any existing preview
      if (preview) {
        try {
          URL.revokeObjectURL(preview);
        } catch {
          /* ignore */
        }
      }
      setPreview(null);
      return;
    }

    // revoke current preview before creating a new one
    if (preview) {
      try {
        URL.revokeObjectURL(preview);
      } catch {
        /* ignore */
      }
    }

    const newPreview = URL.createObjectURL(f);
    setFile(f);
    setPreview(newPreview);
    setUpload((s) => ({ ...s, error: null }));
  };

  function clearPreview(): void {
    if (preview) {
      try {
        URL.revokeObjectURL(preview);
      } catch {
        /* ignore */
      }
    }
    setFile(null);
    setPreview(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
    setUpload((s) => ({ ...s, error: null }));
  }

  const handleSubmit = async (e?: FormEvent): Promise<void> => {
    if (e) e.preventDefault();

    if (!file) {
      toast("You must select an image", {
        classNames: {
          toast:
            "!bg-yellow-600 !text-white rounded-xl border border-yellow-700",
        },
        closeButton: true,
      });
      return;
    }

    // basic client-side mime check
    if (!(file.type && file.type.startsWith("image/"))) {
      setUpload((s) => ({ ...s, error: "File must be an image" }));
      return;
    }

    setUpload({ uploading: true, progress: 0, error: null, success: false });
    setIsSubmitting(true);

    // fallback progress simulation interval (cleared once real progress happens or on finish)
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    try {
      // Start a gentle fallback progress so UI doesn't look stalled
      let fallbackProgress = 0;
      fallbackInterval = setInterval(() => {
        fallbackProgress = Math.min(85, fallbackProgress + Math.floor(Math.random() * 6) + 1);
        setUpload((s) => ({ ...s, progress: Math.max(s.progress, fallbackProgress) }));
      }, 400);

      const formData = new FormData();
      // backend expects field "avatar"
      formData.append("avatar", file);

      await api.patch("/api/auth/update/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const loaded: number = progressEvent?.loaded ?? 0;
          const total: number = progressEvent?.total ?? 0;
          if (total > 0) {
            const percent = Math.round((loaded * 100) / total);
            setUpload((s) => ({ ...s, progress: percent }));
          }
        },
      });

      // ensure progress hits 100
      setUpload({
        uploading: false,
        progress: 100,
        error: null,
        success: true,
      });

      toast(`Profile updated successfully!`, {
        classNames: {
          toast: "!bg-green-600 !text-white rounded-xl border border-green-700",
          actionButton: "bg-white text-green-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });

      // cleanup preview & input
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (preview) {
        try {
          URL.revokeObjectURL(preview);
        } catch {
          /* ignore */
        }
      }
      setFile(null);
      setPreview(null);
    } catch (err: unknown) {
      // attempt to read axios-style error safely without using `any`
      let message = "Failed to update user";
      if (typeof err === "object" && err !== null) {
        // err might be an axios error shaped object with response?.data?.message
        // do a safe traversal with type guards
        const maybeErr = err as Record<string, unknown>;
        const response = maybeErr.response as Record<string, unknown> | undefined;
        const data = response?.data as Record<string, unknown> | undefined;
        const maybeMessage = data?.message ?? maybeErr.message;
        if (typeof maybeMessage === "string") message = maybeMessage;
      } else if (typeof err === "string") {
        message = err;
      }

      setUpload({
        uploading: false,
        progress: 0,
        error: message,
        success: false,
      });

      toast(`Failed to update Profile`, {
        description: `${message}`,
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
    } finally {
      if (fallbackInterval) clearInterval(fallbackInterval);
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <motion.div
        {...FadeUp}
        animate={{
          ...Animate.animatenly,
          transition: { ...Animate.transition, delay: 0.4 },
        }}
        className="mb-4"
      >
        <label className="defaultLabel" htmlFor="avatar">
          Avatar
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          onChange={handleAvatarChange}
          className="defaultInput"
          disabled={upload.uploading}
        />
        {file && (
          <div className="mt-2 flex items-center gap-4">
            <img
              src={preview ?? ""}
              alt="Preview"
              width={200}
              height={200}
              className="h-20 w-20 rounded-full object-cover"
            />

            <div className="flex flex-col gap-2">
              {preview && (
                <button
                  type="button"
                  onClick={clearPreview}
                  className="underline text-sm"
                  disabled={upload.uploading}
                >
                  Remove
                </button>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={upload.uploading}
                >
                  {upload.uploading ? "Uploading..." : "Upload"}
                </button>

                <button
                  type="button"
                  onClick={clearPreview}
                  className="btn-secondary"
                  disabled={upload.uploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Progress bar & error message area (matches NewPost behavior) */}
      {upload.uploading && (
        <div className="w-full bg-secondaryHigh dark:bg-gray-200 h-2 rounded overflow-hidden mt-4">
          <div
            style={{
              width: `${upload.progress}%`,
              transition: "width 300ms linear",
            }}
            className="h-full"
          />
        </div>
      )}

      <AnimatePresence>
        {upload.error && (
          <motion.p
            {...FadeUp}
            {...Animate}
            className="!text-red-600 text-xl mt-3"
          >
            {upload.error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};

export default Update_Avatar;
