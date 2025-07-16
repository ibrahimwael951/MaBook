import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["books.google.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        pathname: "/books/content/**",
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/books/content/**",
      },
    ],
  },
};

export default nextConfig;
