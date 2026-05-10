"use client";

import { useEffect } from "react";
import { useToken } from "./tokenContext";
import { useAuth } from "@/hooks/Auth";

export function RemainingTokenClient() {
  const { free, paid, is_unlimited, unlimited_until, loading } = useToken();
  const { user } = useAuth();

  useEffect(() => {
    console.log("Context updated in Badge:", { is_unlimited, free, paid });
  }, [is_unlimited, free, paid]);

  if (!user) {
    return (
    <div className="mt-2 py-3 px-4 bg-gray-50 rounded-xl border border-stone-200 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px]">🔒</span> 
        <span className="text-[10px] text-stone-600 font-black uppercase tracking-widest">
          Token Status
        </span>
      </div>
      <p className="text-[11px] font-bold text-stone-400 leading-tight">
        Login required to sync your token balance.
      </p>
    </div>
  );
  }

  if (loading && !is_unlimited && free === 0 && paid === 0) {
    return <div className="ml-2 text-xs animate-pulse">Checking...</div>;
  }

  if (is_unlimited && unlimited_until) {
    const expiryDate = new Date(unlimited_until).toLocaleDateString("en-US");

    return (
      <div className="flex flex-col gap-2 ml-1 mt-2">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1.5 rounded-lg shadow-sm border border-green-200">
            <span className="text-lg">🚀</span>
          </div>
          <div>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none">
              Status
            </p>
            <p className="text-base font-black text-green-700 leading-tight">
              Unlimited
            </p>
          </div>
        </div>
        <div className="flex">
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-100">
            <span className="text-[10px] font-bold text-green-600">
              Ends: {expiryDate}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 ml-1 mt-2">
      <div className="flex items-center gap-2">
        <div className="bg-amber-100 p-1.5 rounded-lg shadow-sm">
          <span className="text-lg">🪙</span>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">
            Balance
          </p>
          <p className="text-lg font-black text-gray-800 leading-tight">
            {free + paid}{" "}
            <span className="text-xs font-medium text-gray-500">tokens</span>
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
          <span className="text-[10px] font-bold text-gray-500">
            Free: {free}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
          <span className="text-[10px] font-bold text-gray-500">
            Paid: {paid}
          </span>
        </div>
      </div>
    </div>
  );
}
