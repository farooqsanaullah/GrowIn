import { z } from "zod";
import { 
  userNameSchema,
  emailSchema,
  passwordSchema,
  roleSchema
} from "@/lib/auth/zodSchemas";
 
export const signUpSchema = z.object({
  userName: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  role: roleSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;