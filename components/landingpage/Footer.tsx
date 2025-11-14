"use client";

const Footer = () => {
  // Custom color scheme
  const colors = {
    bgPrimary: "#D6F6FE",
    bgSecondary: "#FEE8BD",
    textPrimary: "#16263d",
    textSecondary: "#65728d",
    textMuted: "#657da8",
  };

  const footerLinks = {
    platform: [
      { name: "For Founders", href: "#founders" },
      { name: "For Investors", href: "#investors" },
      { name: "Competitions", href: "#competitions" },
      { name: "Success Stories", href: "#stories" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
      { name: "Contact", href: "#contact" },
    ],
    resources: [
      { name: "Blog", href: "#blog" },
      { name: "Help Center", href: "#help" },
      { name: "API Docs", href: "#api" },
      { name: "Community", href: "#community" },
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "GDPR", href: "#gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: "𝕏", href: "#twitter" },
    { name: "LinkedIn", icon: "💼", href: "#linkedin" },
    { name: "Instagram", icon: "📷", href: "#instagram" },
    { name: "GitHub", icon: "💻", href: "#github" },
  ];

  return (
    <footer
      className="relative"
      style={{
        backgroundColor: colors.bgPrimary,
        borderTop: `1px solid ${colors.textMuted}30`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/logo.png" alt="GrowIn Logo" width={150} />
              </div>
              <p
                className="text-base leading-relaxed mb-6 max-w-sm"
                style={{ color: colors.textMuted }}
              >
                The AI-powered startup ecosystem connecting founders and
                investors. Build, compete, and grow with the future of
                innovation.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: colors.bgSecondary + "80",
                      color: colors.textSecondary,
                      border: `1px solid ${colors.textMuted}30`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.textPrimary;
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.boxShadow = `0 5px 15px ${colors.textPrimary}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.bgSecondary + "80";
                      e.currentTarget.style.color = colors.textSecondary;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div className="pt-[58px]">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.textPrimary }}
              >
                Platform
              </h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:underline"
                      style={{ color: colors.textMuted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.textPrimary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.textMuted;
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="pt-[58px]">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.textPrimary }}
              >
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:underline"
                      style={{ color: colors.textMuted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.textPrimary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.textMuted;
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="pt-[58px]">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.textPrimary }}
              >
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:underline"
                      style={{ color: colors.textMuted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.textPrimary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.textMuted;
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="pt-[58px]">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: colors.textPrimary }}
              >
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors duration-300 hover:underline"
                      style={{ color: colors.textMuted }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.textPrimary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.textMuted;
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div
          className="py-8 border-t border-b mb-8"
          style={{ borderColor: colors.textMuted + "30" }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3
              className="text-xl font-bold mb-4"
              style={{ color: colors.textPrimary }}
            >
              Stay Updated with GrowIn
            </h3>
            <p className="text-base mb-6" style={{ color: colors.textMuted }}>
              Get the latest startup insights, competition updates, and success
              stories delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border text-base transition-all duration-300 focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "white",
                  borderColor: colors.textMuted + "50",
                  color: colors.textPrimary,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.textPrimary;
                  e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.textPrimary}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.textMuted + "50";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              <button
                className="px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                style={{
                  backgroundColor: colors.textPrimary,
                  boxShadow: "0 5px 15px rgba(22, 38, 61, 0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.textSecondary;
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(22, 38, 61, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.textPrimary;
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(22, 38, 61, 0.25)";
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center">
          <p
            className="text-sm mb-4 sm:mb-0"
            style={{ color: colors.textMuted }}
          >
            © 2025 GrowIn. All rights reserved. Built with 💙 for the startup
            ecosystem.
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#10b981" }}
              ></div>
              <span
                className="text-sm font-medium"
                style={{ color: colors.textMuted }}
              >
                Platform Status: Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
