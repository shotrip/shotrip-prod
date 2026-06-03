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
      await signOut({ global: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("CognitoIdentityServiceProvider.")) {
          localStorage.removeItem(key);
        }
      });
      window.location.href = "/";
    }
  };
  return { handleLogin, handleLogout, refreshAuthStatus };
};
