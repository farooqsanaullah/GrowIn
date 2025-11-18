"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeClosedIcon, Loader } from "lucide-react";
import {
  Button,
  Input,
  Label
} from "@/components/ui";
import Link from "next/link";
import { EMAIL_REGEX } from "@/lib/constants/regex";
import Image from "next/image";

type SignupForm = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "investor" | "founder";
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
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "investor",
    },
  });

  const userNameValue = watch("userName");
  const emailValue = watch("email");
  const passwordValue = watch("password") || "";
  const confirmValue = watch("confirmPassword") || "";
  const { lengthCheck, specialCharCheck, digitCheck } = getPasswordStrength(passwordValue);

  useEffect(() => {
    if (!userNameValue || userNameValue.length < 3 || userNameValue.length > 30) {
      setIsAvailable(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsChecking(true);
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(userNameValue)}`); // uses encodedURI for special chars
        const data = await res.json();
        setIsAvailable(data.available); // expects { available: true/false }
      } catch (err) {
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn); // cleanup previous timeout
  }, [userNameValue]);

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);

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
        password: data.password,
      });

      router.push("/signin"); // Redirect to signin after signup
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
        
        {/* Logo */}
        <div className="flex justify-center mt-[-10]">
          <Image
            src="/logo.png"
            alt="App Logo"
            width={125}
            height={0}
            className="rounded-md"
          />
        </div>
        
        <h1 className="mb-6 text-center text-3xl font-semibold text-foreground">Sign Up</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role */}
          <Controller
            name="role"
            control={control}
            defaultValue="investor"
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                  <Button
                    type="button" // Prevent form submit
                    variant={field.value === "investor" ? "default" : "outline"}
                    className="flex-grow cursor-pointer"
                    onClick={() => field.onChange("investor")}
                  >
                    Investor
                  </Button>

                  <Button
                    type="button" // Prevent form submit
                    variant={field.value === "founder" ? "default" : "outline"}
                    className="flex-grow cursor-pointer"
                    onClick={() => field.onChange("founder")}
                  >
                    Founder
                  </Button>
                </div>

                {errors.role && (
                  <p className="mt-1 text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>
            )}
          />

          {/* User Name */}
          <div>
            <Label htmlFor="userName" className="text-foreground text-md">Username</Label>
            <div className="relative">
              <Input
                id="userName"
                type="text"
                placeholder="John Doe"
                autoComplete="new-username"
                className={`mt-2 bg-input text-foreground pr-10
                  ${
                    isAvailable === true && !isChecking
                      ? "bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                      : "border-border"
                  }`}
                {...register("userName", { 
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters long" },
                  maxLength: { value: 30, message: "Username must not exceed 30 characters" },
                  // trim input on change
                  setValueAs: (value) => value.trim(),
                })}
              />
              {isChecking && (
                <Loader className="animate-spin absolute right-2 top-3.5 w-5 h-5 text-muted-foreground" />
              )}
            </div>

            {isAvailable === true && !isChecking && (
              <p className="mt-1 text-sm text-success">Username <b>{userNameValue}</b> is available.</p>
            )}
            {isAvailable === false && !isChecking && (
              <p className="mt-1 text-sm text-destructive">Username is already taken.</p>
            )}
            {errors.userName && (
              <p className="mt-1 text-sm text-destructive">{errors.userName.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-foreground text-md">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              {...register("email", { required: "Email is required" })}
              className={`mt-2 bg-input text-foreground pr-10
                ${(EMAIL_REGEX.test(emailValue))
                    ? "bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                    : "border-border"
                }
              `}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-foreground text-md">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  validate: {
                    hasLength: (value) => value.length >= 8, 
                    hasDigit: (value) => /\d/.test(value),
                    hasSpecialChar: (value) => /[!@#$%^&*(),.?\":{}|<>]/.test(value),
                  },
                })}
                className={`mt-2 bg-input text-foreground pr-10
                  ${(lengthCheck && specialCharCheck && digitCheck)
                      ? "bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                      : "border-border"
                  }
                `}
              />
              {passwordValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-3.5 flex items-center text-muted-foreground cursor-pointer"
                >
                  {showPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
            </div>

            {passwordValue.length > 0 && (
              // Password Guide
              <div className="mt-4 text-sm space-y-1">
                <p className={lengthCheck ? "text-success" : "text-destructive"}>
                  • At least 8 characters
                </p>
                <p className={specialCharCheck ? "text-success" : "text-destructive"}>
                  • 1 special character
                </p>
                <p className={digitCheck ? "text-success" : "text-destructive"}>
                  • 1 digit
                </p>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-destructive">
                {errors.password.message}
              </p>
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
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className={`mt-2 bg-input text-foreground pr-10
                  ${(confirmValue.length > 0 && passwordValue === confirmValue)
                      ? "bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                      : "border-border"
                  }
                `}
              />
              {confirmValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-2 top-3.5 flex items-center text-muted-foreground cursor-pointer"
                >
                  {showConfirm ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* SignIn Page Link */}
          <p className="text-sm">
            Already have an account? SignIn{" "}
            <Link
              className="text-sm underline text-primary hover:text-primary"
              href={"/signin"}
            >
              here
            </Link>
          </p>

          {/* SignUp Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-primary text-md text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                Signing up
                <Loader className="animate-spin ml-2" />
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

        </form>
      </div>
    </div>
  );
}
