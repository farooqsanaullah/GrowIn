import { Schema, model, models } from "mongoose";
import { EMAIL_REGEX } from "../auth/helpers";

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
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username must not exceed 30 characters"],
    },
    name: {
      type: String,
      trim: true,
      maxlength: [50, "Name must not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["investor", "founder"],
        message: "Role must be either 'investor' or 'founder'",
      },
      required: [true, "Role is required"],
    },
    profileImage: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: [500, "Bio too long"] },
    socialLinks: {
      twitter: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?(www\.)?twitter\.com\/[A-Za-z0-9_]{1,15}$/,
          "Invalid Twitter URL",
        ],
      },
      linkedin: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
          "Invalid LinkedIn URL",
        ],
      },
      website: {
        type: String,
        trim: true,
        match: [/^(https?:\/\/)?[^\s$.?#].[^\s]*$/, "Invalid website URL"],
      },
    },
    // Address
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    // Founder specific
    experience: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    // Investor specific
    fundingRange: {
      min: { type: Number, min: [0, "Minimum funding must be positive"] },
      max: { type: Number, min: [0, "Maximum funding must be positive"] },
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
