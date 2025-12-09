"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Laptop, Heart, BookOpen, DollarSign, ShoppingCart,
  Coffee, Zap, Factory, Truck, Home, Video,
  ChevronDown, ChevronLeft, ChevronRight
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

const industriesList = [
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

const categoriesList = ["B2B", "B2C", "C2B", "C2C"];
const batchesList = ["Trending", "Funded", "Top Rated"];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = Object.fromEntries(new URLSearchParams(useSearchParams()?.toString()));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<"batch" | "category" | null>(null);

  const { scrollRef, scroll, canScrollLeft, canScrollRight } = useHorizontalScroll(6 * 110 + 5 * 12);

  const getSelected = (key: string) => searchParams[key]?.split(",") || [];
  const selectedIndustries = getSelected("industry");
  const selectedCategories = getSelected("category");
  const selectedBatches = getSelected("badges");

  const toggleFilter = (key: "industry" | "category" | "badges", value: string) => {
    const params = new URLSearchParams(searchParams as any);
    const current = params.get(key)?.split(",") || [];
    const newValues = current.includes(value) ? current.filter(v => v !== value) : [...current, value];

    if (newValues.length) params.set(key, newValues.join(",")); 
    else params.delete(key);

    params.delete("page");
    router.push(`/category?${params.toString()}`);
  };

  const clearAll = () => router.push("/explore");
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col md:flex-row items-start md:items-center gap-3 p-3 bg-white border rounded-xl shadow-sm sm:mx-4 md:mx-20"
    >

      <div className="flex items-center w-full md:w-auto flex-1 relative overflow-hidden">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex p-2 rounded-full border hover:bg-gray-100 absolute left-0 z-10"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide max-w-full flex-1 px-2"
        >
          {industriesList.map(ind => (
            <button
              key={ind.name}
              onClick={() => toggleFilter("industry", ind.name)}
              className={`flex-shrink-0 min-w-[110px] flex flex-col items-center py-2 px-2 rounded-xl transition ${
                selectedIndustries.includes(ind.name) ? "text-black bg-gray-200" : "text-gray-500 hover:text-black"
              }`}
            >
              {ind.icon}
              <span className="text-xs mt-1 text-center truncate w-full">{ind.name}</span>
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex p-2 rounded-full border hover:bg-gray-100 absolute right-0 z-10"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center w-full md:w-auto min-w-0">
        <div className="relative flex-shrink-0 min-w-0">
          <button
            onClick={() => setOpenDropdown(openDropdown === "batch" ? null : "batch")}
            className="px-4 py-2 bg-gray-100 rounded-xl flex items-center justify-between whitespace-nowrap truncate max-w-[200px]"
          >
            {selectedBatches.length ? selectedBatches.join(", ") : "Filters"}
            <ChevronDown size={18} />
          </button>
          {openDropdown === "batch" && (
            <div className="absolute right-0 bg-white border rounded-xl shadow-lg w-40 mt-2 z-10">
              {batchesList.map(b => (
                <button
                  key={b}
                  onClick={() => toggleFilter("badges", b)}
                  className={`w-full text-left px-4 py-2 ${selectedBatches.includes(b) ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex-shrink-0 min-w-0">
          <button
            onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
            className="px-4 py-2 bg-gray-100 rounded-xl flex items-center justify-between whitespace-nowrap truncate max-w-[200px]"
          >
            {selectedCategories.length ? selectedCategories.join(", ") : "Business Model"}
            <ChevronDown size={18} />
          </button>
          {openDropdown === "category" && (
            <div className="absolute right-0 bg-white border rounded-xl shadow-lg w-40 mt-2 z-10">
              {categoriesList.map(c => (
                <button
                  key={c}
                  onClick={() => toggleFilter("category", c)}
                  className={`w-full text-left px-4 py-2 ${selectedCategories.includes(c) ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {(selectedIndustries.length || selectedCategories.length || selectedBatches.length)? (
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 whitespace-nowrap flex-shrink-0 min-w-0 truncate max-w-[120px]"
          >
            Clear All
          </button>
        ) : null}
      </div>
    </div>
  );
}
