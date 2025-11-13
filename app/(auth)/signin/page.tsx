"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { signIn, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Separator } from "@/components/ui";
import { toast } from "sonner";
import { Eye, EyeClosedIcon, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type LoginForm = {
  email: string;
  password: string;
};

const isDev = process.env.NODE_ENV === "development";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [providers, setProviders] = useState<any>(null);

  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors }, 
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const isPassEntered = watch("password").length > 0;

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

  // Fetch OAuth providers
  useEffect(() => {
    getProviders().then((data) => setProviders(data));
  }, []);

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

        <h1 className="mb-6 text-center text-3xl font-semibold text-foreground">Sign In</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
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
                className="mt-2 bg-input text-foreground border-border pr-10"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {isPassEntered && (
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute flex items-center inset-y-6.75 space-y-1 right-2 text-muted-foreground cursor-pointer"
                >
                  {showPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* SignUp Link */}
          <p className="text-sm">
            Don't have an account? SignUp{" "}
            <Link className="text-sm underline text-primary hover:text-primary" href={"/signup"}>
              here
            </Link>
          </p>

          {/* SignIn Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-primary text-md text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                Signing in
                <Loader className="animate-spin ml-2" />
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          
          {/* OAuth Buttons */}
          {providers && (
            <div className="flex flex-col space-y-3 mb-6">
              {Object.values(providers)
                .filter((prov: any) => prov.id !== "credentials")
                .map((prov: any) => (
                  <Button
                    key={prov.name}
                    variant={"outline"}
                    onClick={() => signIn(prov.id)}
                    className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Sign in with {prov.name}
                  </Button>
                ))}
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
