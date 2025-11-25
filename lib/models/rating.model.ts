// lib/models/rating.model.ts
import mongoose, { Schema, model, models } from "mongoose";

interface IReview {
  startupId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    startupId: {
      type: Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const Review = models.Review || model<IReview>("Review", reviewSchema);
export default Review;
