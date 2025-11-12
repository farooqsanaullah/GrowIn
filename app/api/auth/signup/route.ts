import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { getUserByEmail, hashPassword } from "@/lib/auth/helpers";
import { error, success } from "@/lib/auth/apiResponses";
import User from "@/lib/models/user.model";

const isDev = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userName, email, password, role } = body;

    // --- Basic validation ---
    if (!userName || !email || !password || !role) return error("userName, email, password, and role are required", 400);

    if (!["investor", "founder"].includes(role)) return error("Invalid role", 400);

    // --- Check if user already exists ---
    const existingUser = await getUserByEmail(email);
    if (existingUser) return error("User already exists", 400);

    const hashedPassword = await hashPassword(password);

    // --- Create new user ---
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
    });

    await newUser.save();

    // --- Respond success ---
    return success("[Signup API] User registered successfully", 201, {
      userName,
      email,
      role,
    });
  } catch (err) {
    isDev && console.error("[Signup API] Error:", err);
    return error("Internal Server Error", 500, err);
  }
}
