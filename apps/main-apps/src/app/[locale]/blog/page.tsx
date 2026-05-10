import Link from "next/link";
import Image from "next/image";
import { RegionPageProps } from "@/types/regionsPage";
import { REGION_MAP_CONFIG, REGIONS_KEY } from "@/lib/data/regionsLabels";
import { RegionsKey } from "@/types/regoinsKey";
import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { Metadata } from "next";
import { buildHrefLang } from "@/lib/seo/buildHrefLang";
import { LOCALES } from "@/lib/data/paramsData";
import { MapPin } from "lucide-react";
import { CATEGORIES_LIST } from "@/lib/data/categoriesLabels";
import { CategoriesKey } from "@/types/categoriesKey";
import { getAllArticlesSorted } from "@/lib/utils/getAllSlug";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const text = INTERNAL_UI_TEXT[locale as keyof typeof INTERNAL_UI_TEXT];

  const title = `Japan Travel Blog | Shotrip`;
  const description = text.articles.select_region;

  const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    fr: "fr_FR",
    de: "de_DE",
    es: "es_ES",
    it: "it_IT",
    th: "th_TH",
    vi: "vi_VN",
  };

  const hrefLangMetadata = buildHrefLang("/blog");

  return {
    ...hrefLangMetadata,
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/${locale}/blog`,
      siteName: "Shotrip",
      images: ["/images/common/placeholder.jpg"],
      type: "website",
      locale: ogLocaleMap[locale] || "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/common/placeholder.jpg"],
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}

export default async function SoleRegionPage({ params }: RegionPageProps) {
  const { locale } = await params;
  const text = INTERNAL_UI_TEXT[locale];

  const allArticles = getAllArticlesSorted();
  const latestArticles = allArticles.slice(0, 3);

  return (
    <>
    <PageHeader />
    <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 py-12">
      <main className="lg:col-span-8">
        <h1 className="mb-4 text-2xl font-semibold">
          {text.articles.select_region}
        </h1>
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-0.5 bg-brand-red"></span>
            {text.home.region_tiles}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REGIONS_KEY.map((region) => {
              const key = region.key as RegionsKey;
              return (
                <div
                  key={key}
                  className="flex flex-col rounded-lg border overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative h-48 w-full bg-gray-200">
                    <Image
                      src={`/images/regions/home/${key}.jpg`}
                      alt={text.home.region_names[key]}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  <div className="flex flex-col p-6 w-full">
                    <h3 className="text-2xl font-bold text-stone-900">
                      {text.home.region_names[key]}
                    </h3>
                    <p className="mt-4 text-stone-600 mb-8 leading-relaxed grow">
                      {text.home.regoin_tiles_excerpt[key]}
                    </p>

                    <div className="flex gap-3 mt-auto">
                      <Link
                        href={`/${locale}/blog/${region.key}`}
                        className="flex-2 bg-stone-900 text-white text-center py-3 text-sm font-semibold rounded-md hover:bg-stone-800 transition-colors"
                      >
                        {text.home.explore}
                      </Link>
                      <a
                        href={`https://www.google.com/maps/@${REGION_MAP_CONFIG[key].lat},${REGION_MAP_CONFIG[key].lng},${REGION_MAP_CONFIG[key].zoom}z`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center p-3 justify-center gap-1 w-full border border-stone-300 text-stone-700 text-center py-3 text-sm font-semibold rounded-md hover:bg-stone-100 transition-colors"
                      >
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{text.home.map}</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
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

        <h1 className="mb-4 text-2xl font-semibold" id="essentials">
          {text.articles.learn_tips}
        </h1>
        <section className="py-1 mb-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-0.5 bg-brand-red"></span>
              {text.home.essentials_title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES_LIST.map((cat) => {
                const key = cat.key as CategoriesKey;
                return (
                  <Link
                    key={key}
                    href={`/${locale}/blog/essentials/${cat.key}`}
                    className="group relative overflow-hidden rounded-2xl aspect-4/3 bg-stone-200 shadow-sm"
                  >
                    <Image
                      src={`/images/categories/${key}.jpg`}
                      alt={cat.label}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-stone-900/80 to-transparent z-10" />

                    <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        {text.home.essentials_phrase}
                      </span>
                      <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                        {text.home.essentials_names[key]}
                      </h3>
                    </div>

                    <div className="absolute inset-0 bg-stone-900 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  </Link>
                );
              })}
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
        
      </main>
      <aside className="lg:col-span-4 w-full max-w-4xl mx-auto lg:max-w-none">
        <div className="sticky top-24 space-y-10">
          {latestArticles.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-6 flex items-center justify-between border-b pb-2">
                {text.home.latest_articles}
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
              </h2>
              <div className="space-y-6">
                {latestArticles.map((article) => {
                  const href =
                    article.type === "regional"
                      ? `/${locale}/blog/${article.region}/${article.prefecture}/${article.slug}`
                      : `/${locale}/blog/essentials/${article.category}/${article.slug}`;

                  return (
                    <Link
                      key={`side-${article.slug}`}
                      href={href}
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
                  );
                })}
              </div>
            </section>
          )}

          <div className="w-full max-w-md mx-auto lg:max-w-none border rounded-2xl p-8 bg-gray-50/50 border-dashed flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2">
              Advertisement
            </span>
            <div className="w-full aspect-4/3 bg-white border rounded flex items-center justify-center text-gray-300 text-[10px]">
              Ads Placeholder
            </div>
          </div>
        </div>
      </aside>
    </div>
    </>
  );
}
