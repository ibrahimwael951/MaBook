"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Animate, FadeDown, FadeLeft, opacity } from "@/animation";
import { RegisterCredentials } from "@/types/Auth";
import Link from "next/link";
import Loading from "@/components/Loading";

import Features from "@/components/Auth/Features";
import { Mars, Venus } from "lucide-react";
import { BANNED_USERNAMES } from "@/data/BannedUsernames";
import { toast } from "sonner";

export default function Page() {
  const InputStyle =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh z-10 duration-150";
  const englishOnlyRegex = /^[a-zA-Z]+$/;
  const { register, loading, clearError, user, checkUsername, CheckEmail } =
    useAuth();

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof RegisterCredentials, string>>
  >({});

  const router = useRouter();

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    password: "",
  });

  const trimmedCredentials = {
    ...credentials,
    username: credentials.username.toLowerCase().replace(/\s+/g, ""),
    firstName: credentials.firstName.trim(),
    lastName: credentials.lastName.trim(),
    email: credentials.email.trim(),
    password: credentials.password.replace(/\s+/g, ""),
  };

  // --------------------------------

  const [statusUsername, setStatusUserName] = useState<null | boolean>(null);
  const [statusMessageUsername, setStatusMessageUsername] = useState<
    null | string
  >(null);

  const handleCheckUsername = async () => {
    try {
      await checkUsername(credentials.username);
      setStatusUserName(true);
      setStatusMessageUsername("Username Available");
    } catch {
      setStatusUserName(false);
      setStatusMessageUsername("Use Another Username");
    }
  };

  // --------------------------------

  const [statusEmail, setStatusEmail] = useState<null | boolean>(null);
  const [statusMessageEmail, setStatusMessageEmail] = useState<null | string>(
    null
  );

  const handleCheckEmail = async () => {
    try {
      await CheckEmail(credentials.email);
      setStatusEmail(true);
      setStatusMessageEmail("email Available");
    } catch {
      setStatusEmail(false);
      setStatusMessageEmail("Use Another email");
    }
  };

  // --------------------------------

  useEffect(() => {
    if (credentials.username.length < 2 || fieldErrors.username) return;

    const delayDebounceFn = setTimeout(() => {
      handleCheckUsername();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [credentials.username, fieldErrors.username, handleCheckUsername]);

  // --------------------------------

  useEffect(() => {
    if (credentials.email.length < 2 || fieldErrors.email) return;

    const delayDebounceFn = setTimeout(() => {
      handleCheckEmail();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [credentials.email, fieldErrors.email, handleCheckEmail]);

  // --------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      await register(trimmedCredentials);
      toast("You have Successfully become a Reader <3", {
        description: "Welcome to Ma Book Platform :>",
        classNames: {
          toast: "!bg-green-600 !text-white rounded-xl border border-red-700",
          description: "!text-white text-sm opacity-90",
          actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      router.push(`/profile/${user?.username}`);
      setSubmitted(true);
    } catch (error) {
      toast(`Register Failed`, {
        description: "Check Errors under all Inputs or contact Me ",
        classNames: {
          toast: "!bg-red-600 !text-white rounded-xl border border-red-700",
          description: "!text-white text-sm opacity-90",
          actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
        },
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      setSubmitted(true);
      console.error("Register failed:", error);
    }
  };

  // --------------------------------

  const [currentField, setCurrentField] = useState<
    keyof RegisterCredentials | null
  >(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCredentials({
      ...credentials,
      [name]: value,
    });

    setCurrentField(name as keyof RegisterCredentials);
  };

  useEffect(() => {
    if (!currentField) return;

    const delayDebounceFn = setTimeout(() => {
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

    return () => clearTimeout(delayDebounceFn);
  }, [currentField ? credentials[currentField] : null, currentField]);

  // --------------------------------
  const validate = () => {
    const errors: Partial<Record<keyof RegisterCredentials, string>> = {};

    if (
      credentials.username.trim().length < 2 ||
      credentials.username.trim().length > 8
    ) {
      errors.username = "Username must be between 2 and 8 characters.";
    } else if (!englishOnlyRegex.test(credentials.username.trim())) {
      errors.username =
        "Username must contain only English letters and numbers.";
    } else if (BANNED_USERNAMES.includes(credentials.username.toLowerCase())) {
      errors.username = "This username is not allowed.";
    }

    if (
      credentials.firstName.trim().length < 2 ||
      credentials.firstName.trim().length > 10
    ) {
      errors.firstName = "First name must be between 2 and 10 characters.";
    } else if (!englishOnlyRegex.test(credentials.firstName.trim())) {
      errors.firstName = "First Name must contain only English letters.";
    }

    if (
      credentials.lastName.trim().length < 2 ||
      credentials.lastName.trim().length > 10
    ) {
      errors.lastName = "Last name must be between 2 and 10 characters.";
    } else if (!englishOnlyRegex.test(credentials.lastName.trim())) {
      errors.lastName = "Last Name must contain only English letters.";
    }

    if (!["male", "female"].includes(credentials.gender.toLowerCase())) {
      errors.gender = "Please select your gender.";
    }

    if (
      credentials.password.trim().length < 8 ||
      credentials.password.trim().length > 20
    ) {
      errors.password = "Password must be between 8 and 20 characters.";
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(credentials.email.trim())) {
      errors.email =
        "Email must be a valid Gmail address (e.g. yourname@gmail.com).";
    }

    return errors;
  };

  useEffect(() => {
    if (!loading && user) {
      router.push(`/profile/${user?.username}`);
    }
  }, [loading, user, router]);

  if (loading || user) return <Loading />;
  return (
    <section className="mt-28 flex flex-col lg:flex-row items-center justify-center gap-10 min-h-screen  ">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full mx-auto max-w-md"
      >
        <motion.div {...FadeLeft} {...Animate} className="relative">
          <label
            htmlFor="username"
            className="font-medium uppercase w-fit flex  items-center "
          >
            username :{" "}
            <AnimatePresence>
              {statusMessageUsername && !fieldErrors.username && (
                <motion.div
                  {...opacity}
                  {...Animate}
                  className={`${
                    statusUsername ? "text-green-500" : "text-red-500"
                  }       z-20`}
                >
                  {statusUsername
                    ? "Username Available"
                    : "Use another username"}
                </motion.div>
              )}
            </AnimatePresence>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="ibrhimwael809"
            value={credentials.username.toLowerCase().replace(/\s+/g, "")}
            onChange={handleChange}
            className={`${fieldErrors.username && "mb-10"} ${InputStyle}`}
          />
          <AnimatePresence>
            {fieldErrors.username && (
              <motion.p
                {...opacity}
                {...Animate}
                className="absolute top-full  !text-red-500  mt-1"
              >
                {fieldErrors.username}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ------------------------------------ */}

        <motion.div {...FadeLeft} {...Animate} className="relative">
          <label
            htmlFor="firstName"
            className="font-medium uppercase w-fit flex  items-center "
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="ibrhim"
            value={credentials.firstName.trim()}
            onChange={handleChange}
            className={`${fieldErrors.firstName && "mb-10"} ${InputStyle}`}
          />
          <AnimatePresence>
            {fieldErrors.firstName && (
              <motion.p
                {...opacity}
                {...Animate}
                className="absolute top-full  !text-red-500  mt-1"
              >
                {fieldErrors.firstName}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ------------------------------------ */}

        <motion.div {...FadeLeft} {...Animate} className="relative">
          <label
            htmlFor="lastName"
            className="font-medium uppercase w-fit flex  items-center "
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Wael"
            value={credentials.lastName.trim()}
            onChange={handleChange}
            className={`${fieldErrors.lastName && "mb-10"} ${InputStyle}`}
          />
          <AnimatePresence>
            {fieldErrors.lastName && (
              <motion.p
                {...opacity}
                {...Animate}
                className="absolute top-full  !text-red-500  mt-1"
              >
                {fieldErrors.lastName}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ------------------------------------ */}

        <motion.div {...FadeLeft} {...Animate} className="relative">
          <label
            htmlFor="email"
            className="font-medium uppercase w-fit flex  items-center "
          >
            email :{" "}
            <AnimatePresence>
              {statusMessageEmail && !fieldErrors.email && (
                <motion.div
                  {...opacity}
                  {...Animate}
                  className={`${
                    statusEmail ? "text-green-500" : "text-red-500"
                  }       z-20`}
                >
                  {statusEmail ? "Email Available" : "Use another Email"}
                </motion.div>
              )}
            </AnimatePresence>
          </label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="UserEmail@gmail.com"
            value={credentials.email.trim()}
            onChange={handleChange}
            className={`${fieldErrors.email && "mb-10"} ${InputStyle}`}
          />
          <AnimatePresence>
            {fieldErrors.email && (
              <motion.p
                {...opacity}
                {...Animate}
                className="absolute top-full  !text-red-500  mt-1"
              >
                {fieldErrors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...FadeLeft} {...Animate}>
          <label htmlFor="gender" className="font-medium uppercase">
            Gender : {credentials.gender}
          </label>
          <div
            className={`${
              fieldErrors.gender && " mb-10 "
            } flex justify-center gap-5 w-full mt-2 duration-150`}
          >
            <motion.div
              animate={{ opacity: credentials.gender === "male" ? 1 : 0.25 }}
              whileHover={{ opacity: 1, scale: 1.04, y: -2 }}
              whileTap={{ scale: 1, y: -0 }}
              onClick={() => {
                setCredentials({
                  ...credentials,
                  gender: "male",
                });
                setCurrentField("gender" as keyof RegisterCredentials);
              }}
              className="w-2/4 p-5 rounded-2xl border-blue-600 text-blue-600 border flex items-center justify-center cursor-pointer"
            >
              <Mars size={70} />
            </motion.div>
            <motion.div
              animate={{ opacity: credentials.gender === "female" ? 1 : 0.25 }}
              whileHover={{ opacity: 1, scale: 1.04, y: -2 }}
              whileTap={{ scale: 1, y: -0 }}
              onClick={() => {
                setCredentials({
                  ...credentials,
                  gender: "female",
                });
                setCurrentField("gender" as keyof RegisterCredentials);
              }}
              className="w-2/4 p-5 rounded-2xl border-pink-600 text-pink-600 border flex items-center justify-center cursor-pointer"
            >
              <Venus size={70} />
            </motion.div>
          </div>
          <AnimatePresence>
            {fieldErrors.gender && (
              <motion.p
                {...opacity}
                {...Animate}
                className="absolute top-full  !text-red-500  mt-1"
              >
                {fieldErrors.gender}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div {...FadeLeft} {...Animate}>
          <label htmlFor="password" className="font-medium uppercase">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="***********"
            value={credentials.password}
            onChange={handleChange}
            className={` ${
              fieldErrors.password && "mb-10"
            } mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl  text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh duration-150`}
          />
          <AnimatePresence>
            {fieldErrors.password && (
              <motion.p
                {...opacity}
                {...Animate}
                className="absolute top-full  !text-red-500  mt-1"
              >
                {fieldErrors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          {...FadeLeft}
          {...Animate}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondaryHigh focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </motion.button>
        <div className="text-center">
          Already have account ? . go to{" "}
          <Link
            href="/login"
            className="text-lg font-semibold text-secondaryHigh mx-1 "
          >
            Login{" "}
          </Link>{" "}
          form page then
        </div>
      </form>

      <Features />
    </section>
  );
}
