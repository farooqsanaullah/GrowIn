// lib/models/rating.model.ts
import mongoose, { Schema, model, models } from "mongoose";
// Import related models to ensure proper registration order
import "./user.model";
import "./startup.model";

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


reviewSchema.index({ startupId: 1, userId: 1 }, { unique: true });


reviewSchema.index({ startupId: 1, rating: -1 });


reviewSchema.index({ startupId: 1, createdAt: -1 });


reviewSchema.index({ userId: 1, createdAt: -1 });


reviewSchema.index({ rating: -1, createdAt: -1 });

const Review = models.Review || model<IReview>("Review", reviewSchema);
export default Review;
