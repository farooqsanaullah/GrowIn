"use client";

import { useState, useEffect, useRef } from "react";
interface CompanyCard {
  id: number;
  name: string;
  industry: string;
  description: string;
  funding: string;
  logo: string;
  thumbnail: string;
  metrics: {
    investors: number;
    funding_raised: string;
    growth: string;
  };
  tags: string[];
  badge_color: string;
}

const HeroSection = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Custom color scheme
  const colors = {
    bgPrimary: "#D6F6FE",
    bgSecondary: "#FEE8BD",
    textPrimary: "#16263d",
    textSecondary: "#65728d",
    textMuted: "#657da8",
  };

  const featuredCompanies: CompanyCard[] = [
    {
      id: 1,
      name: "EcoTech Solutions",
      industry: "Clean Energy",
      description:
        "Solar optimization platform participating in GrowIn's sustainability batch competition.",
      funding: "Batch Winner",
      logo: "ES",
      thumbnail:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop",
      metrics: {
        investors: 24,
        funding_raised: "$2.5M",
        growth: "+340%",
      },
      tags: ["AI", "Sustainability", "IoT"],
      badge_color: "#10b981",
    },
    {
      id: 2,
      name: "NeuroLink AI",
      industry: "Healthcare AI",
      description:
        "Early disease detection platform connecting with investors through GrowIn's healthcare showcase.",
      funding: "Competition Finalist",
      logo: "NA",
      thumbnail:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
      metrics: {
        investors: 18,
        funding_raised: "$1.8M",
        growth: "+280%",
      },
      tags: ["Healthcare", "AI", "Diagnostics"],
      badge_color: "#8b5cf6",
    },
    {
      id: 3,
      name: "Quantum FinTech",
      industry: "Financial Technology",
      description:
        "Blockchain payment infrastructure featured in GrowIn's fintech innovation competition.",
      funding: "Active Participant",
      logo: "QF",
      thumbnail:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
      metrics: {
        investors: 31,
        funding_raised: "$4.2M",
        growth: "+520%",
      },
      tags: ["Blockchain", "Payments", "Security"],
      badge_color: "#f59e0b",
    },
  ];

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentCard((prev) => (prev + 1) % featuredCompanies.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isHovered, featuredCompanies.length]);

  const getCardTransform = (index: number) => {
    const totalCards = featuredCompanies.length;
    const position = (index - currentCard + totalCards) % totalCards;

    switch (position) {
      case 0: // Center card
        return {
          transform: "translateX(0) rotateY(0deg)",
          zIndex: 30,
          opacity: 1,
          scale: 1,
        };
      case 1: // Right card
        return {
          transform: "translateX(120px) rotateY(-25deg)",
          zIndex: 20,
          opacity: 0.8,
          scale: 0.9,
        };
      case 2: // Left card
        return {
          transform: "translateX(-120px) rotateY(25deg)",
          zIndex: 20,
          opacity: 0.8,
          scale: 0.9,
        };
      default:
        return {
          transform: "translateX(0) rotateY(0deg)",
          zIndex: 10,
          opacity: 0,
          scale: 0.8,
        };
    }
  };

  return (
    <>
      <section
        className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-16 lg:pt-20"
        style={{
          background: `linear-gradient(135deg, ${colors.bgPrimary}, ${colors.bgSecondary})`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent"></div>

        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10 min-h-screen lg:min-h-0">
            {/* Left Content */}
            <div
              className="flex flex-col justify-center space-y-8 text-center lg:text-left py-8 lg:py-0"
              style={{ color: colors.textPrimary }}
            >
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  AI-Powered Startup
                  <span
                    className="block text-transparent bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
                    }}
                  >
                    Ecosystem
                  </span>
                </h1>

                <p
                  className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0"
                  style={{ color: colors.textSecondary }}
                >
                  Connect founders and investors in a single space. Discover
                  startups, participate in competitions, and build the{" "}
                  <span className="font-semibold" style={{ color: "#10b981" }}>
                    future of innovation
                  </span>
                  .
                </p>
              </div>

              <div className="flex justify-center lg:justify-start">
                <button
                  className="px-8 py-4 rounded-lg font-semibold text-white transform hover:scale-105 transition-all duration-300 shadow-lg text-lg w-full sm:w-auto max-w-xs"
                  style={{
                    background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
                    boxShadow: "0 10px 25px rgba(22, 38, 61, 0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.textSecondary}, ${colors.textPrimary})`;
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(22, 38, 61, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`;
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(22, 38, 61, 0.25)";
                  }}
                >
                  Join the Ecosystem
                </button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 pt-8 max-w-lg mx-auto lg:max-w-none lg:mx-0">
                <div className="text-center lg:text-left">
                  <div
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    500+
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Startups
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    50+
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Active Competitions
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    1000+
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    Founders & Investors
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - 3D Card Carousel */}
            <div
              className="relative h-[500px] sm:h-[550px] lg:h-[600px] flex items-center justify-center py-8 lg:py-0"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="relative w-80 sm:w-96 h-[400px] sm:h-[450px] mx-auto perspective-1000">
                {featuredCompanies.map((company, index) => {
                  const transform = getCardTransform(index);

                  return (
                    <div
                      key={company.id}
                      className={`absolute w-80 sm:w-96 h-[400px] sm:h-[450px] rounded-3xl p-6 sm:p-8 bg-white shadow-2xl transition-all duration-700 ease-in-out cursor-pointer group`}
                      style={{
                        transform: `${transform.transform} scale(${transform.scale})`,
                        zIndex: transform.zIndex,
                        opacity: transform.opacity,
                        transformStyle: "preserve-3d",
                        border: `2px solid ${colors.bgPrimary}`,
                        boxShadow: `0 25px 50px rgba(22, 38, 61, 0.15), 0 0 0 1px ${colors.bgPrimary}50`,
                        background: `linear-gradient(145deg, #ffffff, #fefefe)`,
                      }}
                      onClick={() => setCurrentCard(index)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 35px 70px rgba(22, 38, 61, 0.25), 0 0 0 2px ${colors.textSecondary}`;
                        e.currentTarget.style.transform = `${
                          transform.transform
                        } scale(${transform.scale * 1.02})`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 25px 50px rgba(22, 38, 61, 0.15), 0 0 0 1px ${colors.bgPrimary}50`;
                        e.currentTarget.style.transform = `${transform.transform} scale(${transform.scale})`;
                      }}
                    >
                      {/* Card Content */}
                      <div
                        className="h-full flex flex-col justify-between relative overflow-hidden"
                        style={{ transform: "translateZ(50px)" }}
                      >
                        {/* Background Decoration */}
                        <div
                          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
                          style={{
                            background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
                            transform: "translate(50%, -50%)",
                          }}
                        ></div>

                        {/* Company Header with Thumbnail */}
                        <div className="relative z-10">
                          {/* Thumbnail Section */}
                          <div className="w-full h-24 sm:h-32 rounded-2xl mb-3 sm:mb-4 relative overflow-hidden group">
                            <img
                              src={company.thumbnail}
                              alt={`${company.name} thumbnail`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                              <span
                                className="px-2 sm:px-3 py-1 text-xs font-bold rounded-full text-white shadow-lg backdrop-blur-sm"
                                style={{
                                  backgroundColor: company.badge_color + "E6",
                                }}
                              >
                                🏆 {company.funding}
                              </span>
                            </div>
                            {/* Subtle overlay for better text readability */}
                            <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-8 bg-gradient-to-t from-white to-transparent"></div>
                          </div>

                          <div className="mb-3 sm:mb-4">
                            <h3
                              className="text-lg sm:text-xl font-bold mb-1 sm:mb-2"
                              style={{ color: colors.textPrimary }}
                            >
                              {company.name}
                            </h3>
                            <p
                              className="font-semibold text-sm mb-2 sm:mb-3"
                              style={{ color: colors.textSecondary }}
                            >
                              {company.industry}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                              {company.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 text-xs font-medium rounded-md"
                                  style={{
                                    backgroundColor: colors.bgPrimary,
                                    color: colors.textPrimary,
                                    border: `1px solid ${colors.textMuted}30`,
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <p
                            className="leading-relaxed text-xs sm:text-sm mb-4 sm:mb-5"
                            style={{ color: colors.textMuted }}
                          >
                            {company.description}
                          </p>

                          {/* Metrics Section */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                            <div
                              className="text-center p-2 sm:p-3 rounded-lg"
                              style={{
                                backgroundColor: colors.bgPrimary + "30",
                              }}
                            >
                              <div
                                className="text-sm sm:text-lg font-bold"
                                style={{ color: colors.textPrimary }}
                              >
                                {company.metrics.investors}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: colors.textMuted }}
                              >
                                Investors
                              </div>
                            </div>
                            <div
                              className="text-center p-2 sm:p-3 rounded-lg"
                              style={{
                                backgroundColor: colors.bgSecondary + "30",
                              }}
                            >
                              <div
                                className="text-sm sm:text-lg font-bold"
                                style={{ color: colors.textPrimary }}
                              >
                                {company.metrics.funding_raised}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: colors.textMuted }}
                              >
                                Raised
                              </div>
                            </div>
                            <div
                              className="text-center p-2 sm:p-3 rounded-lg"
                              style={{ backgroundColor: "#10b98120" }}
                            >
                              <div
                                className="text-sm sm:text-lg font-bold"
                                style={{ color: "#10b981" }}
                              >
                                {company.metrics.growth}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: colors.textMuted }}
                              >
                                Growth
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="relative z-10">
                          <div
                            className="flex justify-between items-center pt-3 sm:pt-4"
                            style={{
                              borderTop: `1px solid ${colors.textMuted}30`,
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ backgroundColor: "#10b981" }}
                              ></div>
                              <span
                                className="text-xs font-medium"
                                style={{ color: colors.textMuted }}
                              >
                                Live on GrowIn
                              </span>
                            </div>
                            <button
                              className="font-semibold text-xs transition-all duration-300 flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full hover:shadow-md"
                              style={{
                                color: colors.textSecondary,
                                backgroundColor: colors.bgPrimary + "50",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  colors.bgPrimary;
                                e.currentTarget.style.transform =
                                  "translateX(2px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  colors.bgPrimary + "50";
                                e.currentTarget.style.transform =
                                  "translateX(0px)";
                              }}
                            >
                              Invest Now
                              <span className="text-sm">💰</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Navigation Dots */}
                <div className="absolute -bottom-12 sm:-bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
                  {featuredCompanies.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCard(index)}
                      className={`h-3 rounded-full transition-all duration-300 ${
                        index === currentCard ? "w-6 sm:w-8" : "w-3"
                      }`}
                      style={{
                        backgroundColor:
                          index === currentCard
                            ? colors.textPrimary
                            : colors.textMuted,
                        boxShadow:
                          index === currentCard
                            ? `0 0 10px ${colors.textPrimary}40`
                            : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (index !== currentCard) {
                          e.currentTarget.style.backgroundColor =
                            colors.textSecondary;
                          e.currentTarget.style.boxShadow = `0 0 8px ${colors.textSecondary}40`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (index !== currentCard) {
                          e.currentTarget.style.backgroundColor =
                            colors.textMuted;
                          e.currentTarget.style.boxShadow = "none";
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add custom CSS for 3D effects */}
        <style jsx>{`
          .perspective-1000 {
            perspective: 1000px;
          }
        `}</style>
      </section>
    </>
  );
};

export default HeroSection;
