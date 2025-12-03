import { z } from "zod";
import { PhoneSchema,
  PasswordSchema,
  SocialLinksSchema,
  ExperienceSchema,
  FundingRangeSchema,
 } from "@/lib/auth/zodSchemas";

// User update schema
export const updateUserSchema = z.object({
  userName: z.string().min(3, "Username too short").max(30, "Username too long").optional(),
  name: z.string().max(50, "Name too long").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: PhoneSchema,
  password: PasswordSchema,
  role: z.enum(["investor", "founder"]).optional(),
  profileImage: z.string().url("Invalid URL").optional(),
  bio: z.string().max(500, "Bio too long").optional(),
  socialLinks: SocialLinksSchema,
  city: z.string().optional(),
  country: z.string().optional(),
  experiences: z.array(ExperienceSchema).optional(),
  skills: z.array(z.string()).optional(),
  fundingRange: FundingRangeSchema,
  isVerified: z.boolean().optional(),
});
