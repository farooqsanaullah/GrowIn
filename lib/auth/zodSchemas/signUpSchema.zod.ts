import { z } from "zod";
import { 
  emailSchema,
  userNameSchema,
  passwordSchema,
  roleSchema
 } from "@/lib/auth/zodSchemas";
 
 export const signUpSchema = z.object({
  userName: userNameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
});