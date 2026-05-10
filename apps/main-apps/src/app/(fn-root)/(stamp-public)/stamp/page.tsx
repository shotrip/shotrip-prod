import { Metadata } from "next";
import StampRouteList from "@/components/stamp/stampRouteList";
import Image from "next/image";
import { MapPin, Smartphone, Trophy, Info } from "lucide-react";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Discovery Rally | Digital Stamp Rally in Japan by Shotrip";
  const description =
    "Explore Japan beyond the guidebooks with our Digital Stamp Rallies. Collect digital stamps at hidden shrines, local ramen shops, and scenic spots to keep your travel memories alive.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/stamp`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/stamp`,
      siteName: "Shotrip",
      type: "website",
      images: [
        {
          url: "/images/stamp/hero2.jpg",
          width: 1200,
          height: 630,
          alt: "Discovery Rally Japan - Digital Stamp Experience",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/stamp/hero2.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function StampHomePage() {
  return (
    <>
        <section className="relative h-[calc(60vh+104px)] min-h-100 w-full mt-0 mb-16 overflow-hidden flex items-center justify-center">
          <Image
            src="/images/stamp/hero.jpg"
            alt="Japan Travel"
            fill
            priority
            style={{ objectFit: "cover" }}
            className="absolute inset-0 z-0"
          />
    
          <div className="absolute inset-0 bg-black/40 z-10" />
    
          <div className="relative text-center text-white p-8 pt-32.5 z-20">
            <h1 className="text-4xl font-bold mb-4">Discovery Rally</h1>
            <p className="text-lg opacity-90">Try Japanese Niches</p>
          </div>
        </section>

      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
        <main className="lg:col-span-8 w-full">
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                <Info size={24} className="text-[#b11f2a]" />
              </div>
              <h2 className="text-3xl font-bold text-stone-900">
                What is Discovery Rally?
              </h2>
            </div>

            <p className="text-lg text-stone-700 leading-relaxed mb-10">
              Go beyond the typical guidebook. Our digital stamp rallies take
              you to the soul of Japan—from ancient shrines hidden in cedar
              forests to the best local ramen shops only residents know about.
              <strong>
                {" "}
                Collect digital stamps as you explore, and keep your travel
                memories alive forever.
              </strong>
            </p>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Find a Route",
                  desc: "Choose a theme or region that sparks your curiosity.",
                },
                {
                  icon: Smartphone,
                  title: "Check-in",
                  desc: "Visit the spots and use your phone to collect digital stamps.",
                },
                {
                  icon: Trophy,
                  title: "Get Rewards",
                  desc: "Complete the rally to earn special rewards you can use during your trip.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#b11f2a] group-hover:text-white transition-all duration-300 shadow-sm">
                    <step.icon size={32} />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-snug">
                    {step.desc}
                  </p>
                </div>
              ))}
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

          <section>
            <div className="flex items-center justify-between my-8">
              <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
                <span className="w-10 h-0.5 bg-[#b11f2a] rounded-full"></span>
                Active Rallies
              </h2>
            </div>
            <StampRouteList />
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
        </main>

        <aside className="lg:col-span-4 py-8 lg:py-12">
          <div className="sticky top-24 border rounded-2xl p-8 bg-gray-50/50 shadow-sm">
            <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-6 border-b pb-2">
              Ads Space
            </h3>
            <div className="aspect-square bg-white border-2 border-dashed border-stone-200 rounded-2xl flex items-center justify-center text-stone-300 text-sm font-medium">
              Placeholder
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
