import User from "@/lib/models/user.model";

export async function getUserById(userId: string) {
  return await User.findById(userId);
}

export async function getUserByEmail(email: string) {
  return await User.findOne({ email }).select("+password");
}
