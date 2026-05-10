"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/Auth";
import { useAuthActions } from "@/hooks/useAuthActions";
import { fetchAuthSession } from "aws-amplify/auth";
import UserMenu from "./userMenu";
import { UserProfileProps } from "@/types/userProfile";
import { ENV } from "@/config/env";

export default function Auth_MenuButton() {
  const { user, loading } = useAuth();
  const { handleLogin } = useAuthActions();
  const [profile, setProfile] = useState<UserProfileProps | null>(null);
  const [fetching, setFetching] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setFetching(true);
    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      const idToken = session.tokens?.idToken?.toString();

      const response = await fetch(
        `${ENV.API_BASE_URL}/user/me`,
        {
          headers: { 
            Authorization: `Bearer ${idToken}`,
            "x-api-key": ENV.API_KEY,
           },
          cache: "no-store",
        },
      );

      if (response.ok) {
        const data: UserProfileProps = await response.json();
        console.log("Profile Refetched:", data);
        setProfile({ ...data });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      alert("Oops! We're having trouble loading your profile. Please try refreshing the page.");
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();

    const handleUpdateEvent = () => {
      console.log("Detected profileUpdated event - Refreshing Header...");
      fetchProfile();
    };

    window.addEventListener("profileUpdated", handleUpdateEvent);
    return () => {
      window.removeEventListener("profileUpdated", handleUpdateEvent);
    };
  }, [fetchProfile]);

  if (loading || (user && fetching)) {
    return (
      <div className="flex items-center justify-center w-24 h-9 bg-stone-50 rounded-full border border-stone-100">
        <div className="flex gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <UserMenu
        profile={profile}
        onProfileUpdate={(data) => setProfile(data)}
      />
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="relative px-6 py-2 text-sm tracking-widest transition-all duration-200 ease-in-out
                 rounded-full font-medium overflow-hidden text-stone-800 hover:text-stone-100
                bg-stone-50/50 hover:bg-stone-400 shadow-sm active:scale-95"
    >
      <span className="relative flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-800 hover:bg-stone-100" />
        Login
      </span>
      <div className="absolute inset-0 opacity-0 hover:opacity-100 bg-white/20 transition-opacity duration-500" />
    </button>
  );
}
