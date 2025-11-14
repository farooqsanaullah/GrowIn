import bcrypt from "bcrypt";
import User from "@/lib/models/user.model";
import { EMAIL_REGEX } from "@/lib/constants/regex";

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
  return EMAIL_REGEX.test(email);
}

export function isValidPassword(password: string) {
  const lengthCheck = password.length >= 8;
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const digitCheck = /\d/.test(password);

  return lengthCheck && specialCharCheck && digitCheck;
}

export function isValidUserName(name: string) {
  return typeof name === "string" && name.trim().length >= 3 && name.trim().length <= 50;
}

export function isValidRole(role: string) {
  return ["investor", "founder"].includes(role);
}
