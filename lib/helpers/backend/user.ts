import User from "@/lib/models/user.model";

export async function getUserById(userId: string) {
  return await User.findById(userId).select("+password");
}

export async function getUsersByIds(ids: string[]) {
  return User.find({ _id: { $in: ids } }).select("email");
}

export async function getUserByEmail(email: string) {
  return await User.findOne({ email }).select("+password");
}
