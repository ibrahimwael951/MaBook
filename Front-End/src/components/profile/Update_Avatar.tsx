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
import { useAuth } from "@/contexts/AuthContext";

type UploadState = {
  uploading: boolean;
  progress: number; // 0 - 100
  error?: string | null;
  success?: boolean;
};

const Update_Avatar: React.FC = () => {
  const { user } = useAuth();
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
    if (user?.avatar) {
      setPreview(user.avatar);
    }
  }, [user]);

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
        fallbackProgress = Math.min(
          85,
          fallbackProgress + Math.floor(Math.random() * 6) + 1
        );
        setUpload((s) => ({
          ...s,
          progress: Math.max(s.progress, fallbackProgress),
        }));
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
        const response = maybeErr.response as
          | Record<string, unknown>
          | undefined;
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
      <section className=" my-5 flex flex-col justify-center items-center gap-5">
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
    <form onSubmit={handleSubmit} className="my-5 space-y-6">
      <motion.div
        {...FadeUp}
        animate={{
          ...Animate.animatenly,
          transition: { ...Animate.transition },
        }}
      >
        {/* Avatar Preview Section */}
        <div className="flex flex-col items-center gap-4">
          {/* Current/Preview Avatar */}
          <div className="relative group">
            <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-gray-200 dark:ring-gray-700 shadow-lg">
              <img
                src={preview ?? "/Avatars/Normal_men.jpg"}
                alt="Avatar Preview"
                className="h-full w-full object-cover"
              />
              {/* Hover Overlay */}
              {!upload.uploading && (
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-all duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}

              {/* Upload Progress Overlay */}
              {upload.uploading && (
                <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="animate-spin h-8 w-8 text-white mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-white text-sm font-medium">
                      {upload.progress}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* File Input */}
          <div className="w-full">
            <label
              htmlFor="avatar"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-secondary dark:hover:border-secondary transition-colors duration-200 cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {file ? file.name : "Choose a photo"}
              </span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={upload.uploading}
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              PNG, JPG (max. 5MB)
            </p>
          </div>

          {/* Action Buttons */}
          {file && preview && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-3 w-full"
            >
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-secondary to-secondaryHigh text-white font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={upload.uploading}
              >
                {upload.uploading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Upload Avatar
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearPreview}
                className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                disabled={upload.uploading}
              >
                Cancel
              </button>
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        {upload.uploading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
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
              className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
                  Upload Failed
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {upload.error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </form>
  );
};

export default Update_Avatar;
