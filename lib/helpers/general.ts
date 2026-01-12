import { Experience } from "@/lib/models/user.model";

export const isExperienceEmpty = (exp: Experience) => {
  return (
    !exp.designation?.trim() ||
    !exp.company?.trim() ||
    !exp.experienceDesc?.trim()
  );
};

export function getPasswordStrength(password: string) {
  const lengthCheck = password.length >= 8;
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const digitCheck = /\d/.test(password);
  
  return { lengthCheck, specialCharCheck, digitCheck };
}

export const getInitials = (name?: string, userName?: string) => {
  const full = name || userName || "";
  const words = full.trim().split(" ");
  if (words.length === 0) return "";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase().slice(0, 2);
};