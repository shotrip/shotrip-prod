"use client";

import { useRef, useEffect } from "react";
import { CompleteModalProps } from "@/types/completeModal";
import Link from "next/link";
import { Award, Trophy, Sparkles, ExternalLink, X } from "lucide-react";

export default function CompleteModal({
    routeLabel,
    reward,
    onClose,
}: CompleteModalProps) {

    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && ! modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.body.style.overflow = "unset";

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [onClose]);

    return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-700" />

      <div
        ref={modalRef}
        className="relative bg-[#FCFBF7] rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[6px] border-double border-[#D4AF37]/30 animate-in zoom-in-95 fade-in duration-500 text-center overflow-hidden"
      >
        <Award className="absolute -left-8 -bottom-8 w-32 h-32 text-red-500/5 rotate-12" />

        <div className="absolute top-6 right-6 w-14 h-14 border-4 border-red-600 rounded-sm flex items-center justify-center transform rotate-12 bg-transparent opacity-80">
          <span className="text-red-600 font-black text-[10px] leading-tight flex flex-col items-center justify-center" style={{ fontFamily: 'serif' }}>
            <span>完走</span>
            <span className="border-t border-red-600 mt-0.5">証印</span>
          </span>
        </div>

        <div className="relative inline-block mt-4 mb-6">
          <div className="absolute -inset-4 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse" />
          <div className="relative w-20 h-20 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
            <Trophy className="text-white w-10 h-10" strokeWidth={2.5} />
          </div>
          <Sparkles className="absolute -top-1 -right-2 text-yellow-500 w-6 h-6 animate-bounce" />
        </div>

        <h2 className="text-2xl font-black text-stone-900 mb-3 tracking-tighter">
          CONGRATULATIONS!
        </h2>

        <div className="space-y-4 mb-10">
          <p className="text-stone-600 text-sm leading-relaxed px-2">
            You have successfully explored every spot in <br />
            <span className="relative inline-block px-1 font-bold text-stone-900">
              <span className="relative z-10">{routeLabel}</span>
              <span className="absolute bottom-0 left-0 w-full h-2 bg-red-100 z-0" />
            </span>
          </p>
          
          <div className="mx-auto w-12 h-px bg-stone-200" />

          <p className="text-[12px] text-stone-500 font-medium px-4">
             &ldquo;{reward.description}&rdquo;
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href={reward.affiliate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-full py-4 bg-stone-900 text-white rounded-2xl font-black shadow-xl hover:bg-black active:scale-[0.98] transition-all text-sm tracking-widest overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              GET REWARD <ExternalLink size={16} />
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
          
          <button
            onClick={onClose}
            className="flex items-center gap-1 mx-auto text-stone-400 text-[10px] font-bold hover:text-stone-600 transition tracking-[0.2em] uppercase"
          >
            <X size={12} /> Close Window
          </button>
        </div>
      </div>
    </div>
  );
}