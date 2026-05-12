"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData, profileSchema } from "@/lib/constraints/profileData";
import { ProfileRegistrationModalStep } from "@/types/profileRegistrationModal";
import {
  fetchAuthSession,
  fetchUserAttributes,
  updateUserAttributes,
} from "aws-amplify/auth";
import { ENV } from "@/config/env";

export const ProfileRegistrationModal = () => {
  const [modalStep, setModalStep] = useState<ProfileRegistrationModalStep>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const session = await fetchAuthSession();
        if (!session.tokens?.idToken) {
          return;
        }

        const attrs = await fetchUserAttributes();
        if (
          !attrs["custom:display_name"] ||
          !attrs["custom:nationality"] ||
          !attrs["custom:honorific"] ||
          !attrs["custom:age"]
        ) {
          setModalStep("form");
        }
      } catch (error) {
        console.error("User is not authenticated:", error);
      }
    };
    checkProfile();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);

    try {
      await updateUserAttributes({
        userAttributes: {
          "custom:display_name": data.nickname,
          "custom:nationality": data.nationality,
          "custom:honorific": data.honorific,
          "custom:age": data.age,
        },
      });

      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const userAttrs = await fetchUserAttributes();

      const API_GW_URL =
        `${ENV.API_BASE_URL}/user/profile-update`;

      const response = await fetch(API_GW_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
          "x-api-key": ENV.API_KEY,
        },
        body: JSON.stringify({
          user_id: userAttrs.sub,
          nickname: data.nickname,
          nationality: data.nationality,
          honorific: data.honorific,
          age: data.age,
        }),
      });

      if (!response.ok) throw new Error("API sync failed");

      window.dispatchEvent(new Event("profileUpdated"));

      setModalStep("welcome");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Oops! Registration failed. Cloud you please try again?");
    } finally {
      setLoading(false);
    }
  };

  if (!modalStep) return null;

  const inputBase = "w-full rounded-xl border p-3.5 text-sm outline-none transition-all";
  const inputNormal = "border-stone-200 bg-stone-50 focus:border-stone-800 focus:bg-white";
  const inputError = "border-red-500 bg-red-50 focus:border-red-600";

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4">
      {modalStep === "form" ? (
        <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-stone-800 tracking-tight">Welcome to Shotrip</h2>
            <p className="text-sm text-stone-400 mt-1">Please set up your profile to continue.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">Nickname</label>
              <input
                {...register("nickname")}
                placeholder="Your name"
                className={`${inputBase} ${errors.nickname ? inputError : inputNormal}`}
              />
              {errors.nickname && <p className="mt-1 text-[10px] font-bold text-red-500 tracking-wide">{errors.nickname.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">Title</label>
                <select {...register("honorific")} className={`${inputBase} ${errors.honorific ? inputError : inputNormal}`}>
                  <option value="">Select...</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Sr.">Sir.</option>
                  <option value="Jr.">Jr.</option>
                </select>
                {errors.honorific && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.honorific.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">Age</label>
                <select {...register("age")} className={`${inputBase} ${errors.age ? inputError : inputNormal}`}>
                  <option value="">Select...</option>
                  <option value="10s">10s</option>
                  <option value="20s">20s</option>
                  <option value="30s">30s</option>
                  <option value="40s">40s</option>
                  <option value="50s+">50s+</option>
                </select>
                {errors.age && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.age.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">Nationality</label>
              <input
                {...register("nationality")}
                placeholder="e.g. Japan"
                className={`${inputBase} ${errors.nationality ? inputError : inputNormal}`}
              />
              {errors.nationality && <p className="mt-1 text-[10px] font-bold text-red-500">{errors.nationality.message}</p>}
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full rounded-xl bg-stone-800 py-4 font-bold text-white transition-all hover:bg-black disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed shadow-xl shadow-stone-200 mt-4"
            >
              {loading ? "Creating..." : "Start Journey"}
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-sm rounded-3xl bg-white p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-stone-800">Welcome!</h2>
          <p className="text-stone-500 mt-2 mb-8">Your profile is ready. Let&apos;s start your journey!</p>
          <button
            onClick={() => {
              setModalStep(null);
              window.dispatchEvent(new Event("profileUpdated"));
            }}
            className="w-full rounded-xl bg-stone-800 py-4 font-bold text-white hover:bg-black transition-all"
          >
            Enjoy Shotrip!
          </button>
        </div>
      )}
    </div>
  );
};
