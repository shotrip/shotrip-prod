import { CATEGORIES_LIST } from "@/lib/data/categoriesLabels";
import { LOCALES } from "@/lib/data/paramsData";
import { buildHrefLang } from "@/lib/seo/buildHrefLang";
import { getAllEssentialsSlug } from "@/lib/utils/getAllSlug";
import { EssentialslArticlePageProps } from "@/types/articlesPage";
import { Categories } from "@/types/params";
import { Metadata } from "next";
import { getPostMetadata } from "@/lib/seo/getPostMetadata";
import Link from "next/link";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { PageHeader } from "@/components/global/PageHeader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: Categories; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;

  const relativePath = `essentials/${category}/${slug}.md`;
  const urlPath = `/blog/essentials/${category}/${slug}`;
  const postMetadata = await getPostMetadata(relativePath, urlPath);

  const hrefLangMetadata = buildHrefLang(
    `/blog/essentials/${category}/${slug}`,
  );

  return {
    ...postMetadata,
    ...hrefLangMetadata,
    title: `${postMetadata.title} | Shotrip Essentials`,
  };
}

export async function generateStaticParams() {
  const allEssentialPosts = getAllEssentialsSlug();

  return LOCALES.flatMap((locale) =>
    allEssentialPosts.map(({ category, slug }) => ({
      locale,
      category,
      slug,
    })),
  );
}

export default async function EssenatialsBlogArticle({
  params,
}: EssentialslArticlePageProps) {
  const { locale, category, slug } = await params;
  const categories = CATEGORIES_LIST.find((c) => c.key === category);

  const text = INTERNAL_UI_TEXT[locale];

  const filePath = path.join(
    process.cwd(),
    "posts",
    "essentials",
    category,
    `${slug}.md`,
  );
  let postContent = {
    title: "Title Not Found",
    content: "Content not found.",
  };

  const adHtml = `
  <div class="my-8 lg:hidden">
    <div class="bg-stone-50 border border-dashed border-stone-200 rounded-2xl h-32 flex flex-col items-center justify-center relative overflow-hidden">
      <span class="absolute top-2 left-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Advertisement</span>
      <p class="text-stone-300 text-sm font-medium">Ads Placeholder</p>
    </div>
  </div>
`;

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    if (!fileContents || fileContents.trim() === "") {
      throw new Error("File is empty");
    }
    
    const { data, content } = matter(fileContents);
    let htmlContent = marked.parse(content);
    if (typeof htmlContent !== "string") htmlContent = await htmlContent;

    const contentWithAds = htmlContent.replace(/\[\[AD\]\]/g, adHtml);

    postContent = {
      title: data.title,
      content: contentWithAds
    };
  } catch (e) {
    console.error("File not found:", e);
  }

  return (
    <>
    <PageHeader />
    <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <main className="py-8 lg:col-span-8 w-full">
        {/* --- Language Badge --- */}
        <div className="mb-6 flex items-center gap-2 text-[11px] font-medium text-green-500 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          This article is available in English only. Thank you for your
          understanding!
        </div>

        {/* --- Breadcrumb (Top) --- */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 text-xs text-gray-400 uppercase tracking-wider"
        >
          <Link
            href={`/${locale}`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.others.common_breadcrumb.home}
          </Link>
          <Link
            href={`/${locale}/blog#essentials`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.essentials.breadcrumb}
          </Link>
          <Link
            href={`/${locale}/blog/essentials/${category}`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors uppercase"
          >
            {text.essentials.category[category]}
          </Link>
          <span aria-current="page" className="text-gray-900">
            {postContent.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <article className="lg:col-span-3">
            <h1 className="mb-6 text-3xl font-bold">{postContent.title}</h1>

            <section className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: postContent.content }} />

              <div className="mt-12 pt-8 border-t text-sm text-gray-500">
                Category: {categories?.label}
              </div>
            </section>

            {/* --- Breadcrumb (Bottom) ---*/}
            <nav
              aria-label="Breadcrumb"
              className="mt-16 flex justify-end text-xs text-gray-400 uppercase tracking-wider"
            >
              <Link
                href={`/${locale}`}
                className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
              >
                {text.others.common_breadcrumb.home}
              </Link>
              <Link
                href={`/${locale}/blog#essentials`}
                className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
              >
                {text.essentials.breadcrumb}
              </Link>
              <Link
                href={`/${locale}/blog/essentials/${category}`}
                className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors uppercase"
              >
                {text.essentials.category[category]}
              </Link>
              <span aria-current="page" className="text-gray-900 font-medium">
                {postContent.title}
              </span>
            </nav>
          </article>
        </div>
      </main>

      {/* --- Sidebar --- */}
      <aside className="lg:col-span-4 py-8">
        <div className="sticky top-20 border rounded-lg p-6 bg-gray-50 min-h-125">
          <h3 className="font-semibold text-gray-700 mb-4">Ads Space</h3>
        </div>
      </aside>
    </div>
    </>
  );
}
