import { Metadata } from "next";
import Link from "next/link";
import { History, Clock } from "lucide-react";
import { getAllRevisionPosts } from "@/lib/utils/getAllSlug";
import RevisionList from "@/components/revision_history/RevisionList";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Revision History | Shotrip";
  const description =
    "The history of updates and revisions for Shotrip's platform services.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/legal/revision_history`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/legal/revision_history`,
      type: "website",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function RevisionHistoryPage() {
  const revisions = getAllRevisionPosts();

  return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-white pb-24 relative">
      {/* Header Section */}
      <section className="pt-4 pb-8 px-6 border-b border-slate-50 bg-slate-50/30">
        <div className="max-w-4xl mx-auto">
          {/* Top Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-4 text-xs text-slate-400 uppercase tracking-wider"
          >
            <Link
              href="/en"
              className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <span aria-current="page" className="text-slate-900 font-medium">
              Revision History
            </span>
          </nav>

          {/* Language Warning Badge */}
          <div className="mb-8 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            This page is available in English only to avoid misunderstandings.
          </div>

          <div className="flex items-center gap-3 mb-4 text-slate-400">
            <History size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Legal & Compliance
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
            Revision History
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
            We maintain a transparent record of all updates to our terms,
            policies, and service guidelines to ensure trust and accountability.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {revisions.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
            <Clock className="mx-auto text-slate-200 mb-4" size={40} />
            <p className="text-slate-400 font-medium">
              No revision history found at this time.
            </p>
          </div>
        ) : (
          <RevisionList revisions={revisions} />
        )}

        {/* Footer Navigation */}
        <div className="mt-24 pt-8 border-t border-slate-100">
          <nav
            aria-label="Breadcrumb"
            className="flex justify-end text-xs text-slate-400 uppercase tracking-wider"
          >
            <Link
              href="/en"
              className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <span aria-current="page" className="text-slate-900 font-medium">
              Revision History
            </span>
          </nav>
        </div>
      </div>
    </div>
    </>
  );
}
