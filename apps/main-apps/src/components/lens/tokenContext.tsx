"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { TokenContextProps, Tokens } from "@/types/tokenContext";
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuth } from "@/hooks/Auth";
import { ENV } from "@/config/env";

const TokenContext = createContext<(TokenContextProps & { setTokens: React.Dispatch<React.SetStateAction<Tokens>> }) | null>(null);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<Tokens>({
    free: 0,
    paid: 0,
    is_unlimited: false,
    unlimited_until: null,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTokens = useCallback(async () => {
    if (!user) return;
    if (!tokens.is_unlimited) setLoading(true);

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const API_GW_URL =
        `${ENV.API_BASE_URL}/user/tokens`;
      const response = await fetch(API_GW_URL, {
        headers: { 
          Authorization: `Bearer ${idToken}`,
          "x-api-key": ENV.API_KEY,
         },
      });

      if (response.ok) {
        const data = await response.json();
        setTokens({
          free: data.free,
          paid: data.paid,
          is_unlimited: data.is_unlimited,
          unlimited_until: data.unlimited_until,
        });
      }
    } catch (error) {
      console.error("Fetch tokens failed:", error);
      alert("Oops! We're having trouble checking your token balance right now. To avoid any billing errors, please wait a moment or try refreshing the page before making a purchase.");
    } finally {
      setLoading(false);
    }
  }, [user, tokens.is_unlimited]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  const isDepleted = useMemo(() => 
  !loading && !tokens.is_unlimited && tokens.free === 0 && tokens.paid === 0
  , [loading, tokens.is_unlimited, tokens.free, tokens.paid]);

  const value = useMemo(
    () => ({
      ...tokens,
      setTokens,
      isDepleted,
      loading,  
    }),
    [tokens, isDepleted, loading],
  );

  return (
    <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useToken must be used within TokenProvider");
  }
  return context;
}
