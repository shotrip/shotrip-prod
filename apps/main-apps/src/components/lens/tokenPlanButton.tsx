"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/Auth";
import { TokenPlanButtonProps } from "@/types/tokenPlanButton";

export default function TokenPlanButton({ product, label }: TokenPlanButtonProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="w-full h-10 bg-gray-100 animate-pulse rounded-lg" />;
    }

    if (!user) {
    return (
      <div className="space-y-2">
        <button
          disabled
          className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg cursor-not-allowed font-medium"
        >
          Login Required
        </button>
        <p className="text-[10px] text-gray-400">
          Please login to charge Tokens!
        </p>
      </div>
    );
  }

  return (
    <Link
      href={`/payment-hub?product=${product}`}
      className="block w-full bg-black text-white py-2 rounded-lg hover:opacity-80 transition text-center font-medium"
    >
      {label}
    </Link>
  );
}
