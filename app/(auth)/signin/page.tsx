"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Label,
} from "@/components/ui";
import { toast } from "sonner";

type LoginForm = {
  email: string;
  password: string;
};

const isDev = process.env.NODE_ENV === "development";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res?.ok) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Login successful");
      router.push("/"); // redirect after login
    } catch (error) {
      isDev && console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              className="mt-2"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-2"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
