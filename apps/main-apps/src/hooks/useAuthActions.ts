"use client";

import { useRouter } from "next/navigation";
import { signOut, fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { ENV } from "@/config/env";

export const useAuthActions = () => {
  const router = useRouter();

  const handleLogin = () => {
    const currentUrl = window.location.href;
    router.push(
      `${ENV.PROD_URL}/auth-callback?return_to=${encodeURIComponent(currentUrl)}`,
    );
  };

  const refreshAuthStatus = async () => {
    try {
      await fetchAuthSession({ forceRefresh: true });
      const attributes = await fetchUserAttributes();

      return attributes;
    } catch (error) {
      console.error("Auth refresh error:", error);
      return null;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return { handleLogin, handleLogout, refreshAuthStatus };
};
