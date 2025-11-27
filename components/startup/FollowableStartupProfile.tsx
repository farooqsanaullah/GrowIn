"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Startup } from "@/lib/types/startup";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import toast from "react-hot-toast";
import Header from "../landingpage/Header";
import Footer from "../landingpage/Footer";

interface Props {
  startup: Startup;
}

const FollowableStartupProfile: React.FC<Props> = ({ startup: initialStartup }) => {
  const { data: session } = useSession();

  const [startup, setStartup] = useState(initialStartup);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isFollowed, setIsFollowed] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState(startup.avgRating || 0);
  const [ratingCount, setRatingCount] = useState(startup.ratingCount || 0);
  const [isInvesting, setIsInvesting] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

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
  }, [session, startup.followers]);

  useEffect(() => {
    if (!session?.user?.id || !startup?._id) return;

    const fetchUserRating = async () => {
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

    fetchUserRating();
  }, [session?.user?.id, startup?._id]);

  const toggleFollow = async () => {
    if (!session?.user?.id) return toast.error("Please login first");
    if (!startup?._id) return <div>Loading...</div>;

    try {
      const res = await fetch(`/api/startups/${startup._id}/follow`, {
        method: "POST",
      });

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
    if (!session?.user?.id) return alert("Please login to rate");
    if (!startup?._id) return <div>Loading...</div>;

    setIsRatingSubmitting(true);

    try {
      const res = await fetch(`/api/startups/${startup._id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });

      if (!res.ok) throw new Error("Failed to submit rating");

      const data = await res.json();
      if (data.success) {
        setUserRating(rating);
        setAvgRating(data.avgRating);
        setRatingCount(data.ratingCount);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting your rating");
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const handleInvest = async () => {
    // Check if user is logged in
    if (!session?.user?.id) {
      toast.error("Please login first");
      return;
    }

    // Check if startup data is loaded
    if (!startup?._id) {
      toast.error("Startup data not loaded");
      return;
    }

    // Validate investment amount
    const amountNum = parseFloat(investmentAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setIsInvesting(true);

    try {
      // Call backend to create Stripe invoice
      const res = await fetch("/api/create-investment-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorId: session.user.id,
          startupId: startup._id,
          amount: amountNum,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create invoice");
      }

      const data = await res.json();
      const { invoiceUrl } = data; // single invoice returned now

      if (!invoiceUrl) {
        toast.error("Invoice URL not found");
        console.error("Backend response:", data);
        return;
      }

      // Redirect to Stripe payment page
      window.location.href = invoiceUrl;

    } catch (err) {
      console.error("Error creating investment invoice:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsInvesting(false);
    }
  };

  const profilePic = startup.profilePic || "/fallback-image.png";

  return (
    <div>
    <div className="bg-gray-50 p-4 md:mx-20 lg:p-8 flex flex-col lg:flex-row gap-6 mt-20">
      <Header />
      <div className="flex-1 space-y-6 overflow-y-auto">
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

        <div className="relative w-full rounded-3xl overflow-hidden shadow-lg h-64 md:h-96">
          <img src={profilePic} alt={startup.title} className="w-full h-full object-cover" />
        </div>

        <div className="sticky top-0 bg-white z-10 py-2 px-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex gap-4">
            <button onClick={() => scrollToSection("description")} className="font-semibold hover:underline text-gray-700">Description</button>
            <button onClick={() => scrollToSection("team")} className="font-semibold hover:underline text-gray-700">Team</button>
            {startup.pitch?.length > 0 && (
              <button onClick={() => scrollToSection("pitch")} className="font-semibold hover:underline text-gray-700">Pitch Deck</button>
            )}
          </div>
        </div>

        {startup.description && (
          <div ref={descriptionRef} className="bg-white rounded-2xl p-6 shadow-md">
            <p className="leading-relaxed text-gray-800">{startup.description}</p>
          </div>
        )}

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

      <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
        <div className="lg:sticky lg:top-20 space-y-6">

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

            <div className="mb-6">
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
              <button
                onClick={handleInvest}
                disabled={isInvesting}
                className={`w-full mt-3 py-2 font-semibold rounded-lg transition ${
                  isInvesting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {isInvesting ? "Investing..." : "Invest Now"}
              </button>
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
                  <span className="font-bold">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({ratingCount})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Followers */}
          <div className="rounded-2xl p-6 shadow-md bg-gray-50">
            <h3 className="text-xl font-semibold mb-3 text-center">Followers</h3>
            <p className="font-bold text-lg text-center">{Array.isArray(startup.followers) ? startup.followers.length : 0}</p>
          </div>

          {/* Star Rating */}
          <div className="rounded-2xl p-6 shadow-md bg-gray-50 text-center">
            <h3 className="text-xl font-semibold mb-2">Rate this Startup</h3>
            <div className="flex gap-2 justify-center mb-2">
              {[1,2,3,4,5].map(star => (
                <Star
                  key={star}
                  size={28}
                  onClick={() => handleRating(star)}
                  className={`cursor-pointer transition ${
                    userRating && star <= userRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  } ${isRatingSubmitting ? "pointer-events-none opacity-50" : ""}`}
                />
              ))}
            </div>
            {userRating && <p className="text-sm mb-2">You rated this {userRating} star{userRating>1?"s":""}.</p>}
          </div>

        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default FollowableStartupProfile;
