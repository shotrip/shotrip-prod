"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchAuthSession, signInWithRedirect, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { ENV } from "@/config/env";

function AuthCallbackHandler() {
  const searchParams = useSearchParams();
  const [isAmplifyReady, setIsAmplifyReady] = useState(false);
  const isExecuted = useRef(false);

  useEffect(() => {
    const checkConfig = () => {
      const timer = setTimeout(() => setIsAmplifyReady(true), 500);
      return () => clearTimeout(timer);
    };
    checkConfig();
  }, []);

  useEffect(() => {
    if (!isAmplifyReady || isExecuted.current) return;

    const handleAuth = async () => {
      isExecuted.current = true;

      try {
        const session = await fetchAuthSession({ forceRefresh: true });
        const returnTo = localStorage.getItem("return_to");
        console.log("Auth session established");

        if (session.tokens) {
          await fetchUserAttributes();
          const idToken = session.tokens.idToken?.toString();
          if (idToken) {
            const isExternal = returnTo && !returnTo.startsWith(window.location.origin) && !returnTo.startsWith("/");
            if (isExternal) {
              localStorage.setItem("widget_id_token", idToken);
            } else {
              localStorage.removeItem("widget_id_token");
            }
          }

          localStorage.removeItem("return_to");
          
          const targetUrl = returnTo || `${ENV.SITE_URL}`;
          const url = new URL(targetUrl);

          
          window.location.replace(url.toString());
          
        } else if (searchParams.has("code")) {
          const unsubscribe = Hub.listen("auth", ({ payload }) => {
            if (payload.event === "signedIn") {
              window.location.reload();
            }
          });

          return () => unsubscribe();
        } else {
          const returnToParam = searchParams.get("return_to");
          if (returnToParam) {
            localStorage.setItem("return_to", returnToParam);
          }
          await signInWithRedirect({
            provider: "Google",
            options: { preferPrivateSession: true }
          });
        }
      } catch (error: unknown) {
        console.error("Auth process error:", error);
        alert("Oops! Something went wrong. My bad!");
        window.location.replace("/");
      }
    };

    handleAuth();
  }, [isAmplifyReady, searchParams]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white gap-4">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-stone-800" />
      <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">
        {isAmplifyReady ? "Verifying Session" : "Initializing Amplify"}
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-white gap-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-stone-800" />
        <p className="text-[10px] tracking-[0.2em] text-stone-400 uppercase">Loading Auth...</p>
      </div>
    }>
      <AuthCallbackHandler />
    </Suspense>
  );
}