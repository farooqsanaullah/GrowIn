import bcrypt from "bcrypt";
import User from "@/lib/models/user.model";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/helpers/jwt";
import { getUserById } from "./user";

const { NODE_ENV } = process.env;
const isDev = NODE_ENV! === "development";

export async function generateUniqueUsername(userName?: string, email?: string) {
  let candidate = userName?.trim() || email?.split("@")[0];
  if (!candidate) return null;

  // Check if username is free
  if (!(await User.findOne({ userName: candidate }))) return candidate.slice(0, 30);

  // Fallback: email prefix (if not same as candidate)
  if (email) {
    const prefix = email.split("@")[0];
    if (prefix !== candidate && !(await User.findOne({ userName: prefix }))) {
      return prefix.slice(0, 30);
    }
    candidate = prefix;
  }

  // Final fallback: use MongoDB ObjectId (guaranteed unique)
  return `${candidate}-${new Date().getTime()}`.slice(0, 30);
};

export async function getAuthenticatedUser(req: NextRequest) {
 
  try {
    const manualToken = req.cookies?.get("token")?.value;
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // No tokens found
    if (!manualToken && !nextAuthToken) return null;

    // Extract userId from whichever token exists
    let userId: string | undefined;

    if (manualToken) {
      const decoded = verifyToken(manualToken);
      userId = decoded?.userId;
    } else if (nextAuthToken) {
      userId = nextAuthToken.userId?.toString() || nextAuthToken.sub;
    }

    if (!userId) return null;

    // Fetch user document from DB
    return await getUserById(userId);
  } catch (error) {
    isDev && console.log("Unauthenticated user:", error);
    return null;
  }
}

export async function verifyPassword(plain: string, hashed: string) {
  return await bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string) {
  return await bcrypt.hash(plain, 10);
}

export async function updatePassword(userId: string, newPassword: string): Promise<void> {
  const hashedPassword = await hashPassword(newPassword);
  
  await User.findByIdAndUpdate(userId, {
    password: hashedPassword,
    updatedAt: new Date(),
  });
}
