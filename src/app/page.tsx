import Books from "@/components/Books";
import Futures from "@/components/Futures";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <Futures />
      <Books />
    </main>
  );
}
