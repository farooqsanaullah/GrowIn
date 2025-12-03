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