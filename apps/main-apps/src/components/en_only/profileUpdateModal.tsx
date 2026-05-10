"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData, profileSchema } from "@/lib/constraints/profileData";
import { ChevronDown, X } from "lucide-react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { ProfileUpdateModalProps } from "@/types/profileUpdateModal";
import { ENV } from "@/config/env";

export default function ProfileUpdateModal({
  profile,
  onClose,
  onProfileUpdate,
}: ProfileUpdateModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      nickname: profile.nickname || "",
      honorific: profile.honorific || "",
      nationality: profile.nationality || "",
      age: profile.age || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      const userAttrs = await fetchUserAttributes();

      const response = await fetch(
        `${ENV.API_BASE_URL}/user/profile-update`,
        {
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
        },
      );

      if (response.ok) {
        onProfileUpdate({ ...profile, ...data });
        window.dispatchEvent(new Event("profileUpdated"));
        onClose();
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Oops! Profile Update failed. Cloud you please try again?");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = "w-full rounded-xl border p-3 text-sm outline-none transition-all";
  const inputNormal = "border-stone-200 bg-stone-50 focus:border-stone-800 focus:bg-white text-black";
  const inputError = "border-red-500 bg-red-50 focus:border-red-600 text-black";
  const errorText = "mt-1 text-[10px] font-bold text-red-500 tracking-wide";

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 transition-colors"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="mb-6 text-xl font-black text-stone-800">
          Profile Update
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Nickname */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
              Nickname
            </label>
            <input
              {...register("nickname")}
              className={`${inputBase} ${errors.nickname ? inputError : inputNormal}`}
            />
            {errors.nickname && <p className={errorText}>{errors.nickname.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                Title
              </label>
              <div className="relative">
                <select
                  {...register("honorific")}
                  className={`${inputBase} ${errors.honorific ? inputError : inputNormal} appearance-none`}
                >
                  <option value="">Select...</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Sr.">Sir.</option>
                  <option value="Jr.">Jr.</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
              {errors.honorific && <p className={errorText}>{errors.honorific.message}</p>}
            </div>

            {/* Age Group */}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                Age Group
              </label>
              <div className="relative">
                <select
                  {...register("age")}
                  className={`${inputBase} ${errors.age ? inputError : inputNormal} appearance-none`}
                >
                  <option value="">Select...</option>
                  <option value="10s">10s</option>
                  <option value="20s">20s</option>
                  <option value="30s">30s</option>
                  <option value="40s">40s</option>
                  <option value="50s+">50s+</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              </div>
              {errors.age && <p className={errorText}>{errors.age.message}</p>}
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
              Nationality
            </label>
            <input
              {...register("nationality")}
              className={`${inputBase} ${errors.nationality ? inputError : inputNormal}`}
            />
            {errors.nationality && <p className={errorText}>{errors.nationality.message}</p>}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full rounded-xl bg-stone-800 py-4 font-bold text-white transition-all hover:bg-black disabled:bg-stone-200 disabled:cursor-not-allowed shadow-lg shadow-stone-200 mt-2"
          >
            {loading ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
