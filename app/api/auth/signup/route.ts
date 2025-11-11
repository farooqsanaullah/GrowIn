import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/user.model";
import { getUserByEmail, hashPassword } from "@/lib/auth/helpers";
import { error } from "console";
import { success } from "@/lib/auth/apiResponses";

const isDev = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) return error("All fields are required", 400);

    // User already exists?
    if (await getUserByEmail(email)) return error("User already exists", 400);

    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return success("[Signup API] User registered successfully", 201, { name, email });
  } catch (err) {
    isDev && console.error("[Signup API] Error:", err);
    return error("Internal Server Error", 500, err);
  }
}
