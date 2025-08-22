"use client";
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BANNED_USERNAMES } from "@/data/BannedUsernames";
import { Update } from "@/types/Auth";

export default function Page() {
  const { user, updateUser, checkUsername } = useAuth();
  const [formData, setFormData] = useState<Update>({
    username: "",
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

  // username allows letters + numbers
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  // name fields allow only english letters
  const nameRegex = /^[a-zA-Z]+$/;

  const [statusUsername, setStatusUserName] = useState<null | boolean>(null);
  const [statusMessageUsername, setStatusMessageUsername] = useState<
    null | string
  >(null);

  // Normalize banned list once
  const bannedLower = useRef(
    BANNED_USERNAMES.map((n) => (typeof n === "string" ? n.toLowerCase() : n))
  );

  // load user once
  useEffect(() => {
    if (user && !initialized.current) {
      setFormData({
        username: user.username ?? "",
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
    const uname = formData.username?.trim() ?? "";
    const fname = formData.firstName?.trim() ?? "";
    const lname = formData.lastName?.trim() ?? "";

    if (uname.length < 2 || uname.length > 8) {
      errors.username = "Username must be between 2 and 8 characters.";
    } else if (!usernameRegex.test(uname)) {
      errors.username =
        "Username must contain only English letters and numbers.";
    } else if (bannedLower.current.includes(uname.toLowerCase())) {
      errors.username = "This username is not allowed.";
    }

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

  useEffect(() => {
    if (!currentField) return;
    const value = formData[currentField];
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
  }, [currentField ? formData[currentField] : null, currentField]);

  const handleCheckUsername = useCallback(async () => {
    const uname = formData.username?.trim() ?? "";
    if (uname.length < 2 || fieldErrors.username) {
      setStatusUserName(null);
      setStatusMessageUsername(null);
      return;
    }

    try {
      await checkUsername(uname);
      setStatusUserName(true);
      setStatusMessageUsername("Username available");
    } catch {
      setStatusUserName(false);
      setStatusMessageUsername("Use another username");
    }
  }, [formData.username, fieldErrors.username, checkUsername]);

  useEffect(() => {
    setStatusUserName(null);
    setStatusMessageUsername(null);

    if (!formData.username || (fieldErrors.username ?? null)) return;

    const t = setTimeout(() => {
      handleCheckUsername();
    }, 500);

    return () => clearTimeout(t);
  }, [formData.username, fieldErrors.username, handleCheckUsername]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFocus = (name: keyof Update) => () => setCurrentField(name);
  const handleBlur = () => setCurrentField(null);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 rounded-lg shadow-md text-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 text-white bg-green-600 rounded">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onFocus={handleFocus("username")}
            onBlur={handleBlur}
            aria-invalid={!!fieldErrors.username || statusUsername === false}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.username && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
          )}
          {!fieldErrors.username && statusMessageUsername && (
            <p
              className={`mt-1 text-sm ${
                statusUsername ? "text-green-600" : "text-red-600"
              }`}
            >
              {statusMessageUsername}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="firstName">
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.firstName && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="lastName">
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
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {fieldErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            onFocus={handleFocus("bio")}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2" htmlFor="avatar">
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formData.avatar && (
            <div className="mt-2">
              <img
                src={formData.avatar as string}
                alt="Preview"
                className="h-20 w-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
