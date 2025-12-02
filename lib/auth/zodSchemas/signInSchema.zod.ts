import { z } from "zod";
import { emailSchema } from "@/lib/auth/zodSchemas";

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});
