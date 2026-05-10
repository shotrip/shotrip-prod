import EmptyCategoryState from "@/components/blog/EmptyCategoryState";
import { CATEGORIES_LIST } from "@/lib/data/categoriesLabels";
import { getEssentialsArticlesByCategory } from "@/lib/utils/getAllSlug";
import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { CATEGORIES, LOCALES } from "@/lib/data/paramsData";
import { buildHrefLang } from "@/lib/seo/buildHrefLang";
import { CategoryPageProps } from "@/types/categoryPage";
import { Categories, Locale } from "@/types/params";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { ArticleInfiniteGridForEssentials } from "@/components/blog/ArticleInfiniteGrid";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: Categories }>;
}): Promise<Metadata> {
  const { locale, category } = await params;

  const currentLocale = (
    INTERNAL_UI_TEXT[locale as keyof typeof INTERNAL_UI_TEXT] ? locale : "en"
  ) as keyof typeof INTERNAL_UI_TEXT;
  const text = INTERNAL_UI_TEXT[currentLocale];

  const title = `${text.essentials.category[category]} | Shotrip Essentials`;
  const description = text.essentials[category].detail;
  const ogImage = `/images/categories/${category}/hero-1.jpg`;
  const hrefLangMetadata = buildHrefLang(`/blog/essentials/${category}`);

  return {
    ...hrefLangMetadata,
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/${currentLocale}/blog/essentials/${category}`,
      siteName: "Shotrip",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: text.essentials[category].title,
        },
      ],
      locale: currentLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    CATEGORIES.map((category) => ({
      locale: locale,
      category: category,
    })),
  );
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = await params;

  const categories = CATEGORIES_LIST.find((c) => c.key === category);
  const text = INTERNAL_UI_TEXT[locale];

  const filteredArticles = getEssentialsArticlesByCategory(category);
  const latestCategoryArticles = filteredArticles.slice(0, 3);

  return (
    <>
    <PageHeader />
    <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 py-12">
      <main className="lg:col-span-8">
        {/* --- Header & Navigation --- */}
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
          <span aria-current="page" className="text-gray-900 font-medium">
            {text.essentials.category[category]}
          </span>
        </nav>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-0.5 bg-brand-red"></span>
            {text.essentials.category[category]} {text.essentials.h2_part}
          </h2>
        </div>

        {/* --- ① Overview Section (Urban vs Rural & Pros/Cons) --- */}
        <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                {text.essentials[category].title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {text.essentials[category].detail}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 uppercase border-b">
                  <tr>
                    <th className="px-4 py-3">
                      {text.essentials[category].table_contents.mode.title}
                    </th>
                    <th className="px-4 py-3">
                      {text.essentials[category].table_contents.pros.title}
                    </th>
                    <th className="px-4 py-3">
                      {text.essentials[category].table_contents.cons.title}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      {text.essentials[category].table_contents.mode.mode_1}
                    </td>
                    <td className="px-4 py-3">
                      {text.essentials[category].table_contents.pros.pros_1}
                    </td>
                    <td className="px-4 py-3">
                      {text.essentials[category].table_contents.cons.cons_1}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      {text.essentials[category].table_contents.mode.mode_2}
                    </td>
                    <td className="px-4 py-3">
                      {text.essentials[category].table_contents.pros.pros_2}
                    </td>
                    <td className="px-4 py-3">
                      {text.essentials[category].table_contents.cons.cons_2}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-red-600">
                      {text.essentials[category].table_contents.mode.mode_3}
                    </td>
                    <td className="px-4 py-3">
                      {text.essentials[category].table_contents.pros.pros_3}
                    </td>
                    <td className="px-4 py-3">
                      {text.essentials[category].table_contents.cons.cons_3}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col gap-4 h-full">
            <div className="relative flex-1 min-h-50 overflow-hidden rounded-2xl shadow-md">
              <Image
                src={`/images/categories/${category}/hero-1.jpg`}
                alt="Urban train in Japan"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative flex-1 min-h-50 overflow-hidden rounded-2xl shadow-md">
              <Image
                src={`/images/categories/${category}/hero-2.jpg`}
                alt="Rural scenery or bus"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* --- ③ Quick Tips (Small trivia) --- */}
        <section className="mb-20 rounded-2xl bg-amber-50 p-8 border border-amber-100">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-800">
            <span className="text-2xl">💡</span>{" "}
            {text.essentials[category].trivia_title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                {text.essentials[category].trivia_contents.trivia_1.title}
              </h4>
              <p className="text-sm text-amber-800/80">
                {text.essentials[category].trivia_contents.trivia_1.detail}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                {text.essentials[category].trivia_contents.trivia_2.title}
              </h4>
              <p className="text-sm text-amber-800/80">
                {text.essentials[category].trivia_contents.trivia_2.detail}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-amber-900 mb-2">
                {text.essentials[category].trivia_contents.trivia_3.title}
              </h4>
              <p className="text-sm text-amber-800/80">
                {text.essentials[category].trivia_contents.trivia_3.detail}
              </p>
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

        {/* --- ④ Article Grid --- */}
        <section>
          <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-0.5 bg-brand-red"></span>
            {text.essentials.to_articles}
          </h3>
          {filteredArticles.length === 0 ? (
            <EmptyCategoryState
              categoryLabel={categories?.key}
              locale={locale}
            />
          ) : (
            <ArticleInfiniteGridForEssentials
              articles={filteredArticles}
              locale={locale}
              category={category}
            />
          )}
        </section>
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
          <span aria-current="page" className="text-gray-900 font-medium">
            {text.essentials.category[category]}
          </span>
        </nav>

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

      <aside className="lg:col-span-4 w-full max-w-4xl mx-auto lg:max-w-none">
        <div className="sticky top-24 space-y-10">
          {latestCategoryArticles.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-6 flex items-center justify-between border-b pb-2">
                {text.essentials.latest_articles}
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">
                  {categories?.label}
                </span>
              </h2>

              <div className="space-y-6">
                {latestCategoryArticles.map((article) => (
                  <Link
                    key={`side-${article.slug}`}
                    href={`/${locale}/blog/essentials/${category}/${article.slug}`}
                    className="group flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={article.thumbnail}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-brand-red transition-colors leading-snug">
                        {article.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {article.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="w-full max-w-md mx-auto lg:max-w-none border rounded-2xl p-8 bg-gray-50/50 border-dashed flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2">
              Tips
            </span>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Find the best ways to travel around {categories?.label} in Japan.
            </p>
          </div>
        </div>
      </aside>
    </div>
    </>
  );
}
