"use client";
import React, { useRef } from "react";
import StartupCard from "@/components/explore/StartupCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Startup } from "@/types/startup";

interface HorizontalSectionProps {
  title: string;
  startups: Startup[];
}

const HorizontalSection: React.FC<HorizontalSectionProps> = ({ title, startups }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === "right" ? width : -width,
        behavior: "smooth",
      });
    }
  };

  if (startups.length === 0) return null;

  const limitedStartups = startups.slice(0, 7);
  const hasMore = startups.length > 7;

  return (
    <div className="mb-8 relative group md:px-30 sm:px-4">

      <h2 className="text-xl font-semibold mb-3 px-2">{title}</h2>

      <div className="flex items-center relative">
        <button
          onClick={() => scroll("left")}
          className="hidden group-hover:flex absolute z-10 left-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
        >
          <ChevronLeft size={24} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-2 pb-4 scroll-smooth scrollbar-hide"
        >
          {limitedStartups.map((startup) => (
            <div
              key={startup._id}
              className="flex-shrink-0 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]"
            >
              <StartupCard startup={startup} />
            </div>
          ))}

          {hasMore && (
            <a
              href={`/explore`}
              className="
                flex-shrink-0 
                w-full sm:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)]
                rounded-xl 
                bg-gradient-to-br from-[#E3F6FF] to-[#F9FDFF]
                border border-[#CDEEFF]
                hover:from-[#D8F1FF] hover:to-white
                shadow-md hover:shadow-lg
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

        <button
          onClick={() => scroll("right")}
          className="hidden group-hover:flex absolute z-10 right-0 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalSection;
