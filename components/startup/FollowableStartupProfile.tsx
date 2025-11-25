"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Startup } from "@/lib/types/startup";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

interface Props {
  startup: Startup;
}

const FollowableStartupProfile: React.FC<Props> = ({ startup: initialStartup }) => {
  const { data: session } = useSession();

  const [startup, setStartup] = useState(initialStartup);
  const [isFollowed, setIsFollowed] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const descriptionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);

  const { scrollRef, canScrollLeft, canScrollRight, scroll } = useHorizontalScroll(600);
  const [activeIndex, setActiveIndex] = useState(0);

  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
  };

  useEffect(() => {
    if (session?.user?.id && Array.isArray(startup.followers)) {
      setIsFollowed(startup.followers.includes(session.user.id));
    }

    // Fetch user's existing review
    const fetchUserReview = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/startups/${startup._id}/rate`);
        if (!res.ok) throw new Error("Failed to fetch review");
        const data = await res.json();
        if (data.success && data.review?.rating) {
          setUserRating(data.review.rating);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserReview();
  }, [session, startup.followers, startup._id]);

  const toggleFollow = async () => {
    if (!session?.user?.id) return alert("Please login first");
    try {
      const res = await fetch(`/api/startups/${startup._id}/follow`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIsFollowed(data.isFollowed);
        setStartup(prev => prev ? { ...prev, followers: data.followers } : prev);
      }
    } catch (err) {
      console.error(err);
      alert("Error following/unfollowing startup");
    }
  };

  const scrollToSection = (section: "description" | "team" | "pitch") => {
    const refMap = { description: descriptionRef, team: teamRef, pitch: pitchRef };
    refMap[section].current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRating = async (rating: number) => {
    if (!session?.user?.id) return alert("Please login first");

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/startups/${startup._id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");
      const data = await res.json();

      if (data.success) {
        setUserRating(rating);
        setStartup(prev =>
          prev ? { ...prev, avgRating: data.avgRating, ratingCount: data.ratingCount } : prev
        );
      } else {
        alert(data.message || "Failed to submit rating");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting your rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const profilePic = startup.profilePic || "/fallback-image.png";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:mx-20 lg:p-8 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{startup.title}</h1>
            <p className="text-lg text-gray-600">{startup.industry}</p>
          </div>
          <button
            onClick={toggleFollow}
            className={`px-5 py-2 text-sm font-semibold rounded-full shadow-md transition ${
              isFollowed ? "bg-gray-300 text-black" : "bg-blue-500 text-white"
            }`}
          >
            {isFollowed ? "Following" : "Follow"}
          </button>
        </div>

        {/* Profile Image */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-lg h-64 md:h-96">
          <img src={profilePic} alt={startup.title} className="w-full h-full object-cover" />
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-0 bg-white z-10 py-2 px-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex gap-4">
            <button onClick={() => scrollToSection("description")} className="font-semibold hover:underline text-gray-700">Description</button>
            <button onClick={() => scrollToSection("team")} className="font-semibold hover:underline text-gray-700">Team</button>
            {startup.pitch?.length > 0 && (
              <button onClick={() => scrollToSection("pitch")} className="font-semibold hover:underline text-gray-700">Pitch Deck</button>
            )}
          </div>
        </div>

        {/* Description */}
        {startup.description && (
          <div ref={descriptionRef} className="bg-white rounded-2xl p-6 shadow-md">
            <p className="leading-relaxed text-gray-800">{startup.description}</p>
          </div>
        )}

        {/* Team */}
        {startup.founders?.length > 0 && (
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

        {/* Pitch */}
        {startup.pitch?.length > 0 && (
          <div ref={pitchRef} className="bg-white rounded-2xl p-6 shadow-md relative scrollbar-hide">
            <h2 className="text-2xl font-bold mb-4">Pitch Deck</h2>
            <div className="relative">
              {canScrollLeft && <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:flex" onClick={() => scroll("left")}>◀</button>}
              {canScrollRight && <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10 hidden md:flex" onClick={() => scroll("right")}>▶</button>}

              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth touch-pan-x"
                onScroll={() => {
                  const container = scrollRef.current;
                  if (!container) return;
                  const childWidth = container.scrollWidth / container.children.length;
                  const index = Math.round(container.scrollLeft / childWidth);
                  setActiveIndex(Math.min(index, startup.pitch.length - 1));
                }}
              >
                {startup.pitch.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Pitch ${i + 1}`}
                    className="w-64 sm:w-72 md:w-80 lg:w-[700px] h-40 sm:h-48 md:h-60 lg:h-[500px] flex-shrink-0 object-cover rounded-2xl shadow-lg snap-center hover:scale-105 transition-transform duration-300"
                  />
                ))}
              </div>

              <div className="flex justify-center mt-4 gap-2">
                {startup.pitch.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const container = scrollRef.current;
                      if (!container) return;
                      const childWidth = container.scrollWidth / container.children.length;
                      container.scrollTo({ left: i * childWidth, behavior: "smooth" });
                    }}
                    className={`w-3 h-3 rounded-full transition-colors ${i === activeIndex ? "bg-blue-600" : "bg-gray-300"}`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
        <div className="lg:sticky lg:top-20 space-y-6">

          {/* Investment & Stats */}
          {startup.equityRange?.length > 0 && (
            <div className="rounded-2xl p-6 shadow-md bg-gray-50">
              <h2 className="text-2xl font-bold mb-6">Investment Opportunity</h2>
              <div className="space-y-2 mb-6">
                {startup.equityRange.map((eq, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white shadow-sm">
                    <span className="text-gray-700 text-sm font-medium">{eq.range}</span>
                    <span className="font-bold text-gray-900 text-lg">{eq.equity}%</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-lg p-4 shadow-sm" style={{backgroundColor: 'var(--bg-primary)'}}>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-lg font-bold">💰</span>
                    <span className="text-gray-800 font-semibold">Raised</span>
                  </div>
                  <span className="text-gray-900 font-bold text-lg">
                    {formatAmount(startup.totalRaised ?? 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg p-4 shadow-sm" style={{backgroundColor: 'var(--bg-secondary)'}}>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                    <span className="text-gray-800 font-semibold">Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{startup.avgRating?.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({startup.ratingCount})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Followers */}
          <div className="rounded-2xl p-6 shadow-md bg-gray-50">
            <h2 className="text-2xl font-bold mb-4">Followers</h2>
            <p className="font-bold text-lg">{Array.isArray(startup.followers) ? startup.followers.length : 0}</p>
          </div>

          {/* Star Rating */}
          <div className="rounded-2xl p-6 shadow-md bg-gray-50">
            <h3 className="text-xl font-semibold mb-3 text-center">Rate this Startup</h3>
            <div className="flex gap-2 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => !isSubmitting && handleRating(star)}
                  className={`cursor-pointer transition ${
                    userRating && star <= userRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                />
              ))}
            </div>
            {userRating && (
              <p className="text-sm text-center">
                You rated this {userRating} star{userRating > 1 ? "s" : ""}.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FollowableStartupProfile;
