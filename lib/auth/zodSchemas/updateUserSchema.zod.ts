import { z } from "zod";
import {
  PhoneSchema,
  PasswordSchema,
  SocialLinksSchema,
  ExperienceSchema,
  FundingRangeSchema,
} from "@/lib/auth/zodSchemas";

// Treat empty strings as undefined for optional fields
const optionalString = (schema: z.ZodString) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema.optional());

// User update schema (profile edits do not require password)
export const UpdateUserSchema = z.object({
  userName: optionalString(z.string().min(3, "Username too short").max(30, "Username too long")),
  name: optionalString(z.string().max(50, "Name too long")),
  email: optionalString(z.string().email("Invalid email")),
  phone: z.preprocess((val) => (val === "" ? undefined : val), PhoneSchema),
  password: z.preprocess((val) => (val === "" ? undefined : val), PasswordSchema.optional()),
  role: z.enum(["investor", "founder"]).optional(),
  profileImage: optionalString(z.string().url("Invalid URL")),
  bio: optionalString(z.string().max(500, "Bio too long")),
  socialLinks: SocialLinksSchema,
  city: optionalString(z.string()),
  country: optionalString(z.string()),
  experiences: z.array(ExperienceSchema).optional(),
  skills: z.array(z.string()).optional(),
  fundingRange: FundingRangeSchema,
  isVerified: z.boolean().optional(),
});
