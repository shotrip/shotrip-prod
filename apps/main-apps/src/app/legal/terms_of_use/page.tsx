import { Metadata } from "next";
import {
  Scale,
  HeartHandshake,
  Copyright,
  AlertTriangle,
  Ban,
  Gavel,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Terms of Use | Shotrip";
  const description =
    "The terms and conditions for using Shotrip services. Please read these terms carefully before using our platform, Shotrip Lens, and other travel features.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/legal/terms_of_use`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/legal/terms_of_use`,
      type: "website",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function TermsOfUsePage() {
  return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-slate-50 py-12 px-6 sm:px-12 lg:px-24 text-slate-800">
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
          <span aria-current="page" className="text-slate-900 font-medium">
            Terms of Use
          </span>
        </nav>
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-16 border border-slate-100">
          <div className="mb-6 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            This page is available in English only to avoid misunderstandings.
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Scale className="text-brand-red w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight">Terms of Use</h1>
          </div>

          <p className="mb-10 text-sm text-slate-500 italic border-b pb-6" />

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <CheckCircle2 className="w-5 h-5 mr-2 text-brand-red" />
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed text-slate-600">
              By accessing or using our services, you agree to be bound by these
              Terms of Use and all applicable laws and regulations. If you do
              not agree with any of these terms, you are prohibited from using
              or accessing this site.
            </p>
          </section>

          {/* Section 2: Responsible Travel Commitment (The Hero Section) */}
          <section className="mb-12 p-8 bg-red-50 border border-red-100 rounded-xl">
            <h2 className="text-xl font-bold mb-6 text-brand-red-dark flex items-center">
              <HeartHandshake className="w-6 h-6 mr-3" />
              2. Responsible Travel Commitment
            </h2>
            <p className="mb-6 font-medium text-brand-red-dark leading-relaxed">
              As a counter-overtourism media, we advocate for sustainable
              tourism. Users are required to adhere to the following standards
              to protect local Japanese communities:
            </p>
            <ul className="grid gap-4">
              {[
                {
                  label: "Respect Local Rules",
                  text: "No littering. Carry your trash back or use designated bins.",
                },
                {
                  label: "Privacy & Property",
                  text: "No trespassing on private property for photos or any other reason.",
                },
                {
                  label: "Quiet Enjoyment",
                  text: "Maintain silence in residential areas and on public transport.",
                },
                {
                  label: "Public Decorum",
                  text: "Strictly follow local laws regarding street smoking and drinking.",
                },
                {
                  label: "Mindful Exploration",
                  text: "Prioritize low-congestion times and areas as suggested by Shotrip.",
                },
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 bg-white/60 p-3 rounded-md border border-red-200/50"
                >
                  <span className="mt-1 text-brand-red">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <span className="text-sm leading-relaxed text-slate-700">
                    <strong className="text-brand-red-dark">
                      {item.label}:<br/>
                    </strong>{" "}
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <Copyright className="w-5 h-5 mr-2 text-slate-500" />
              3. Intellectual Property
            </h2>
            <p className="leading-relaxed text-slate-600 text-sm">
              All content including text, graphics, and data-driven insights are
              the property of <strong>Shotrip</strong>. Unauthorized
              reproduction or commercial use is strictly prohibited.
            </p>
          </section>

          {/* Section 4: Limitation of Liability (Disclaimer Integrated) */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
              4. Limitation of Liability & Disclaimer
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-800 underline decoration-amber-200">
                  No Guarantees:
                </strong>{" "}
                While Shotrip strives to provide high-quality and up-to-date
                information, we do not warrant the accuracy, completeness, or
                suitability of any content (including facility hours,
                accessibility, or safety conditions). Travel destinations can
                change rapidly.
              </p>
              <p>
                <strong className="text-slate-800 underline decoration-amber-200">
                  Assumption of Risk:
                </strong>{" "}
                Your use of the information on this site is at your own risk.
                Shotrip, its operators, and its contributors shall not be held
                liable for any direct or indirect loss, damage, injury, or legal
                issues arising from your travel or reliance on our content.
              </p>
              <p className="text-xs italic bg-white p-3 border border-slate-100 rounded">
                * This includes, but is not limited to: traffic accidents, fines
                for trespassing, disputes with local residents, or
                dissatisfaction with suggested locations. You are responsible
                for following local laws and exercising common sense.
              </p>
            </div>
          </section>

          {/* Footer grid (Section 5 & 6) */}
          <div className="grid md:grid-cols-2 gap-8 border-t pt-10 text-slate-600">
            <section>
              <h2 className="text-lg font-bold mb-3 text-slate-800 flex items-center">
                <Ban className="w-4 h-4 mr-2 text-red-500" />
                5. Prohibited Conduct & Security
              </h2>
              <p className="text-xs leading-relaxed">
                Users must not engage in harmful activities, including but not
                limited to: automated scraping, interfering with platform
                security, or using our insights for unauthorized commercial
                purposes. We reserve the right to restrict access to anyone
                violating these terms.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3 text-slate-800 flex items-center">
                <Gavel className="w-4 h-4 mr-2 text-slate-500" />
                6. Governing Law
              </h2>
              <p className="text-xs leading-relaxed">
                These Terms of Use shall be governed by and construed in
                accordance with the laws of Japan. Any disputes arising from the
                use of this service shall be subject to the exclusive
                jurisdiction of the courts of Japan.
              </p>
            </section>
          </div>

          <div className="mt-12 text-center text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Empowering Communities through Responsible Travel
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
          <span aria-current="page" className="text-slate-900 font-medium">
            Terms of Use
          </span>
        </nav>
      </div>
    </div>
    </>
  );
}
