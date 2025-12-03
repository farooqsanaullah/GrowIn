"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { EmailSchema } from "@/lib/auth/zodSchemas/fieldSchemas.zod";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input, Button, Label } from "@/components/ui";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ForgotPasswordFormValues = {
  email: string;
};

// Wrap EmailSchema in object for the form
const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

export default function ForgotPasswordDialog() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailValue = watch("email");
  const isEmailValid = EmailSchema.safeParse(emailValue).success;

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setFormError(null);
    setSuccess(false);

    try {
      setLoading(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to send reset link");
      }

      setSuccess(true);
      toast.success("Password reset link sent to your email!");
    } catch (err: any) {
      setFormError(err.message);
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Forgot Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-foreground text-md">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email")}
              className={`mt-2 bg-input text-foreground pr-10
                ${errors.email
                  ? "!bg-destructive/10 border-transparent focus-visible:border-destructive focus-visible:ring-0 shadow-none"
                  : isEmailValid
                  ? "bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                  : "border-border"
                }
              `}
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {formError && <p className="text-destructive text-sm">{formError}</p>}

          <DialogFooter className="mt-8">
            <div className="w-full">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 cursor-pointer"
                >
                  {loading ? (
                    <>Sending<Loader className="animate-spin" /></>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </div>

              {success && (
                <div className="mt-4 bg-success/10 p-2 rounded text-center">
                  <p className="text-success text-sm">
                    A password reset link has been sent to your email. Please check your inbox/spam.
                  </p>
                </div>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
