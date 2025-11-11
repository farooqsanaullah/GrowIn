import bcrypt from "bcrypt";
import User from "@/lib/models/user.model";

export async function getUserByEmail(email: string) {
  return await User.findOne({ email }).select("+password");
}

export async function verifyPassword(plain: string, hashed: string) {
  return await bcrypt.compare(plain, hashed);
}

export async function hashPassword(plain: string) {
  return await bcrypt.hash(plain, 10);  
}