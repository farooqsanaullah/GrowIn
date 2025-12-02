import { z } from "zod";
import { phoneSchema,
  passwordSchema,
  socialLinksSchema,
  experienceSchema,
  fundingRangeSchema,
 } from "@/lib/auth/zodSchemas";

// User update schema
export const updateUserSchema = z.object({
  userName: z.string().min(3, "Username too short").max(30, "Username too long").optional(),
  name: z.string().max(50, "Name too long").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: phoneSchema,
  password: passwordSchema,
  role: z.enum(["investor", "founder"]).optional(),
  profileImage: z.string().url("Invalid URL").optional(),
  bio: z.string().max(500, "Bio too long").optional(),
  socialLinks: socialLinksSchema,
  city: z.string().optional(),
  country: z.string().optional(),
  experiences: z.array(experienceSchema).optional(),
  skills: z.array(z.string()).optional(),
  fundingRange: fundingRangeSchema,
  isVerified: z.boolean().optional(),
});
