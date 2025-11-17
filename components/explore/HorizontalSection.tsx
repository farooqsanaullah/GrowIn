"use client";
import React, { useState } from "react";
import StartupCard from "@/components/explore/StartupCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Startup } from "@/types/startup";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

interface HorizontalSectionProps {
  title: string;
  startups: Startup[];
}

const HorizontalSection: React.FC<HorizontalSectionProps> = ({ title, startups }) => {
  const { scrollRef, scroll, canScrollLeft, canScrollRight } = useHorizontalScroll(900);
  const [hovering, setHovering] = useState(false);

  if (startups.length === 0) return null;

  const limitedStartups = startups.slice(0, 7);
  const hasMore = startups.length > 7;

  return (
    <div className="mb-8 relative md:px-20 sm:px-4">
      <h2 className="text-xl font-semibold mb-3 px-2">{title}</h2>

      <div
        className="flex items-center relative"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {hovering && canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute z-10 left-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* SCROLL CONTAINER */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-2 pb-4 scroll-smooth scrollbar-hide"
        >
          {limitedStartups.map((startup) => (
            <div
              key={startup._id}
              className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px]"
            >
              <StartupCard startup={startup} />
            </div>

          ))}

          {hasMore && (
            <a
              href={`/explore`}
              className="
                flex-shrink-0 
                min-w-[80%] sm:min-w-[50%] lg:min-w-[25%]
                rounded-xl 
                hover:from-[#D8F1FF] hover:to-white
                transition 
                flex flex-col items-center justify-center p-8
              "
            >
              <div className="text-gray-800 font-semibold text-lg tracking-wide">See More</div>
              <div className="text-gray-500 text-sm mt-1">Explore all in {title}</div>

              <div className="mt-4 w-12 h-12 rounded-full bg-white shadow flex items-center justify-center">
                <ChevronRight size={22} className="text-gray-700" />
              </div>
            </a>
          )}
        </div>

        {hovering && canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute z-10 right-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalSection;
