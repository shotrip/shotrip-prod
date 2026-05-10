import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { getAllRevisionSlugs } from "@/lib/utils/getAllSlug";
import { Metadata } from "next";
import { getPostMetadata } from "@/lib/seo/getPostMetadata";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const baseMetadata = await getPostMetadata(
    `revision_history/${slug}.md`,
    `/legal/revision_history/${slug}`,
  );

  return {
    ...baseMetadata,
    title: `${baseMetadata.title} | Revision History`,
    alternates: {
      canonical: `${ENV.PROD_URL}/legal/revision_history/${slug}`,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export async function generateStaticParams() {
  const allRevisions = getAllRevisionSlugs();
  return allRevisions.map((item) => ({
    slug: item.slug,
  }));
}

export default async function RevisoinDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const filePath = path.join(
    process.cwd(),
    "posts",
    "revision_history",
    `${slug}.md`,
  );

  let postData = {
    title: "",
    date: "",
    content: "",
  };

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const htmlContent = marked.parse(content);

    postData = {
      title: data.title || "No Title",
      date: data.date || "",
      content:
        typeof htmlContent === "string" ? htmlContent : await htmlContent,
    };
  } catch (e) {
    console.error("Error reading revision file:", e);
  }

  return (
    <>
    <PageHeader />
    <article className="min-h-screen bg-white pb-24 relative">
      {/* Header Section */}
      <section className="pt-8 pb-8 px-6 border-b border-slate-50 bg-slate-50/30">
        <div className="max-w-3xl mx-auto">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 text-xs text-slate-400 uppercase tracking-wider"
          >
            <Link
              href="/en"
              className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/legal/revision_history"
              className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
            >
              Revision History
            </Link>
            <span aria-current="page" className="text-slate-900 font-medium">
              Detail
            </span>
          </nav>

          <div className="mb-16 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            This page is available in English only to avoid misunderstandings.
          </div>

          <header className="space-y-4">
            <time className="text-[11px] font-bold font-mono text-slate-400 tracking-wider uppercase">
              {postData.date}
            </time>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
              {postData.title}
            </h1>
          </header>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div
          className="prose prose-slate prose-sm md:prose-base max-w-none prose-headings:text-slate-900 prose-a:text-blue-600"
          dangerouslySetInnerHTML={{ __html: postData.content }}
        />

        {/* Footer Navigation */}
        <div className="mt-20 pt-8 border-t border-slate-100">
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
            <Link
              href="/legal/revision_history"
              className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
            >
              Revision History
            </Link>
            <span aria-current="page" className="text-slate-900 font-medium">
              Detail
            </span>
          </nav>
        </div>
      </section>
    </article>
    </>
  );
}
