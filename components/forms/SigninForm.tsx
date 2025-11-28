"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Input, Label, Separator } from "@/components/ui";
import { toast } from "react-hot-toast";
import { Eye, EyeClosedIcon, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type SigninFormValues = {
  email: string;
  password: string;
};

type SigninFormProps = {
  providers: Record<string, any> | null;
};

const isDev = process.env.NODE_ENV === "development";

export default function SigninForm({ providers }: SigninFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors }, 
  } = useForm<SigninFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const isPassEntered = watch("password").length > 0;

  const onSubmit = async (data: SigninFormValues) => {
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
      const session = await fetch("/api/auth/session").then(r => r.json());
      const role = session?.user?.role;

      if (role === "founder") {
        router.push("/founder/dashboard");
      } else if (role === "investor") {
        router.push("/investor/dashboard");
      } else {
        router.push("/");
      }

    } catch (error) {
      isDev && console.error("Login error:", error);
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
          <div className="flex justify-between text-sm">
            <p>
              Don't have an account? SignUp {" "}
              <Link className="text-sm underline text-foreground hover:text-primary" href={"/signup"}>
                here
              </Link>
            </p>
            <p>
              <Link className="text-sm underline text-foreground hover:text-primary" href={"/forgot-password"}>
                Forgot password?
              </Link>
            </p>
          </div>

          {/* SignIn Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-primary text-md text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>Signing in<Loader className="animate-spin ml-2" /></>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Separator */}
          <div className="relative flex items-center justify-center overflow-hidden">
            <Separator />
            <div className="py-1.5 px-2 border rounded-full text-center bg-muted text-xs mx-1">
              OR
            </div>
            <Separator />
          </div>
          
          {/* OAuth Buttons */}
          {providers && (
            <>
              <div className="flex flex-col space-y-3 mb-4">
                {Object.values(providers)
                  .filter((prov: any) => prov.id !== "credentials")
                  .map((prov: any) => (
                    <Button
                      type="button"
                      key={prov.name}
                      variant={"outline"}
                      onClick={() => signIn(prov.id)}
                      className="w-full bg-background text-foreground hover:bg-foreground hover:text-background border-border hover:border-transparent cursor-pointer"
                    >
                      Sign in with {prov.name}
                    </Button>
                  ))}
              </div>
              <p className="text-sm text-foreground text-center">
                By clicking Continue, you agree to GrowIn's
                <Link className="text-chart-3" href={"/legal/user-agreement"}> User Agreement, </Link>
                <Link className="text-chart-3" href={"/legal/privacy-policy"}>Privacy Policy, </Link>
                and 
                <Link className="text-chart-3" href={"/legal/cookie-policy"}> Cookie Policy.</Link>
              </p>
            </>
          )}

        </form>
      </div>
    </div>
  );
}
