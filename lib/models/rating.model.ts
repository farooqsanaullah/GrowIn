// models/Rating.ts
import mongoose, { Schema, Model } from "mongoose";

interface IRating {
  userId: string;
  startupId: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    userId: {
      type: String,
      required: true,
    },
    startupId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one rating per user per startup
RatingSchema.index({ userId: 1, startupId: 1 }, { unique: true });

const Rating: Model<IRating> =
  mongoose.models.Rating || mongoose.model<IRating>("Rating", RatingSchema);

export default Rating;