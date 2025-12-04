"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { PasswordSchema } from "@/lib/auth/zodSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosedIcon, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  FloatingLabelInput,
} from "@/components/ui";
import toast from "react-hot-toast";
import { getPasswordStrength } from "@/lib/helpers";

export type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isForgotPasswordFlow?: boolean;
  token?: string | null;
};

type FormValues = {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
};

// Create a combined schema for the form
const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().optional(), // only required in normal flow
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ChangePasswordModal({
  isOpen,
  onClose,
  isForgotPasswordFlow = false,
  token,
}: ChangePasswordModalProps) {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const currentPasswordValue = watch("currentPassword");
  const newPasswordValue = watch("newPassword");
  const confirmPasswordValue = watch("confirmPassword");
  const { lengthCheck, specialCharCheck, digitCheck } = getPasswordStrength(newPasswordValue);

  const isValidCurrentPassword = PasswordSchema.safeParse(currentPasswordValue).success;
  const isValidNewPassword = PasswordSchema.safeParse(newPasswordValue).success;
  const isValidConfirmPassword = newPasswordValue === confirmPasswordValue && confirmPasswordValue.length > 0;

  const onSubmit = async (data: FormValues) => {
    const { currentPassword, newPassword } = data;

    try {
      const url = isForgotPasswordFlow
        ? "/api/auth/reset-password"
        : "/api/auth/change-password";

      const body = isForgotPasswordFlow
        ? { token, newPassword }
        : { currentPassword, newPassword };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to change password!");
      }

      toast.success("Password changed successfully, please login again.");
      onClose();
      router.push("/signin");
    } catch (err: any) {
      setError("root", { message: err.message });

      if (err.message.includes("expired")) {
        alert("Your reset link has expired. Please request a new one.");
        router.push("/forgot-password");
      }
    }
  };

  const handleCancel = () => {
    if (isForgotPasswordFlow) router.push("/signin");
    else onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Change Password</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* CURRENT PASSWORD */}
          {!isForgotPasswordFlow && (
            <div>
              <FloatingLabelInput
                id="currentPassword"
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="password"
                disabled={isSubmitting}
                className={`bg-input text-foreground pr-10 ${
                  currentPasswordValue?.length === 0 
                    ? "border-border"
                    : isValidCurrentPassword
                    ? "!bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                    : "!bg-destructive/10 border-transparent focus-visible:border-destructive focus-visible:ring-0 shadow-none"
                }`}
                {...register("currentPassword")}
              />
              {currentPasswordValue && currentPasswordValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-2 inset-y-0 flex items-center text-muted-foreground cursor-pointer"
                >
                  {showCurrentPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
              {errors.currentPassword && (
                <p className="text-destructive text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
          )}

          {/* NEW PASSWORD */}
          <div>
            <div className="relative">
              <FloatingLabelInput
                id="newPassword"
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                autoComplete="password"
                disabled={isSubmitting}
                className={`bg-input text-foreground pr-10 ${
                  newPasswordValue?.length === 0 
                    ? "border-border"
                    : isValidNewPassword
                    ? "!bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                    : "!bg-destructive/10 border-transparent focus-visible:border-destructive focus-visible:ring-0 shadow-none"
                }`}
                {...register("newPassword")}
              />
              {newPasswordValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-2 inset-y-0 flex items-center text-muted-foreground cursor-pointer"
                >
                  {showNewPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
              
            </div>
            {errors.newPassword && (
              <p className="text-destructive text-sm mt-1 pl-1">{errors.newPassword.message}</p>
            )}
            {newPasswordValue.length > 0 && (
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
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <div className="relative">
              <FloatingLabelInput
                id="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="password"
                disabled={isSubmitting}
                className={`bg-input text-foreground pr-10 ${
                  confirmPasswordValue?.length === 0 
                    ? "border-border"
                    : isValidConfirmPassword
                    ? "!bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                    : "!bg-destructive/10 border-transparent focus-visible:border-destructive focus-visible:ring-0 shadow-none"
                }`}
                {...register("confirmPassword")}
              />
              {confirmPasswordValue && confirmPasswordValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 inset-y-0 flex items-center text-muted-foreground cursor-pointer"
                >
                  {showConfirmPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
            </div>
          {errors.confirmPassword && (
            <p className="text-destructive text-sm mt-1 pl-1">{errors.confirmPassword.message}</p>
          )}
          </div>

          {errors.root && (
            <p className="text-destructive text-sm">{errors.root.message}</p>
          )}

          <DialogFooter className="flex flex-col gap-2 mt-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              {isSubmitting ? (
                <>Changing<Loader className="animate-spin" /></>
              ) : (
                "Change Password"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
