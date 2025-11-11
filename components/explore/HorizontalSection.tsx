"use client";
import React, { useRef } from "react";
import StartupCard, { Startup } from "./StartupCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalSectionProps {
  title: string;
  startups: Startup[];
}

const HorizontalSection: React.FC<HorizontalSectionProps> = ({ title, startups }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth; // visible width
      scrollRef.current.scrollBy({
        left: direction === "right" ? width : -width,
        behavior: "smooth",
      });
    }
  };

  if (startups.length === 0) return null;

  return (
    <div className="mb-8 relative group md:px-20 sm:px-4">

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
          {startups.map((startup) => (
            <div
              key={startup._id}
              className="
                flex-shrink-0 
                w-full 
                sm:w-[calc(50%-1rem)] 
                lg:w-[calc(25%-1rem)]
              "
            >
              <StartupCard startup={startup} />
            </div>
          ))}
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
