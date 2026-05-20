"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { LOCALES } from "@/lib/data/paramsData";
import { Locale } from "@/types/params";
import { LABEL, FLAG_MAP } from "@/lib/data/i18n/localeSwitch";
import { LocaleSwitcherProps } from "@/types/localeSwitcher";
import { usePathname } from "next/navigation";

function isLocaleWorld(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts.length > 0 && (LOCALES as readonly string[]).includes(parts[0]);
}

function replaceLocale(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/").filter(Boolean);

  if (isLocaleWorld(pathname)) {
    parts[0] = nextLocale;
    return "/" + parts.join("/");
  }

  return `/${nextLocale}/`;  
}

export default function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const shouldHide = useMemo(() => {
    return pathname.startsWith("/legal") || pathname.startsWith("/contact");
  }, [pathname]);

  const CurrentFlag = FLAG_MAP[locale];
  const others = useMemo(() => LOCALES.filter((l) => l !== locale), [locale]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (shouldHide) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-stone-50/50 transition-colors text-stone-800 hover:bg-stone-400 hover:text-stone-100 active:scale-95"
      >
        {CurrentFlag && <CurrentFlag className="w-5 h-5 rounded-sm shadow-sm" />}
        <span className="font-medium">{LABEL[locale]}</span>
        <span className="text-[10px] opacity-40">▼</span>
      </button>

      {open && (
        <div 
          className="absolute right-0 top-full mt-2 z-50 min-w-40 overflow-hidden rounded-2xl border border-gray-200 bg-stone-200 backdrop-blur-sm shadow-xl animate-in fade-in zoom-in-95 duration-200"
          role="menu"
        >
          {others.map((l) => {
            const Flag = FLAG_MAP[l];
            return (
              <Link
                key={l}
                href={replaceLocale(pathname, l)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-100 transition-colors border-b border-gray-300 last:border-0"
                onClick={() => setOpen(false)}
              >
                {Flag && <Flag className="w-5 h-5 rounded-sm" />}
                {LABEL[l]}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
