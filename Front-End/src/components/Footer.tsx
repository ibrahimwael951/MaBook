"use client";
import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Company, Navbar, socialMedia } from "@/data/Quick_Links";
import { motion } from "framer-motion";
import { ModeSelector } from "@/components/ui/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const MotionLink = motion.create(Link);

const Footer = () => {
  const { user } = useAuth();

  if (user) return null;
  return (
    <footer className="border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary to-secondaryHigh rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <Image
                  alt="logo"
                  src="/open-book.png"
                  width={56}
                  height={56}
                  className="relative"
                />
              </div>
              <span className="text-3xl font-extrabold bg-gradient-to-r from-secondary to-secondaryHigh bg-clip-text text-transparent">
                Ma Book
              </span>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
              Your digital sanctuary for discovering, tracking, and sharing your
              reading journey with a community of book lovers.
            </p>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Theme:
              </span>
              <ModeSelector />
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-secondary to-secondaryHigh rounded-full"></div>
                Company
              </h3>
              <ul className="space-y-4">
                {Company.map((item, i) => (
                  <li key={i}>
                    <MotionLink
                      whileHover={{ x: 5 }}
                      href={item.href}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-secondary dark:hover:text-secondary transition-colors group"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </MotionLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-secondary to-secondaryHigh rounded-full"></div>
                Quick Links
              </h3>
              <ul className="space-y-4">
                {Navbar.map((item, i) => (
                  <li key={i}>
                    <MotionLink
                      whileHover={{ x: 5 }}
                      href={item.href}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-secondary dark:hover:text-secondary transition-colors group"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </MotionLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-secondary to-secondaryHigh rounded-full"></div>
                Connect
              </h3>
              <ul className="space-y-4">
                {socialMedia.map((item, i) => (
                  <li key={i}>
                    <MotionLink
                      whileHover={{ x: 5 }}
                      href={item.href}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-secondary dark:hover:text-secondary transition-colors group"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </MotionLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-300 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Ma Book
              </span>
              . All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-secondary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
