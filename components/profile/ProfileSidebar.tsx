"use client";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  website?: string;
}

interface FundingRange {
  min?: number;
  max?: number;
}

interface IUser {
  name: string;
  email: string;
  role: "investor" | "founder" | "admin";
  profileImage?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  city: string;
  country: string;
  skills?: string[];
  fundingRange?: FundingRange;
  isVerified?: boolean;
  joinedDate: string;
}

interface ProfileSidebarProps {
  user: IUser;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
}

const ProfileSidebar = ({ user, colors }: ProfileSidebarProps) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 sticky top-8">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-32 h-32 rounded-full object-cover mx-auto"
              style={{ boxShadow: `0 0 0 4px ${colors.bgPrimary}` }}
            />
            {user.isVerified && (
              <div 
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: '#10b981' }}
              >
                ✓
              </div>
            )}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {user.name}
          </h1>
          <p className="text-lg font-medium mb-4" style={{ color: colors.textSecondary }}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </p>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            About
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
            {user.bio}
          </p>
        </div>

        {/* Location */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Location
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span>
            <span className="text-sm" style={{ color: colors.textMuted }}>
              {user.city}, {user.country}
            </span>
          </div>
        </div>

        {/* Joined Date */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Member Since
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <span className="text-sm" style={{ color: colors.textMuted }}>
              {user.joinedDate}
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
            Connect
          </h3>
          <div className="flex gap-3">
            {user.socialLinks?.twitter && (
              <a 
                href={user.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: '#1da1f2' }}
              >
                𝕏
              </a>
            )}
            {user.socialLinks?.linkedin && (
              <a 
                href={user.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: '#0077b5' }}
              >
                in
              </a>
            )}
            {user.socialLinks?.website && (
              <a 
                href={user.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: colors.textPrimary }}
              >
                🌐
              </a>
            )}
          </div>
        </div>

        {/* Role-specific Section */}
        <div>
          {user.role === 'founder' && user.skills && (
            <>
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{
                      backgroundColor: colors.bgPrimary,
                      color: colors.textPrimary,
                      border: `1px solid ${colors.textMuted}30`
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </>
          )}

          {user.role === 'investor' && user.fundingRange && (
            <>
              <h3 className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
                Investment Range
              </h3>
              <div className="p-4 rounded-lg" style={{ backgroundColor: colors.bgSecondary + '30' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Minimum
                  </span>
                  <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    {formatCurrency(user.fundingRange.min || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                    Maximum
                  </span>
                  <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    {formatCurrency(user.fundingRange.max || 0)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;