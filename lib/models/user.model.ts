import { Schema, model, models } from "mongoose";
import { EMAIL_REGEX } from "@/lib/constants";
import { isValidNumber, parsePhoneNumberFromString } from "libphonenumber-js";

interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  website?: string;
}

interface FundingRange {
  min?: number;
  max?: number;
}

export interface Experience {
  designation: string;
  startDate: Date;
  endDate: Date;
  company: string;
  experienceDesc?: string;
}

export interface IUser {
  userName: string;
  name?: string;
  email: string;
  phone?: string;
  password?: string;
  role: "investor" | "founder";
  profileImage?: string;
  bio?: string;
  socialLinks?: SocialLinks;
  provider: "credentials" | "google" | "github";

  // Location
  city?: string;
  country?: string;

  // Founder specific
  experiences?: Experience[];
  skills?: string[];

  // Investor specific
  fundingRange?: FundingRange;

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
    phone: {
        type: String,
        trim: true,
        validate: {
          validator: (value: string) => {
            if (!value) return true; // allow empty
            try {
              return isValidNumber(value);
            } catch {
              return false;
            }
          },
          message: "Invalid phone number",
        },
      },
    password: {
      type: String,
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
      default: "investor",
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
      github: {
        type: String,
        trim: true,
        match: [
          /^(https?:\/\/)?(www\.)?github\.com\/.*$/,
          "Invalid Github URL",
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
    provider: { 
      type: String, 
      enum: ["credentials", "google", "github"], 
      default: "credentials" 
    },

    // Location
    city: { type: String, trim: true },
    country: { type: String, trim: true },

    // Founder specific
    experiences: [
      {
        designation: { type: String, trim: true },
        startDate: { type: Date },
        endDate: { type: Date },
        company: { type: String, trim: true },
        experienceDesc: { type: String, trim: true, maxlength: [500, "Description too long"] },
      },
    ],
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

userSchema.pre("save", function (next) {
  if (this.phone) {
    const parsed = parsePhoneNumberFromString(this.phone);
    if (parsed) {
      this.phone = parsed.format("E.164"); // e.g., +14155552671
    }
  }
  next();
});


userSchema.index({ role: 1, city: 1, country: 1 });


userSchema.index({ email: 1, provider: 1 });


userSchema.index({ role: 1, isVerified: 1 });


userSchema.index({ userName: 1, role: 1 });


userSchema.index({ role: 1, 'fundingRange.min': 1, 'fundingRange.max': 1 });


userSchema.index({ role: 1, createdAt: -1 });


const User = models.User || model<IUser>("User", userSchema);
export default User;
