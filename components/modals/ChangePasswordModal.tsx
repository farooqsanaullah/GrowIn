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
} from "@/components/ui";
import toast from "react-hot-toast";

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

  const newPasswordValue = watch("newPassword");

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
          <DialogTitle className="text-lg font-semibold text-center">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {!isForgotPasswordFlow && (
            <div>
              <label>Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current password"
                  autoComplete="current-password"
                className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus:ring-ring"
                  {...register("currentPassword", {
                    validate: (value) =>
                      isForgotPasswordFlow
                        ? true
                        : validatePassword(value || "") || true,
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                >
                  {showCurrentPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>
          )}

          {/* NEW PASSWORD */}
          <div>
            <label>New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                autoComplete="new-password"
                className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("newPassword", {
                  validate: (value) => validatePassword(value) || true,
                })}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showNewPassword ? <EyeClosedIcon /> : <Eye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label>Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus:ring-ring"
                {...register("confirmPassword", {
                  validate: (value) => {
                    const err = validatePassword(value);
                    if (err) return err;
                    if (value !== newPasswordValue) return "Passwords do not match";
                    return true;
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showConfirmPassword ? <EyeClosedIcon /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          {errors.root && (
            <p className="text-red-500 text-sm">{errors.root.message}</p>
          )}

          <DialogFooter className="flex flex-col gap-2 mt-8">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting}
              className="flex-1"
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
