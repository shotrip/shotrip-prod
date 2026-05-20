import { Metadata } from "next";
import Link from "next/link";
import TokenPlanButton from "@/components/lens/tokenPlanButton";
import Image from "next/image";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Rocket,
  Sparkles,
} from "lucide-react";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Shotrip Lens | Your AI Travel Concierge for Japan";
  const description =
    "Meet Shotrip Lens, your personal AI travel buddy. Discover hidden gems, local favorites, and expert tips across all 47 prefectures in Japan with our conversational assistant.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/lens`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/lens`,
      siteName: "Shotrip",
      type: "website",
      images: [
        {
          url: "/images/lens/hero.jpg",
          width: 1200,
          height: 630,
          alt: "Shotrip Lens - AI Travel Concierge",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/lens/hero.jpg"],
    },
  };
}

export default function LensPage() {
  return (
    <>
      <section className="relative h-[calc(60vh+104px)] min-h-100 w-full mt-0 mb-16 overflow-hidden flex items-center justify-center">
        <Image
          src="/images/lens/hero.jpg"
          alt="Japan Travel"
          fill
          priority
          style={{ objectFit: "cover" }}
          className="absolute inset-0 z-0"
        />

        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="relative text-center text-white p-8 pt-32.5 z-20">
          <h1 className="text-4xl font-bold mb-4">Shotrip Lens</h1>
          <p className="text-lg opacity-90">Your Trip Concierge</p>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Main Content */}
        <main className="lg:col-span-8 py-4 md:py-12">
          <div className="space-y-12">
            {/* What is Shotrip Lens? Section */}
            <section className="px-6 md:px-12 py-8 bg-white border border-stone-100 rounded-3xl shadow-sm max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-gray-900 tracking-tight">
                What is Shotrip Lens?
              </h2>

              <div className="space-y-12 text-gray-700 leading-relaxed">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="shrink-0 w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Sparkles size={24} className="text-[#b11f2a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      Meet Shotrip Lens
                    </h3>
                    <p>
                      Hey there! Shotrip Lens is your personal, conversational
                      AI travel buddy. Forget the crowded tourist
                      traps—we&apos;re here to help you find the hidden gems,
                      local favorites, and secret spots that make Japan truly
                      special.
                      <span className="block mt-2 text-sm font-medium text-gray-500 italic">
                        *ShotripLens speaks English only. Thank you for your
                        understanding!
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="shrink-0 w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                    <MapPin size={24} className="text-[#b11f2a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      What you can do
                    </h3>
                    <p>
                      I’ve traveled to all 47 prefectures in Japan and spent
                      years working as an interpreter and engineer. I’ve packed
                      all that local knowledge into this AI. Whether you&apos;re
                      planning your trip or wandering the streets, just ask!
                      Think of it as having a local friend right in your pocket.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="shrink-0 w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                    <Rocket size={24} className="text-[#b11f2a]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      How to use
                    </h3>
                    <p className="mb-4 text-sm font-semibold text-gray-400 uppercase tracking-widest">
                      It’s super simple:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Log in (or sign up if you haven't yet).",
                        "Open the Lens chat page.",
                        "Start asking anything!",
                      ].map((step, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-gray-800"
                        >
                          <CheckCircle2
                            size={18}
                            className="text-green-600 shrink-0"
                          />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 p-5 bg-stone-50 rounded-2xl border border-stone-100 text-sm text-gray-500 leading-relaxed space-y-2">
                      <p>
                        * You get 5 free tokens every Sunday at midnight (JST).
                        Each question costs 1 token. If you run out, no
                        worries—you can top up your tokens whenever you like.
                      </p>
                      <p className="text-amber-700 font-medium bg-amber-50/50 p-2 rounded-xl border border-amber-100/50 text-xs">
                        * Data Retention Note: To ensure data privacy, chat
                        history older than 10 days will be automatically and
                        permanently deleted from our system. Please make sure to
                        save any important travel information or recommendations
                        elsewhere.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="shrink-0 w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                    <AlertCircle size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      A little note
                    </h3>
                    <p className="text-gray-600">
                      I really want to share as much as I can, so sometimes the
                      AI might go a little rogue and suggest places you
                      didn&apos;t even ask for—consider it a bonus tip! Also,
                      since it’s AI-powered, it might occasionally make a
                      mistake.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex justify-center">
                <Link
                  href="/lens/shotrip_lens"
                  className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-linear-to-r from-[#b11f2a] to-[#d32f2f] rounded-2xl shadow-[0_10px_20px_rgba(177,31,42,0.3)] hover:shadow-[0_15px_30px_rgba(177,31,42,0.4)] hover:-translate-y-1 active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="text-lg tracking-wide">
                      Explore with Shotrip Lens
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </section>

            {/* --- Mobile Ad Space 1 --- */}
            <div className="lg:hidden w-full py-4 px-2">
              <div className="bg-stone-50 border border-dashed border-stone-200 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="absolute top-2 left-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                  Advertisement
                </span>
                <p className="text-stone-300 text-sm font-medium">
                  Ads Placeholder
                </p>
              </div>
            </div>

            {/* Token Info & Plans Section */}
            <section
              id="token"
              className="scroll-mt-24 px-4 md:px-12 bg-white py-12 border border-stone-100 rounded-3xl shadow-sm"
            >
              <div className="max-w-3xl mx-auto mb-16">
                <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                  About Token
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 transition-colors hover:bg-white hover:border-stone-200">
                    <span className="text-[#b11f2a] font-bold text-xl">•</span>
                    <p className="text-gray-700 leading-relaxed">
                      You guys have <strong>5 free tokens</strong> available
                      for a week.{" "}
                      <span className="text-sm text-gray-500">
                        (*The free tokens are recharged every Sunday in JST.)
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 transition-colors hover:bg-white hover:border-stone-200">
                    <span className="text-[#b11f2a] font-bold text-xl">•</span>
                    <p className="text-gray-700 leading-relaxed">
                      When problems occur in the backend, no worries. Shotrip
                      Lens will respond with &quot;Something went wrong.&quot;
                      and <strong>no token will be consumed</strong>.
                    </p>
                  </div>
                  <div className="flex gap-4 p-5 bg-stone-50 rounded-2xl border border-stone-100 transition-colors hover:bg-white hover:border-stone-200">
                    <span className="text-[#b11f2a] font-bold text-xl">•</span>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Any plans are not subscriptions.</strong> Your
                      unlimited mode will automatically end when the expiration
                      date comes. No pressure to remember to cancel!
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">
                Token Plans
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {/* 30 Tokens */}
                <div className="flex flex-col border border-stone-100 rounded-2xl p-8 text-center bg-stone-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    30 Tokens
                  </h3>
                  <p className="text-4xl font-extrabold mb-4 text-gray-900">
                    $3
                  </p>
                  <p className="text-sm text-gray-500 mb-8 grow">
                    Light usage / Try Lens
                  </p>
                  <TokenPlanButton product="tokens_30" label="Buy Now" />
                </div>

                {/* 100 Tokens */}
                <div className="flex flex-col border-2 border-[#b11f2a]/10 rounded-2xl p-8 text-center bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b11f2a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Best Value
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    100 Tokens
                  </h3>
                  <p className="text-4xl font-extrabold mb-4 text-gray-900">
                    $6
                  </p>
                  <p className="text-sm text-gray-500 mb-8 grow">
                    For the curious explorers
                  </p>
                  <TokenPlanButton product="tokens_100" label="Buy Now" />
                </div>

                {/* Unlimited */}
                <div className="flex flex-col border-2 border-amber-500/20 rounded-2xl p-8 text-center bg-white shadow-sm hover:shadow-xl transition-all duration-300 relative sm:col-span-2 lg:col-span-1 w-full sm:max-w-[calc(50%-1rem)] lg:max-w-none sm:justify-self-center">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                    Recommendation
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-800">
                    Unlimited (1mo)
                  </h3>
                  <p className="text-4xl font-extrabold mb-4 text-gray-900">
                    $7
                  </p>
                  <p className="text-sm text-gray-500 mb-8 grow">
                    For heavy travelers
                  </p>
                  <TokenPlanButton
                    product="unlimited_month"
                    label="Get Unlimited"
                  />
                </div>
              </div>
            </section>

            <div className="lg:hidden w-full py-4 px-2">
              <div className="bg-stone-50 border border-dashed border-stone-200 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="absolute top-2 left-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                  Advertisement
                </span>
                <p className="text-stone-300 text-sm font-medium">
                  Ads Placeholder
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Ads */}
        <aside className="lg:col-span-4 py-8 lg:py-12">
          <div className="lg:sticky lg:top-24 border border-stone-200 rounded-3xl p-8 bg-stone-50 shadow-inner">
            <h3 className="font-bold text-xs text-stone-400 uppercase tracking-widest mb-6 border-b border-stone-200 pb-3">
              Ads Space
            </h3>
            <div className="aspect-square bg-white border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center text-stone-300 text-sm font-medium">
              Ads Placeholder
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
