"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Explore Startups", href: "/explore" },
    { name: "Explore Investors", href: "/explore-investors" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md shadow-lg" : "bg-transparent"
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
            <Link href="/">
              <img src="/logo.png" alt="GrowIn Logo" width={200} height={120} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 relative group ${
                  pathname === item.href ? "text-primary" : ""
                }`}
                style={{
                  color:
                    pathname === item.href
                      ? colors.textPrimary
                      : colors.textSecondary,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = colors.textPrimary;
                }}
                onMouseLeave={(e) => {
                  if (pathname !== item.href) {
                    e.currentTarget.style.color = colors.textSecondary;
                  }
                }}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 
      ${pathname === item.href ? "w-full" : "w-0 group-hover:w-full"}`}
                  style={{ backgroundColor: colors.textPrimary }}
                ></span>
              </Link>
            ))}
          </div>

          {/* Authentication UI */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              // Authenticated User - Profile Dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: colors.bgSecondary + "50",
                    border: `1px solid ${colors.textMuted}30`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.bgSecondary;
                    e.currentTarget.style.boxShadow = `0 5px 15px ${colors.textMuted}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      colors.bgSecondary + "50";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* User Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
                    }}
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <span>
                        {session.user?.name?.charAt(0) ||
                          session.user?.email?.charAt(0) ||
                          "U"}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: colors.textPrimary }}
                  >
                    {session.user?.name ||
                      session.user?.email?.split("@")[0] ||
                      "User"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    style={{ color: colors.textSecondary }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border z-10"
                    style={{
                      backgroundColor: colors.bgPrimary,
                      borderColor: colors.textMuted + "30",
                      boxShadow: `0 10px 25px ${colors.textMuted}40`,
                    }}
                  >
                    {/* User Info - Updated with text wrapping */}
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: colors.textMuted + "20" }}
                    >
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: colors.textPrimary }}
                      >
                        {session.user?.name || "User"}
                      </p>
                      <p
                        className="text-xs break-all overflow-hidden mt-1"
                        style={{
                          color: colors.textSecondary,
                          wordBreak: "break-word",
                          maxWidth: "100%",
                        }}
                      >
                        {session.user?.email}
                      </p>
                      <p
                        className="text-xs capitalize font-medium mt-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {session.user?.role || "User"}
                      </p>
                    </div>

  {/* Navigation Links */}
                    <div className="py-1">
                      <Link
                        href={`/${session.user?.role}/dashboard`}
                        className="flex items-center px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: colors.textSecondary }}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.bgSecondary + "30";
                          e.currentTarget.style.color = colors.textPrimary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        </svg>
                        Dashboard
                      </Link>

                      <Link
                        href={`/${session.user?.role}/profile`}
                        className="flex items-center px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: colors.textSecondary }}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.bgSecondary + "30";
                          e.currentTarget.style.color = colors.textPrimary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>

                      <Link
                        href={`/${session.user?.role}/settings`}
                        className="flex items-center px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: colors.textSecondary }}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = colors.bgSecondary + "30";
                          e.currentTarget.style.color = colors.textPrimary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>

                      {/* Logout */}
                      <hr className="my-1" style={{ borderColor: colors.textMuted + "20" }} />
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-left transition-colors duration-200"
                        style={{ color: colors.textSecondary }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#fee2e2";
                          e.currentTarget.style.color = "#dc2626";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = colors.textSecondary;
                        }}
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Non-authenticated User - CTA Buttons
              <>
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
                  <Link href="/signin">Sign In</Link>
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
                  <Link href="/explore">Get Started</Link>
                </button>
              </>
            )}
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
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
              {session ? (
                // Authenticated Mobile Menu
                <>
                  {/* User Info */}
                  <div
                    className="flex items-start space-x-3 p-3 rounded-lg"
                    style={{ backgroundColor: colors.bgSecondary + "30" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
                      }}
                    >
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <span>
                          {session.user?.name?.charAt(0) ||
                            session.user?.email?.charAt(0) ||
                            "U"}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: colors.textPrimary }}
                      >
                        {session.user?.name || "User"}
                      </p>
                      <p
                        className="text-xs break-all overflow-hidden"
                        style={{
                          color: colors.textSecondary,
                          wordBreak: "break-word",
                        }}
                      >
                        {session.user?.email}
                      </p>
                      <p
                        className="text-xs capitalize mt-1"
                        style={{ color: colors.textSecondary }}
                      >
                        {session.user?.role || "User"}
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Link */}
                  <Link
                    href={`/${session.user?.role}/dashboard`}
                    className="w-full flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300"
                    style={{
                      color: colors.textPrimary,
                      backgroundColor: colors.bgSecondary + "50",
                      border: `1px solid ${colors.textMuted}30`,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                    </svg>
                    Dashboard
                  </Link>

                  {/* Profile Link */}
                  <Link
                    href={`/${session.user?.role}/profile`}
                    className="w-full flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300"
                    style={{
                      color: colors.textPrimary,
                      backgroundColor: colors.bgSecondary + "50",
                      border: `1px solid ${colors.textMuted}30`,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>

                  {/* Sign Out */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-300"
                    style={{
                      color: "#dc2626",
                      backgroundColor: "#fee2e2",
                      border: "1px solid #fca5a5",
                    }}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Sign Out
                  </button>
                </>
              ) : (
                // Non-authenticated Mobile Menu
                <>
                  <Link
                    href="/signin"
                    className="w-full px-4 py-2 text-base font-semibold rounded-lg transition-all duration-300 text-center"
                    style={{
                      color: colors.textPrimary,
                      backgroundColor: colors.bgSecondary,
                      border: `1px solid ${colors.textMuted}30`,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/explore"
                    className="w-full px-4 py-2 text-base font-semibold text-white rounded-lg transition-all duration-300 shadow-lg text-center"
                    style={{
                      background: `linear-gradient(135deg, ${colors.textPrimary}, ${colors.textSecondary})`,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
