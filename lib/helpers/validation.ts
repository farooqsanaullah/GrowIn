import { EMAIL_REGEX } from "@/lib/constants/regex";

export function isValidEmail(email: string) {
  if (!email) return false;

  return EMAIL_REGEX.test(email);
}

export function isValidPassword(password: string) {
  if (!password) return false;

  const lengthCheck = password.length >= 8;
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const digitCheck = /\d/.test(password);

  return lengthCheck && specialCharCheck && digitCheck;
}

export function isValidUserName(name: string) {
  if (!name) return false;

  return typeof name === "string" && name.trim().length >= 3 && name.trim().length <= 50;
}

export function isValidRole(role: string) {
  if (!role) return false;
  
  return ["investor", "founder"].includes(role);
}
