export interface Startup {
  _id: string;
  title: string;
  description: string;
  pitch: string[];
  founders: string[];
  investors: string[];
  badges: string[];
  categoryType: string;
  industry: string;
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
  };
  followers: number;
  status: string;
  ratingCount: number;
  avgRating: number;
  equityRange: { range: string; equity: number }[];
  profilePic: string;
}
