import { z } from "zod";
import { 
  PASSWORD_MIN_LENGTH, 
  USERNAME_MAX_LENGTH, 
  USERNAME_MIN_LENGTH,
  ALLOWED_ROLES,
  PASSWORD_SPECIAL_CHAR_REGEX,
  PHONE_REGEX,
} from "@/lib/constants";

// Username
export const UserNameSchema = z
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

// Email
export const EmailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.");

// Password
export const PasswordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  )
  .regex(/\d/, "Password must include 1 digit")
  .regex(PASSWORD_SPECIAL_CHAR_REGEX, "Password must include 1 special character");

// Role
export const RoleSchema = z
  .enum(ALLOWED_ROLES)
  .refine((val) => ALLOWED_ROLES.includes(val), {
    message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
});

// Social links
export const SocialLinksSchema = z.object({
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

// Funding range
export const FundingRangeSchema = z.object({
  min: z.number().min(0, "Minimum funding must be positive").optional(),
  max: z.number().min(0, "Maximum funding must be positive").optional(),
}).optional();

// Phone (regex matches E.164 | common formats)
export const PhoneSchema = z
  .string()
  .regex(PHONE_REGEX, "Invalid phone number")
  .optional();

export const UpdatePasswordSchema = PasswordSchema.optional();

// Experience
export const ExperienceSchema = z.object({
  designation: z.string().min(1),
  company: z.string().min(1),
  experienceDesc: z.string().max(500).optional(),
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.endDate >= data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});