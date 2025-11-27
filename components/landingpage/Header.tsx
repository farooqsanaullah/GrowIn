"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom color scheme
  const colors = {
    bgPrimary: "#D6F6FE",
    bgSecondary: "#FEE8BD",
    textPrimary: "#16263d",
    textSecondary: "#65728d",
    textMuted: "#657da8",
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore Startups", href: "/explore" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      style={{
        backgroundColor: isScrolled ? colors.bgPrimary + "E6" : "transparent",
        borderBottom: isScrolled ? `1px solid ${colors.textMuted}30` : "none",
      }}
    >
      <nav className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="GrowIn Logo" width={200} height={120} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 relative group"
                style={{ color: colors.textSecondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                {item.name}
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: colors.textPrimary }}
                ></span>
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base font-semibold rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                color: colors.textPrimary,
                backgroundColor: colors.bgSecondary + "80",
                border: `1px solid ${colors.textMuted}30`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.bgSecondary;
                e.currentTarget.style.boxShadow = `0 5px 15px ${colors.textMuted}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  colors.bgSecondary + "80";
                e.currentTarget.style.boxShadow = "none";
              }}
            >

              <Link href="/signin" className="" >
                Sign In
              </Link>
            </button>
            <button
              className="px-4 py-2 lg:px-6 lg:py-3 text-sm lg:text-base font-semibold text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
                boxShadow: "0 5px 15px rgba(22, 38, 61, 0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.textSecondary}, ${colors.textPrimary})`;
                e.currentTarget.style.boxShadow =
                  "0 8px 25px rgba(22, 38, 61, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`;
                e.currentTarget.style.boxShadow =
                  "0 5px 15px rgba(22, 38, 61, 0.25)";
              }}
            >
              <Link href="/explore" className="" >
                Get Started
              </Link>



            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors duration-300"
            style={{
              color: colors.textSecondary,
              backgroundColor: isScrolled
                ? colors.bgPrimary + "50"
                : "transparent",
            }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isScrolled
                ? colors.bgPrimary + "50"
                : "transparent";
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div
            className="py-4 space-y-4 border-t"
            style={{
              borderColor: colors.textMuted + "30",
              backgroundColor: colors.bgPrimary + "F0",
            }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-base font-medium rounded-lg transition-colors duration-300"
                style={{ color: colors.textSecondary }}
                onClick={() => setIsMobileMenuOpen(false)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.bgSecondary + "50";
                  e.currentTarget.style.color = colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = colors.textSecondary;
                }}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col space-y-3 px-4 pt-4">
              <button
                className="w-full px-4 py-2 text-base font-semibold rounded-lg transition-all duration-300"
                style={{
                  color: colors.textPrimary,
                  backgroundColor: colors.bgSecondary,
                  border: `1px solid ${colors.textMuted}30`,
                }}
              >
                Sign In
              </button>
              <button
                className="w-full px-4 py-2 text-base font-semibold text-white rounded-lg transition-all duration-300 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
