"use client";

import React, { useState, useMemo } from "react";
import { EditorialPost } from "@/types/phoenixz";
import { FeedCard } from "@/components/ui/FeedCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { SlidersHorizontal, Search } from "lucide-react";

interface LiveFeedProps {
  posts: EditorialPost[];
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "All Moves" },
    { id: "pricing", label: "Pricing" },
    { id: "dx_change", label: "DX / API" },
    { id: "launch", label: "Launches" },
    { id: "feature_parity", label: "Feature Parity" },
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.moveType === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.takeText.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <section className="w-full space-y-4">
      {/* Controls: Search and Filter Pills */}
      <div className="bg-zinc-950 border border-zinc-800 p-3 sm:p-4 rounded-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500 mr-1 flex-shrink-0" aria-hidden="true" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              aria-label={`Filter feed by ${cat.label}`}
              className={`text-xs font-mono px-2.5 py-1 rounded-xs transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 ${
                selectedCategory === cat.id
                  ? "bg-zinc-200 text-zinc-950 font-bold"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search moves or companies…"
            aria-label="Search moves or companies"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-xs font-mono pl-8 pr-3 py-1.5 rounded-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus:border-zinc-600"
          />
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, idx) => (
            <FeedCard key={post.id} post={post} initiallyExpanded={idx === 0} />
          ))
        ) : (
          <div className="bg-zinc-950 border border-zinc-800 p-12 text-center rounded-sm">
            <p className="text-zinc-400 font-mono text-sm">
              No analysis posts match your current filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
