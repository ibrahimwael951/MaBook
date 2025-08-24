"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Animate, FadeDown, FadeUp } from "@/animation";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
export default function page() {
  const { user, loading } = useAuth();
  const isUserFound = user ? true : false;
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  useEffect(() => {
    if (!loading && user) {
      setForm({
        ...form,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [loading, user, setForm]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    // setCurrentField(name as keyof RegisterCredentials);
  };

  if (loading) return <Loading />;
  return (
    <main className="min-h-screen mt-20">
      <div className="min-h-screen h-[40rem] w-full rounded-md relative flex flex-col items-center justify-center antialiased">
        <motion.h1
          {...FadeUp}
          {...Animate}
          className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-bold"
        >
          Contact <span> Us </span>
        </motion.h1>
        <motion.p
          {...FadeUp}
          animate={{
            ...Animate.animate,
            transition: {
              ...Animate.animate.transition,
              delay: 0.25,
            },
          }}
        >
          hello guys
        </motion.p>

        <motion.form
          {...FadeUp}
          animate={{
            ...Animate.animate,
            transition: { ...Animate.animate.transition, delay: 0.3 },
          }}
          action=""
          className=" grid grid-cols-2 gap-5 border-2 border-dashed rounded-2xl p-5 z-20 m-7"
        >
          <AnimatePresence>
            {isUserFound && (
              <motion.p
                {...FadeDown}
                {...Animate}
                className="col-span-2  text-center"
              >
                We Used your Account data
              </motion.p>
            )}
          </AnimatePresence>
          <div className="relative">
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
              onChange={handleChange}
              value={form.firstName}
              disabled={isUserFound}
              className="defaultInput disabled:cursor-not-allowed  disabled:ring-1 disabled:ring-green-500 dark:disabled:ring-green-500"
            />
          </div>
          <div className="relative">
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
              onChange={handleChange}
              value={form.lastName}
              disabled={isUserFound}
              className="defaultInput disabled:cursor-not-allowed disabled:ring-1 disabled:ring-green-500 dark:disabled:ring-green-500"
            />
          </div>

          <div className="relative col-span-2">
            <label
              htmlFor="email"
              className="font-medium uppercase w-fit flex  items-center "
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text"
              placeholder="user@gmail.com"
              onChange={handleChange}
              value={form.email}
              disabled={isUserFound}
              className="defaultInput disabled:cursor-not-allowed  disabled:ring-1 disabled:ring-green-500 dark:disabled:ring-green-500"
            />
          </div>
          <div className="relative col-span-2">
            <label
              htmlFor="phone"
              className="font-medium uppercase w-fit flex  items-center "
            >
              Your Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="01234567891"
              onChange={handleChange}
              value={form.phone}
              className="defaultInput"
            />
          </div>
          <div className="relative col-span-2">
            <label
              htmlFor="message"
              className="font-medium uppercase w-fit flex  items-center "
            >
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Hi, i love your platform a lot"
              onChange={handleChange}
              value={form.message}
              rows={5}
              className="defaultInput"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            // disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondaryHigh focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondaryHigh disabled:opacity-50 disabled:cursor-not-allowed col-span-2"
          >
            Send Message
          </motion.button>
        </motion.form>
        {/* <BackgroundBeams className="" /> */}
      </div>
    </main>
  );
}
