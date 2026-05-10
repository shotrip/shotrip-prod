import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { AboutPageProps } from "@/types/aboutPage";
import { buildHrefLang } from "@/lib/seo/buildHrefLang";
import { LOCALES } from "@/lib/data/paramsData";
import { Metadata } from "next";
import { Cpu, Heart, Map, ShieldCheck, Zap, Award } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const currentLocale = (
    INTERNAL_UI_TEXT[locale as keyof typeof INTERNAL_UI_TEXT] ? locale : "en"
  ) as keyof typeof INTERNAL_UI_TEXT;
  const text = INTERNAL_UI_TEXT[currentLocale];

  const title = `${text.about_us.title} | Shotrip`;
  const description =
    text.about_us.description ||
    "Learn more about Shotrip, your ultimate guide to discovering hidden gems and local favorites across Japan.";

  const hrefLangMetadata = buildHrefLang("/about");

  return {
    ...hrefLangMetadata,
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/${currentLocale}/about`,
      siteName: "Shotrip",
      type: "website",
      images: [
        {
          url: "/images/common/placeholder.jpg",
          width: 1200,
          height: 630,
          alt: "About Shotrip",
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({
    locale,
  }));
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const text = INTERNAL_UI_TEXT[locale];
  return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-white text-slate-900 pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-gray-400 uppercase tracking-wider"
        >
          <Link
            href={`/${locale}`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.others.common_breadcrumb.home}
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            {text.about_us.title}
          </span>
        </nav>
      </div>
      {/* Hero Section: Bold but not overwhelming */}
      <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center border-b border-slate-100">
        <h1 className="text-4xl font-extrabold tracking-tight mb-8 text-slate-950 leading-tight">
          {text.about_us.h1_1}
          <br />
          {text.about_us.h1_2}
          <span className="text-brand-red">{text.about_us.h1_3}</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-3xl mx-auto">
          {text.about_us.description}
        </p>
      </section>

      {/* Philosophy: Find Your Own Favorites */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-7 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {text.about_us.philosophy_section_title}
            </h2>
            <div className="text-slate-700 space-y-5 text-base leading-relaxed">
              <p>{text.about_us.philosophy_section_desc_1}</p>
              <p>{text.about_us.philosophy_section_desc_2}</p>
            </div>
          </div>
          <div className="md:col-span-5 bg-slate-50 p-12 rounded-3xl border border-slate-100 relative overflow-hidden">
            <Map className="w-16 h-16 text-brand-red/20 mb-6" />
            <p className="text-sm text-slate-600 leading-relaxed relative z-10">
              {text.about_us.philosophy_section_side_desc}
            </p>
            <Map className="absolute -right-10 -bottom-10 w-40 h-40 text-slate-100/50" />
          </div>
        </div>
      </section>

      {/* The System: ShotripLens & Commitments */}
      <section className="py-16 px-6 bg-slate-950 text-white rounded-[3rem] mx-4 md:mx-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <Cpu className="text-brand-red w-7 h-7" />
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
                  {text.about_us.system_section_title}
                </h2>
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight text-white leading-tight">
                {text.about_us.system_section_sub_title_1}
                <br />
                {text.about_us.system_section_sub_title_2}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {text.about_us.system_section_desc}
              </p>

              {/* Founder's Credibility Tag */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 p-2 px-4 rounded-full text-[11px] text-slate-400 font-medium">
                <Award size={14} className="text-brand-red" />
                {text.about_us.system_section_card}
              </div>
            </div>

            <div className="flex-1 border-l border-white/10 pl-0 md:pl-16 md:pt-0">
              <h3 className="text-xl font-bold mb-8 text-slate-100 tracking-tight">
                {text.about_us.system_section_commitment_title}
              </h3>
              <ul className="space-y-8">
                <li className="flex gap-5">
                  <ShieldCheck className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1.5">
                      {text.about_us.system_section_commitment_sub_title_1}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {text.about_us.system_section_commitment_desc_1}
                    </p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <Heart className="w-6 h-6 text-brand-red shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1.5">
                      {text.about_us.system_section_commitment_sub_title_2}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {text.about_us.system_section_commitment_desc_2}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-28 px-6 max-w-4xl mx-auto text-center relative">
        <Zap className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-12 text-slate-100" />
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400 mb-6 font-mono pt-10">
          {text.about_us.future_vision_section_title}
        </h2>
        <h3 className="text-3xl font-extrabold mb-8 tracking-tighter text-slate-950">
          {text.about_us.future_vision_section_sub_title}
        </h3>
        <p className="text-slate-700 text-base leading-relaxed mb-16 max-w-3xl mx-auto">
          {text.about_us.future_vision_section_desc}
        </p>

        {/* Founder's Note */}
        <div className="mt-20 pt-12 border-t border-slate-100 max-w-2xl mx-auto">
          <p className="text-xs italic text-slate-500 leading-relaxed">
            {text.about_us.founder_notes}
          </p>
        </div>
        <nav
          aria-label="Breadcrumb"
          className="mt-16 flex justify-end text-xs text-gray-400 uppercase tracking-wider text-right"
        >
          <Link
            href={`/${locale}`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.others.common_breadcrumb.home}
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            {text.about_us.title}
          </span>
        </nav>
      </section>
    </div>
  </>
  );
}
