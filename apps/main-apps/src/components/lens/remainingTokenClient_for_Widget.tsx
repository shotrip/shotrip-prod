"use client";

import { useAuth } from "@/hooks/Auth";
import { useToken } from "./tokenContext";

export function RemainingTokenClient_for_Widget() {
  const { free, paid, is_unlimited } = useToken();
  const { user } = useAuth();

  if (!user) {
  return (
    <div className="flex px-4">
      <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200 opacity-60">
        <span className="text-[10px]">🔒</span>
        <span className="text-[9px] font-black text-stone-600 uppercase tracking-tight">
          Locked
        </span>
      </div>
    </div>
  );
}

  if (is_unlimited) {
    return (
      <div className="flex flex-col items-end px-4">
        <div className="flex items-center gap-1.5 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 shadow-sm">
          <span className="text-[10px]">🚀</span>
          <span className="text-[10px] font-black text-green-700 uppercase tracking-tighter">
            Unlimited
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex px-4">
      <div className="flex items-center gap-2 bg-amber-100 px-2.5 py-1 rounded-full shadow-sm border border-amber-100">
        <span className="text-[13px]">🪙</span>
        
        <div className="flex items-center gap-1.5 text-gray-500 font-black text-[10px] whitespace-nowrap">
          <div className="flex items-center gap-0.5">
            <span className="opacity-80 text-[10px]">F{""}</span>
            <span>{free}</span>
          </div>
          <span className="opacity-40">|</span>
          <div className="flex items-center gap-0.5">
            <span className="opacity-80 text-[10px]">P{""}</span>
            <span>{paid}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
