import { z } from "zod";
import { EmailSchema } from "@/lib/auth/zodSchemas";

export const SignInSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;