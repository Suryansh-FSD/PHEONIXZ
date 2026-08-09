"use client";

import React, { useState, useMemo } from "react";
import { EditorialPost } from "@/types/phoenixz";
import { FeedCard } from "@/components/ui/FeedCard";
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
        (post.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (post.company?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (post.takeText?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (post.text?.toLowerCase() || "").includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <section className="w-full space-y-6">
      {/* Controls Bar: Filter Icon + Pills + Search Box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Left: Filter Icon & Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="w-9 h-9 border border-gray-200 rounded-md bg-white text-gray-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex items-center space-x-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-sans font-medium px-3.5 py-2 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-orange-50/60 border border-orange-500 text-orange-600 font-semibold shadow-2xs"
                      : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Search Box */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search moves or companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-xs font-sans pl-9 pr-3 py-2 rounded-md focus:outline-none focus:border-gray-400 shadow-2xs"
          />
        </div>
      </div>

      {/* Analysis Feed List */}
      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, idx) => (
            <FeedCard key={post.id} post={post} initiallyExpanded={idx === 0} />
          ))
        ) : (
          <div className="bg-white border border-gray-200 p-12 text-center rounded-lg space-y-2">
            <p className="text-gray-400 font-mono text-xs uppercase tracking-wider">
              No Analysis Briefs Match Current Filter
            </p>
            <p className="text-gray-500 text-xs font-sans">
              Try selecting a different category pill or clearing your search input.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
