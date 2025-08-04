"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { CopyX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Animate, FadeLeft, FadeUp, opacity } from "@/animation";
import { RegisterCredentials } from "@/types/Auth";
import Link from "next/link";
import Loading from "@/components/Loading";

import Features from "@/components/Auth/Features";

export default function Page() {
  const { register, loading, error, clearError, user } = useAuth();
  const [closeErrorPop, setCloseErrorPop] = useState<boolean>(false);
  const router = useRouter();

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
    username: credentials.username.replace(/\s+/g, ""),
    firstName: credentials.firstName.trim(),
    lastName: credentials.lastName.trim(),
    email: credentials.email.trim(),
    password: credentials.password.replace(/\s+/g, ""),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await register(trimmedCredentials);
      router.push("/dashboard");
    } catch (error) {
      setCloseErrorPop(true);
      console.error("Register failed:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      username: e.target.value.replace(/\s+/g, ""),
    });
  };

  const InputsData: Array<{
    item: keyof RegisterCredentials;
    placeholder: string;
  }> = [
    { item: "username", placeholder: "ibrhim809" },
    { item: "firstName", placeholder: "Ibrahim" },
    { item: "lastName", placeholder: "Wael" },
    { item: "email", placeholder: "YourEmailAddress@gmail.com" },
  ];

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard ");
    }
  }, [loading, user, router]);

  if (loading || user) return <Loading />;
  return (
    <section className="mt-28 flex flex-col lg:flex-row items-center justify-center gap-10 min-h-screen  ">
      <>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full mx-auto max-w-md"
        >
          {InputsData.map((item, i) => {
            const isUsername = item.item === "username";
            const handleFieldChange = isUsername
              ? handleChangeUsername
              : handleChange;

            return (
              <motion.div key={i} {...FadeLeft} {...Animate}>
                <label htmlFor={item.item} className="font-medium uppercase">
                  {item.item}
                </label>
                <input
                  id={item.item}
                  name={item.item}
                  type={item.item === "email" ? "email" : "text"}
                  placeholder={item.placeholder}
                  value={credentials[item.item]}
                  onChange={handleFieldChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh"
                  required
                />
              </motion.div>
            );
          })}
          <motion.div {...FadeLeft} {...Animate}>
            <label htmlFor="gender" className="font-medium uppercase">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={credentials.gender}
              onChange={(e) =>
                setCredentials((prev) => ({
                  ...prev,
                  gender: e.target.value.trim(),
                }))
              }
              className="bg-primary dark:bg-third mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl  text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh"
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl  text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh"
              required
            />
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
          <div>
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

        <AnimatePresence>
          {closeErrorPop && (
            <>
              <motion.div
                {...opacity}
                animate={{ opacity: 0.6 }}
                className=" fixed top-0 left-0 w-full h-screen bg-black opacity-60 z-50"
              />
              <motion.div
                {...FadeUp}
                {...Animate}
                className=" fixed top-2/4 left-2/4 -translate-2/4 dark:bg-secondary bg-primary p-5 rounded-2xl w-5/6 max-w-96 h-60 z-50 "
              >
                <h1 className="text-2xl flex items-center gap-2 mb-5 text-red-500 font-bold">
                  Register Failed :
                </h1>
                {credentials.username.length < 8 && (
                  <h1 className="text-2xl"> {error} </h1>
                )}

                <ul className="text-lg list-decimal list-inside">
                  {credentials.username.trim().length >= 8 && (
                    <li>Your username must be from 2 to 8 characters</li>
                  )}
                  {credentials.firstName.trim().length >= 8 && (
                    <li>Your first Name must be from 2 to 10 characters</li>
                  )}

                  {credentials.lastName.trim().length >= 8 && (
                    <li>Your last Name must be from 2 to 10 characters</li>
                  )}

                  {credentials.gender === "Male" ||
                    (credentials.gender === "Female" && (
                      <li>You must Choose Your Gender</li>
                    ))}

                  {credentials.password.trim().length <= 8 ||
                    (credentials.password.trim().length >= 20 && (
                      <li>Your password must be from 8 to 20 characters</li>
                    ))}
                </ul>

                <button
                  onClick={() => setCloseErrorPop(false)}
                  className="absolute top-2 right-2 p-2 text-2xl cursor-pointer"
                >
                  <CopyX />
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
      <Features />
    </section>
  );
}
