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
import { Button, FloatingLabelInput } from "@/components/ui";
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
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
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
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to send reset link");
      }

      setSuccess(true);
      toast.success("Password reset link sent to your email!");
    } catch (err: any) {
      setFormError(err.message);
      toast.error(err.message || "Failed to send reset link");
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <FloatingLabelInput
              id="email"
              label="Email"
              disabled={isSubmitting}
              autoComplete="email"
              className={`bg-input text-foreground pr-10
                ${errors.email || formError
                  ? "!bg-destructive/10 border-transparent focus-visible:border-destructive focus-visible:ring-0 shadow-none"
                  : isEmailValid
                  ? "!bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                  : "border-border"
              }`}
              {...register("email")}
            />
            {(errors.email || formError) && (
              <p className="text-destructive text-sm pl-1 mt-1">
                {errors.email?.message || formError}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4">
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
                  disabled={isSubmitting}
                  className="flex-1 cursor-pointer"
                >
                  {isSubmitting ? (
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
