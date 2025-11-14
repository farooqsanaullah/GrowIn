"use client";

import { useEffect, useRef } from "react";

const Testimonial = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const colors = {
    bgPrimary: "#D6F6FE",
    bgSecondary: "#FEE8BD",
    textPrimary: "#16263d",
    textSecondary: "#65728d",
    textMuted: "#657da8",
  };

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Angel Investor",
      company: "TechVentures",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format",
      text: "GrowIn has transformed my startup investing experience. The vetting process is thorough and the platform makes it incredibly easy to diversify my portfolio.",
      rating: 5,
      amount: "$50K+",
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      role: "Serial Entrepreneur",
      company: "Innovation Labs",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format",
      text: "The competition format is brilliant! It gave our startup the exposure we needed and connected us with the right investors at the perfect time.",
      rating: 5,
      amount: "Raised $2.5M",
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Investment Manager",
      company: "Capital Partners",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format",
      text: "I have invested in 12 startups through GrowIn. The dashboard keeps me updated and the startup quality is consistently high. Best investment platform I have used.",
      rating: 5,
      amount: "$125K+",
    },
    {
      id: 4,
      name: "David Park",
      role: "Startup Founder",
      company: "EcoTech Solutions",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format",
      text: "GrowIn did not just help us raise funds, they connected us with mentors and advisors who have been instrumental in our growth journey.",
      rating: 5,
      amount: "Raised $1.8M",
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Investment Analyst",
      company: "Future Fund",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format",
      text: "The AI-powered matching system is incredible. It suggests startups that align perfectly with my investment thesis and risk appetite.",
      rating: 5,
      amount: "$80K+",
    },
    {
      id: 6,
      name: "James Mitchell",
      role: "VC Partner",
      company: "Growth Equity",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format",
      text: "GrowIn has democratized startup investing. The platform transparency and due diligence process rival traditional VC processes.",
      rating: 5,
      amount: "$300K+",
    },
    {
      id: 7,
      name: "Priya Patel",
      role: "Tech Entrepreneur",
      company: "AI Innovations",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format",
      text: "From pitch to funding in just 3 weeks! GrowIn's streamlined process and investor network made our fundraising incredibly efficient.",
      rating: 5,
      amount: "Raised $900K",
    },
    {
      id: 8,
      name: "Alex Johnson",
      role: "Private Investor",
      company: "Independent",
      avatar:
        "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face&auto=format",
      text: "Started with small investments and now I'm seeing real returns. GrowIn made startup investing accessible and profitable for individual investors like me.",
      rating: 5,
      amount: "$25K+",
    },
  ];

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const scroll = () => {
      scrollElement.scrollLeft += 1;
      if (scrollElement.scrollLeft >= scrollElement.scrollWidth / 2) {
        scrollElement.scrollLeft = 0;
      }
    };

    const intervalId = setInterval(scroll, 30);
    return () => clearInterval(intervalId);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-yellow-400 ${
          i < rating ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <section
      className="py-16 lg:py-24 overflow-hidden"
      style={{ backgroundColor: colors.bgPrimary + "30" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
            style={{ backgroundColor: colors.bgSecondary }}
          >
            <span className="text-2xl">💬</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            style={{ color: colors.textPrimary }}
          >
            Success Stories
          </h2>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto"
            style={{ color: colors.textSecondary }}
          >
            Hear from investors and founders who've found success through our
            platform
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden pb-4"
          style={{ scrollBehavior: "auto" }}
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="flex-shrink-0 w-80 sm:w-96 bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border"
              style={{ borderColor: colors.textMuted + "20" }}
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  style={{ boxShadow: `0 0 0 3px ${colors.bgPrimary}` }}
                />
                <div className="flex-1">
                  <h4
                    className="font-semibold text-lg"
                    style={{ color: colors.textPrimary }}
                  >
                    {testimonial.name}
                  </h4>
                  <p
                    className="text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    {testimonial.role}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(testimonial.rating)}
                </div>
                <p
                  className="text-sm font-medium px-3 py-1 rounded-full inline-block"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    color: colors.textPrimary,
                  }}
                >
                  {testimonial.amount}
                </p>
              </div>

              <blockquote
                className="text-base leading-relaxed"
                style={{ color: colors.textMuted }}
              >
                "{testimonial.text}"
              </blockquote>

              <div className="mt-6 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.textPrimary }}
                ></div>
                <span
                  className="text-xs font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Verified Review
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <div
          className="inline-flex items-center gap-4 px-6 py-3 rounded-full"
          style={{
            backgroundColor: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center gap-1">
            <span className="text-2xl">⭐</span>
            <span
              className="font-bold text-xl"
              style={{ color: colors.textPrimary }}
            >
              4.9
            </span>
          </div>
          <div
            className="w-px h-6"
            style={{ backgroundColor: colors.textMuted + "30" }}
          ></div>
          <span
            className="text-sm font-medium"
            style={{ color: colors.textSecondary }}
          >
            Based on 2,500+ reviews
          </span>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
