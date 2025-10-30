"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { User, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Update } from "@/types/Auth";
import Loading from "@/components/Loading";
import { Animate, FadeUp } from "@/animation";

import { toast } from "sonner";
import Update_Avatar from "@/components/profile/Update_Avatar";

export default function Page() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<Update>({
    bio: "",
    lastName: "",
    firstName: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof Update, string>>
  >({});
  const [currentField, setCurrentField] = useState<keyof Update | null>(null);

  const nameRegex = /^[a-zA-Z]+$/;

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio ?? "",
        lastName: user.lastName ?? "",
        firstName: user.firstName ?? "",
      });

      setIsLoading(false);
    }
  }, [user]);

  const validate = (): Partial<Record<keyof Update, string>> => {
    const errors: Partial<Record<keyof Update, string>> = {};

    const fname = formData.firstName?.trim() ?? "";
    const lname = formData.lastName?.trim() ?? "";
    const Bio = formData.bio?.trim() ?? "";

    if (fname.length < 2 || fname.length > 10) {
      errors.firstName = "First name must be between 2 and 10 characters.";
    } else if (!nameRegex.test(fname)) {
      errors.firstName = "First Name must contain only English letters.";
    }

    if (lname.length < 2 || lname.length > 10) {
      errors.lastName = "Last name must be between 2 and 10 characters.";
    } else if (!nameRegex.test(lname)) {
      errors.lastName = "Last Name must contain only English letters.";
    }

    if (Bio.length < 10) {
      errors.bio = "Bio must be at least 10 characters.";
    }

    return errors;
  };

  const normalizedField = currentField ? formData[currentField] : null;

  useEffect(() => {
    if (!currentField) return;
    const timeout = setTimeout(() => {
      const errors = validate();
      if (errors[currentField]) {
        setFieldErrors((prev) => ({
          ...prev,
          [currentField]: errors[currentField],
        }));
      } else {
        setFieldErrors((prev) => {
          const updated = { ...prev };
          delete updated[currentField];
          return updated;
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [normalizedField, currentField]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof Update;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      toast(`${errors.firstName || errors.lastName || errors.bio}`, {
        classNames: {
          toast:
            "!bg-yellow-600 !text-white rounded-xl border border-yellow-700",
        },
        closeButton: true,
      });
      setIsSubmitting(false);
      return;
    }

    const payload: Partial<Update> = {};
    (Object.keys(formData) as (keyof Update)[]).forEach((key) => {
      if (formData[key] !== user?.[key]) {
        payload[key] = formData[key];
      }
    });

    if (Object.keys(payload).length === 0) {
      toast("No changes detected, nothing to update.", {
        classNames: {
          toast:
            "!bg-yellow-600 !text-white rounded-xl border border-yellow-700",
        },
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await updateUser(payload);

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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update user";

      setError(message);

      toast(`Failed to update Profile`, {
        description: "Check Types under inputs or refresh page",
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
      setIsSubmitting(false);
    }
  };

  const handleFocus = (name: keyof Update) => () => setCurrentField(name);
  const handleBlur = () => setCurrentField(null);

  if (isLoading) return <Loading />;
  // if (isSubmitting) {
  //   return (
  //     <section className="min-h-screen flex flex-col justify-center items-center gap-5">
  //       <motion.div
  //         {...Animate}
  //         {...opacity}
  //         className="inline-block animate-spin rounded-full h-40 w-40 border-b-2  border-third dark:border-primary"
  //       />
  //       <AnimatePresence mode="wait">
  //         {TookLonger && (
  //           <motion.div key={TookLonger} {...Animate} {...opacity}>
  //             {TookLonger}
  //           </motion.div>
  //         )}
  //       </AnimatePresence>
  //     </section>
  //   );
  // }

  return (
    <section className=" max-w-2xl mx-auto p-8">
      <div className="bg-white dark:bg-third rounded-2xl shadow-xl  overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-secondary to-secondaryHigh p-8 text-white">
          <motion.h2
            {...Animate}
            {...FadeUp}
            className="text-4xl font-bold text-center"
          >
            Update Your Profile
          </motion.h2>
          <motion.p
            {...FadeUp}
            animate={{
              ...Animate.animatenly,
              transition: { ...Animate.transition, delay: 0.1 },
            }}
            className="text-center mt-2 !text-white/90"
          >
            Keep your information up to date
          </motion.p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {/* Avatar Section */}
          <Update_Avatar />

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <motion.div
                {...FadeUp}
                animate={{
                  ...Animate.animatenly,
                  transition: { ...Animate.transition, delay: 0.2 },
                }}
              >
                <label
                  className="defaultLabel flex items-center gap-2 mb-2"
                  htmlFor="firstName"
                >
                  <User className="w-4 h-4" />
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onFocus={handleFocus("firstName")}
                  onBlur={handleBlur}
                  aria-invalid={!!fieldErrors.firstName}
                  className={`defaultInput transition-all duration-200 ${
                    fieldErrors.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "focus:border-secondary focus:ring-secondary"
                  }`}
                  placeholder="Enter your first name"
                />
                {fieldErrors.firstName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.firstName}
                  </motion.p>
                )}
              </motion.div>

              {/* Last Name */}
              <motion.div
                {...FadeUp}
                animate={{
                  ...Animate.animatenly,
                  transition: { ...Animate.transition, delay: 0.3 },
                }}
              >
                <label
                  className="defaultLabel flex items-center gap-2 mb-2"
                  htmlFor="lastName"
                >
                  <User className="w-4 h-4" />
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onFocus={handleFocus("lastName")}
                  onBlur={handleBlur}
                  aria-invalid={!!fieldErrors.lastName}
                  className={`defaultInput transition-all duration-200 ${
                    fieldErrors.lastName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "focus:border-secondary focus:ring-secondary"
                  }`}
                  placeholder="Enter your last name"
                />
                {fieldErrors.lastName && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.lastName}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Bio Field */}
            <motion.div
              {...FadeUp}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.4 },
              }}
            >
              <label
                className="defaultLabel flex items-center gap-2 mb-2"
                htmlFor="bio"
              >
                <FileText className="w-4 h-4" />
                Bio
                <span className="text-xs text-gray-500 font-normal ml-auto">
                  {formData.bio ? formData.bio.length : 0} characters
                </span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                onFocus={handleFocus("bio")}
                onBlur={handleBlur}
                className="defaultInput transition-all duration-200 focus:border-secondary focus:ring-secondary resize-none"
                rows={5}
                placeholder="Tell us about yourself..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Share a brief description about yourself, your interests, or
                what you do.
              </p>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              {...FadeUp}
              animate={{
                ...Animate.animatenly,
                transition: { ...Animate.transition, delay: 0.5 },
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-secondary to-secondaryHigh hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Update Profile
                  </>
                )}
              </motion.button>
            </motion.div>

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
          </form>
        </div>
      </div>

      {/* Helper Text */}
      <motion.p
        {...FadeUp}
        animate={{
          ...Animate.animatenly,
          transition: { ...Animate.transition, delay: 0.6 },
        }}
        className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
      >
        Your information is secure and will only be visible to you
      </motion.p>
    </section>
  );
}
