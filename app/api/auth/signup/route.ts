import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { hashPassword, getUserByEmail } from "@/lib/helpers/backend";
import { success, error } from "@/lib/auth/apiResponses";
import User from "@/lib/models/user.model";
import { signUpSchema } from "@/lib/auth/zodSchemas";

const isDev = process.env.NODE_ENV === "development";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Validating request body with zod
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return error(parsed.error.issues[0].message, 400);
    }

    const { userName, email, password, role } = parsed.data;

    // Check existing user
    if (await getUserByEmail(email)) {
      return error("User already exists", 409);
    }

    // Hash password & create user
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
