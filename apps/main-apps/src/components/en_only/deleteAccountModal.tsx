"use client";

import { useState } from "react";
import { AlertTriangle, X, CheckCircle2, Loader2 } from "lucide-react";
import { DeleteAccountModalProps } from "@/types/deleteAccountModal";
import { fetchAuthSession } from "aws-amplify/auth";
import { ENV } from "@/config/env";
import Link from "next/link";

export default function DeleteAccountModal({
  onClose,
}: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) throw new Error("Authentication token not found");
      const headers = { Authorization: `Bearer ${idToken}`, "x-api-key": ENV.API_KEY };
      const sub = session.tokens?.idToken?.payload?.sub;

      const res1 = await fetch(
        `${ENV.API_BASE_URL}/user/me/delete`,
        {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: sub }),
        },
      );
      if (!res1.ok) throw new Error("Failed to update user flag");

      const res2 = await fetch(
        `${ENV.API_BASE_URL}/stamp/user/delete`,
        {
          method: "DELETE",
          headers,
        },
      );
      if (!res2.ok) throw new Error("Failed to clean database");

      const res3 = await fetch(
        `${ENV.API_BASE_URL}/user/me/delete`,
        {
          method: "DELETE",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: sub }),
        },
      );
      if (!res3.ok) throw new Error("Failed to delete Cognito account.");

      localStorage.clear();
      setIsDeleted(true);

    } catch (err) {
      console.error("An error occured during deleting:", err);
      setError("Oops! We hit a snag while deleting your account. Please try again, or contact us if the issue persists.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        {!isDeleted ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-50 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-stone-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-lg font-black text-stone-800 mb-2">
              Delete Account
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Are you sure? This action is permanent.
            </p>
            {error && <p className="text-xs text-red-600 mb-4">{error}</p>}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Yes, Delete Permanently"
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-black text-stone-800 mb-2">
              Deleted Successfully
            </h2>
            <p className="text-xs text-stone-500 mb-6">
              Thank you for using our service.
            </p>
            <Link
              href={ENV.PROD_URL}
              className="block w-full py-3 bg-stone-800 text-white text-xs font-bold rounded-xl"
            >
              Return to Top
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
