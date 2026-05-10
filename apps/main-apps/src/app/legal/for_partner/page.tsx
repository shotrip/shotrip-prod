import { Metadata } from "next";
import { Handshake, Building2, Youtube, Store, MessageSquare, Languages, MapPin, Camera, Globe } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "パートナーシップ・事業提携について | Shotrip";
  const description =
    "Shotripとの事業提携、自治体・企業様向けのインバウンド集客支援に関するお問い合わせはこちら。日本観光の新しい体験を共に創りましょう。";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/legal/for_partner`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/legal/for_partner`,
      type: "website",
      locale: "ja_JP",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ForPartnerPage() {
  return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-white py-4 px-6 sm:px-12 lg:px-24 text-slate-800 font-sans">
      <div className="max-w-5xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-12 text-xs text-gray-400 uppercase tracking-wider">
          <Link href="/en" className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            Business Partnership
          </span>
        </nav>
        <div className="mb-8 flex items-center gap-2 text-[11px] font-medium text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
          <span className="flex h-2 w-2 rounded-full bg-blue-400"></span>
          こちらのページは国内事業者・クリエイター様向けに日本語で作成されています。
        </div>

        {/* Header */}
        <div className="border-b-2 border-brand-red pb-8 mb-16">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3 italic">
            <Handshake className="text-brand-red w-10 h-10" />
            BUSINESS PARTNERSHIP
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            AI技術と多言語リソースで、日本の観光資源を世界へ正しく届ける。
          </p>
        </div>

        <div className="space-y-16">
          <section className="group">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-slate-900 p-2 rounded-lg text-white">
                <Building2 size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                ① 自治体・DMO様向け
              </h2>
            </div>
            <div className="grid md:grid-cols-12 gap-8 bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <div className="md:col-span-7 space-y-4 text-slate-600">
                <p className="font-bold text-slate-900 underline decoration-brand-red decoration-2 underline-offset-4">
                  貴自治体サイトに、インバウンド特化型AIチャットボットを導入します。
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    • 自治体独自の観光データを完全独立したDBで管理・運用
                  </li>
                  <li className="flex items-start gap-2">
                    • 観光情報の翻訳・DB投入・メンテナンスをShotripが代行
                  </li>
                  <li className="flex items-start gap-2">
                    • 月次での利用者傾向・分散型観光の提案レポート提供
                  </li>
                  <li className="flex items-start gap-2">
                    • 既存の自治体サイト自体の翻訳対応も応相談
                  </li>
                </ul>
              </div>
              <div className="md:col-span-5 bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-center">
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                  Pricing
                </p>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  月額 10万円
                  <span className="text-sm font-normal text-slate-500">
                    （税別）〜
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 leading-tight italic">
                  ※システム導入フローやサイト制約等の事前調査・ヒアリング後に正式な判断となります。
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-600 p-2 rounded-lg text-white">
                <Youtube size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                ② 海外リーチを狙うクリエイター・YouTuber様向け
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-200 p-6 rounded-xl hover:border-brand-red transition-colors group">
                <Languages className="mb-4 text-slate-400 group-hover:text-brand-red" />
                <h3 className="font-bold mb-2 text-lg">
                  多言語翻訳サポート（有償）
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  文字数ベースの単発依頼から、継続的な動画への字幕付与まで対応。ターゲット層の文化背景に基づいた「伝わる翻訳」で、グローバルな視聴者獲得を支援します。
                </p>
              </div>
              <div className="border border-slate-200 p-6 rounded-xl hover:border-brand-red transition-colors group">
                <Handshake className="mb-4 text-brand-red" />
                <h3 className="font-bold mb-2 text-lg text-brand-red-dark">
                  コンテンツ・アライアンス
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  「高品質な翻訳リソース」と「独自の現地観光情報」を相互に提供し合うパートナーシップ制度です。
                </p>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                  クリエイター様からの現地情報提供と、Shotripによる多言語化支援を掛け合わせることで、制作コストを抑えつつ、相互のプラットフォームでの相乗効果を目指します。※審査・面談あり
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-red p-2 rounded-lg text-white">
                <Store size={24} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                ③ 訪日外国人を集客したい店舗・施設様向け
              </h2>
            </div>
            <div className="grid md:grid-cols-12 gap-8 bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden shadow-xl">
              <div className="md:col-span-7 space-y-6 relative z-10">
                <p className="text-lg font-bold text-slate-300 underline decoration-brand-red decoration-2 underline-offset-4">
                  インバウンド視点での魅力を発掘し、世界へ発信。
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  実際に現地へ伺い、弊社メディア、AIチャットボット、デジタルスタンプラリーの各チャネルを通じて魅力を最大化します。
                </p>
                <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest">
                  <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20 flex items-center gap-1">
                    <Camera size={12} /> 実地取材
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20 flex items-center gap-1">
                    <Globe size={12} /> 多言語紹介
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full border border-white/20 flex items-center gap-1">
                    <MapPin size={12} /> AIルート誘導
                  </span>
                </div>
              </div>
              <div className="md:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 flex flex-col justify-center relative z-10">
                <p className="text-xs text-slate-400 uppercase font-bold mb-2">Conditions</p>
                <p className="text-xl font-bold text-white mb-2">内容により応相談</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  ※交通費・宿泊費、紹介料等は別途検討。まずは詳細をお聞かせください。
                </p>
              </div>
              <MapPin className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5 -rotate-12" />
            </div>
          </section>
        </div>

        {/* Final CTA */}
        <div className="mt-20 pt-12 border-t text-center">
          <h2 className="text-xl font-bold mb-6 text-slate-800">
            すべての窓口はこちらから
          </h2>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 mx-auto bg-slate-900 hover:bg-black text-white font-bold py-4 px-12 rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95 group"
          >
            <MessageSquare
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />
            <span>お問い合わせフォームへ</span>
          </Link>
          <h2 className="text-xl font-bold mb-6 mt-8 text-slate-800">または</h2>
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-slate-50 border border-slate-100 text-left space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Email
              </p>
              <a
                href="mailto:info@shotrip.com"
                className="text-slate-900 font-bold hover:text-brand-red transition-colors"
              >
                info@shotrip.com
              </a>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Phone
              </p>
              <p className="text-slate-900 font-bold">0xx-xxxx-xxxx</p>
              <p className="mt-2 text-[11px] text-slate-400 leading-relaxed italic">
                ※お電話については対応不可の場合がございますので、その際はお手数おかけしますが留守電にメッセージをいただけますと幸いです。
              </p>
            </div>
          </div>
        </div>
        <nav aria-label="Breadcrumb" className="mt-20 flex justify-end text-xs text-gray-400 uppercase tracking-wider">
          <Link href="/en" className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">Business Partnership</span>
        </nav>
      </div>
    </div>
    </>
  );
}
