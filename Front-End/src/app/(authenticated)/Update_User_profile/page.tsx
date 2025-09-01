"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Update } from "@/types/Auth";
import Loading from "@/components/Loading";
import { Animate, FadeUp } from "@/animation";
import Image from "next/image";
import { toast } from "sonner";

export default function Page() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState<Update>({
    bio: "",
    lastName: "",
    firstName: "",
    avatar: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const initialized = useRef(false);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof Update, string>>
  >({});
  const [currentField, setCurrentField] = useState<keyof Update | null>(null);

  const nameRegex = /^[a-zA-Z]+$/;

  // load user once
  useEffect(() => {
    if (user && !initialized.current) {
      setFormData({
        bio: user.bio ?? "",
        lastName: user.lastName ?? "",
        firstName: user.firstName ?? "",
        avatar: user.avatar ?? "",
      });
      setIsLoading(false);
      initialized.current = true;
    }
  }, [user]);

  // validate helper
  const validate = (): Partial<Record<keyof Update, string>> => {
    const errors: Partial<Record<keyof Update, string>> = {};

    const fname = formData.firstName?.trim() ?? "";
    const lname = formData.lastName?.trim() ?? "";

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
  }, [normalizedField, currentField, validate]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const key = name as keyof Update;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateUser(formData);
      setSuccess(true);
      toast(`Profile updated successfully!`, {
        classNames: {
          toast: "!bg-green-600 !text-white rounded-xl border border-red-700",
          actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
      toast(`Failed to update Profile ${error}`, {
        description: "Check Types under inputs or refresh page ",
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
  return (
    <section className="mt-20  max-w-xl mx-auto p-6 rounded-lg shadow-md">
      <motion.h2
        {...Animate}
        {...FadeUp}
        className="text-4xl font-bold mb-6 text-center"
      >
        Update Your <span> Profile </span>
      </motion.h2>

      <form onSubmit={handleSubmit} noValidate>
        <motion.div
          {...FadeUp}
          animate={{
            ...Animate.animatenly,
            transition: { ...Animate.transition, delay: 0.1 },
          }}
          className="mb-4"
        >
          <label className="defaultLabel" htmlFor="firstName">
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
            className="defaultInput"
          />
          {fieldErrors.firstName && (
            <p className="mt-1 text-sm !text-red-600">
              {fieldErrors.firstName}
            </p>
          )}
        </motion.div>

        <motion.div
          {...FadeUp}
          animate={{
            ...Animate.animatenly,
            transition: { ...Animate.transition, delay: 0.2 },
          }}
          className="mb-4"
        >
          <label className="defaultLabel" htmlFor="lastName">
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
            className="defaultInput"
          />
          {fieldErrors.lastName && (
            <p className="mt-1 text-sm !text-red-600">{fieldErrors.lastName}</p>
          )}
        </motion.div>

        <motion.div
          {...FadeUp}
          animate={{
            ...Animate.animatenly,
            transition: { ...Animate.transition, delay: 0.3 },
          }}
          className="mb-4"
        >
          <label className="defaultLabel" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            onFocus={handleFocus("bio")}
            onBlur={handleBlur}
            className="defaultInput"
            rows={5}
          />
        </motion.div>

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
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="defaultInput"
          />
          {formData.avatar && (
            <div className="mt-2">
              <Image
                src={formData.avatar as string}
                alt="Preview"
                width={200}
                height={200}
                unoptimized
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          )}
        </motion.div>

        <motion.button
          {...FadeUp}
          animate={{
            ...Animate.animatenly,
            transition: { ...Animate.transition, delay: 0.5 },
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondaryHigh focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh disabled:opacity-50 disabled:cursor-not-allowed  "
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </motion.button>
      </form>
    </section>
  );
}
