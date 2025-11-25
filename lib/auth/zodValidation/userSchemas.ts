import { z, ZodError } from "zod";
import { 
  PASSWORD_MIN_LENGTH, 
  USERNAME_MAX_LENGTH, 
  USERNAME_MIN_LENGTH,
  ALLOWED_ROLES,
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
  .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), "Password must contain at least one special character.")
  .refine((val) => /\d/.test(val), "Password must contain at least one number.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const roleSchema = z
  .enum(ALLOWED_ROLES)
  .refine((val) => ALLOWED_ROLES.includes(val), {
    message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
});

export const signupSchema = z.object({
  userName: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
});

export const validateField = (name: string, value: string) => {
  try {
    if (name === "userName") {
      userNameSchema.parse(value);
    } else if (name === "email") {
      emailSchema.parse(value);
    } else if (name === "password") {
      passwordSchema.parse(value);
    }
    return ""; // no error
  } catch (err) {
    if (err instanceof ZodError) {
      return err.issues?.[0]?.message || "Invalid input";
    }
    return "Validation failed";
  }
};
