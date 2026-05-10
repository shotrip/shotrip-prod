"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  LogIn,
  Map,
  Stamp,
  Trophy,
  MapPin,
  CheckCircle2,
  Info,
  X,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { useAuth } from "@/hooks/Auth";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useState, useRef, useEffect, useMemo } from "react";
import { fetchRoutes, fetchCheckpoints } from "@/lib/utils/stampApi";
import { CheckPoint } from "@/types/checkPoint";
import CheckPointModal from "./checkPointModal";
import { Routes } from "@/types/route";

export default function StampRouteList() {
  const { user, loading: authLoading } = useAuth();
  const { handleLogin } = useAuthActions();

  const [routes, setRoutes] = useState<Routes[]>([]);
  const [checkpoints, setCheckpoints] = useState<CheckPoint[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedRouteKey, setSelectedRouteKey] = useState<string | null>(null);
  const [selectedCheckpoint, setSelectedCheckpoint] =
    useState<CheckPoint | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchRoutes()
        .then((data) => setRoutes(data))
        .catch((err) => {
          console.error("Routes fetch error:", err);
          alert(
            "Oops! We're having trouble loading routes. It might be a network hiccup, please try refreshing the page!",
          );
        });
    }
  }, [user]);

  useEffect(() => {
    if (!selectedRouteKey) return;

    const loadCheckpoints = async () => {
      try {
        setDataLoading(true);
        const data = await fetchCheckpoints(selectedRouteKey);
        console.log("DEBUG: Checkpoints data from API:", data);
        if (data && Array.isArray(data.checkpoints)) {
          setCheckpoints(data.checkpoints);
        } else if (Array.isArray(data)) {
          setCheckpoints(data);
        }
      } catch (err) {
        console.error("Checkpoints fetch error:", err);
        alert(
          "Oops! We're having trouble loading checkpoints. It might be a network hiccup, please try refreshing the page!",
        );
        setCheckpoints([]);
      } finally {
        setDataLoading(false);
      }
    };

    loadCheckpoints();

    return () => {
      setCheckpoints([]);
      setDataLoading(false);
    };
  }, [selectedRouteKey]);

  const { inProgress, completed, notStarted } = useMemo(() => {
    return routes.reduce(
      (acc, route) => {
        if (route.status === "in-progress") acc.inProgress.push(route);
        else if (route.status === "completed") acc.completed.push(route);
        else acc.notStarted.push(route);
        return acc;
      },
      {
        inProgress: [] as Routes[],
        completed: [] as Routes[],
        notStarted: [] as Routes[],
      },
    );
  }, [routes]);

  const groupedNotRoutes = useMemo(() => {
    const groups: Record<string, Routes[]> = {};
    notStarted.forEach((route) => {
      if (!groups[route.region]) groups[route.region] = [];
      groups[route.region].push(route);
    });
    return groups;
  }, [notStarted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedCheckpoint) return;

      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelectedRouteKey(null);
      }
    };

    if (selectedRouteKey) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedRouteKey, selectedCheckpoint]);

  if (authLoading) {
    return (
      <div className="text-gray-500 text-center py-10">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none select-none">
          <Stamp
            size={300}
            className="absolute -top-20 -left-20 rotate-[-15deg] text-gray-900"
          />
          <Stamp
            size={250}
            className="absolute -bottom-16 -right-16 rotate-10 text-gray-900"
          />

          <div
            className="absolute inset-0 h-full w-full"
            style={{
              backgroundImage: "radial-gradient(#1f2937 1px, transparent 1px)",
              backgroundSize: "calc(20px * 1.414) 20px",
              backgroundPosition: "0 0, calc(20px * 0.707) 10px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-sm mx-auto">
          <div className="mb-8 flex justify-center space-x-3">
            <div className="w-14 h-14 rounded-full bg-red-50 border-4 border-white flex items-center justify-center text-red-600 shadow-md">
              <Map size={28} />
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center text-blue-600 shadow-md">
              <Stamp size={28} />
            </div>
            <div className="w-14 h-14 rounded-full bg-yellow-50 border-4 border-white flex items-center justify-center text-yellow-500 shadow-md">
              <Trophy size={28} />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-950 mb-3 tracking-tight">
            Start Your Journey!
          </h3>
          <p className="text-gray-600 mb-10 leading-relaxed">
            You can get digital stamps and special rewards by joining and
            completing a rally.
          </p>

          <button
            onClick={handleLogin}
            className="group flex items-center justify-center w-full sm:w-auto mx-auto bg-brand-red-light hover:bg-brand-red text-white font-bold py-3.5 px-10 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-4 focus:ring-red-100"
          >
            <LogIn className="mr-2.5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Login to start
          </button>

          <p className="mt-5 text-sm text-gray-400">
            *You can also create an account from here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* --- IN-PROGRESS SECTION --- */}
      {inProgress.length > 0 && (
        <section className="space-y-6 mt-12">
          <div className="flex items-center gap-3 border-b border-stone-300 pb-3">
            <div className="h-6 w-1 bg-brand-red-light rounded-full" />
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              IN PROGRESS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {inProgress.map((route) => (
              <div
                key={route.key}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-xl bg-gray-50 shrink-0 overflow-hidden ring-1 ring-gray-100">
                  <img
                    src={route.thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="grow min-w-0">
                  <Link href={`/stamp/${route.key}`}>
                    <h3 className="text-base font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                      {route.label}
                    </h3>
                    <p className="text-xs text-blue-500 font-medium mt-1 flex items-center gap-1">
                      <MapPin size={12} /> Continue Route
                    </p>
                  </Link>
                </div>
                <button
                  onClick={() => setSelectedRouteKey(route.key)}
                  className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all"
                >
                  <Info size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- COMPLETED SECTION --- */}
      {completed.length > 0 && (
        <section className="space-y-6 mt-16">
          <div className="flex items-center gap-3 border-b border-stone-300 pb-3">
            <div className="h-6 w-1 bg-green-500 rounded-full" />
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              COMPLETED
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {completed.map((route) => (
              <div
                key={route.key}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-all"
              >
                <div className="relative w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden opacity-60">
                  <img
                    src={route.thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover grayscale"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-green-500/10">
                    <CheckCircle2 size={24} className="text-green-600" />
                  </div>
                </div>
                <div className="grow min-w-0 text-gray-400">
                  <Link href={`/stamp/${route.key}`}>
                    <h3 className="text-base font-bold truncate">
                      {route.label}
                    </h3>
                  </Link>
                </div>
                <button
                  onClick={() => setSelectedRouteKey(route.key)}
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-white border border-gray-100 text-gray-400 hover:text-blue-600 transition-all shadow-sm"
                >
                  <Info size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- REGIONAL SECTIONS --- */}
      {Object.entries(groupedNotRoutes).map(([region, regionRoutes]) => (
        <section key={region} className="space-y-6 mt-16">
          <div className="relative mb-10 pb-4">
            <div className="flex items-end justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-600 ml-1 mb-2">
                  Explore Routes in this region
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-brand-red-light shadow-sm ring-1 ring-blue-100/50">
                    <MapPin size={22} strokeWidth={2.5} />
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                    {region}
                  </h2>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red-light opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-red"></span>
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {regionRoutes.length} Route(s)
                </span>
              </div>
            </div>

            <div className="mt-4 h-0.5 w-full bg-linear-to-r from-brand-red-dark via-brand-red-light to-transparent opacity-30" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {regionRoutes.map((route) => (
              <div
                key={route.key}
                className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-xl bg-gray-50 shrink-0 overflow-hidden ring-1 ring-gray-100">
                  <img
                    src={route.thumbnail_url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="grow min-w-0">
                  <Link href={`/stamp/${route.key}`}>
                    <h3 className="text-base font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                      {route.label}
                    </h3>
                  </Link>
                </div>
                <button
                  onClick={() => setSelectedRouteKey(route.key)}
                  className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all"
                >
                  <Info size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* --- ROUTE MODAL --- */}
      {selectedRouteKey && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all ${selectedCheckpoint ? "bg-transparent pointer-events-none" : "bg-black/40"}`}
        >
          <div
            ref={modalRef}
            className={`bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden transition-all duration-300 ${selectedCheckpoint ? "scale-95 opacity-0 pointer-events-none" : "scale-100 opacity-100"}`}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Checkpoints</h2>
                <p className="text-xs text-gray-400 font-medium">
                  Select a spot to see details
                </p>
              </div>
              <button
                onClick={() => setSelectedRouteKey(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
              {dataLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Loader2 className="animate-spin mb-2" size={32} />
                  <p className="text-sm font-medium italic">
                    Loading checkpoints...
                  </p>
                </div>
              ) : (
                checkpoints.map((cp) => (
                  <button
                    key={cp.id}
                    onClick={() => setSelectedCheckpoint(cp)}
                    className="w-full group flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl items-center shadow-sm hover:shadow-md hover:border-blue-200 transition-all text-left"
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 shadow-inner">
                      <img
                        src={cp.thumbnail_url}
                        alt={cp.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                        {cp.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                        {cp.excerpt}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-gray-300 mr-1" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {selectedCheckpoint && (
        <CheckPointModal
          checkpoint={selectedCheckpoint}
          onClose={() => setSelectedCheckpoint(null)}
        />
      )}
    </>
  );
}
