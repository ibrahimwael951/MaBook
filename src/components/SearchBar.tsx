"use client";
import { FadeUp, ViewPort } from "@/animation";
import { motion }from "framer-motion"
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  delay?:number;
}

export default function SearchBar({ onSearch, loading ,delay }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.form {...FadeUp} {...ViewPort} transition={{delay:delay}} onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books..."
          className="w-full px-4 py-3  pr-24 text-lg border-2 border-thirdLow dark:border-primLow rounded-lg dark:focus:border-primary focus:border-third focus:outline-none"
          disabled={loading}
        />
    
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-seconder text-primary  px-6 py-2 rounded-md  disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </motion.form>
  );
}
