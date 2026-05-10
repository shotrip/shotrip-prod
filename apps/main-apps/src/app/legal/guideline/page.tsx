import { Metadata } from "next";
import {
  Heart,
  CameraOff,
  Trash2,
  VolumeX,
  UserCheck,
  Map,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Community Guidelines & Prohibited Matters | Shotrip";
  const description =
    "The guidelines for using Shotrip services. Please review our community standards and prohibited actions to ensure a safe and enjoyable experience for all Japan travelers.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/legal/guideline`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/legal/guideline`,
      type: "website",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function GuidelinePage() {
  return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-slate-50 py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 text-xs text-slate-400 uppercase tracking-wider"
        >
          <Link
            href="/en"
            className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
          >
            Home
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            Community Guideline
          </span>
        </nav>
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-16 border border-slate-100 text-slate-800">
          <div className="mb-6 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            This page is available in English only to avoid misunderstandings.
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <Heart className="text-rose-500 w-12 h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              Community Guideline
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Japan is not a theme park; it is a place where people live, pray,
              and work. To preserve the beauty of our local communities, we ask
              you to travel with a &quot;neighbor&quot; mindset.
            </p>
          </div>

          <div className="space-y-12">
            <section className="flex gap-6">
              <div className="bg-rose-50 p-3 rounded-full h-fit">
                <CameraOff className="text-rose-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">
                  1. Respect Living Privacy
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Many photogenic spots are actually narrow residential alleys.
                  Please do not take photos of private houses, gardens, or
                  locals (especially Maiko or residents) without explicit
                  permission. Your &quot;perfect shot&quot; should never come at
                  the cost of someone&apos;s privacy.
                </p>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="bg-blue-50 p-3 rounded-full h-fit">
                <Trash2 className="text-blue-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">
                  2. Carry Your Trash Back
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Japan has very few public trash bins. Please do not leave your
                  food waste or bottles on the streets, at shrines, or on top of
                  vending machines. Carry a small bag and take your trash back
                  to your hotel.
                </p>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="bg-amber-50 p-3 rounded-full h-fit">
                <VolumeX className="text-amber-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">
                  3. Embrace the Silence
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Public transport and residential streets are considered
                  &quot;quiet zones&quot; in Japan. Please keep your voice down,
                  refrain from using speakerphones, and enjoy the tranquil
                  atmosphere.
                </p>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="bg-emerald-50 p-3 rounded-full h-fit">
                <UserCheck className="text-emerald-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">
                  4. Observe Local Etiquette
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Shrines and temples are sacred spaces for prayer, not just
                  tourist attractions. Follow the rules for bowing and washing
                  hands, and avoid blocking the path of those who are there to
                  worship.
                </p>
              </div>
            </section>

            <section className="flex gap-6">
              <div className="bg-indigo-50 p-3 rounded-full h-fit">
                <Map className="text-indigo-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-slate-900">
                  5. Explore Beyond the Crowds
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Overtourism often happens because everyone visits the same
                  spot at the same time. Try visiting early in the morning, or
                  explore the &quot;off-the-beaten-path&quot; areas Shotrip
                  suggests to support local businesses away from the main
                  crowds.
                </p>
              </div>
            </section>
          </div>

          {/* Owner's Message Footer */}
          <div className="mt-20 p-8 bg-brand-red rounded-2xl text-white text-center">
            <p className="italic text-lg mb-4">
              &quot;Be a traveler, not just a tourist.&quot;
            </p>
            <p className="text-stone-300 text-sm leading-relaxed">
              By following these simple requests, you help us ensure that Japan
              remains a welcoming and beautiful place for everyone—locals and
              visitors alike. Thank you for being a part of the solution.
            </p>
          </div>
        </div>
        <nav
          aria-label="Breadcrumb"
          className="mt-12 flex justify-end text-xs text-slate-400 uppercase tracking-wider"
        >
          <Link
            href="/en"
            className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
          >
            Home
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            Community Guideline
          </span>
        </nav>
      </div>
    </div>
    </>
  );
}
