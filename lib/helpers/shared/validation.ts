import { 
  ALLOWED_ROLES, 
  PASSWORD_MIN_LENGTH, 
  USERNAME_MAX_LENGTH, 
  USERNAME_MIN_LENGTH, 
  EMAIL_REGEX 
} from "@/lib/constants";

export function validateEmail(email: string): string | null {
  if (!email) 
    return "Email is required.";
  
  if (!EMAIL_REGEX.test(email)) 
    return "Please enter a valid email address.";
  
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) 
    return "Password is required.";

  if (password.length < PASSWORD_MIN_LENGTH)
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`;

  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";

  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character.";

  return null;
}

export function getPasswordStrength(password: string) {
  const lengthCheck = password.length >= 8;
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const digitCheck = /\d/.test(password);
  
  return { lengthCheck, specialCharCheck, digitCheck };
}

export function validateUsername(username: string): string | null {
  if (!username) 
    return "Username is required.";
  if (username.length < USERNAME_MIN_LENGTH)
    return `Username must be at least ${USERNAME_MIN_LENGTH} characters long.`;
  
  if (username.length > USERNAME_MAX_LENGTH)
    return `Username must not exceed ${USERNAME_MAX_LENGTH} characters.`;
  
  return null;
}

export function validateRole(role: string): string | null {
  if (!role) 
    return "Role is required.";
  
  if (!ALLOWED_ROLES.includes(role as any)) 
    return `Role must be one of: ${ALLOWED_ROLES.join(", ")}`;
  
  return null;
}
