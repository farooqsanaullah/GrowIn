import { z } from "zod";
import { 
  UserNameSchema,
  EmailSchema,
  PasswordSchema,
  RoleSchema
} from "@/lib/auth/zodSchemas";
 
export const SignUpSchema = z.object({
  userName: UserNameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  confirmPassword: z.string(),
  role: RoleSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;