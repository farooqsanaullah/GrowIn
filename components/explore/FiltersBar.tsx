"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Laptop, Heart, BookOpen, DollarSign, ShoppingCart,
  Coffee, Zap, Factory, Truck, Home, Video,
  ChevronDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { usePathname, useRouter } from "next/navigation";

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

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<"batch" | "category" | null>(null);

  const { scrollRef, scroll, canScrollLeft, canScrollRight } = useHorizontalScroll(250);

  // Determine active filter from URL
  const parts = pathname.split("/").filter(Boolean); // e.g., ['category', 'industry', 'Technology']
  const activeFilterType = parts[1]; // 'industry', 'business-model', 'category'
  const activeFilterValue = parts[2] || "";

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Map activeFilterType → key in our internal logic
  const activeFilters = {
    industry: activeFilterType === "industry" ? activeFilterValue : undefined,
    category: activeFilterType === "business-model" ? activeFilterValue : undefined,
    batch: activeFilterType === "category" ? activeFilterValue : undefined,
  };

  // Handler to navigate on filter click
  const navigate = (type: "industry" | "category" | "batch", value: string) => {
    if (!value) return;
    if (type === "industry") router.push(`/category/industry/${value}`);
    if (type === "category") router.push(`/category/business-model/${value}`);
    if (type === "batch") router.push(`/category/badges/${value}`);
  };

  const Dropdown = ({
    label,
    options,
    filterKey,
  }: {
    label: string;
    options: string[];
    filterKey: "batch" | "category";
  }) => (
    <div className="relative">
      <button
        onClick={() => setOpenDropdown(openDropdown === filterKey ? null : filterKey)}
        className="flex items-center justify-between min-w-[140px] px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm md:text-base font-medium transition-all"
      >
        {activeFilters[filterKey] || label}
        <ChevronDown
          size={20}
          className={`transition-transform ${openDropdown === filterKey ? "rotate-180" : ""}`}
        />
      </button>

      {openDropdown === filterKey && (
        <div className="absolute right-0 mt-2 w-[160px] bg-white border rounded-xl shadow-lg z-10 overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              className={`w-full text-left px-4 py-2.5 text-sm md:text-base transition
                ${activeFilters[filterKey] === option ? "bg-gray-100 font-semibold text-black" : "hover:bg-gray-50"}`}
              onClick={() => navigate(filterKey, option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-3 sm:px-5 md:px-6 py-3 bg-white rounded-xl border border-gray-100 shadow-sm sticky top-0 z-20 mx-2 sm:mx-6 md:mx-20"
    >
      {/* Horizontal Industry Scroll */}
      <div className="flex items-center w-full md:w-auto flex-1">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide flex-1 px-2 scroll-smooth"
          style={{ minWidth: "0", maxWidth: "calc(7 * 110px + 6 * 14px)" }}
        >
          {industries.map((industry) => (
            <button
              key={industry.name}
              className={`
                flex flex-col items-center justify-center
                min-w-[110px]
                transition-all duration-200 text-center
                ${activeFilters.industry === industry.name ? "text-black scale-105" : "text-gray-500 hover:text-gray-800"}
              `}
              onClick={() => navigate("industry", industry.name)}
            >
              <div className="mb-1">{industry.icon}</div>
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {industry.name}
              </span>
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Dropdowns */}
      <div className="flex items-center justify-end gap-3 w-full md:w-auto">
        <Dropdown label="Filters" options={batchFilters} filterKey="batch" />
        <Dropdown label="Business Model" options={categories} filterKey="category" />
      </div>
    </div>
  );
}
