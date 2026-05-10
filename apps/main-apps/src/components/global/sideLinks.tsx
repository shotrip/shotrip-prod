"use client";

import { Home, BookOpen, Map, Video, Heart, Mail, Info, ArrowLeft, Menu, X } from "lucide-react";
import { SideLinksProps } from "@/types/sideLinks";
import Link from "next/link";
import { useState } from "react";

export default function SideLinks({ locale, children }: SideLinksProps) {

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sideLinks = [
    { label: "Home", href: `/${locale}`, icon: Home },
    { label: "Articles", href: `/${locale}/blog`, icon: BookOpen },
    { label: "Stamp Rally", href: "/stamp", icon: Map },
    { label: "Videos", href: "https://www.youtube.com/", icon: Video },
    { label: "Support Us", href: `/${locale}/support`, icon: Heart },
    { label: "Contact Info", href: `/contact`, icon: Mail },
    { label: "About Us", href: `/${locale}/about`, icon: Info },
  ];

 return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-28 left-6 z-100 p-4 bg-stone-900 text-white rounded-full shadow-2xl active:scale-95 transition-all"
      >
        <Menu size={16} />
      </button>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-105 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-110 w-72 transform transition-transform duration-300 ease-in-out bg-stone-50 border-r border-stone-200 p-6 flex flex-col justify-between h-full
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:w-64 lg:min-w-[16rem]
      `}>
        <div>
          <div className="mb-8 flex items-center justify-between">
            <Link
              href={"/lens"}
              onClick={() => setIsMobileOpen(false)}
              className="group text-sm font-semibold flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:underline transition-colors"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Lens Home
            </Link>
            
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-1 text-gray-400">
              <X size={24} />
            </button>
          </div>

          <ul className="flex flex-col gap-1 text-sm">
            {sideLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-brand-red-light hover:bg-white/50 rounded-lg transition-all group"
                  >
                    <Icon size={18} className="text-gray-400 group-hover:text-brand-red-light transition-colors" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-4">
          {children}
          <Link href="/lens#token" onClick={() => setIsMobileOpen(false)}>
            <button className="w-full mt-3 py-2.5 px-4 bg-stone-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95 active:translate-y-0">
              Charge Token
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
