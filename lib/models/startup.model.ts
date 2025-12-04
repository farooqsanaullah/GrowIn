import { Schema, model, models } from "mongoose";
import "./user.model";

interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  x?: string;
  instagram?: string;
  facebook?: string;
}

interface EquityRange {
  range: string;
  equity: number;
}

export interface IStartup {
  title: string;
  description: string;
  pitch: string[];
  founders: Schema.Types.ObjectId[];
  investors: Schema.Types.ObjectId[];
  badges: string[];
  categoryType: string;
  industry: string;
  socialLinks?: SocialLinks;
  followers: Schema.Types.ObjectId[];
  status: string;
  ratingCount: number;
  avgRating: number;
  equityRange: EquityRange[];
  profilePic?: string;
}

const startupSchema = new Schema<IStartup>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title must not exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [2000, "Description must not exceed 2000 characters"],
    },
    pitch: [
      {
        type: String,
        trim: true,
      },
    ],
    founders: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    investors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    badges: [
      {
        type: String,
        trim: true,
      },
    ],
    categoryType: {
      type: String,
      required: [true, "Category type is required"],
      trim: true,
    },
    industry: {
      type: String,
      required: [true, "Industry is required"],
      trim: true,
    },
    socialLinks: {
      website: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      x: { type: String, trim: true },
      instagram: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },
    followers: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending", "closed"],
      default: "active",
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: [0, "Rating count cannot be negative"],
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    equityRange: [
      {
        range: {
          type: String,
          required: true,
          trim: true,
        },
        equity: {
          type: Number,
          required: true,
          min: [0, "Equity cannot be negative"],
          max: [100, "Equity cannot exceed 100"],
        },
      },
    ],
    profilePic: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


startupSchema.index({ title: "text", description: "text" });


startupSchema.index({ categoryType: 1, industry: 1 });
startupSchema.index({ founders: 1 });
startupSchema.index({ createdAt: -1 });


startupSchema.index({ status: 1, categoryType: 1, industry: 1 });


startupSchema.index({ status: 1, createdAt: -1 });


startupSchema.index({ categoryType: 1, industry: 1, avgRating: -1 });


startupSchema.index({ founders: 1, status: 1, createdAt: -1 });


startupSchema.index({ industry: 1, avgRating: -1, createdAt: -1 });


startupSchema.index({ status: 1, avgRating: -1 });

const Startup = models.Startup || model<IStartup>("Startup", startupSchema);
export default Startup;
