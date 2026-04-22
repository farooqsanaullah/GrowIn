import mongoose from "mongoose";

/**
 * Global is used here to maintain a cached connection across hot reloads in dev
 * This prevents creating multiple connections during Next.js development
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI; 

  // Skip connection during build time if no MONGODB_URI is provided
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
      console.warn("MongoDB connection skipped during build time");
      return null;
    }
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
