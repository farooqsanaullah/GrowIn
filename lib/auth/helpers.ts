import bcrypt from "bcrypt";
import User from "@/lib/models/user.model";
import jwt from "jsonwebtoken";
import { EMAIL_REGEX } from "@/lib/constants/regex";

const {
  AUTH_SECRET,
} = process.env;

// --- JWT Utilities ---
export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, AUTH_SECRET!) as { userId: string };
}

// --- User helpers ---
export async function getUserByEmail(email: string) {
  return await User.findOne({ email }).select("+password");
}

export async function verifyPassword(plain: string, hashed: string) {
  return await bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string) {
  return await bcrypt.hash(plain, 10);
}

// --- Validation helpers ---
export function isValidEmail(email: string) {
  if (!email) return false;

  return EMAIL_REGEX.test(email);
}

export function isValidPassword(password: string) {
  if (!password) return false;

  const lengthCheck = password.length >= 8;
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const digitCheck = /\d/.test(password);

  return lengthCheck && specialCharCheck && digitCheck;
}

export function isValidUserName(name: string) {
  if (!name) return false;

  return typeof name === "string" && name.trim().length >= 3 && name.trim().length <= 50;
}

export function isValidRole(role: string) {
  if (!role) return false;
  
  return ["investor", "founder"].includes(role);
}

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
