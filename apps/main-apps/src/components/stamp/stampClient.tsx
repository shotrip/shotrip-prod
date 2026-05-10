"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import CheckPointCard from "./checkPointCard";
import CheckPointModal from "./checkPointModal";
import { CheckPoint } from "@/types/checkPoint";
import {
  fetchCheckpoints,
  fetchRoutes,
  fetchRouteStart,
  postCheckIn,
} from "@/lib/utils/stampApi";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import CompleteModal from "./completeModal";
import { Routes } from "@/types/route";
import { Reward } from "@/types/stampReward";
import { Lock, MapPin, Flag, Check, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function StampClient({ routeKey }: { routeKey: string }) {
  const [reward, setReward] = useState<Reward | null>(null);
  const [checkpoints, setCheckpoints] = useState<CheckPoint[]>([]);
  const [routeLabel, setRouteLabel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [selectedCheckPoint, setSelectedCheckPoint] =
    useState<CheckPoint | null>(null);
  const [stampedIds, setStampedIds] = useState<string[]>([]);
  const [hasClosedModal, setHasClosedModal] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const { width } = useWindowSize();
  const [documentHeight, setDocumentHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [routesData, responseData]: [
          Routes[],
          {
            is_started: boolean;
            status: string;
            stamped_ids: string[];
            checkpoints: CheckPoint[];
          },
        ] = await Promise.all([fetchRoutes(), fetchCheckpoints(routeKey)]);

        const currentRoute = routesData.find((r) => r.key === routeKey);
        console.log("DEBUG: Checkpoints data from API:", currentRoute);
        setRouteLabel(currentRoute?.label || "Route");

        setIsStarted(responseData.is_started);
        setStampedIds(responseData.stamped_ids);
        setCheckpoints(responseData.checkpoints);
      } catch (err) {
        console.error("Failed to load route data:", err);
        alert(
          "Oops! We're having trouble loading the stamp rally route. It might be a network hiccup, please try refreshing the page!",
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [routeKey]);

  const isAllCompleted = useMemo(() => {
    return stampedIds.length === checkpoints.length && checkpoints.length > 0;
  }, [stampedIds, checkpoints]);

  const progressPercentage = useMemo(() => {
    return (stampedIds.length / checkpoints.length) * 100;
  }, [stampedIds, checkpoints]);

  const sorted = useMemo(
    () => [...checkpoints].sort((a, b) => a.order - b.order),
    [checkpoints],
  );

  const handleStartRoute = async () => {
    try {
      await fetchRouteStart(routeKey);
      setIsStarted(true);
    } catch (err) {
      console.error("Failed to start:", err);
      alert(
        "Oops! We had a little trouble starting this route. Could you give it one more tap?",
      );
    }
  };

  const handleStampComplete = async (id: string) => {
    try {
      const result = await postCheckIn(routeKey, id);

      setStampedIds(result.stamped_ids);

      if (result.is_completed && result.reward) {
        setTimeout(() => {
          setReward(result.reward);
        }, 800);
      }
    } catch (err) {
      console.error("Failed to check in:", err);
      alert(
        "Oops! That stamp didn't quite make it. Mind trying one more time? We're sure it'll work now!",
      );
    }
  };

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const fullHeight = Math.max(
          containerRef.current.scrollHeight,
          window.innerHeight,
        );
        setDocumentHeight(fullHeight);
      }
    };

    updateHeight();

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [checkpoints, isAllCompleted, loading]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Loading route...</div>
    );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FDFCFB] pb-20 overflow-hidden"
    >
      {isAllCompleted && (
        <Confetti
          width={width}
          height={documentHeight}
          recycle={true}
          colors={["#FFC0CB", "#FFB6C1", "#FF69B4", "#FFF0F5"]}
          gravity={0.05}
          friction={0.98}
          drawShape={(ctx) => {
            ctx.beginPath();
            for (let i = 0; i < 22; i++) {
              const angle = 0.35 * i;
              const x = (0.2 + 1.5 * angle) * Math.cos(angle);
              const y = (0.2 + 1.5 * angle) * Math.sin(angle);
              ctx.lineTo(x, y);
            }
            ctx.fill();
            ctx.closePath();
          }}
          numberOfPieces={150}
        />
      )}
      {isAllCompleted && reward && !hasClosedModal && (
        <CompleteModal
          routeLabel={routeLabel}
          reward={reward}
          onClose={() => setHasClosedModal(true)}
        />
      )}

      <div className="max-w-2xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em] block">
              Stamp Rally Route
            </span>
            <h1 className="text-4xl font-black text-stone-900 tracking-tight">
              {routeLabel}
            </h1>
          </div>

          <div className="bg-white p-4 rounded-4xl shadow-xl shadow-stone-200/50 border border-stone-100 flex items-center gap-4 min-w-50">
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#F1F1F0"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#EF4444"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * progressPercentage) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-stone-800">
                {Math.round(progressPercentage)}%
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">
                Status
              </p>
              <p className="text-lg font-black text-stone-800 leading-none">
                {stampedIds.length}
                <span className="text-stone-300 mx-1">/</span>
                {checkpoints.length}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline List */}
        <div className="relative">
          {!isStarted && (
            <div className="absolute inset-0 -mx-6 -mt-12 -mb-20 z-50 flex items-start justify-center pt-32 bg-white/60 backdrop-blur-xl">
              <div className="sticky top-1/3 flex flex-col items-center gap-6">
                <div className="h-1 w-1 bg-stone-200 rounded-full mb-4 animate-bounce" />

                <button
                  onClick={handleStartRoute}
                  className="group relative bg-stone-900 text-white px-16 py-6 rounded-full text-xl font-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:bg-black hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 tracking-widest">
                    START ADVENTURE
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>

                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                  Tap to begin your journey
                </p>
              </div>
            </div>
          )}

          <div className="space-y-0">
            {sorted.map((checkpoint, idx) => {
              const isStamped = stampedIds.includes(checkpoint.id);
              const isLocked =
                idx > 0 && !stampedIds.includes(sorted[idx - 1].id);
              const isLast = idx === sorted.length - 1;

              return (
                <div key={checkpoint.id} className="relative">
                  {!isLast && (
                    <div className="absolute left-7.75 top-17.5 w-0.5 h-[calc(100%-40px)] z-0">
                      <div
                        className={`w-full h-full transition-all duration-1000 ${isStamped ? "bg-red-400" : "bg-stone-200"}`}
                        style={{
                          backgroundImage: isStamped
                            ? "none"
                            : "linear-gradient(to bottom, #E7E5E4 50%, transparent 50%)",
                          backgroundSize: "2px 10px",
                        }}
                      />
                    </div>
                  )}

                  <div className="relative z-10 flex gap-6 pb-12">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                          isStamped
                            ? "bg-red-500 text-white shadow-red-200"
                            : isLocked
                              ? "bg-stone-100 text-stone-300 shadow-none"
                              : "bg-white text-red-500 border-2 border-red-50"
                        }`}
                      >
                        {isStamped ? (
                          <Check className="w-8 h-8 stroke-3" />
                        ) : isLocked ? (
                          <Lock className="w-6 h-6" />
                        ) : idx === 0 ? (
                          <Flag className="w-6 h-6 fill-current" />
                        ) : (
                          <MapPin className="w-6 h-6" />
                        )}
                      </div>
                    </div>

                    {/* Card Component */}
                    <div className="flex-1 pt-1">
                      <CheckPointCard
                        checkpoint={checkpoint}
                        isStamped={isStamped}
                        isLocked={isLocked}
                        onStampComplete={() =>
                          handleStampComplete(checkpoint.id)
                        }
                        onThumbnailClick={() =>
                          setSelectedCheckPoint(checkpoint)
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-12 flex justify-end">
            <Link
              href="/stamp"
              className="group flex items-center gap-2 px-6 py-4 bg-white border border-stone-200 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 text-stone-600 hover:text-stone-900"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                <ChevronLeft size={18} />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-sm font-black italic">EXIT ROUTE</span>
              </div>
            </Link>
          </div>
        </div>

        {selectedCheckPoint && (
          <CheckPointModal
            checkpoint={selectedCheckPoint}
            onClose={() => setSelectedCheckPoint(null)}
          />
        )}
      </div>
    </div>
  );
}
