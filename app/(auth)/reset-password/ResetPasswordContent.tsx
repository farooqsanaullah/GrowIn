"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import { jwtDecode } from "jwt-decode";

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isOpen, setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const showErrorAndRedirect = useCallback((msg: string) => {
    setErrorMsg(msg);
    setIsOpen(false);
    setTimeout(() => router.push("/signin"), 3000);
  }, [router]);

  useEffect(() => {
    if (!token) return showErrorAndRedirect("Invalid or missing password reset link.");

    try {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const timeLeft = decodedToken.exp * 1000 - Date.now();

      if (timeLeft <= 0) return showErrorAndRedirect("Password reset link has expired.");

      // Token valid → open modal
      setIsOpen(true);

      const timer = setTimeout(() => showErrorAndRedirect("Password reset link has expired."), timeLeft);
      return () => clearTimeout(timer);
    } catch (err: any) {
      showErrorAndRedirect("Invalid password reset token.");
    }
  }, [token, showErrorAndRedirect]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    router.push("/signin");
  }, [router]);

  return (
    <div>
      {errorMsg && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <p className="font-medium">{errorMsg}</p>
          </div>
        </div>
      )}

      <ChangePasswordModal
        isOpen={isOpen}
        onClose={handleClose}
        isForgotPasswordFlow={true}
        token={token}
      />
    </div>
  );
}
