import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";
import { SupportPageProps } from "@/types/supportPage";
import { buildHrefLang } from "@/lib/seo/buildHrefLang";
import { LOCALES } from "@/lib/data/paramsData";
import { Metadata } from "next";
import {
  Coffee,
  Fuel,
  Clock,
  MapPin,
  Monitor,
  Youtube,
  ArrowRight,
} from "lucide-react";
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

  const title = `${text.support_us.title} | Shotrip`;
  const description =
    text.support_us.description_1 ||
    "Support Shotrip to help us continue providing high-quality, hidden-gem travel guides and AI-powered assistance for Japan travelers.";

  const hrefLangMetadata = buildHrefLang("/support");

  return {
    ...hrefLangMetadata,
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/stamp/${currentLocale}/support`,
      type: "website",
      images: [
        {
          url: "/images/common/placeholder.jpg",
          width: 1200,
          height: 630,
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

export default async function Support({ params }: SupportPageProps) {
  const { locale } = await params;
  const text = INTERNAL_UI_TEXT[locale];

  return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-white text-slate-900 pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-12">
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
            {text.support_us.title}
          </span>
        </nav>
      </div>
      {/* Header */}
      <section className="pt-20 pb-10 px-6 max-w-4xl mx-auto text-center border-b border-slate-50">
        <span className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase block mb-4">
          {text.support_us.accent_label}
        </span>

        <h1 className="text-4xl font-black tracking-tighter mb-8 text-slate-900">
          {text.support_us.section_title}
        </h1>

        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="text-slate-600">{text.support_us.description_1}</p>

          <p className="text-slate-500">
            {text.support_us.description_2_1}{" "}
            <span className="font-bold text-slate-900">Buy Me a Coffee</span>{" "}
            {text.support_us.description_2_2}
          </p>
        </div>
      </section>

      {/* The Challenges (Why we need support) */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-12 text-center">
          {text.support_us.challenges_section_title}
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex gap-6 p-8 rounded-3xl border border-slate-100 bg-slate-50/50">
            <Clock className="text-brand-red shrink-0" size={28} />
            <div>
              <h3 className="font-bold mb-2">
                {text.support_us.challenges_section_sub_title_1}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {text.support_us.challenges_section_desc_1}
              </p>
            </div>
          </div>
          <div className="flex gap-6 p-8 rounded-3xl border border-slate-100 bg-slate-50/50">
            <Fuel className="text-brand-red shrink-0" size={28} />
            <div>
              <h3 className="font-bold mb-2">
                {text.support_us.challenges_section_sub_title_2}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {text.support_us.challenges_section_desc_2}
              </p>
            </div>
          </div>
          <div className="flex gap-6 p-8 rounded-3xl border border-slate-100 bg-slate-50/50">
            <MapPin className="text-brand-red shrink-0" size={28} />
            <div>
              <h3 className="font-bold mb-2">
                {text.support_us.challenges_section_sub_title_3}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {text.support_us.challenges_section_desc_3}
              </p>
            </div>
          </div>
          <div className="flex gap-6 p-8 rounded-3xl border border-slate-100 bg-slate-50/50">
            <Monitor className="text-brand-red shrink-0" size={28} />
            <div>
              <h3 className="font-bold mb-2">
                {text.support_us.challenges_section_sub_title_4}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {text.support_us.challenges_section_desc_4}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Support Section: Buy Me a Coffee */}
      <section className="py-16 px-4 bg-slate-950 text-white rounded-[3rem] mx-4 md:mx-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">
              {text.support_us.main_support_section_title}
            </h2>
            <p className="text-slate-400">
              {text.support_us.main_support_section_desc_1}{" "}
              <span className="text-white font-bold">Buy Me a Coffee</span>
              {text.support_us.main_support_section_desc_2}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Simple Donation */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <div>
                <Coffee className="text-brand-red mb-6" size={32} />
                <h4 className="text-xl font-bold mb-4">
                  {text.support_us.main_support_section_sub_title_1}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {text.support_us.main_support_section_sub_desc_1}
                </p>
              </div>
              <Link
                href={ENV.BUY_ME_A_COFFEE_URL}
                target="_blank"
                className="w-full py-4 bg-white text-slate-950 text-center font-bold rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
              >
                {text.support_us.main_support_section_link_1}{" "}
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Field Research Ticket */}
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-brand-red text-[10px] font-bold px-2 py-1 rounded tracking-tighter">
                {text.support_us.main_support_section_parts_1}
              </div>
              <div>
                <MapPin className="text-brand-red mb-6" size={32} />
                <h4 className="text-xl font-bold mb-4">
                  {text.support_us.main_support_section_sub_title_2}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  {text.support_us.main_support_section_sub_desc_2}
                </p>
                <div className="flex gap-4 mb-8">
                  <Youtube className="text-slate-500" size={20} />
                  <span className="text-xs text-slate-500">
                    {text.support_us.main_support_section_parts_2}
                  </span>
                </div>
              </div>
              <Link
                href="https://buymeacoffee.com/shotrip/e/528556"
                target="_blank"
                className="w-full py-4 bg-brand-red text-white text-center font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                {text.support_us.main_support_section_link_2}{" "}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Message */}
      <section className="py-24 px-6 text-center max-w-2xl mx-auto">
        <p className="text-slate-500 text-sm italic leading-relaxed">
          {text.support_us.closing_section}
        </p>
      </section>
      <div className="max-w-4xl mx-auto px-6">
        <nav
          aria-label="Breadcrumb"
          className="flex justify-end text-xs text-gray-400 uppercase tracking-wider"
        >
          <Link
            href={`/${locale}`}
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            {text.others.common_breadcrumb.home}
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            {text.support_us.title}
          </span>
        </nav>
      </div>
    </div>
    </>
  );
}
