"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { OPEN_SPOT_MODAL } from "@/types/spotEvent";
import { SpotSource } from "@/types/spot";
import { fetchAuthSession } from "aws-amplify/auth";
import { useFavorites } from "./favoriteSpotContext";
import { Heart, X } from "lucide-react";
import { ENV } from "@/config/env";
import Link from "next/link";

export default function SpotModal() {
  const [ spot, setSpot ] = useState<SpotSource | null>(null);
  const { favSpotIds, toggleFavState } = useFavorites();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isFav = spot ? favSpotIds.has(spot.spot_id) : false;

  useEffect(() => {
    const handleOpen = (e: WindowEventMap[typeof OPEN_SPOT_MODAL]) => {
      setSpot(e.detail);
    };

    window.addEventListener(OPEN_SPOT_MODAL, handleOpen);
    return () => window.removeEventListener(OPEN_SPOT_MODAL, handleOpen);
  }, []);

  const handleFavClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!spot || isLoading) return;

    const nextStatus = !isFav;
    setIsLoading(true);
    toggleFavState(spot, nextStatus);

    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) throw new Error("No token");

      const API_GW_URL = `${ENV.API_BASE_URL}/spot/fav`;

      const response = await fetch(API_GW_URL, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
          "x-api-key": ENV.API_KEY,
        },
        body: JSON.stringify({
          spot_id: spot.spot_id,
          is_fav: nextStatus,
        }),
      });

      if (!response.ok) throw new Error("Failed to sync favorite");
    } catch (error) {
      toggleFavState(spot, !nextStatus);
      console.error("Fav sync error:", error);
      alert("Oops! We couldn't update your favorites list this time. Could you try again in a moment?");
    } finally {
      setIsLoading(false);
    }
  };

  if (!spot) return null;

return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={() => setSpot(null)}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-4xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="relative h-75 w-full bg-gray-100">
          {spot.image_url ? (
            <img src={spot.image_url} alt={spot.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
          )}
          <div className="absolute top-6 right-6 flex gap-3">
            <button
              onClick={handleFavClick}
              disabled={isLoading}
              className={`w-12 h-12 backdrop-blur-md rounded-full flex items-center justify-center transition-all active:scale-75 shadow-lg ${
                isFav 
                  ? "bg-white text-rose-500" 
                  : "bg-black/20 text-white hover:bg-black/40"
              }`}
            >
              <Heart 
                className={`w-6 h-6 transition-colors ${isFav ? "fill-rose-500" : ""}`} 
              />
            </button>
            <button
              onClick={() => setSpot(null)}
              className="w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-700 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {spot.prefecture}
            </span>
            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {spot.city}
            </span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">{spot.name}</h2>

          <div className="text-gray-600 leading-relaxed mb-8">
            <p className="whitespace-pre-wrap text-base font-medium">{spot.short_description}</p>
          </div>

          <div className="flex gap-4 border-t border-gray-100 pt-8">
            {spot.map_url && (
              <Link
                href={spot.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <span>📍</span> View on Maps
              </Link>
            )}
            <button
              className="px-8 py-4 bg-gray-100 text-gray-900 rounded-2xl font-black hover:bg-gray-200 transition active:scale-95"
              onClick={() => setSpot(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
