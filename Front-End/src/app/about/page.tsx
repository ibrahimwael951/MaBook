import React from "react";
import Hero from "@/components/About/Hero";
import Features from "@/components/About/Features";
import Why_MaBook from "@/components/About/Why_MaBook";

export default function Page() {
  return (
    <section className="">
      <Hero />
      <Why_MaBook/>
      <Features/>
    </section>
  );
}
