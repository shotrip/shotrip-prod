"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import {
  Settings,
  CreditCard,
  LogOut,
  ChevronDown,
  User,
  Heart,
  ChevronLeft,
} from "lucide-react";
import ProfileUpdateModal from "./profileUpdateModal";
import { UserMenuProps } from "@/types/userMenu";
import { useFavorites } from "./favoriteSpotContext";
import { openSpotDetail } from "@/types/spotEvent";
import DeleteAccountModal from "./deleteAccountModal";
import Link from "next/link";

export default function UserMenu({ profile, onProfileUpdate }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const { handleLogout } = useAuthActions();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const pathname = usePathname();

  const isStampSubPage =
    pathname.startsWith("/stamp/") && pathname !== "/stamp";

  const { favorites, fetchFavorites, isLoading } = useFavorites();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFavs(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFavMouseEnter = () => {
    setShowFavs(true);
    fetchFavorites();
  };

  return (
    <div className="relative z-1001" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-stone-100 
                   transition-all duration-200 border border-stone-200 shadow-sm bg-white active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-white text-xs font-bold shadow-inner">
          {profile?.nickname?.[0]?.toUpperCase() || (
            <User className="w-4 h-4" />
          )}
        </div>
        <span className="text-xs font-bold text-stone-700 max-w-20 truncate">
          {profile?.nickname || "Loading..."}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-stone-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-stone-200 rounded-2xl shadow-xl z-1010 py-1 animate-in fade-in zoom-in duration-200">
          <div className="px-4 py-3 border-b border-stone-50">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-0.5">
              Member
            </p>
            <p className="text-sm font-black text-stone-800 truncate">
              {profile
                ? `${profile.nickname} ${profile.honorific}`
                : "Loading..."}
            </p>
            {profile?.age && (
              <p className="text-[9px] text-stone-400 font-medium">
                {profile.age}
              </p>
            )}
          </div>

          <div className="p-1">
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs mb-1 font-medium text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-stone-400" /> Profile Update
            </button>

            <div className="relative group">
              <button
                onMouseEnter={handleFavMouseEnter}
                className="w-full flex items-center justify-between px-3 py-2 text-xs mb-1 font-medium text-stone-600 hover:bg-stone-50 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart
                    className={`w-4 h-4 ${favorites.length > 0 ? "text-rose-400 fill-rose-400" : "text-stone-400"}`}
                  />
                  Your Favorites
                </div>
                <ChevronLeft className="w-3 h-3 text-stone-300" />
              </button>

              {showFavs && (
                <div
                  className="absolute right-full top-0 mr-2 w-48 bg-white border border-stone-200 rounded-2xl shadow-2xl py-2 animate-in slide-in-from-right-2 duration-200 overflow-hidden"
                  onMouseLeave={() => setShowFavs(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-50 bg-stone-50/50">
                    <p className="text-[9px] text-stone-400 font-black uppercase tracking-widest">
                      Favorites ({favorites.length})
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-1 scrollbar-hide">
                    {isLoading ? (
                      <div className="p-4 text-center text-[10px] text-stone-300">
                        Loading...
                      </div>
                    ) : favorites.length === 0 ? (
                      <div className="p-6 text-center text-[10px] text-stone-400 italic">
                        No spots saved
                      </div>
                    ) : (
                      favorites.map((spot) => (
                        <button
                          key={spot.spot_id}
                          onClick={() => openSpotDetail(spot)}
                          className="w-full p-1.5 flex items-center gap-2.5 hover:bg-stone-50 rounded-xl transition-colors group/item text-left"
                        >
                          <img
                            src={spot.image_url}
                            className="w-8 h-8 rounded-lg object-cover border border-stone-100 shrink-0"
                            alt=""
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[8px] font-bold text-blue-500 truncate leading-tight">
                              {spot.city}
                            </p>
                            <p className="text-[10px] font-black text-stone-700 truncate leading-tight">
                              {spot.name}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/lens#token"
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-50 rounded-xl transition-colors"
            >
              <CreditCard className="w-4 h-4 text-stone-400" /> Charge Token
            </Link>
          </div>
          {isModalOpen && profile && (
            <ProfileUpdateModal
              profile={profile}
              onClose={() => setIsModalOpen(false)}
              onProfileUpdate={onProfileUpdate}
            />
          )}

          <div className="border-t border-stone-50 p-1 mt-1">
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs mb-1 font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <User className="w-4 h-4" /> Delete Account
            </button>
            <button
              onClick={handleLogout}
              disabled={isStampSubPage}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-xl transition-all
                ${
                  isStampSubPage
                    ? "opacity-30 cursor-not-allowed text-stone-400"
                    : "text-red-500 hover:bg-red-50 active:scale-95"
                }`}
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            {isStampSubPage && (
              <p className="px-3 py-1 text-[8px] text-brand-red-light leading-tight">
                *You cannot logout while in stamp route page.
              </p>
            )}
          </div>

          {isDeleteModalOpen && (
            <DeleteAccountModal onClose={() => setIsDeleteModalOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
}
