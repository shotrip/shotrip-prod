import { FooterProps } from "@/types/footer";
import Link from "next/link";
import {
  RiTwitterXFill,
  RiInstagramLine,
  RiWhatsappLine,
  RiRedditLine,
  RiPinterestLine,
} from "react-icons/ri";
import { FaQuora } from "react-icons/fa";

export function EnFooter({ locale }: FooterProps) {
  const systemLinks = [
    { label: "Business Owner", href: `/${locale}/about` },
    { label: "Contact Info", href: "/contact" },
    { label: "FAQ", href: "/legal/faq" },
  ];

  const legalLinks = [
    { label: "Terms of Use", href: "/legal/terms_of_use" },
    { label: "Privacy Policy", href: "/legal/privacy_policy" },
    {
      label: "Commercial Disclosure",
      href: "/legal/commercial_disclosure",
    },
    { label: "Community Guideline", href: "/legal/guideline" },
  ];

  const adsLink = [{ label: "Affiliates / Advertisement", href: "/legal/ads" }];

  const historyLink = [
    { label: "Revision History", href: "/legal/revision_history" },
  ];

  const shareLinks = [
    { icon: <RiTwitterXFill size={20} />, href: "https://x.com/", label: "X" },
    {
      icon: <RiInstagramLine size={20} />,
      href: "https://www.instagram.com/",
      label: "Instagram",
    },
    {
      icon: <RiWhatsappLine size={20} />,
      href: "https://web.whatsapp.com/",
      label: "WhatsApp",
    },
    {
      icon: <RiRedditLine size={20} />,
      href: "https://www.reddit.com/",
      label: "Reddit",
    },
    {
      icon: <FaQuora size={18} />,
      href: "https://jp.quora.com/",
      label: "Quora",
    },
    {
      icon: <RiPinterestLine size={20} />,
      href: "https://jp.pinterest.com/",
      label: "Pinterest",
    },
  ];

  return (
    <footer className="border-t bg-gray-50 w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-12 gap-y-12 text-sm text-gray-600">
          
          <div className="flex flex-col items-start w-full">
            <p className="mb-4 font-semibold text-gray-900 border-b border-gray-200 w-full pb-1 lg:border-none uppercase tracking-wider text-[11px]">System</p>
            <ul className="space-y-2.5">
              {systemLinks.map((link) => (
                <li key={link.href} className="hover:underline text-[13px] whitespace-nowrap">
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start w-full">
            <p className="mb-4 font-semibold text-gray-900 border-b border-gray-200 w-full pb-1 lg:border-none uppercase tracking-wider text-[11px]">Rules</p>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href} className="hover:underline text-[13px] leading-snug">
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start w-full">
            <p className="mb-4 font-semibold text-gray-900 border-b border-gray-200 w-full pb-1 lg:border-none uppercase tracking-wider text-[11px]">Advertising</p>
            <ul className="space-y-2.5">
              {adsLink.map((link) => (
                <li key={link.href} className="hover:underline text-[13px]">
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start w-full">
            <p className="mb-4 font-semibold text-gray-900 border-b border-gray-200 w-full pb-1 lg:border-none uppercase tracking-wider text-[11px]">History</p>
            <ul className="space-y-2.5">
              {historyLink.map((link) => (
                <li key={link.href} className="hover:underline text-[13px]">
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-start w-full">
            <p className="mb-4 font-semibold text-gray-900 border-b border-gray-200 w-full pb-1 lg:border-none uppercase tracking-wider text-[11px]">Share on SNS</p>
            <div className="flex flex-wrap gap-6 lg:gap-4">
              {shareLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-brand-red transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="block p-1">{link.icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 text-center text-[11px] text-gray-400 border-t border-gray-100 uppercase tracking-widest">
          © 2026 Shotrip. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
