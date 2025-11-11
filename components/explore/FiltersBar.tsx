"use client";
import React, { useState, useRef } from "react";
import {
  Laptop,
  Heart,
  BookOpen,
  DollarSign,
  ShoppingCart,
  Coffee,
  Zap,
  Factory,
  Truck,
  Home,
  Video,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface FiltersBarProps {
  activeFilters: { industry?: string; category?: string; batch?: string };
  setActiveFilters: (filters: {
    industry?: string;
    category?: string;
    batch?: string;
  }) => void;
}

const industries = [
  { name: "Technology", icon: <Laptop size={20} /> },
  { name: "Healthcare", icon: <Heart size={20} /> },
  { name: "Education", icon: <BookOpen size={20} /> },
  { name: "Finance", icon: <DollarSign size={20} /> },
  { name: "Retail", icon: <ShoppingCart size={20} /> },
  { name: "Food & Beverage", icon: <Coffee size={20} /> },
  { name: "Sustainability", icon: <Zap size={20} /> },
  { name: "Manufacturing", icon: <Factory size={20} /> },
  { name: "Mobility", icon: <Truck size={20} /> },
  { name: "Real Estate", icon: <Home size={20} /> },
  { name: "Media", icon: <Video size={20} /> },
];

const categories = ["B2B", "B2C", "C2B", "C2C"];
const batchFilters = ["Trending", "Funded", "Top Rated"];

const FiltersBar: React.FC<FiltersBarProps> = ({
  activeFilters,
  setActiveFilters,
}) => {
  const [showCategory, setShowCategory] = useState(false);
  const [showBatch, setShowBatch] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-3 md:px-6 py-3 bg-white rounded-xl border border-gray-100 shadow-sm sticky top-0 z-20 mx-2 sm:mx-6 md:mx-20">

      <div className="flex items-center w-full md:w-auto flex-1">
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide flex-1 px-2 sm:px-4 scroll-smooth"
        >
          {industries.map((industry) => (
            <button
              key={industry.name}
              className={`flex flex-col items-center justify-center min-w-[60px] sm:min-w-[70px] transition-all duration-200 text-center
                ${
                  activeFilters.industry === industry.name
                    ? "text-black scale-105"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              onClick={() =>
                setActiveFilters({
                  ...activeFilters,
                  industry:
                    activeFilters.industry === industry.name
                      ? undefined
                      : industry.name,
                })
              }
            >
              <div className="mb-1">{industry.icon}</div>
              <span className="text-[10px] sm:text-xs font-medium whitespace-nowrap">
                {industry.name}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex p-1 rounded-full border border-gray-300 hover:bg-gray-100 transition"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-3 w-full md:w-auto">
        <div className="relative">
          <button
            onClick={() => {
              setShowBatch(!showBatch);
              setShowCategory(false);
            }}
            className="flex items-center justify-between w-[110px] sm:w-[120px] px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[10px] sm:text-xs font-medium transition-all"
          >
            {activeFilters.batch || "Filters"}
            <ChevronDown
              size={14}
              className={`transition-transform ${
                showBatch ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {showBatch && (
            <div className="absolute right-0 mt-2 w-[130px] sm:w-[140px] bg-white border rounded-xl shadow-lg z-10 overflow-hidden">
              {batchFilters.map((batch) => (
                <button
                  key={batch}
                  className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs transition
                    ${
                      activeFilters.batch === batch
                        ? "bg-gray-100 font-semibold text-black"
                        : "hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    setActiveFilters({
                      ...activeFilters,
                      batch:
                        activeFilters.batch === batch ? undefined : batch,
                    });
                    setShowBatch(false);
                  }}
                >
                  {batch}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setShowCategory(!showCategory);
              setShowBatch(false);
            }}
            className="flex items-center justify-between w-[130px] sm:w-[150px] px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[10px] sm:text-xs font-medium transition-all"
          >
            {activeFilters.category || "Popular Searches"}
            <ChevronDown
              size={14}
              className={`transition-transform ${
                showCategory ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {showCategory && (
            <div className="absolute right-0 mt-2 w-[150px] sm:w-[160px] bg-white border rounded-xl shadow-lg z-10 overflow-hidden">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`w-full text-left px-3 py-2 text-[11px] sm:text-xs transition
                    ${
                      activeFilters.category === cat
                        ? "bg-gray-100 font-semibold text-black"
                        : "hover:bg-gray-50"
                    }`}
                  onClick={() => {
                    setActiveFilters({
                      ...activeFilters,
                      category:
                        activeFilters.category === cat ? undefined : cat,
                    });
                    setShowCategory(false);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
