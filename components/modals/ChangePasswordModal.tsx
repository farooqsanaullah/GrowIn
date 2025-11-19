"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { validatePassword } from "@/lib/helpers/shared";
import { Eye, EyeClosedIcon, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Label,
  Input,
} from "@/components/ui";
import toast from "react-hot-toast";
import { getPasswordStrength } from "@/lib/helpers/shared";

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

  const onSubmit = async (data: FormValues) => {
    const { currentPassword, newPassword, confirmPassword } = data;

    const currentPasswordError =
      !isForgotPasswordFlow ? validatePassword(currentPassword || "") : null;
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validatePassword(confirmPassword);

    if (currentPasswordError) setError("currentPassword", { message: currentPasswordError });
    if (newPasswordError) setError("newPassword", { message: newPasswordError });
    if (confirmPasswordError) setError("confirmPassword", { message: confirmPasswordError });

    if (
      currentPasswordError ||
      newPasswordError ||
      confirmPasswordError
    )
      return;

    if (newPassword !== confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {!isForgotPasswordFlow && (
            <div>
              <Label htmlFor="currentPassword" className="text-foreground text-md">Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current password"
                  autoComplete="current-password"
                  {...register("currentPassword", {
                    validate: (value) =>
                      isForgotPasswordFlow
                        ? true
                        : validatePassword(value || "") || true,
                  })}
                  className={`bg-input text-foreground pr-10
                  ${(currentPasswordValue && currentPasswordValue.length >= 8)
                      ? "bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                      : "border-border"
                  }
                `}
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
              </div>
              {errors.currentPassword && (
                <p className="text-destructive text-sm">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
          )}

          {/* NEW PASSWORD */}
          <div>
            <Label htmlFor="newPassword" className="text-foreground text-md">New Password</Label>
            <div className="mt-2 relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("newPassword", {
                  validate: (value) => validatePassword(value) || true,
                })}
                className={`bg-input text-foreground pr-10
                  ${(lengthCheck && specialCharCheck && digitCheck)
                      ? "bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                      : "border-border"
                  }
                `}
              />
              {newPasswordValue && newPasswordValue.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-2 inset-y-0 flex items-center text-muted-foreground cursor-pointer"
                >
                  {showNewPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              )}
            </div>

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

            {errors.newPassword && (
              <p className="text-destructive text-sm">{errors.newPassword.message}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <Label htmlFor="confirmPassword" className="text-foreground text-md">Confirm New Password</Label>
            <div className="mt-2 relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  validate: (value) => {
                    const err = validatePassword(value);
                    if (err) return err;
                    if (value !== newPasswordValue) return "Passwords do not match";
                    return true;
                  },
                })}
                className={`bg-input text-foreground pr-10
                  ${(confirmPasswordValue.length > 0 && newPasswordValue === confirmPasswordValue)
                      ? "bg-success/10 border-transparent focus-visible:border-success focus-visible:ring-0 shadow-none"
                      : "border-border"
                  }
                `}
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
              <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
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
                <>
                  Changing <Loader className="animate-spin ml-2" />
                </>
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
