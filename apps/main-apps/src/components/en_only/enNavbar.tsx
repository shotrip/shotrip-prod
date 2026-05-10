"use client";
/* eslint-disable @next/next/no-img-element */

import { NavbarProps } from "@/types/navbar";
import Link from "next/link";
import {
  Menu,
  X,
  BookOpen,
  Video,
  MessageSquare,
  Ticket,
  ArrowRight,
  CornerRightDown,
  LucideProps,
} from "lucide-react";
import React, { useState } from "react";

export function EnNavbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navLinks = [
    { label: "Home", href: `/${locale}` },
    {
      label: "Articles",
      href: `/${locale}/blog`,
      description:
        'Discover Japan\'s hidden gems and travel tips through our stories and travel guides. This would help you find out your interests about Japan and learn "How-To" tips for getting rid of your confusion while in Japan.',
      icon: <BookOpen size={20} />,
      image: "/images/common/placeholder.jpg",
    },
    {
      label: "Videos",
      href: "https://www.youtube.com/",
      description:
        "Experience the sights and sounds of Japan through high-quality cinematic videos. These videos feature our experiences while reporting spots appearing in Articles and Chatbot. Let us share them with you guys!",
      icon: <Video size={20} />,
      image: "/images/common/placeholder.jpg",
    },
    {
      label: "Chatbot",
      href: "/lens",
      description:
        'Our AI-powered concierge "Shotrip Lens" is ready to help you find your own favorites. This is a part of our brain. Please enjoy talking to this and get our insights towards this country!',
      icon: <MessageSquare size={20} />,
      image: "/images/common/placeholder.jpg",
    },
    {
      label: "Stamp Rally",
      href: "/stamp",
      description:
        "Join our digital stamp collection and earn rewards by completing exploring local spots. Digital Stamp is designed by Japanese traditional arts, which may make you fild your own new favorite drawing...?",
      icon: <Ticket size={20} />,
      image: "/images/common/placeholder.jpg",
    },
    { label: "Contact Info", href: "/contact" },
    { label: "About Us", href: `/${locale}/about` },
    { label: "Support Us", href: `/${locale}/support` },
    { label: "国内クリエイター/事業者様向け", href: "/legal/for_partner" },
  ];

  const targetLabels = ["Articles", "Videos", "Chatbot", "Stamp Rally"];

  return (
    <nav
      className="bg-transparent text-white relative"
      onMouseLeave={() => setHoveredLink(null)}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-12 items-center justify-between xl:justify-center">
          <ul className="hidden xl:flex items-center gap-4 text-sm relative">
            {navLinks.map((link) => (
              <li
                key={link.href}
                onMouseEnter={() => {
                  if (targetLabels.includes(link.label))
                    setHoveredLink(link.label);
                  else setHoveredLink(null);
                }}
              >
                <Link
                  href={link.href}
                  className="px-4 py-1.5 rounded-full bg-stone-100/50 transition-colors text-stone-950 hover:bg-stone-400 hover:text-stone-100 active:scale-95 block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="xl:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-40 flex items-center justify-center w-10 h-10 rounded-md bg-stone-50/50 transition-colors hover:bg-stone-400 text-stone-800 hover:text-stone-100 duration-200 active:scale-95 shadow-sm"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute left-0 right-0 top-full pointer-events-none">
        <div className="mx-auto max-w-4xl px-4 pt-4 pointer-events-auto">
          {navLinks.map(
            (link) => 
              hoveredLink === link.label &&
              link.description && (
                <div
                  key={link.label}
                  className="pointer-events-auto bg-white/95 backdrop-blur-xl text-stone-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 ease-out"
                >
                  <div className="flex min-h-72 relative items-stretch">
                    <div className="absolute -left-8 -bottom-8 text-stone-100 pointer-events-none opacity-50 rotate-12 z-0">
                      {link.icon &&
                        React.cloneElement(
                          link.icon as React.ReactElement<LucideProps>,
                          { size: 180 },
                        )}
                    </div>

                    <div className="flex-1 p-10 flex flex-col relative z-10">
                      <div className="space-y-6">
                        {" "}
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-brand-red text-white rounded-xl shadow-lg">
                            {link.icon}
                          </div>
                          <h3 className="font-extrabold text-2xl tracking-tighter text-stone-900">
                            {link.label}
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <CornerRightDown
                            size={18}
                            className="text-stone-400 shrink-0 mt-1"
                          />
                          <p className="text-stone-500 text-[15px] leading-relaxed font-medium">
                            {link.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto pt-8">
                        <Link
                          href={link.href}
                          className="group flex items-center w-fit px-6 py-3 bg-brand-red text-stone-50 rounded-full text-sm font-bold transition-all hover:bg-stone-700 hover:shadow-md active:scale-95"
                        >
                          <span>Explore Now</span>
                          <ArrowRight
                            size={16}
                            className="ml-2 transition-transform group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>

                    <div className="w-[40%] bg-stone-200 relative overflow-hidden group/img shrink-0">
                      {link.image ? (
                        <>
                          <img
                            src={link.image}
                            alt={link.label}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent pointer-events-none" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          No Preview Available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] xl:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="xl:hidden bg-brand-red-light rounded-2xl absolute top-12 right-0 w-1/2 z-50 shadow-2xl rounded-bl-xl overflow-hidden animate-in slide-in-from-top-1 duration-200">
            <ul className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg bg-brand-red text-stone-100 active:bg-gray-300 hover:bg-gray-300 hover:text-gray-900 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}
