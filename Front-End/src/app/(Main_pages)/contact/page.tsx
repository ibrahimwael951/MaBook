"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Animate, FadeDown, FadeUp } from "@/animation";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
} from "lucide-react";
import Loading from "@/components/Loading";
export default function Page() {
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
      setForm((prevForm) => ({
        ...prevForm,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }));
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
    <main className="min-h-screen my-20">
      <div className="min-h-screen w-full rounded-md relative flex flex-col items-center justify-center antialiased px-4">
        {/* Header Section */}
        <div className="text-center mb-8 z-20">
          <motion.h1
            {...FadeUp}
            {...Animate}
            className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-bold mb-4"
          >
            Contact <span>Us</span>
          </motion.h1>
          <motion.p
            {...FadeUp}
            animate={{
              ...Animate.animate,
              transition: {
                ...Animate.animate.transition,
                delay: 0.15,
              },
            }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Have a question or feedback? We'd love to hear from you. Send us a
            message and we'll respond as soon as possible.
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          {...FadeUp}
          animate={{
            ...Animate.animate,
            transition: { ...Animate.animate.transition, delay: 0.3 },
          }}
          className="w-full max-w-3xl z-20"
        >
          <div className="bg-white dark:bg-third rounded-2xl shadow-xl dark:shadow-white/20 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-secondary to-secondaryHigh p-6 text-white">
              <h2 className="text-2xl font-bold text-center">
                Send us a Message
              </h2>
              <p className="text-center mt-2 text-white/90 text-sm">
                Fill out the form below and we'll get back to you soon
              </p>
            </div>

            {/* Form Content */}
            <form className="p-8">
              {/* Auto-filled Data Notice */}
              <AnimatePresence>
                {isUserFound && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">
                        Account Information Detected
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        We've pre-filled your account information to save you
                        time
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <motion.div
                  {...FadeUp}
                  animate={{
                    ...Animate.animate,
                    transition: { ...Animate.animate.transition, delay: 0.4 },
                  }}
                >
                  <label
                    htmlFor="firstName"
                    className="defaultLabel flex items-center gap-2 mb-2"
                  >
                    <User className="w-4 h-4" />
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    onChange={handleChange}
                    value={form.firstName}
                    disabled={isUserFound}
                    className="defaultInput transition-all duration-200 focus:border-secondary focus:ring-secondary disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:ring-2 disabled:ring-green-500 dark:disabled:ring-green-500"
                  />
                </motion.div>

                {/* Last Name */}
                <motion.div
                  {...FadeUp}
                  animate={{
                    ...Animate.animate,
                    transition: { ...Animate.animate.transition, delay: 0.45 },
                  }}
                >
                  <label
                    htmlFor="lastName"
                    className="defaultLabel flex items-center gap-2 mb-2"
                  >
                    <User className="w-4 h-4" />
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    onChange={handleChange}
                    value={form.lastName}
                    disabled={isUserFound}
                    className="defaultInput transition-all duration-200 focus:border-secondary focus:ring-secondary disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:ring-2 disabled:ring-green-500 dark:disabled:ring-green-500"
                  />
                </motion.div>

                {/* Email */}
                <motion.div
                  {...FadeUp}
                  animate={{
                    ...Animate.animate,
                    transition: { ...Animate.animate.transition, delay: 0.5 },
                  }}
                  className="md:col-span-2"
                >
                  <label
                    htmlFor="email"
                    className="defaultLabel flex items-center gap-2 mb-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    onChange={handleChange}
                    value={form.email}
                    disabled={isUserFound}
                    className="defaultInput transition-all duration-200 focus:border-secondary focus:ring-secondary disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:ring-2 disabled:ring-green-500 dark:disabled:ring-green-500"
                  />
                </motion.div>

                {/* Phone */}
                <motion.div
                  {...FadeUp}
                  animate={{
                    ...Animate.animate,
                    transition: { ...Animate.animate.transition, delay: 0.55 },
                  }}
                  className="md:col-span-2"
                >
                  <label
                    htmlFor="phone"
                    className="defaultLabel flex items-center gap-2 mb-2"
                  >
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    onChange={handleChange}
                    value={form.phone}
                    className="defaultInput transition-all duration-200 focus:border-secondary focus:ring-secondary"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Optional - We'll only use this if we need to reach you
                    quickly
                  </p>
                </motion.div>

                {/* Message */}
                <motion.div
                  {...FadeUp}
                  animate={{
                    ...Animate.animate,
                    transition: { ...Animate.animate.transition, delay: 0.6 },
                  }}
                  className="md:col-span-2"
                >
                  <label
                    htmlFor="message"
                    className="defaultLabel flex items-center gap-2 mb-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Your Message
                    <span className="text-xs text-gray-500 font-normal ml-auto">
                      {form.message.length} characters
                    </span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us what's on your mind..."
                    onChange={handleChange}
                    value={form.message}
                    rows={6}
                    className="defaultInput transition-all duration-200 focus:border-secondary focus:ring-secondary resize-none"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Please provide as much detail as possible so we can assist
                    you better
                  </p>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  {...FadeUp}
                  animate={{
                    ...Animate.animate,
                    transition: { ...Animate.animate.transition, delay: 0.65 },
                  }}
                  className="md:col-span-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    // disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-secondary to-secondaryHigh hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </motion.button>
                </motion.div>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <motion.div
            {...FadeUp}
            animate={{
              ...Animate.animate,
              transition: { ...Animate.animate.transition, delay: 0.7 },
            }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We typically respond within 24 hours during business days
            </p>
          </motion.div>
        </motion.div>

        <BackgroundBeams className="" />
      </div>
    </main>
  );
}
