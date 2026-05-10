"use client";
/* eslint-disable @next/next/no-img-element */

import { CheckPoint } from "@/types/checkPoint";
import { useState } from "react";
import { getDistance } from "@/lib/utils/geolocation";
import { Lock, MapPin } from "lucide-react";

export default function CheckPointCard({
  checkpoint,
  isStamped,
  isLocked,
  onStampComplete,
  onThumbnailClick,
}: {
  checkpoint: CheckPoint;
  isStamped: boolean;
  isLocked: boolean;
  onStampComplete: () => void;
  onThumbnailClick: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStampClick = () => {
    if (isLocked || isStamped || isLoading) return;

    if (!navigator.geolocation) {
      setErrorMessage("GPS is not available on your browser.");
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const distance = getDistance(
          latitude,
          longitude,
          checkpoint.lat,
          checkpoint.lng,
        );

        const ALLOWED_DISTANCE = 100;

        if (distance <= ALLOWED_DISTANCE) {
          setErrorMessage(null);

          if (typeof window !== "undefined" && window.navigator.vibrate) {
            window.navigator.vibrate([100, 50, 100]);
          }

          onStampComplete();
        } else {
          const roundedDist = Math.round(distance - ALLOWED_DISTANCE);
          setErrorMessage(
            `Too far away! You need to move ${roundedDist}m closer.`,
          );
        }
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed:", error);
        setErrorMessage("Please enable GPS to stamp.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className={`group relative transition-all duration-500 rounded-[2.5rem] p-5 flex flex-col border ${
        isLocked ? "bg-transparent border-stone-100 opacity-60" : 
        isStamped ? "bg-white border-stone-200 shadow-sm" : 
        "bg-white border-transparent shadow-xl shadow-stone-200/40 hover:shadow-2xl hover:-translate-y-1"
      }`}>
      
      <div className="flex items-center gap-5 w-full">
        {/* Thumbnail */}
        <div onClick={onThumbnailClick} className="relative shrink-0 w-24 h-24 rounded-3xl overflow-hidden cursor-pointer shadow-inner bg-stone-100">
          <img 
            src={checkpoint.thumbnail_url} 
            alt="" 
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isStamped ? "grayscale-[0.4] opacity-50" : ""}`} 
          />
          {isLocked && (
            <div className="absolute inset-0 bg-stone-200/30 backdrop-blur-[1px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-stone-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-black text-[11px] uppercase tracking-[0.15em] mb-1.5 ${isLocked ? "text-stone-400" : "text-stone-900"}`}>
            {checkpoint.name}
          </h3>
          <p className={`text-xs font-medium leading-relaxed line-clamp-2 ${isLocked ? "text-stone-300" : "text-stone-500"}`}>
            {isLocked ? "Complete previous spots to unlock this location." : checkpoint.excerpt}
          </p>
        </div>

        {/* Action Area */}
        <div className="relative shrink-0 w-20 h-20 flex items-center justify-center">
          {!isLocked && (
            <button
              onClick={handleStampClick}
              disabled={isStamped || isLoading}
              className={`w-16 h-16 rounded-3xl font-black text-[10px] uppercase tracking-tighter transition-all duration-300 active:scale-90 ${
                isStamped ? "bg-stone-50 text-stone-200 border border-stone-50" : 
                isLoading ? "bg-stone-800 text-white animate-pulse" : 
                "bg-red-500 text-white shadow-lg shadow-red-200 hover:bg-red-600"
              }`}
            >
              {isLoading ? "..." : isStamped ? "" : "Stamp"}
            </button>
          )}

          {isStamped && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-20 h-20 border-[3px] border-[#b14b28]/80 rounded-sm bg-white/10 backdrop-blur-[0.5px] shadow-sm animate-stamp">
                <img 
                  src={checkpoint.stamp_url} 
                  alt="stamp"
                  className="w-full h-full object-contain p-1 filter sepia brightness-90 contrast-125"
                  style={{ mixBlendMode: 'multiply' }} 
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-[#b14b28] text-white text-[10px] px-2 py-0.5 font-bold rotate-[-10deg] shadow-sm">済</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {errorMessage && !isStamped && (
        <div className="mt-4 pt-3 border-t border-red-50 w-full animate-in slide-in-from-top-1">
          <div className="flex items-center justify-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50/50 py-2 rounded-xl">
            <MapPin size={12} className="animate-bounce" />
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
}
