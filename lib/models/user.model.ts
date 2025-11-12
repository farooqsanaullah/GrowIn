import { Schema, model, models } from "mongoose";

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  website?: string;
}

interface FundingRange {
  min?: number;
  max?: number;
}

export interface IUser {
  userName: string;
  name: string;
  email: string;
  password: string;
  role: "investor" | "founder" | "admin";
  profileImage?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  // Address
  city?: string;
  country?: string;
  // Founder specific
  experience?: string;
  skills?: string[];
  // Investor specific
  fundingRange?: FundingRange;
  // Optional extras
  isVerified?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["investor", "founder"], required: true },
    profileImage: { type: String },
    bio: { type: String },
    socialLinks: {
      twitter: { type: String },
      linkedin: { type: String },
      website: { type: String },
    },
    // Address
    city: { type: String },
    country: { type: String },
    // Founder specific
    experience: { type: String },
    skills: [{ type: String }],
    // Investor specific
    fundingRange: {
      min: { type: Number },
      max: { type: Number },
    },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// Prevent model overwrite upon hot reload in development
const User = models.User || model<IUser>("User", userSchema);
export default User;
