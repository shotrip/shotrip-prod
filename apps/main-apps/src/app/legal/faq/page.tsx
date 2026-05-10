import { Metadata } from "next";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "FAQ - Frequently Asked Questions | Shotrip";
  const description = "Find answers to common questions about Shotrip, including how to use Shotrip Lens, digital stamp rallies, and token plans for your Japan trip.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/legal/faq`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/legal/faq`,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function FaqPage() {

  const faqs = [
  {
    q: "Is the chatbot available for free?",
    a: "Yes, it can be used for free with a limit of 10 times per week. For usage beyond this limit, please top up your tokens."
  },
  {
    q: "Is login required?",
    a: "Login is required to use the chatbot and the stamp rally features. There are no fees associated with creating an account or logging in."
  },
  {
    q: "How can I delete my account?",
    a: "While logged in, navigate to the chatbot or stamp rally page and click on your account icon. You can select 'Delete Account' from the dropdown menu. Please note that once an account is deleted, it cannot be recovered."
  },
  {
    q: "Is payment via PayPal possible?",
    a: "Currently, PayPal is not supported. We will consider introducing it once Stripe starts supporting PayPal in Japan."
  },
  {
    q: "How can I use languages other than English?",
    a: "At this time, we do not have plans for multilingual support; our blog posts, chatbot, and stamp rally are provided in English only. Pages including legal notices are provided only in English to avoid misunderstandings. Our Contact Form supports only English and Japanese based on the owner's available languages."
  },
  {
    q: "What personal information is used?",
    a: "Signing up with a Gmail address is required for the chatbot and stamp rally. We use your email address solely for account management, not for other purposes. Any user attributes collected after sign-up are used only for service analysis and do not require information that identifies you personally."
  },
  {
    q: "I accidentally purchased tokens. Can I get a refund?",
    a: "Refunds are not available except in cases of unauthorized billing. If you notice any suspicious charges, please contact us via the Contact Form. We will investigate and respond immediately."
  }
];

    return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-4xl mx-auto px-6 pt-4">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-400 uppercase tracking-wider">
          <Link href="/en" className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">FAQ</span>
        </nav>
      </div>
      <section className="pt-8 pb-8 px-6 max-w-4xl mx-auto">
        <div className="mb-10 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
          This page is available in English only to avoid misunderstandings.
        </div>

        <div className="flex items-center gap-3 mb-4 text-slate-400">
          <HelpCircle size={20} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Support</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">FAQ</h1>
      </section>

      <section className="max-w-4xl mx-auto px-6">
        <div className="space-y-12">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Q: {faq.q}
              </h2>
              <div className="text-slate-500 text-[15px] leading-relaxed pl-6 border-l-2 border-slate-100">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      <div className="mt-24 p-8 rounded-3xl bg-slate-50 border border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
            事業者/クリエイター様向け
          </h2>
          <div className="text-[13px] text-slate-600 leading-relaxed space-y-2">
            <p>
              事業者/クリエイターの方はContact Formまたは
              <Link 
                href="/legal/for_partner" 
                className="text-slate-900 font-bold underline underline-offset-4 hover:text-brand-red transition-colors mx-1"
              >
                こちら
              </Link>
              のページに記載のメールアドレス、電話番号からご連絡ください。
            </p>
            <p className="text-[12px] text-slate-400 italic">
              ※お電話については対応不可の場合がございますので、その際はお手数おかけしますが留守電にメッセージをいただけますと幸いです。
            </p>
          </div>
        </div>

        {/* Home Back Link (Optional) */}
        <div className="mt-16 pt-8 border-t border-slate-50 flex justify-end">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400 uppercase tracking-wider">
            <Link href="/en" className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span aria-current="page" className="text-gray-900 font-medium">FAQ</span>
          </nav>
        </div>
      </section>
    </div>
    </>
  );
}