import Link from "next/link";
import { LandingPageProps } from "@/types/landingPage";
import { FEATURES_LIST } from "@/lib/data/features";
import { REGIONS_KEY, REGION_MAP_CONFIG } from "@/lib/data/regionsLabels";
import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { FeatureKey } from "@/types/featureKey";
import { RegionsKey } from "@/types/regoinsKey";
import { buildHrefLang } from "@/lib/seo/buildHrefLang";
import type { Metadata } from "next";
import { LOCALES } from "@/lib/data/paramsData";
import { FEATURE_LINK_MAP } from "@/lib/data/featureLinkMap";
import { ICON_MAP } from "@/lib/data/features";
import Image from "next/image";
import {
  CalendarDays,
  ChevronRight,
  Landmark,
  MapPin,
  Rocket,
  Sparkles,
  Trees,
  User,
} from "lucide-react";
import { CATEGORIES_LIST } from "@/lib/data/categoriesLabels";
import { CategoriesKey } from "@/types/categoriesKey";
import { getAllArticlesSorted } from "@/lib/utils/getAllSlug";
import { ENV } from "@/config/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const text = INTERNAL_UI_TEXT[locale as keyof typeof INTERNAL_UI_TEXT];

  const title = `Shotrip | ${text.home.title}`; 
  const description = text.home.body_1;

  const ogLocaleMap: Record<string, string> = {
    en: "en_US",
    fr: "fr_FR",
    de: "de_DE",
    es: "es_ES",
    it: "it_IT",
    th: "th_TH",
    vi: "vi_VN",
  };

  const hrefLangMetadata = buildHrefLang("/");

  return {
    ...hrefLangMetadata,
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/${locale}`,
      siteName: "Shotrip",
      images: [
        {
          url: "/images/common/placeholder.jpg",
          width: 1200,
          height: 630,
          alt: "Shotrip - Japan Travel Guide",
        },
      ],
      locale: ogLocaleMap[locale] || "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/common/placeholder.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;

  const text =
    INTERNAL_UI_TEXT[locale as keyof typeof INTERNAL_UI_TEXT] ??
    INTERNAL_UI_TEXT["en"];

  const allArticles = getAllArticlesSorted();
  const latestArticles = allArticles.slice(0, 3);

  return (
    <>
    <section className="relative h-[calc(60vh+104px)] min-h-100 w-full mt-0 mb-16 overflow-hidden flex items-center justify-center">
      <Image
        src="/images/home/hero.jpg"
        alt="Japan Travel"
        fill
        priority
        style={{ objectFit: "cover" }}
        className="absolute inset-0 z-0"
      />

      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative text-center text-white p-8 pt-32.5 z-20">
        <h1 className="text-4xl font-bold mb-4">{text.home.intro}</h1>
        <p className="text-lg opacity-90">{text.home.sub_intro}</p>
      </div>
    </section>

      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8">
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-1 flex items-center gap-3">
              <span className="w-10 h-0.5 bg-brand-red"></span>
              {text.home.title}
            </h2>
            <p className="text-2xl font-semibold text-stone-800 mb-6">
              {text.home.sub_title}
            </p>
            <p className="text-lg text-stone-700 mb-10 leading-relaxed">
              {text.home.body_1}
            </p>

            <div className="space-y-8 mb-8">
              {/* About Service Section */}
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Rocket size={22} className="text-[#b11f2a]" />{" "}
                  {text.home.about_service}
                </h3>
                <ul className="list-none text-stone-600 space-y-3">
                  {[
                    text.home.about_service_1,
                    text.home.about_service_2,
                    text.home.about_service_3,
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* About Founder Section */}
              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <User size={22} className="text-[#b11f2a]" />{" "}
                  {text.home.about_founder}
                </h3>
                <ul className="list-none text-stone-600 space-y-3">
                  {[
                    text.home.about_founder_1,
                    text.home.about_founder_2,
                    text.home.about_founder_3,
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="grid grid-cols-3 gap-4 pt-3">
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/images/home/founder-1.jpg"
                      alt="Founder activity 1"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/images/home/founder-2.jpg"
                      alt="Founder activity 2"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="relative aspect-square w-full">
                    <Image
                      src="/images/home/founder-3.jpg"
                      alt="Founder activity 3"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-stone-500 italic border-l-4 border-stone-200 pl-4 py-1 mb-16">
              {text.home.service_mission}
            </p>

            <div className="lg:hidden w-full py-4 px-2">
              <div className="bg-stone-50 border border-dashed border-stone-200 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="absolute top-2 left-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Advertisement</span>
                <p className="text-stone-300 text-sm font-medium">Ads Placeholder</p>
              </div>
            </div>

            <section className="mb-16">
              <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                <Landmark size={28} className="text-[#b11f2a]" />{" "}
                {text.home.about_japan}
              </h2>
              <p className="text-lg text-stone-700 mb-8 leading-relaxed">
                {text.home.about_japan_detail}
              </p>

              <div className="relative w-full aspect-square mb-10 overflow-hidden">
                <Image
                  src="/images/home/japan-map.jpg"
                  alt="Map of Japan"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-stone-600">
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Sparkles size={22} className="text-amber-500" />{" "}
                    {text.home.key_chars}
                  </h3>
                  <ul className="list-none space-y-2">
                    {[
                      text.home.key_chars_1,
                      text.home.key_chars_2,
                      text.home.key_chars_3,
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-stone-400" />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <Trees size={22} className="text-green-600" />{" "}
                    {text.home.what_to_ex}
                  </h3>
                  <ul className="list-none space-y-2">
                    {[
                      text.home.what_to_ex_1,
                      text.home.what_to_ex_2,
                      text.home.what_to_ex_3,
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-stone-400" />{" "}
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </section>

          <div className="lg:hidden w-full py-4 px-2">
              <div className="bg-stone-50 border border-dashed border-stone-200 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="absolute top-2 left-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Advertisement</span>
                <p className="text-stone-300 text-sm font-medium">Ads Placeholder</p>
              </div>
            </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-6 flex items-center gap-3">
              <span className="w-10 h-0.5 bg-brand-red"></span>
              {text.home.region_tiles}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <span className="absolute top-2 left-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Advertisement</span>
                <p className="text-stone-300 text-sm font-medium">Ads Placeholder</p>
              </div>
            </div>

          <section className="py-10 mb-16">
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
                <span className="absolute top-2 left-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Advertisement</span>
                <p className="text-stone-300 text-sm font-medium">Ads Placeholder</p>
              </div>
            </div>

          <section className="mb-16">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-stone-900 flex items-center gap-3">
                <span className="w-10 h-0.5 bg-brand-red"></span>
                {text.home.feature_tiles}
              </h2>
              <h4 className="mb-8 text-sm text-stone-600">
                {text.home.feature_excuse}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {FEATURES_LIST.map((feature) => {
                  const key = feature.key as FeatureKey;
                  const href = FEATURE_LINK_MAP[key](locale);
                  const Icon = ICON_MAP[key];
                  return (
                    <Link
                      key={key}
                      href={href}
                      className="group block"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-stone-100 rounded-md group-hover:bg-amber-100 transition-colors">
                          <Icon className="w-5 h-5 text-stone-700 group-hover:text-brand-red" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-950 group-hover:text-brand-red transition-colors">
                          {text.home.feature_names[key]}
                        </h3>
                      </div>
                      <h4 className="mt-1 ml-11 text-base font-semibold text-stone-700 group-hover:text-brand-red transition-colors">
                        {text.home.feature_titles[key]}
                      </h4>
                      <p className="mt-3 ml-11 text-sm text-stone-600 leading-relaxed">
                        {text.home.feature_excerpts[key]}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="lg:hidden w-full py-4 px-2">
              <div className="bg-stone-50 border border-dashed border-stone-200 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden">
                <span className="absolute top-2 left-3 text-[9px] font-bold text-stone-400 uppercase tracking-widest">Advertisement</span>
                <p className="text-stone-300 text-sm font-medium">Ads Placeholder</p>
              </div>
            </div>

          <section className="mb-16 mt-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-8 flex items-center gap-3">
              <CalendarDays size={28} className="text-[#b11f2a]" />{" "}
              {text.home.calender}
            </h2>

            <div className="overflow-hidden rounded-xl border border-stone-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-100/50">
                  <tr>
                    <th className="py-4 px-4 text-stone-900 font-bold border-b text-sm uppercase tracking-wider">
                      {text.home.date}
                    </th>
                    <th className="py-4 px-4 text-stone-900 font-bold border-b text-sm uppercase tracking-wider">
                      {text.home.holidays}
                    </th>
                    <th className="py-4 px-4 text-stone-900 font-bold border-b text-sm uppercase tracking-wider">
                      {text.home.shotrip_insights}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">01/01</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.new_years_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.new_years_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">01/12</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.coming_of_age_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.coming_of_age_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">02/11</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.national_foundation_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.national_foundation_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">02/23</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.emperors_birthday}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.emperors_birthday_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">03/20</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.spring_equinox}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.spring_equinox_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">04/29</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.showa_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.showa_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">05/03-06</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.golden_week}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.golden_week_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">07/20</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.marine_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.marine_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">08/11</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.mountain_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.mountain_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">09/21</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.respect_for_the_aged_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.respect_for_the_aged_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">09/23</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.autumn_equinox}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.autumn_equinox_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">10/12</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.sports_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.sports_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">11/03</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.culture_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.culuture_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">11/23</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.labor_thanksgiving_day}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.labor_thanksgiving_day_insight}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-3 font-mono font-bold">12/31</td>
                    <td className="py-4 px-3 font-semibold text-stone-800">
                      {text.home.o_misoka}
                    </td>
                    <td className="py-4 px-3 text-stone-600">
                      {text.home.o_misoka_insight}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
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
                          <p className="text-[10px] text-gray-400 mt-1">{article.date}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            <div className="w-full max-w-md mx-auto lg:max-w-none border rounded-2xl p-8 bg-gray-50/50 border-dashed flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2">Advertisement</span>
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
