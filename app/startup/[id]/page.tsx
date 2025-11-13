"use client";
import React, { useState } from "react";
import startupsData from "@/app/data/startups.json";
import foundersData from "@/app/data/founders.json";
import investmentsData from "@/app/data/investments.json";
import { Star, Globe, Linkedin, X, Instagram, Facebook } from "lucide-react";
import { useParams } from "next/navigation";

const colors = {
  textPrimary: "#16263d",
  textSecondary: "#65728d",
};

interface Founder {
  id: string;
  name: string;
  profilePic: string;
  role: string;
  description: string;
}

interface EquityRange {
  range: string;
  equity: number;
}

interface Startup {
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
  pitch: string[];
  founders: string[];
  equityRange: EquityRange[];
  socialLinks?: {
    website?: string;
    linkedin?: string;
    x?: string;
    instagram?: string;
    facebook?: string;
  };
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

  const startup: Startup | undefined = startupsData.find((s) => s._id === id);
  if (!startup) return <div className="p-10 text-center">Startup not found</div>;

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

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <div className="h-full flex flex-col lg:flex-row gap-6 md:px-30 sm:px-4">
        
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 md:pr-20 sm:pr-4"
             style={{
               scrollbarWidth: 'thin',
               scrollbarColor: '#cbd5e1 #f1f5f9'
             }}>
          
          <div className="flex items-center justify-between mt-5">
            <div>
              <h1
                className="text-3xl md:text-3xl font-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                {startup.title}
              </h1>
              <p className="text-lg text-gray-600">{startup.industry}</p>
            </div>
            <button
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow-md transition-all duration-200"
            >
              Follow
            </button>
          </div>

          <div className="relative w-full rounded-3xl overflow-hidden shadow-lg">
            <img
              src={startup.profilePic}
              alt={startup.title}
              className="w-full h-128 object-cover"
            />
          </div>
          <div className="flex gap-3 justify-end">
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

          {startup.description && (
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <p className="text-gray-700 leading-relaxed">
                {startup.description}
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>
              Our Team
            </h2>
            
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
                 style={{
                   scrollbarWidth: 'thin',
                   scrollbarColor: '#cbd5e1 #f1f5f9'
                 }}>
              {visibleTeam.map((member) => (
                <div key={member.id} className="flex-shrink-0 w-72 snap-start">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-blue-200 flex-shrink-0">
                      <img
                        src={member.profilePic}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">{member.role}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {member.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {team.length > 2 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowAllTeam(!showAllTeam)}
                  className="px-5 py-2 bg-white text-gray-700 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition"
                >
                  {showAllTeam ? "Show Less" : "Show More"}
                </button>
              </div>
            )}
          </div>

          {startup.pitch && startup.pitch.length > 0 && (
            <div className="bg-white rounded-5xl p-6 shadow-md relative">
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.textPrimary }}>
                Pitch Deck
              </h2>

              <button
                onClick={() => {
                  const scrollContainer = document.getElementById("pitchScroll");
                  if (scrollContainer) scrollContainer.scrollBy({ left: -400, behavior: "smooth" });
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
              >
                ←
              </button>

              <button
                onClick={() => {
                  const scrollContainer = document.getElementById("pitchScroll");
                  if (scrollContainer) scrollContainer.scrollBy({ left: 400, behavior: "smooth" });
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100"
              >
                →
              </button>

              <div
                id="pitchScroll"
                className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
                style={{
                  scrollbarWidth: 'none',
                }}
              >
                {startup.pitch.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Pitch ${i + 1}`}
                    className="w-[600px] h-[400px] flex-shrink-0 object-cover rounded-2xl shadow-lg snap-center hover:scale-[1.02] transition-transform duration-300"
                  />
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="w-full lg:w-96 flex-shrink-0 overflow-y-auto pr-2 md:py-20 sm:py-4"
             style={{
               scrollbarWidth: 'thin',
               scrollbarColor: '#cbd5e1 #f1f5f9'
             }}>
          
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>
              Investment Opportunity
            </h2>
            
            <div className="space-y-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Equity Range
              </h3>
              {startup.equityRange.map((eq, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700 text-sm font-medium">{eq.range}</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {eq.equity}%
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Investment Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>
                <input
                  type="text"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border-2 border-gray-300 rounded-lg pl-8 pr-4 py-3 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-md">
                Invest Now
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Raised</span>
                <span className="font-bold text-gray-900">
                  ${totalInvestment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Followers</span>
                <span className="font-bold text-gray-900">
                  {startup.followers.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="text-yellow-400 fill-yellow-400" size={16} />
                  <span className="font-bold text-gray-900">
                    {startup.avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({startup.ratingCount})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupProfilePage;