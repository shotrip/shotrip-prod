import { Metadata } from "next";
import { Megaphone, Info, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Advertising with Shotrip | Reach Japan Travelers";
  const description =
    "Learn about advertising opportunities on Shotrip. Connect with inbound travelers exploring Japan through our guides and AI travel assistant.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/legal/ads`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/legal/ads`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function AdsPage() {
  return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-slate-50 py-12 px-6 sm:px-12 lg:px-24 text-slate-800 font-sans">
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
            Affiliates & Advertisement Disclosure
          </span>
        </nav>
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-16 border border-slate-100">
          <div className="mb-6 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            This page is available in English only to avoid misunderstandings.
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="text-slate-800 w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight">
              Affiliates & Advertisement Disclosure
            </h1>
          </div>

          <p className="mb-10 text-sm text-slate-500 italic border-b pb-6">
            Transparency regarding our partnerships and advertising.
          </p>

          {/* Section 1: Introduction */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              1. Transparency Policy
            </h2>
            <p className="leading-relaxed text-slate-600 text-sm">
              At <strong>Shotrip</strong>, we believe in radical transparency.
              To keep our counter-overtourism initiatives and high-quality
              travel insights accessible to everyone, we participate in various
              affiliate marketing programs. This means we may earn a commission
              when you click on certain links or make purchases through our
              recommendations.
            </p>
          </section>

          {/* Section 2: How It Works */}
          <section className="mb-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold mb-4 text-slate-800">
              How It Affects You
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong>No Extra Cost:</strong> Using our affiliate links does
                  NOT increase the price you pay. In some cases, our
                  partnerships may even grant you exclusive discounts.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  <strong>Unbiased Content:</strong> Our editorial integrity is
                  our priority. We only recommend services and products that
                  align with our mission of sustainable and responsible travel.
                </p>
              </li>
            </ul>
          </section>

          {/* Section 3: Ad Platforms */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <ShieldAlert className="w-5 h-5 mr-2 text-amber-500" />
              2. Third-Party Advertising
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                We may display third-party advertisements (such as Google
                AdSense) on our website. Please note that:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  Ad networks may use anonymized data to serve relevant ads to
                  you.
                </li>
                <li>
                  Shotrip does not necessarily endorse the specific products or
                  services featured in automated display ads.
                </li>
                <li>
                  For more details on how your data is handled in relation to
                  ads, please refer to our <strong>Privacy Policy</strong>.
                </li>
              </ul>
            </div>
          </section>

          {/* Footer info */}
          <div className="mt-16 pt-8 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              Compliant with the FTC guidelines and the Japanese Act against
              Unjustifiable Premiums and Misleading Representations.
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
            Affiliates & Advertisement Disclosure
          </span>
        </nav>
      </div>
    </div>
    </>
  );
}
