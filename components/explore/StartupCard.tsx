import React from "react";
import { Heart, Star, Users } from "lucide-react";

export interface Startup {
  _id: string;
  profilePic?: string;
  title: string;
  industry: string;
  badges?: string[];
  avgRating: number;
  ratingCount: number;
  followers: number;
  status: string;
  categoryType: string;
  description?: string;
}

interface StartupCardProps {
  startup: Startup;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">

      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={startup.profilePic || "/fallback-image.png"}
          alt={startup.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 opacity-90">
          {startup.badges?.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="text-xs bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full font-medium transform transition-transform duration-300 hover:scale-110"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Like Button */}
        <button
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-100 transition-transform transform hover:scale-110"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart className="text-red-500" size={18} />
        </button>
      </div>

      {/* Founder Picture (Facebook-style overlap) */}
      <div className="absolute top-40 right-4 z-10">
        <img
          src={startup.profilePic || "/fallback-image.png"}
          alt="Founder"
          className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="pt-14 p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg truncate">{startup.title}</h3>
        <p className="text-sm text-gray-500 truncate">{startup.industry}</p>

        {/* Description */}
        <p className="text-sm text-gray-700 mt-2 line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
          {startup.description || ""}
        </p>

        {/* Rating and Followers */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-1 group">
            <Star
              size={16}
              className="text-yellow-400 transition-transform duration-300 group-hover:scale-125"
            />
            <span>
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

        {/* Status and Category */}
        <div className="flex justify-between mt-3">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              startup.status === "Active"
                ? "bg-green-100 text-green-700 animate-pulse"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {startup.status}
          </span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
            {startup.categoryType}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StartupCard;
