"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, FileText, Download, ExternalLink, MessageCircle, Loader2 } from "lucide-react";
import { Startup } from "@/lib/types/startup";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
  startup: Startup;
}

const FollowableStartupProfile: React.FC<Props> = ({ startup: initialStartup }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [startup, setStartup] = useState(initialStartup);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isFollowed, setIsFollowed] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [avgRating, setAvgRating] = useState(startup.avgRating || 0);
  const [ratingCount, setRatingCount] = useState(startup.ratingCount || 0);
  const [isInvesting, setIsInvesting] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isStartingConversation, setIsStartingConversation] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const pitchRef = useRef<HTMLDivElement>(null);

  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getFileName = (url: string) => {
    return url.split('/').pop()?.split('?')[0] || 'pitch-deck';
  };

  const isPDFUrl = (url: string) => url.toLowerCase().endsWith('.pdf');
  const isPPTUrl = (url: string) => {
    const lower = url.toLowerCase();
    return lower.endsWith('.ppt') || lower.endsWith('.pptx');
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = getFileName(url);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download failed:', err);
      toast.error("Something went wrong while downloading the pitch deck");
    }
  };

  const handleStartConversation = async (founderId: string) => {
    if (!session?.user) {
      toast.error('Please log in to message this startup');
      return;
    }

    if (session.user.role !== 'investor') {
      toast.error('Only investors can start conversations');
      return;
    }

    setIsStartingConversation(true);

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: founderId,
          recipientRole: 'founder',
          startupId: startup._id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start conversation');
      }

      const data = await response.json();
      toast.success('Conversation started!');
      router.push(`/messages/${data.conversation._id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start conversation');
    } finally {
      setIsStartingConversation(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id && Array.isArray(startup.followers)) {
      setIsFollowed(startup.followers.includes(session.user.id));
    }
  }, [session, startup.followers]);

  useEffect(() => {
    if (!session?.user?.id) return;

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
  }, [session?.user?.id, startup._id]);

  const toggleFollow = async () => {
    if (!session?.user?.id) return toast.error("Please login to follow startups");

    try {
      const res = await fetch(`/api/startups/${startup._id}/follow`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setIsFollowed(data.isFollowed);
        setStartup(prev => prev ? { ...prev, followers: data.followers } : prev);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error following/unfollowing startup");
    }
  };

  const scrollToSection = (section: "description" | "team" | "pitch") => {
    const refMap = { description: descriptionRef, team: teamRef, pitch: pitchRef };
    refMap[section].current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRating = async (rating: number) => {
    if (!session?.user?.id) return toast.error("Please login to rate");
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
        toast.success(`You rated ${rating} star${rating > 1 ? "s" : ""}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting your rating");
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  const handleInvest = async () => {
    if (!session?.user?.id) return toast.error("Please login first");

    // Check if startup data is loaded
    if (!startup?._id) {
      toast.error("Startup data not loaded");
      return;
    }

    // Validate investment amount
    const amountNum = parseFloat(investmentAmount);
    if (isNaN(amountNum) || amountNum <= 0) return toast.error("Enter a valid amount");

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

  const pitchDocuments = startup.pitch?.filter(url => isPDFUrl(url) || isPPTUrl(url)) || [];

  return (
    <div>
      <div className="bg-gray-50 p-4 md:mx-20 lg:p-8 flex flex-col lg:flex-row gap-6 mt-20">
        <div className="flex-1 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-primary">{startup.title}</h1>
              <p className="text-lg text-gray-600">{startup.industry}</p>
            </div>
            <button
              onClick={toggleFollow}
              style={{ 
                backgroundColor: isFollowed ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition hover:opacity-90`}
            >
              {isFollowed ? "Following" : "Follow"}
            </button>
          </div>

          {/* Profile Image */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-lg h-64 md:h-96 border-2 border-gray-200">
            <img src={profilePic} alt={startup.title} className="w-full h-full object-cover" />
          </div>

          {/* Sticky Section Nav */}
          <div className="sticky top-0 bg-white z-10 py-2 px-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex gap-4">
              <button onClick={() => scrollToSection("description")} className="font-semibold hover:underline"
                style={{ color: 'var(--text-primary)' }}>
                Description
              </button>
              <button onClick={() => scrollToSection("team")} className="font-semibold hover:underline"
                style={{ color: 'var(--text-primary)' }}>
                Team
              </button>
              {startup.pitch?.length > 0 && (
                <button onClick={() => scrollToSection("pitch")} className="font-semibold hover:underline"
                  style={{ color: 'var(--text-primary)' }}>
                  Pitch Deck
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {Object.entries(startup.socialLinks || {}).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-primary" title={key}>
                  <ExternalLink size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Description */}
          {startup.description && (
            <div ref={descriptionRef} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <p className={`text-gray-800 leading-relaxed ${showFullDesc ? "" : "line-clamp-4"}`}>
                {startup.description}
              </p>
              <button onClick={() => setShowFullDesc(!showFullDesc)}  className="mt-2 font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {showFullDesc ? "Read less" : "Read more"}
              </button>
            </div>
          )}

          {/* Team */}
          {startup.founders?.length > 0 && (
            <div ref={teamRef} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold mb-4 text-primary">Founders</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                {startup.founders.map((member: any, i: number) => (
                  <div key={i} className="flex-shrink-0 w-64 snap-start">
                    <div className="flex gap-4 items-start hover:shadow-md transition rounded-lg p-2 relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-gray-200 flex-shrink-0 ml-2 mt-2">
                        <img src={member.profileImage || "/fallback-image.png"} alt={member.userName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <Link href={`/user/founder/${member._id}`}>
                          <h3 className="text-lg font-bold text-primary">{member.userName}</h3>
                        </Link>
                        <p className="text-gray-500 text-sm mb-1">
                          {member.role ? member.role : i === 0 ? "Founder" : "Co-Founder"}
                        </p>
                      </div>
                      
                      {/* Message Icon - Only for first founder and only for investors */}
                      {i === 0 && session?.user?.role === 'investor' && (
                        <button
                          onClick={() => handleStartConversation(member._id)}
                          disabled={isStartingConversation}
                          className="
                            absolute top-3 right-3
                            p-3 rounded-full
                            bg-gradient-to-r from-emerald-500 to-green-600
                            text-white
                            shadow-lg
                            transition-all duration-300 ease-out
                            hover:from-emerald-600 hover:to-green-700
                            hover:scale-105
                            hover:shadow-xl
                            active:scale-95
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "

                          title="Message this founder"
                        >
                          {isStartingConversation ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pitch Deck */}
          {startup.pitch?.length > 0 && (
            <div ref={pitchRef} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 relative scrollbar-hide">
              <h2 className="text-2xl font-bold mb-4 text-primary">Pitch Deck</h2>
              {pitchDocuments.map((docUrl, idx) => (
                <div key={idx} className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="text-primary" size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{getFileName(docUrl)}</h3>
                      <p className="text-sm text-gray-500 mt-1">{isPDFUrl(docUrl) ? 'PDF Document' : 'PowerPoint Presentation'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                            onClick={() => window.open(docUrl, '_blank')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                          >
                        <ExternalLink size={18} /> 
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                            onClick={() => handleDownload(docUrl)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition"
                            style={{ backgroundColor: 'var(--text-primary)', color: '#fff' }}
                          >
                        <Download size={18} /> <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>
                  {isPDFUrl(docUrl) && <iframe src={`${docUrl}#view=FitH`} className="w-full h-[600px] mt-4 rounded-lg border border-gray-200" title="Pitch Deck Preview" />}
                  {isPPTUrl(docUrl) && <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">💡 PowerPoint files cannot be previewed in browser. Click "View" or "Download".</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0 space-y-6">
          <div className="lg:sticky lg:top-20 space-y-6">
            {startup.equityRange?.length > 0 && (
              <div className="rounded-2xl p-6 shadow-md bg-gray-50 border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-primary">Investment Opportunity</h2>
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
                      className="w-full border-2 border-gray-300 rounded-lg pl-7 pr-3 py-2 text-base focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleInvest}
                    disabled={isInvesting}
                    className={`w-full mt-3 py-2 font-semibold rounded-lg transition`}
                    style={{ backgroundColor: isInvesting ? 'gray' : 'var(--text-primary)', color: '#fff', cursor: isInvesting ? 'not-allowed' : 'pointer' }}
                  >
                    {isInvesting ? "Investing..." : "Invest Now"}
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between rounded-lg p-4 shadow-sm text-white" style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-lg font-bold">💰</span>
                      <span className="font-semibold" style={{color: 'var(--text-primary)'}}>Raised:</span>
                    </div>
                    <span className="font-bold text-lg" style={{color: 'var(--text-primary)'}}>{formatAmount(startup.totalRaised ?? 0)}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg p-4 shadow-sm text-white" style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <div className="flex items-center gap-2">
                      <Star className="text-yellow-400 fill-yellow-400" size={20} />
                      <span className="font-semibold" style={{color: 'var(--text-primary)'}}>Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold" style={{color: 'var(--text-primary)'}}>{avgRating.toFixed(1)}</span>
                      <span className="text-xs" style={{color: 'var(--text-primary)'}}>({ratingCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Followers */}
            <div className="rounded-2xl p-6 shadow-md bg-gray-50 border border-gray-200 text-center">
              <h3 className="text-xl font-semibold mb-3 text-primary">Followers</h3>
              <p className="font-bold text-lg text-gray-900">{Array.isArray(startup.followers) ? startup.followers.length : 0}</p>
            </div>

            {/* Star Rating */}
            <div className="rounded-2xl p-6 shadow-md bg-gray-50 border border-gray-200 text-center">
              <h3 className="text-xl font-semibold mb-2 text-primary">Rate this Startup</h3>
              <div className="flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    disabled={isRatingSubmitting}
                    onClick={() => handleRating(i)}
                    className="transition transform hover:scale-110"
                  >
                    <Star size={28} className={`${userRating && i <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowableStartupProfile;