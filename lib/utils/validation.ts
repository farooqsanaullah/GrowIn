import mongoose from "mongoose";

export function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

export function parseQueryParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("limit") || "10"))
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function sanitizeStartupData(data: any) {
  const sanitized: any = {};

  if (data.title !== undefined) sanitized.title = data.title?.trim();
  if (data.description !== undefined)
    sanitized.description = data.description?.trim();
  if (data.pitch !== undefined) sanitized.pitch = data.pitch;
  if (data.founders !== undefined) sanitized.founders = data.founders;
  if (data.investors !== undefined) sanitized.investors = data.investors;
  if (data.badges !== undefined) sanitized.badges = data.badges;
  if (data.categoryType !== undefined)
    sanitized.categoryType = data.categoryType?.trim();
  if (data.industry !== undefined) sanitized.industry = data.industry?.trim();
  if (data.socialLinks !== undefined) sanitized.socialLinks = data.socialLinks;
  if (data.status !== undefined) sanitized.status = data.status;
  if (data.equityRange !== undefined) sanitized.equityRange = data.equityRange;
  if (data.profilePic !== undefined) sanitized.profilePic = data.profilePic;

  return sanitized;
}
