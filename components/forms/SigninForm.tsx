"use client";

import { JSX, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignInSchemaType } from "@/lib/auth/zodSchemas";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, FloatingLabelInput, Separator } from "@/components/ui";
import { toast } from "react-hot-toast";
import { Eye, EyeClosedIcon, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

type SigninFormProps = {
  providers: Record<string, any> | null;
};

const isDev = process.env.NODE_ENV === "development";

const providerIcons: { [key: string]: JSX.Element } = {
  google: <FcGoogle className="mr-2" />,
  github: <FaGithub className="mr-2" />,
};

export default function SigninForm({ providers }: SigninFormProps) {
  const router = useRouter();
  const [loadingSignin, setLoadingSignin] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { 
    register, 
    handleSubmit,
    watch,
    formState: { errors }, 
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  const isPassEntered = watch("password").length > 0;

  const onSubmit = async (data: SignInSchemaType) => {
    try {
      setLoadingSignin(true);
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
      setLoadingSignin(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-around bg-background text-foreground">
      
      {/* Logo */}
      <div className="flex flex-col justify-start mb-80">
        <Image
          src="/logo.png"
          alt="App Logo"
          width={200}
          height={0}
          className="rounded-md"
        />
        <p className="mt-4 text-xl text-muted-foreground pl-4">
          Welcome back! Sign in to continue your journey with GrowIn.
        </p>
      </div>
      
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-left text-2xl text-foreground">Sign In for GrowIn</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email */}
          <div>
            <FloatingLabelInput 
              id="email"
              label="Email"
              disabled={loadingSignin || loadingProvider}
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <FloatingLabelInput
              id="password"
              label="Password"
              disabled={loadingSignin || loadingProvider}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
            )}

            {isPassEntered && (
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-2 inset-y-0 flex items-center text-muted-foreground cursor-pointer"
              >
                {showPassword ? <EyeClosedIcon /> : <Eye />}
              </button>
            )}
          </div>

          {/* SignUp Link */}
          <div className="flex justify-between text-sm px-1">
            <Link className="text-sm underline text-foreground hover:text-primary" href={"/signup"}>
              SignUp
            </Link>
            <Link className="text-sm underline text-foreground hover:text-primary" href={"/forgot-password"}>
              Forgot password?
            </Link>
          </div>

          {/* SignIn Button */}
          <Button
            type="submit"
            disabled={loadingSignin || loadingProvider}
            className="w-full cursor-pointer bg-primary text-md text-primary-foreground hover:bg-primary/90"
          >
            {loadingSignin ? (
              <>Signing in<Loader className="animate-spin" /></>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Separator */}
          <div className="relative flex items-center justify-center overflow-hidden">
            <Separator />
            <div className="py-2 px-2 border rounded-lg text-center bg-muted text-xs mx-1">
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
                      disabled={loadingProvider || loadingSignin}
                      onClick={() => {
                        setLoadingProvider(prov.id)
                        signIn(prov.id, { callbackUrl: `${window.location.origin}/redirect` })
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