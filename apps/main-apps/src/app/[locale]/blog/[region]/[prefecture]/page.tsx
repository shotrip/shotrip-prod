import Link from "next/link";
// import Image from "next/image";
import { PREFECTURES_LIST } from "@/lib/data/prefectruesLabels";
import { REGIONS_LIST } from "@/lib/data/regionsLabels";
import { PrefPageProps } from "@/types/prefPage";
import { getArticlesByPrefecture } from "@/lib/utils/getAllSlug";
import EmptyPrefectureState from "@/components/blog/EmptyPrefectureState";
import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { Metadata } from "next";
import { buildHrefLang } from "@/lib/seo/buildHrefLang";
import { Region, Prefecture } from "@/types/params";
import { LOCALES, REGIONS } from "@/lib/data/paramsData";
import Image from "next/image";
import { ArticleInfiniteGridForPrefectures } from "@/components/blog/ArticleInfiniteGrid";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; region: Region; prefecture: Prefecture }>;
}): Promise<Metadata> {
  const { region, prefecture, locale } = await params;

  const prefData = PREFECTURES_LIST[region]?.find((p) => p.key === prefecture);
  const text = INTERNAL_UI_TEXT[locale as keyof typeof INTERNAL_UI_TEXT];

  const title = `${prefData?.label} | ${REGIONS_LIST.find((r) => r.key === region)?.label} | Shotrip`;
  const description = text?.prefecture?.intro[prefecture] || "";

  const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    fr: "fr_FR",
    de: "de_DE",
    es: "es_ES",
    it: "it_IT",
    th: "th_TH",
    vi: "vi_VN",
  };

  const hrefLangMetadata = buildHrefLang(`/blog/${region}/${prefecture}`);

  return {
    ...hrefLangMetadata,
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/${locale}/blog/${region}/${prefecture}`,
      siteName: "Shotrip",
      images: [`/images/prefectures/${prefecture}/thumb.jpg`],
      type: "website",
      locale: ogLocaleMap[locale] || "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/images/prefectures/${prefecture}/thumb.jpg`],
    },
  };
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    (Object.keys(REGIONS) as Region[]).flatMap((region) =>
      REGIONS[region].map((prefecture) => ({
        locale,
        region,
        prefecture,
      })),
    ),
  );
}

export default async function PrefPage({ params }: PrefPageProps) {
  const { region, prefecture, locale } = await params;

  const regionData = REGIONS_LIST.find((r) => r.key === region);
  const prefectures = PREFECTURES_LIST[region].find(
    (p) => p.key === prefecture,
  );

  const text = INTERNAL_UI_TEXT[locale];

  const filteredArticles = getArticlesByPrefecture(region, prefecture);
  const latestArticlesInPref = filteredArticles.slice(0, 3);

  return (
    <>
    <PageHeader />
    <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 py-12">
      <main className="lg:col-span-8">
        {/* Breadcrumb */}
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
            href={`/${locale}/blog`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.region.breadcrumb}
          </Link>
          <Link
            href={`/${locale}/blog/${region}`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {regionData?.label}
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            {prefectures?.label}
          </span>
        </nav>

        <header className="mb-12 border-b pb-8">
          <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-0.5 bg-brand-red"></span>
            {text.prefecture.about} {prefectures?.label}
          </h2>

          {/* 1. Introduction: Location & Climate */}
          <section className="prose prose-gray max-w-none leading-relaxed text-gray-600">
            <p className="text-lg">{text.prefecture.intro[prefecture]}</p>
          </section>

          {/* 2. Key Highlights (Bulleted List) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                {text.prefecture.top_destinations_title}
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside pl-1">
                <li>{text.prefecture.top_destinations[prefecture][1]}</li>
                <li>{text.prefecture.top_destinations[prefecture][2]}</li>
                <li>{text.prefecture.top_destinations[prefecture][3]}</li>
                <li>{text.prefecture.top_destinations[prefecture][4]}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                {text.prefecture.must_try_foods_title}
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside pl-1">
                <li>{text.prefecture.must_try_foods[prefecture][1]}</li>
                <li>{text.prefecture.must_try_foods[prefecture][2]}</li>
                <li>{text.prefecture.must_try_foods[prefecture][3]}</li>
                <li>{text.prefecture.must_try_foods[prefecture][4]}</li>
              </ul>
            </div>
          </div>
        </header>

        {/* 3. Image Section */}
        <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic">
              Image: Scenic View 1
            </div>
            {/* <Image src={`/images/prefectures/${prefecture}/img1.jpg`} fill className="object-cover" alt="Scenic view" /> */}
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm italic">
              Image: Local Food 1
            </div>
            {/* <Image src={`/images/prefectures/${prefecture}/img2.jpg`} fill className="object-cover" alt="Local food" /> */}
          </div>
        </section>

        {/* 4. Transport Overview */}
        <section className="mb-16 rounded-2xl bg-gray-50 p-8 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
            {text.prefecture.getting_aroung_title}
          </h3>
          <div className="text-sm leading-relaxed text-gray-600">
            <p>{text.prefecture.getting_around_detail[prefecture]}</p>
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

        {/* 5. Article Cards Section */}
        <div>
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            {text.prefecture.interests}
          </h2>
          {filteredArticles.length === 0 ? (
            <EmptyPrefectureState
              prefectureLabel={prefectures?.label}
              locale={locale}
            />
          ) : (
            <ArticleInfiniteGridForPrefectures
              articles={filteredArticles}
              locale={locale}
              region={region}
              prefecture={prefecture}
            />
          )}
        </div>
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
            href={`/${locale}/blog`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.region.breadcrumb}
          </Link>
          <Link
            href={`/${locale}/blog/${region}`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {regionData?.label}
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            {prefectures?.label}
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
          {latestArticlesInPref.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-6 flex items-center justify-between border-b pb-2">
                <span>{text.prefecture.latest_articles}</span>
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">
                  {prefectures?.label}
                </span>
              </h2>

              <div className="space-y-6">
                {latestArticlesInPref.map((article) => (
                  <Link
                    key={`side-${article.slug}`}
                    href={`/${locale}/blog/${region}/${prefecture}/${article.slug}`}
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
