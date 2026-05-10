import Link from "next/link";
import { RegionPageProps } from "@/types/regionsPage";
import { REGIONS_LIST } from "@/lib/data/regionsLabels";
import { PREFECTURES_LIST } from "@/lib/data/prefectruesLabels";
import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { buildHrefLang } from "@/lib/seo/buildHrefLang";
import { Region } from "@/types/params";
import type { Metadata } from "next";
import { LOCALES, REGIONS } from "@/lib/data/paramsData";
import Image from "next/image";
import { PrefecturesKey } from "@/types/prefecturesKey";
import { getArticlesByRegion } from "@/lib/utils/getAllSlug";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; region: Region }>;
}): Promise<Metadata> {
  const { region, locale } = await params;

  const regionData = REGIONS_LIST.find((r) => r.key === region);
  const text = INTERNAL_UI_TEXT[locale as keyof typeof INTERNAL_UI_TEXT];

  const title = `${regionData?.label} | Shotrip`;
  const description = text?.region?.intro[region] || "";

  const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    fr: "fr_FR",
    de: "de_DE",
    es: "es_ES",
    it: "it_IT",
    th: "th_TH",
    vi: "vi_VN",
  };

  const hrefLangMetadata = buildHrefLang(`/blog/${region}`);

  return {
    ...hrefLangMetadata,
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/${locale}/blog/${region}`,
      siteName: "Shotrip",
      images: [`/images/regions/${region}/main.jpg`],
      type: "website",
      locale: ogLocaleMap[locale] || "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/images/regions/${region}/main.jpg`],
    },
  };
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    (Object.keys(REGIONS) as Region[]).map((region) => ({
      locale,
      region,
    })),
  );
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region, locale } = await params;

  const text = INTERNAL_UI_TEXT[locale];
  const regionData = REGIONS_LIST.find((r) => r.key === region);
  const prefectures = PREFECTURES_LIST[region];

  const allRegionArticles = getArticlesByRegion(region);

  return (
    <>
    <PageHeader />
    <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-14 pb-12">
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
            href={`/${locale}/blog`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.region.breadcrumb}
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            {regionData?.label}
          </span>
        </nav>

        {/* --- 2. Region Image Grid (Visual Intro) --- */}
        <div className="hidden md:grid grid-cols-4 gap-3 mb-10 overflow-hidden rounded-2xl">
          <div className="col-span-2 row-span-2 relative bg-gray-200">
            <Image
              src={`/images/regions/${region}/main.jpg`}
              fill
              className="object-cover"
              alt={region}
            />
          </div>

          <div className="relative aspect-square bg-gray-200">
            <Image
              src={`/images/regions/${region}/sub1.jpg`}
              fill
              className="object-cover"
              alt={region}
            />
          </div>

          <div className="relative aspect-square bg-gray-200">
            <Image
              src={`/images/regions/${region}/sub2.jpg`}
              fill
              className="object-cover"
              alt={region}
            />
          </div>

          <div className="col-span-2 relative aspect-[2/0.7] bg-gray-200">
            <Image
              src={`/images/regions/${region}/sub3.jpg`}
              fill
              className="object-cover"
              alt={region}
            />
          </div>
        </div>

        {/* --- 3. Region Description (Concrete Info) --- */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
            <span className="w-10 h-0.5 bg-brand-red"></span>
            {text.region.explore} {regionData?.label}
          </h2>
          <div className="prose prose-stone max-w-none text-gray-700 leading-relaxed">
            <p className="text-lg text-gray-900 font-medium mb-4">
              {text.region.intro[region]}.
            </p>
          </div>
        </section>

        {/* --- 4. Must-Visit & Activities --- */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 border-b pb-2">
            {text.region.highlights}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {([1, 2] as const).map((i) => (
              <div key={i} className="group">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={`/images/regions/${region}/activity-${i}.jpg`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    alt="Activity"
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {text.region.activities[region].name[i]}
                </h3>
                <p className="text-sm text-gray-600 leading-snug">
                  {text.region.activities[region].detail[i]}
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

        {/* --- 5. Prefecture Cards (Navigation) --- */}
        <section>
          <h2 className="mb-8 text-2xl font-bold border-b">
            {text.region.which_pref} {regionData?.label}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prefectures.map((pref) => {
              const key = pref.key as PrefecturesKey;
              const areaData = text.region.areas[region] as Record<
                PrefecturesKey,
                string
              >;
              const description = areaData[key];
              return (
                <Link
                  key={pref.key}
                  href={`/${locale}/blog/${region}/${key}`}
                  className="group flex items-center rounded-xl border p-4 hover:border-brand-red hover:shadow-md transition-all bg-white"
                >
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 mr-4 shrink-0">
                    <Image
                      src={`/images/prefectures/${key}/thumb.jpg`}
                      fill
                      className="object-cover"
                      alt={pref.label}
                    />
                  </div>
                  <div className="flex flex-col justify-center pr-6">
                    <h3 className="font-bold group-hover:text-brand-red transition-colors leading-tight">
                      {pref.label}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500 leading-relaxed italic">
                      {description}
                    </p>
                  </div>
                  <span className="ml-auto text-gray-300 group-hover:text-brand-red transition-colors">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
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
            href={`/${locale}/blog`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.region.breadcrumb}
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            {regionData?.label}
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
          {allRegionArticles.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-6 flex items-center justify-between border-b pb-2">
                <span>{text.home.latest_articles}</span>
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded text-stone-500">
                  {regionData?.label}
                </span>
              </h2>

              <div className="flex flex-col gap-5">
                {allRegionArticles.slice(0, 5).map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${locale}/blog/${region}/${"prefecture" in article ? article.prefecture : ""}/${article.slug}`}
                    className="group flex gap-4 items-start"
                  >
                    <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-stone-100">
                      <Image
                        src={article.thumbnail}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      {"prefecture" in article && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-red mb-0.5">
                          {article.prefecture}
                        </span>
                      )}
                      <h3 className="font-bold text-sm group-hover:text-brand-red transition-colors leading-snug line-clamp-2 mb-1">
                        {article.title}
                      </h3>
                      <span className="text-[10px] text-gray-400">
                        {article.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* --- Advertising Space --- */}
          <div className="w-full max-w-md mx-auto lg:max-w-none border rounded-2xl p-8 bg-gray-50/50 border-dashed flex flex-col items-center justify-center text-center">
            <span className="text-stone-400 font-medium text-sm">
              Advertising Space
            </span>
          </div>
        </div>
      </aside>
    </div>
    </>
  );
}
