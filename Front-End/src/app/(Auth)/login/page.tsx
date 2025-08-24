"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { CopyX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Animate, FadeLeft, FadeUp, opacity } from "@/animation";
import { LoginCredentials } from "@/types/Auth";
import Link from "next/link";
import Loading from "@/components/Loading";
import Features from "@/components/Auth/Features";
export default function Page() {
  const { login, loading, error, clearError, user } = useAuth();
  const [closeErrorPop, setCloseErrorPop] = useState<boolean>(false);
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    usernameOrEmail: "",
    password: "",
  });

  const trimmedCredentials = {
    ...credentials,
    usernameOrEmail: credentials.usernameOrEmail.replace(/\s+/g, ""),
    password: credentials.password.replace(/\s+/g, ""),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(trimmedCredentials);
      router.push(`/profile/${user?.username}`);
    } catch (error) {
      setCloseErrorPop(true);
      console.error("Login failed:", error);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const InputsData: Array<{
    item: keyof LoginCredentials;
    placeholder: string;
  }> = [
    { item: "usernameOrEmail", placeholder: "ibrahimwael809" },
    { item: "password", placeholder: "*****" },
  ];

  useEffect(() => {
    if (!loading && user) {
      router.push(`/profile/${user?.username}`);
    }
  }, [loading, user, router]);

  if (loading || user) return <Loading />;
  return (
    <section className="mt-28 lg:mt-0 flex flex-col lg:flex-row items-center justify-center gap-10 min-h-screen  ">
      <>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-full mx-auto max-w-md"
        >
          {InputsData.map((item, i) => (
            <motion.div key={i} {...FadeLeft} {...Animate}>
              <label htmlFor={item.item} className="font-medium uppercase">
                {item.item === "usernameOrEmail"
                  ? "UserName or Email"
                  : "Password"}
              </label>
              <input
                id={item.item}
                name={item.item}
                type={item.item === "password" ? "password" : "text"}
                placeholder={item.placeholder}
                value={credentials[item.item]}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh duration-150"
                required
              />
            </motion.div>
          ))}

          <motion.button
            {...FadeLeft}
            {...Animate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondaryHigh focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          <div className="text-center">
            New ? , so what are u doing here go to{" "}
            <Link
              href="/register"
              className="text-lg font-semibold text-secondaryHigh mx-1"
            >
              Register
            </Link>{" "}
            form page
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
                  Login Failed :
                </h1>

                <ul className="text-lg list-decimal list-inside">
                  {credentials.usernameOrEmail.replace(/\s+/g, "").length <
                    2 && <li>Your must write at least 2 characters</li>}
                  {credentials.usernameOrEmail.length > 2 && (
                    <>
                      <h1 className="text-2xl">
                        {" "}
                        {error} : userName or Email invalid or maybe the
                        password
                        {":)"}
                      </h1>
                      <p>check Your UserName , Email and password again </p>
                    </>
                  )}
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
