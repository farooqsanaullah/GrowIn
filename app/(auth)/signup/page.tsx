"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components/ui";
import { toast } from "sonner";
import { Eye, EyeClosedIcon } from "lucide-react";

type SignupForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const isDev = process.env.NODE_ENV === "development";

// Simple password strength checker
function getPasswordStrength(password: string) {
  const lengthCheck = password.length >= 8;
  const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const digitCheck = /\d/.test(password);
  return { lengthCheck, specialCharCheck, digitCheck };
}

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password") || "";
  const confirmValue = watch("confirmPassword") || "";
  const { lengthCheck, specialCharCheck, digitCheck } = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);

      // Calling custom signup API route
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Signup failed");
        return;
      }

      toast.success("Account created successfully!");

      // Auto-login after signup
      await signIn("credentials", { 
        redirect: false, 
        email: data.email, 
        password: data.password 
      });

      router.push("/"); // Redirect after signup
    } catch (error) {
      isDev && console.error("Signup error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-center text-3xl font-semibold text-foreground">Sign Up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-foreground text-md">Full Name</Label>
            <Input
              id="name"
              type="text"
              autoFocus
              placeholder="John Doe"
              className="mt-2 bg-input text-foreground border-border"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-foreground text-md">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              className="mt-2 bg-input text-foreground border-border"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-foreground text-md">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="mt-2 bg-input text-foreground border-border pr-10"
                {...register("password", {
                  required: "Password is required",
                  validate: {
                    hasLength: (value) => value.length >= 8, 
                    hasDigit: (value) => /\d/.test(value),
                    hasSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
                  },
                })}
              />
              {passwordValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-2 top-3.5 flex items-center text-muted-foreground cursor-pointer"
                >
                  {showPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
            </div>

            {/* Password Strength Guide */}
            {passwordValue.length > 0 && (
              <div className="mt-4 text-sm space-y-1">
                <p className={lengthCheck ? "text-success" : "text-destructive"}>• At least 8 characters</p>
                <p className={specialCharCheck ? "text-success" : "text-destructive"}>• 1 special character</p>
                <p className={digitCheck ? "text-success" : "text-destructive"}>• 1 digit</p>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-foreground text-md">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="mt-2 bg-input text-foreground border-border pr-10"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                })}
              />
              {confirmValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirm(prev => !prev)}
                  className="absolute right-2 top-3.5 flex items-center text-muted-foreground cursor-pointer"
                >
                  {showConfirm ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
            </div>
            
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>


          <Button
            type="submit"
            className="w-full cursor-pointer bg-primary text-md text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
