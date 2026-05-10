"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { FavoriteSpotContextProps } from "@/types/favoriteSpotContext";
import { SpotSource } from "@/types/spot";
import { fetchAuthSession } from "aws-amplify/auth";
import { ENV } from "@/config/env";

const FavoriteContext = createContext<FavoriteSpotContextProps | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode}) => {
    const [favorites, setFavorites] = useState<SpotSource[]>([]);
    const [ favSpotIds, setFavSpotIds ] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) return;

      const API_GW_URL = `${ENV.API_BASE_URL}/spot/fav`;
      const response = await fetch(API_GW_URL, {
        headers: { 
          "Authorization": `Bearer ${idToken}`,
          "x-api-key": ENV.API_KEY,
         },
      });

      if (response.ok) {
        const data = await response.json();
        const formatted = data.favorites.map((s: SpotSource) => ({
          ...s,
          spot_id: s.spot_id || (s.PK ? s.PK.replace("SPOT#", "") : "")
        }));
        
        setFavorites(formatted);
        setFavSpotIds(new Set(formatted.map((s: SpotSource) => s.spot_id)));
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      alert("Oops! We couldn't load your favorites right now. Give it a quick refresh?");
    } finally {
      setIsLoading(false);
    }
  }, []);

    const toggleFavState = useCallback((spot: SpotSource, isFav: boolean) => {
        setFavSpotIds((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(spot.spot_id);
        else next.delete(spot.spot_id);
        return next;
        });

        setFavorites((prev) => {
            if (isFav) {
                return prev.some(s => s.spot_id === spot.spot_id) ? prev : [...prev, spot];
            } else {
                return prev.filter((s) => s.spot_id !== spot.spot_id);
            }
            });
        }, []);

    return (
        <FavoriteContext.Provider value={{ favorites, favSpotIds, isLoading, fetchFavorites, toggleFavState }}>
            { children }           
        </FavoriteContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoriteContext);
    if (!context) throw new Error("useFavorites must be used within FavoriteProvider");
    return context;
};