import { 
  PASSWORD_MIN_LENGTH, 
  PASSWORD_SPECIAL_CHAR_REGEX, 
  PHONE_REGEX 
} from "@/lib/constants";
import { z, ZodError } from "zod";

// Social links schema
const socialLinksSchema = z.object({
  twitter: z
    .string()
    .url("Invalid Twitter URL")
    .optional(),
  github: z
    .string()
    .url("Invalid Github URL")
    .optional(),
  linkedin: z
    .string()
    .url("Invalid LinkedIn URL")
    .optional(),
  website: z
    .string()
    .url("Invalid website URL")
    .optional(),
}).optional();

// Funding range schema
const fundingRangeSchema = z.object({
  min: z.number().min(0, "Minimum funding must be positive").optional(),
  max: z.number().min(0, "Maximum funding must be positive").optional(),
}).optional();

// Phone schema using regex for now (matches E.164 or common formats)
const phoneSchema = z
  .string()
  .regex(PHONE_REGEX, "Invalid phone number")
  .optional();

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  )
  .refine((val) => PASSWORD_SPECIAL_CHAR_REGEX.test(val), "Password must contain at least one special character.")
  .refine((val) => /\d/.test(val), "Password must contain at least one number.")
  .optional();

const experienceSchema = z.object({
  designation: z.string().min(1),
  company: z.string().min(1),
  experienceDesc: z.string().max(500).optional(),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

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
