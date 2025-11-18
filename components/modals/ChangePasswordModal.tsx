"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/lib/helpers/shared";
import { Eye, EyeClosedIcon, Loader } from "lucide-react";
import { FormErrors } from "@/lib/types/custom-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from "@/components/ui";

export type ChangePasswordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isForgotPasswordFlow?: boolean;
  token?: string | null;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  isForgotPasswordFlow = false,
  token,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "currentPassword") setCurrentPassword(value);
    else if (name === "newPassword") setNewPassword(value);
    else if (name === "confirmPassword") setConfirmPassword(value);

    const validationError = validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: validationError }));
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const validationError = validatePassword(value);
    setErrors((prev) => ({ ...prev, [name]: validationError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let currentPasswordError = null;
    if (!isForgotPasswordFlow) currentPasswordError = validatePassword(currentPassword);
    const newPasswordError = validatePassword(newPassword);
    const confirmPasswordError = validatePassword(confirmPassword);

    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      setErrors({
        ...(isForgotPasswordFlow ? {} : { currentPassword: currentPasswordError }),
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, formError: "Passwords do not match" }));
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const url = isForgotPasswordFlow ? "/api/auth/reset-password" : "/api/auth/change-password";
      const body = isForgotPasswordFlow ? { token, newPassword } : { currentPassword, newPassword };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to change password!");
      }

      alert("Password changed successfully, please login again.");
      onClose();
      router.push("/signin");
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, formError: err.message }));
      if (err.message.includes("expired")) {
        alert("Your reset link has expired. Please request a new one.");
        router.push("/forgot-password");
      }
    } finally {
      setLoading(false);
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
          <DialogTitle className="text-lg font-semibold text-gray-800 text-center">
            Change Password
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {!isForgotPasswordFlow && (
            <div>
              <label>Current Password</label>
              <div className="relative">
                <input
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  placeholder="Current password"
                  autoComplete="current-password"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-700 hover:text-gray-900"
                >
                  {showCurrentPassword ? <EyeClosedIcon /> : <Eye />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm">{errors.currentPassword}</p>
              )}
            </div>
          )}

          <div>
            <label>New Password</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                placeholder="New password"
                autoComplete="new-password"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-700 hover:text-gray-900"
              >
                {showNewPassword ? <EyeClosedIcon /> : <Eye />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
          </div>

          <div>
            <label>Confirm New Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                value={confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded px-3 py-2 pr-10 outline focus:outline-none focus:ring-2 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-700 hover:text-gray-900"
              >
                {showConfirmPassword ? <EyeClosedIcon /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {errors.formError && <p className="text-red-500 text-sm">{errors.formError}</p>}

          <DialogFooter className="flex flex-col gap-2 mt-8">
            <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
            className="w-full text-md flex-1 cursor-pointer"
            >
            Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={
                loading ||
                Boolean(errors.currentPassword) ||
                Boolean(errors.newPassword) ||
                Boolean(errors.confirmPassword)
              }
              className="w-full flex-1 justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  Changing
                  <Loader className="animate-spin ml-2" />
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