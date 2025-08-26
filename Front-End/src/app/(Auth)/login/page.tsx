"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Animate, FadeLeft } from "@/animation";
import { LoginCredentials } from "@/types/Auth";
import Link from "next/link";
import Loading from "@/components/Loading";
import Features from "@/components/Auth/Features";
import { toast } from "sonner";
export default function Page() {
  const { login, loading, clearError, user } = useAuth();
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
      toast("You have Successfully Logged In", {
        description: "Welcome Back Ma Reader :>",
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
    } catch (error) {
      toast(`Bad credential`, {
        description: "Your password or email are invalid",
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
      </>
      <Features />
    </section>
  );
}
