"use client";
import React, { useState } from "react";
import startupsData from "@/app/data/startups.json";
import foundersData from "@/app/data/founders.json";
import investmentsData from "@/app/data/investments.json";
import { Star, Globe, Linkedin, X, Instagram, Facebook } from "lucide-react";
import { useParams } from "next/navigation";
import { Startup } from "@/types/startup";

interface Founder {
  id: string;
  name: string;
  profilePic: string;
  role: string;
  description: string;
}
interface Investment {
  startup_id: string;
  investor_id: string;
  investment_amount: number;
}

const StartupProfilePage: React.FC = () => {
  const { id } = useParams();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showAllTeam, setShowAllTeam] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  const startup: Startup | undefined = startupsData.find((s) => s._id === id);
  if (!startup) return <div className="p-10 text-center">Startup not found</div>;

  const [avgRating, setAvgRating] = useState(startup.avgRating);
  const [ratingCount, setRatingCount] = useState(startup.ratingCount);

  const startupInvestments: Investment[] = investmentsData.filter(
    (inv) => inv.startup_id === id
  );
  const totalInvestment = startupInvestments.reduce(
    (sum, inv) => sum + inv.investment_amount,
    0
  );

  const team: Founder[] = foundersData.filter((f) =>
    startup.founders.includes(f.id)
  );
  const visibleTeam = showAllTeam ? team : team.slice(0, 2);

  const handleRating = (rating: number) => {
    setUserRating(rating);
    const newCount = ratingCount + 1;
    const newAvg = (avgRating * ratingCount + rating) / newCount;
    setAvgRating(newAvg);
    setRatingCount(newCount);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8">
        {/* Main Section */}
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{startup.title}</h1>
              <p className="text-lg text-gray-600">{startup.industry}</p>
            </div>
            <button className="px-5 py-2 text-sm font-semibold rounded-full shadow-md transition" style={{backgroundColor: "var(--bg-primary)", color: "var(--text-primary)"}}>
              Follow
            </button>
          </div>

          {/* Banner */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-lg h-64 md:h-96">
            <img
              src={startup.profilePic}
              alt={startup.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Social Links */}
          <div className="flex gap-3 flex-wrap justify-start md:justify-end">
            {startup.socialLinks?.website && (
              <a
                href={startup.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow transition"
                title="Website"
              >
                <Globe size={20} />
              </a>
            )}
            {startup.socialLinks?.linkedin && (
              <a
                href={startup.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow transition"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            )}
            {startup.socialLinks?.x && (
              <a
                href={startup.socialLinks.x}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow transition"
                title="X"
              >
                <X size={20} />
              </a>
            )}
            {startup.socialLinks?.instagram && (
              <a
                href={startup.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow transition"
                title="Instagram"
              >
                <Instagram size={20} />
              </a>
            )}
            {startup.socialLinks?.facebook && (
              <a
                href={startup.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow transition"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
            )}
          </div>

          {/* Description */}
          {startup.description && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <p className="text-gray-700 leading-relaxed">{startup.description}</p>
            </div>
          )}

          {/* Team Section */}
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-4">Our Team</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {visibleTeam.map((member) => (
                <div key={member.id} className="flex-shrink-0 w-64 snap-start">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-blue-200 flex-shrink-0">
                      <img
                        src={member.profilePic}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                      <p className="text-gray-500 text-sm mb-1">{member.role}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{member.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {team.length > 2 && (
              <button
                onClick={() => setShowAllTeam(!showAllTeam)}
                className="mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {showAllTeam ? "Show Less" : "Show More"}
              </button>
            )}
          </div>

          {/* Pitch Deck */}
          {startup.pitch && startup.pitch.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md relative">
              <h2 className="text-2xl font-bold mb-4">Pitch Deck</h2>
              <div
                id="pitchScroll"
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
              >
                {startup.pitch.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Pitch ${i + 1}`}
                    className="w-64 md:w-[600px] h-40 md:h-[400px] flex-shrink-0 object-cover rounded-2xl shadow-lg snap-center hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
          <div className="rounded-2xl p-6 shadow-md bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">Investment Opportunity</h2>

            <div className="space-y-3 mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">Equity Range</h3>
              {startup.equityRange.map((eq, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg bg-white shadow-sm"
                >
                  <span className="text-gray-700 text-sm font-medium">{eq.range}</span>
                  <span className="font-bold text-gray-900 text-lg">{eq.equity}%</span>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border-2 border-gray-300 rounded-lg pl-7 pr-3 py-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <button className="w-full mt-3 py-2 font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                Invest Now
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Total Raised</span>
                <span className="font-bold text-gray-900">${totalInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Followers</span>
                <span className="font-bold text-gray-900">{startup.followers.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <span className="text-gray-600 text-sm">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  <span className="font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({ratingCount})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-md bg-gray-50">
            <h3 className="text-xl font-semibold mb-3 text-center">Leave a Review</h3>
            <div className="flex gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => handleRating(star)}
                  className={`cursor-pointer transition ${
                    userRating && star <= userRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                />
              ))}
            </div>
            {userRating && (
              <p className="text-sm text-center text-gray-600">
                You rated this {userRating} star{userRating > 1 ? "s" : ""}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupProfilePage;
