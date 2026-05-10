"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
export default function ToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`
        fixed bottom-6 right-6 z-90
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-linear-to-br from-brand-red-light/95 to-brand-red/95
        text-white
        shadow-[0_8px_30px_rgb(180,30,30,0.3)]
        
        transition-all duration-300 ease-out
        hover:from-brand-red hover:to-brand-red-dark hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(180,30,30,0.4)]
        active:scale-95 active:translate-y-0
        
        ${visible 
          ? "opacity-100 scale-100 pointer-events-auto" 
          : "opacity-0 scale-75 pointer-events-none"
        }
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}