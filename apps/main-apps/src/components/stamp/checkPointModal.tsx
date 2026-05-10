"use client";
/* eslint-disable @next/next/no-img-element */

import { CheckPoint } from "@/types/checkPoint";
import { useRef, useEffect } from "react";
import { X, MapPin, Info } from "lucide-react";

export default function CheckPointModal({
  checkpoint,
  onClose,
}: {
  checkpoint: CheckPoint;
  onClose: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-white rounded-4xl overflow-hidden w-full max-w-sm relative shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col"
      >
        <div className="relative aspect-21/9 w-full overflow-hidden bg-stone-100 shrink-0">
          <img
            src={checkpoint.thumbnail_url}
            alt={checkpoint.name}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute bottom-3 left-3">
            <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider">
              <MapPin size={10} strokeWidth={4} />
              Spot
            </span>
          </div>
          
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 z-20 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-1.5 rounded-full transition-colors active:scale-95"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 flex-1 flex flex-col min-h-0">
          <h3 className="text-xl md:text-2xl font-black text-stone-900 mb-4 tracking-tight leading-tight shrink-0">
            {checkpoint.name}
          </h3>
          
          <div className="flex gap-2.5 bg-stone-50 p-4 rounded-xl border border-stone-100 flex-1 overflow-y-auto max-h-60">
            <div className="mt-0.5 shrink-0">
              <Info size={14} className="text-stone-300" />
            </div>
            <p className="text-sm text-stone-600 leading-relaxed font-medium">
              {checkpoint.excerpt}
            </p>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-stone-900 text-white py-3.5 rounded-xl text-sm font-black hover:bg-black transition-all active:scale-[0.98] shadow-lg shadow-stone-200 shrink-0"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
