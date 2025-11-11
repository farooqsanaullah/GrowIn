"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeClosedIcon } from "lucide-react";
import {
  Button, 
  Input, 
  Label, 
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui";

import { Slider } from "@/components/ui";

type SignupForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "investor" | "founder" | "admin";
  profileImage?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  experience?: string;
  skills?: string;
  fundingRange?: {
    min?: number;
    max?: number;
  };
  isVerified?: boolean;
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
    control, 
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "investor",
      socialLinks: {},
      skills: "",
      fundingRange: {},
      isVerified: false,
    },
  });

  const passwordValue = watch("password") || "";
  const confirmValue = watch("confirmPassword") || "";
  const { lengthCheck, specialCharCheck, digitCheck } = getPasswordStrength(passwordValue);

  const onSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true);

      const payload = {
        ...data,
        skills: data.skills?.split(",").map(s => s.trim()),
        fundingRange: {
          min: data.fundingRange?.min || undefined,
          max: data.fundingRange?.max || undefined,
        },
      };

      // Calling custom signup API route
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-sm">
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

          {/* Role */}
          <Controller
            name="role"
            control={control} // get this from useForm()
            defaultValue="founder"
            rules={{ required: "Role is required" }}
            render={({ field }) => (
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="mt-2 cursor-pointer">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="founder" className="cursor-pointer">Founder</SelectItem>
                    <SelectItem value="investor" className="cursor-pointer">Investor</SelectItem>
                    <SelectItem value="admin" className="cursor-pointer">Admin</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-destructive">{errors.role.message}</p>}
              </div>
            )}
          />

          {/* Profile Image */}
          <div>
            <Label htmlFor="profileImage">Profile Image URL</Label>
            <Input 
              id="profileImage" 
              placeholder="https://..."
              className="mt-2" 
              {...register("profileImage")} />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              placeholder="Short bio" 
              className="mt-2"
              {...register("bio")} />
          </div>

          {/* Social Links */}
          <div>
            <Label>Social Links</Label>
            <Input placeholder="Twitter URL" {...register("socialLinks.twitter")} className="mt-1" />
            <Input placeholder="LinkedIn URL" {...register("socialLinks.linkedin")} className="mt-1" />
            <Input placeholder="Website URL" {...register("socialLinks.website")} className="mt-1" />
          </div>

          {watch("role") === "founder" && (
            <>
              {/* Experience */}
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input 
                  id="experience" 
                  placeholder="e.g., 5 years"
                  className="mt-2"
                  
                  {...register("experience")} />
              </div>

              {/* Skills */}
              <div>
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input 
                  id="skills" 
                  placeholder="JavaScript, React" 
                  className="mt-2"
                  {...register("skills")} />
              </div>
            </>
          )}

          {/* Funding Range */}
          {watch("role") === "investor" && (
            <>
              <Controller
                name="fundingRange"
                control={control}
                defaultValue={{ min: 0, max: 100000 }}
                render={({ field }) => {
                  const [min, max] = [field.value?.min || 0, field.value?.max || 100000];

                  return (
                    <div>
                      <Label>Funding Range</Label>
                      <div className="flex flex-col gap-2 mt-4 cursor-pointer">
                        <Slider
                          value={[min, max]}
                          onValueChange={(val: number[]) =>
                            field.onChange({ min: val[0], max: val[1] })
                          }
                          max={500000} // optional
                          step={1000}  // optional
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>${min}</span>
                          <span>${max}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            <div>
              <Label>Funding Range</Label>
              <div className="flex gap-2 mt-2">
                <Input type="number" placeholder="Min" {...register("fundingRange.min", { valueAsNumber: true })} />
                <Input type="number" placeholder="Max" {...register("fundingRange.max", { valueAsNumber: true })} />
              </div>
            </div>
            </>
          )}

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
