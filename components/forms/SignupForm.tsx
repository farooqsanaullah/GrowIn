"use client";

import { JSX, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeClosedIcon, Loader } from "lucide-react";
import {
  Button,
  FloatingLabelInput,
  Separator,
} from "@/components/ui";
import Link from "next/link";
import { EMAIL_REGEX } from "@/lib/constants";
import Image from "next/image";
import { getPasswordStrength } from "@/lib/helpers/shared";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

type SignupFormValues = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "investor" | "founder";
};

type SignupFormProps = {
  providers: Record<string, any> | null;
};

const isDev = process.env.NODE_ENV === "development";

const providerIcons: { [key: string]: JSX.Element } = {
  google: <FcGoogle className="mr-2" />,
  github: <FaGithub className="mr-2" />,
};

export default function SignupForm({ providers }: SignupFormProps) {
  const router = useRouter();
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(false);
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
  } = useForm<SignupFormValues>({
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

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setLoadingSignup(true);

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

      await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created successfully.");
      router.push("/signin"); // Redirect to signin after signup
    } catch (error) {
      isDev && console.error("Signup error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoadingSignup(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-y-auto">
      {/* Left side with background image */}
      <div
        className="w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/signup-bg.jpg')" }}
      >
        {/* Black overlay with 50% opacity and blur*/}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Centered content */}
        <div className="relative flex h-full items-center justify-center">
          <p className="text-white text-2xl font-semibold">Create your free account</p>
        </div>
      </div>

      {/* Right side with signup form */}
      <div className="w-1/2 flex flex-col items-center justify-center">        
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
          <h1 className="mb-6 text-left text-2xl text-foreground">Sign Up for GrowIn</h1>

          {/* OAuth Buttons */}
          {providers && (
            <div className="flex flex-col space-y-3 mb-4">
              {Object.values(providers)
                .filter((prov: any) => prov.id !== "credentials")
                .map((prov: any) => (
                  <Button
                    type="button"
                    key={prov.name}
                    variant={"outline"}
                    disabled={loadingProvider || loadingSignup}
                    onClick={() => {
                      setLoadingProvider(prov.id)
                      signIn(prov.id)
                    }}
                    className="w-full bg-background text-foreground hover:bg-foreground hover:text-background border-border hover:border-transparent cursor-pointer"
                  >
                    {loadingProvider === prov.id ? (
                      <>
                        {providerIcons[prov.id]}
                        Redirecting
                        <Loader className="w-4 h-4 animate-spin ml-2" />
                      </>
                    ) : (
                      <>
                        {providerIcons[prov.id]}
                        Sign in with {prov.name}
                      </>
                    )}
                  </Button>
                ))}
            </div>
          )}

          {/* Separator */}
          <div className="relative flex items-center justify-center overflow-hidden pb-3">
            <Separator />
            <div className="py-2 px-2 border rounded-lg text-center bg-muted text-xs mx-1">
              OR
            </div>
            <Separator />
          </div>

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
                      disabled={loadingSignup || loadingProvider }
                      className="flex-grow cursor-pointer"
                      onClick={() => field.onChange("investor")}
                    >
                      Investor
                    </Button>

                    <Button
                      type="button" // Prevent form submit
                      variant={field.value === "founder" ? "default" : "outline"}
                      disabled={loadingSignup || loadingProvider }
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
              <FloatingLabelInput 
                id="userName"
                label="Username"
                disabled={loadingSignup || loadingProvider }
                autoComplete="new-username"
                className={`text-foreground pr-10 ${
                  isAvailable && !isChecking
                    ? "!bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                    : "bg-input border-border"
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
              <FloatingLabelInput
                id="email"
                label="Email"
                disabled={loadingSignup || loadingProvider }
                {...register("email", { required: "Email is required" })}
                className={`bg-input text-foreground pr-10
                  ${(EMAIL_REGEX.test(emailValue))
                      ? "!bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
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
              <div className="relative">
                <FloatingLabelInput 
                  id="password"
                  label="Password"
                  disabled={loadingSignup || loadingProvider }
                  autoComplete="password"
                  className={`bg-input text-foreground pr-10
                    ${(lengthCheck && specialCharCheck && digitCheck)
                        ? "!bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                        : "border-border"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    validate: {
                      hasLength: (value) => value.length >= 8, 
                      hasDigit: (value) => /\d/.test(value),
                      hasSpecialChar: (value) => /[!@#$%^&*(),.?\":{}|<>]/.test(value),
                    },
                  })}
                />
                {passwordValue.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 inset-y-0 flex items-center text-muted-foreground cursor-pointer"
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
              <div className="relative">
                <FloatingLabelInput 
                  id="confirmPassword"
                  label="Confirm Password"
                  disabled={loadingSignup || loadingProvider }
                  autoComplete="password"
                  className={`bg-input text-foreground pr-10
                    ${(confirmValue.length > 0 && passwordValue === confirmValue)
                        ? "!bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                        : "border-border"
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                {confirmValue.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-2 inset-y-0 flex items-center text-muted-foreground cursor-pointer"
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
              disabled={loadingSignup || loadingProvider }
              className="w-full cursor-pointer text-md"
            >
              {loadingSignup ? (
                <>Signing up<Loader className="animate-spin ml-2" /></>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
