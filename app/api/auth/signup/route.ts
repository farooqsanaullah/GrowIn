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

    const body = await req.json();
    const {
      name,
      email,
      password,
      role,
      profileImage,
      bio,
      socialLinks,
      experience,
      skills,
      fundingRange,
      isVerified,
    } = body;

    if (!name || !email || !password || !role) return error("Name, email, password and role are required", 400);

    if (!["investor", "founder", "admin"].includes(role)) return error("Invalid role", 400);

    if (await getUserByEmail(email)) return error("User already exists", 400);

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: profileImage || undefined,
      bio: bio || undefined,
      socialLinks: socialLinks
        ? {
            twitter: socialLinks.twitter || undefined,
            linkedin: socialLinks.linkedin || undefined,
            website: socialLinks.website || undefined,
          }
        : undefined,
      experience: experience || undefined,
      skills: Array.isArray(skills) ? skills : undefined,
      fundingRange: fundingRange
        ? {
            min: fundingRange.min ?? undefined,
            max: fundingRange.max ?? undefined,
          }
        : undefined,
      isVerified: isVerified ?? false,
    });

    await newUser.save();

    return success("[Signup API] User registered successfully", 201, { name, email, role });
  } catch (err) {
    isDev && console.error("[Signup API] Error:", err);
    return error("Internal Server Error", 500, err);
  }
}
