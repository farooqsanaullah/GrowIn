import { z } from "zod";
import { 
  PASSWORD_MIN_LENGTH, 
  USERNAME_MAX_LENGTH, 
  USERNAME_MIN_LENGTH,
  ALLOWED_ROLES,
  PASSWORD_SPECIAL_CHAR_REGEX,
  PHONE_REGEX,
} from "@/lib/constants";

export const userNameSchema = z
  .string()
  .trim()
  .min(
    USERNAME_MIN_LENGTH,
    `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`
  )
  .max(
    USERNAME_MAX_LENGTH,
    `Username must not exceed ${USERNAME_MAX_LENGTH} characters.`
  );

export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  )
  .refine((val) => PASSWORD_SPECIAL_CHAR_REGEX.test(val), "Password must contain at least one special character.")
  .refine((val) => /\d/.test(val), "Password must contain at least one number.");

export const roleSchema = z
  .enum(ALLOWED_ROLES)
  .refine((val) => ALLOWED_ROLES.includes(val), {
    message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
});

// Social links schema
export const socialLinksSchema = z.object({
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
export const fundingRangeSchema = z.object({
  min: z.number().min(0, "Minimum funding must be positive").optional(),
  max: z.number().min(0, "Maximum funding must be positive").optional(),
}).optional();

// Phone schema using regex for now (matches E.164 or common formats)
export const phoneSchema = z
  .string()
  .regex(PHONE_REGEX, "Invalid phone number")
  .optional();

export const updatePasswordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  )
  .refine((val) => PASSWORD_SPECIAL_CHAR_REGEX.test(val), "Password must contain at least one special character.")
  .refine((val) => /\d/.test(val), "Password must contain at least one number.")
  .optional();

export const experienceSchema = z.object({
  designation: z.string().min(1),
  company: z.string().min(1),
  experienceDesc: z.string().max(500).optional(),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});