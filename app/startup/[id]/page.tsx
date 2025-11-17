"use client";
import React, { useState, useRef, useEffect } from "react";
import { Star, Globe, Linkedin, X, Instagram, Facebook } from "lucide-react";
import { useParams } from "next/navigation";
import { Startup } from "@/types/startup";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

const StartupProfilePage: React.FC = () => {
  const { id } = useParams();

  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [userRating, setUserRating] = useState<number | null>(null);

  const descriptionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);
  const { scrollRef, canScrollLeft, canScrollRight, scroll } = useHorizontalScroll(600);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchStartup = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/startups/${id}`);
        if (!res.ok) throw new Error("Failed to fetch startup");
        const json = await res.json();
        setStartup(json.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchStartup();
  }, [id]);

  const scrollToSection = (section: "description" | "team" | "pitch") => {
    const refMap = { description: descriptionRef, team: teamRef, pitch: pitchRef };
    refMap[section].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRating = (rating: number) => {
    if (!startup) return;
    setUserRating(rating);
    const newCount = startup.ratingCount + 1;
    const newAvg = (startup.avgRating * startup.ratingCount + rating) / newCount;
    setStartup({ ...startup, avgRating: newAvg, ratingCount: newCount });
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!startup) return <div className="p-10 text-center">Startup not found</div>;

  const profilePic = startup.profilePic || "/fallback-image.png";

  return (
    <div className="bg-white min-h-screen md:mx-20">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8">
        <div className="flex-1 space-y-6 overflow-y-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{startup.title}</h1>
              <p className="text-lg text-gray-600">{startup.industry}</p>
            </div>
            <button className="px-5 py-2 text-sm font-semibold rounded-full shadow-md transition bg-blue-500 text-white">
              Follow
            </button>
          </div>

          <div className="relative w-full rounded-3xl overflow-hidden shadow-lg h-64 md:h-96">
            <img src={profilePic} alt={startup.title} className="w-full h-full object-cover" />
          </div>

          <div className="sticky top-0 bg-white z-10 py-2 px-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex gap-4">
              <button onClick={() => scrollToSection("description")} className="font-semibold hover:underline text-gray-700">Description</button>
              <button onClick={() => scrollToSection("team")} className="font-semibold hover:underline text-gray-700">Team</button>
              {startup.pitch && startup.pitch.length > 0 && (
                <button onClick={() => scrollToSection("pitch")} className="font-semibold hover:underline text-gray-700">Pitch Deck</button>
              )}
            </div>

            <div className="flex gap-3 flex-wrap justify-end">
              {startup.socialLinks?.website && <a href={startup.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow" title="Website"><Globe size={20} /></a>}
              {startup.socialLinks?.linkedin && <a href={startup.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow" title="LinkedIn"><Linkedin size={20} /></a>}
              {startup.socialLinks?.x && <a href={startup.socialLinks.x} target="_blank" rel="noopener noreferrer" className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow" title="X"><X size={20} /></a>}
              {startup.socialLinks?.instagram && <a href={startup.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow" title="Instagram"><Instagram size={20} /></a>}
              {startup.socialLinks?.facebook && <a href={startup.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-full shadow" title="Facebook"><Facebook size={20} /></a>}
            </div>
          </div>
          {startup.description && (
            <div ref={descriptionRef} className="bg-white rounded-2xl p-6 shadow-md">
              <p className="leading-relaxed text-gray-800">{startup.description}</p>
            </div>
          )}

          {startup.founders && startup.founders.length > 0 && (
            <div ref={teamRef} className="bg-white rounded-2xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-4">Our Team</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                {startup.founders.map((member: any, i: number) => (
                  <div key={i} className="flex-shrink-0 w-64 snap-start">
                    <div className="flex gap-4 items-start">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-gray-200 flex-shrink-0 ml-2 mt-2">
                        <img src={member.profileImage || "/fallback-image.png"} alt={member.name || member.userName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{member.name || member.userName}</h3>
                        <p className="text-gray-500 text-sm mb-1">{member.role || "Founder"}</p>
                        {member.bio && <p className="text-gray-700 text-sm leading-relaxed">{member.bio}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {startup.pitch && startup.pitch.length > 0 && (
            <div ref={pitchRef} className="bg-white rounded-2xl p-6 shadow-md relative scrollbar-hide">
              <h2 className="text-2xl font-bold mb-4">Pitch Deck</h2>
              <div className="relative">
                {canScrollLeft && <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:flex" onClick={() => scroll("left")}>◀</button>}
                {canScrollRight && <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:flex" onClick={() => scroll("right")}>▶</button>}

                <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth touch-pan-x" onScroll={() => {
                  const container = scrollRef.current;
                  if (!container) return;
                  const scrollLeft = container.scrollLeft;
                  const children = container.children.length;
                  const childWidth = container.scrollWidth / children;
                  const index = Math.round(scrollLeft / childWidth);
                  setActiveIndex(Math.min(index, startup.pitch.length - 1));
                }}>
                  {startup.pitch.map((img, i) => (
                    <img key={i} src={img} alt={`Pitch ${i + 1}`} className="w-64 sm:w-72 md:w-80 lg:w-[700px] h-40 sm:h-48 md:h-60 lg:h-[500px] flex-shrink-0 object-cover rounded-2xl shadow-lg snap-center hover:scale-105 transition-transform duration-300" />
                  ))}
                </div>

                <div className="flex justify-center mt-4 gap-2">
                  {startup.pitch.map((_, i) => (
                    <button key={i} onClick={() => {
                      if (!scrollRef.current) return;
                      const container = scrollRef.current;
                      const childWidth = container.scrollWidth / container.children.length;
                      container.scrollTo({ left: i * childWidth, behavior: "smooth" });
                    }} className={`w-3 h-3 rounded-full transition-colors ${i === activeIndex ? "bg-blue-600" : "bg-gray-300"}`}></button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
          <div className="lg:sticky lg:top-20 space-y-6">
            <div className="rounded-2xl p-6 shadow-md bg-gray-50">
              <h2 className="text-2xl font-bold mb-4">Investment Opportunity</h2>

              {startup.equityRange && startup.equityRange.map((eq, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white shadow-sm mb-2">
                  <span className="text-gray-700 text-sm font-medium">{eq.range}</span>
                  <span className="font-bold text-gray-900 text-lg">{eq.equity}%</span>
                </div>
              ))}

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input type="text" value={investmentAmount} onChange={(e) => setInvestmentAmount(e.target.value)} placeholder="Enter amount" className="w-full border-2 border-gray-300 rounded-lg pl-7 pr-3 py-2 text-base focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none" />
                </div>
                <button className="w-full mt-3 py-2 font-semibold rounded-lg hover:bg-blue-600 transition bg-blue-500 text-white">Invest Now</button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span>Total Raised</span>
                  <span className="font-bold">${startup.followers?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={16} />
                    <span className="font-bold text-gray-900">{startup.avgRating?.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({startup.ratingCount})</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl p-6 shadow-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-3 text-center">Leave a Review</h3>
              <div className="flex gap-2 justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={28} onClick={() => handleRating(star)} className={`cursor-pointer transition ${userRating && star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`} />
                ))}
              </div>
              {userRating && <p className="text-sm text-center">You rated this {userRating} star{userRating > 1 ? "s" : ""}.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupProfilePage;
