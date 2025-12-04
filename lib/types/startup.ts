export interface Founder {
  _id: string;
  name: string;
  role: string;
}

export interface Startup {
  _id: string;
  title: string;
  description: string;
  pitch: string[];
  founders: Founder[];       // <-- changed from string[] to Founder[]
  investors: string[];
  badges: string[];
  categoryType: string;
  industry: string;
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    x?: string;
    instagram?: string;
    facebook?: string;
  };
  followers: string[];
  status: string;
  ratingCount: number;
  avgRating: number;
  equityRange: { range: string; equity: number }[];
  profilePic: string;
  totalRaised?: number;
}
