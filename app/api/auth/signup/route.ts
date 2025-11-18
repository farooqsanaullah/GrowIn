import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { 
  isValidEmail, 
  isValidPassword, 
  isValidRole, 
  isValidUserName 
} from "@/lib/helpers/validation";
import { getUserByEmail } from "@/lib/helpers/user";
import { hashPassword } from "@/lib/helpers/auth";
import { success, error } from "@/lib/auth/apiResponses";
import User from "@/lib/models/user.model";

const isDev = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { userName, email, password, role } = body;

    // --- Basic validation ---
    if (!userName || !email || !password || !role) return error("userName, email, password, and role are required", 400);

    // --- Check if user already exists ---
    if (!isValidEmail(email)) return error("Invalid email format", 400);
    if (await getUserByEmail(email)) return error("User already exists", 400);
    
    // --- Validation ---
    if (!isValidUserName(userName)) return error("Name must be 3-50 characters", 400);
    if (!isValidPassword(password)) return error("Password must be at least 8 chars, include 1 digit and 1 special char", 400);
    if (!isValidRole(role)) return error("Invalid role", 400);

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
