"use client";
import React from "react";
import Link from "next/link";
import { Heart, Star, Users } from "lucide-react";
import { Startup } from "@/types/startup"; // ✅ Import Startup interface from types

interface StartupCardProps {
  startup: Startup;
}

const colors = {
  bgPrimary: "#D6F6FE",
  bgSecondary: "#FEE8BD",
  textPrimary: "#16263d",
  textSecondary: "#65728d",
  textMuted: "#657da8",
};

const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  const profilePic = startup.profilePic || "/fallback-image.png";
  const fullStars = Math.floor(startup.avgRating);
  const hasHalfStar = startup.avgRating % 1 >= 0.5;

  return (
    <Link href={`/startup/${startup._id}`} className="block">
      <div
        className="group relative bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full transform transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
        style={{ color: colors.textPrimary }}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={profilePic}
            alt={`${startup.title} cover`}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />

          <div className="absolute top-2 left-2 flex gap-1 opacity-95">
            {startup.badges?.slice(0, 2).map((badge, i) => (
              <span
                key={badge}
                className="text-xs px-2 py-1 rounded-full font-medium transition-all duration-300 group-hover:scale-105 backdrop-blur-sm"
                style={{
                  backgroundColor:
                    i % 2 === 0 ? colors.bgPrimary : colors.bgSecondary,
                  color: colors.textPrimary,
                }}
              >
                {badge}
              </span>
            ))}
            {startup.badges && startup.badges.length > 2 && (
              <span
                className="text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm"
                style={{
                  backgroundColor: colors.bgSecondary,
                  color: colors.textPrimary,
                }}
              >
                +{startup.badges.length - 2}
              </span>
            )}
          </div>

          <button
            className="absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Like startup"
          >
            <Heart className="text-red-500" size={18} />
          </button>
        </div>

        <div className="absolute top-36 right-4 z-10">
          <img
            src={profilePic}
            alt="Founder"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="pt-10 p-4 flex flex-col flex-1">
          <h3
            className="font-bold text-lg truncate"
            style={{ color: colors.textPrimary }}
          >
            {startup.title}
          </h3>
          <p className="text-sm truncate" style={{ color: colors.textSecondary }}>
            {startup.industry}
          </p>

          <p
            className="text-sm mt-2 line-clamp-3 group-hover:line-clamp-none transition-all duration-500"
            style={{ color: colors.textMuted }}
          >
            {startup.description || ""}
          </p>
          <div
            className="flex items-center justify-between mt-4 text-sm"
            style={{ color: colors.textSecondary }}
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => {
                const fill =
                  i < fullStars
                    ? "text-yellow-400"
                    : hasHalfStar && i === fullStars
                    ? "text-yellow-300"
                    : "text-gray-300";
                return (
                  <Star
                    key={i}
                    size={16}
                    className={`${fill} transition-transform duration-300 group-hover:scale-110`}
                    fill={fill.includes("yellow") ? "currentColor" : "none"}
                  />
                );
              })}
              <span className="ml-1">
                {startup.avgRating.toFixed(1)} ({startup.ratingCount})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} className="text-gray-500" />
              <span className="font-semibold">
                {startup.followers.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <span
              className="px-2 py-1 text-xs rounded-full font-medium"
              style={{
                backgroundColor: colors.bgPrimary,
                color: colors.textPrimary,
              }}
            >
              💰 Raised: $120K
            </span>
            <span
              className="px-2 py-1 text-xs rounded-full"
              style={{
                backgroundColor: colors.bgSecondary,
                color: colors.textPrimary,
              }}
            >
              {startup.categoryType}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StartupCard;
