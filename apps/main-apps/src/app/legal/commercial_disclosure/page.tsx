import { Metadata } from "next";
import {
  ShoppingBag,
  CreditCard,
  RefreshCcw,
  HelpCircle,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Commercial Disclosure (特定商取引法に基づく表記) | Shotrip";
  const description =
    "Legal disclosures required by the Specified Commercial Transaction Act for Shotrip's paid services and token purchases.";

  return {
    title,
    description,
    alternates: {
      canonical:
        `${ENV.PROD_URL}/legal/specified_commercial_transaction_act`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/legal/specified_commercial_transaction_act`,
      type: "website",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function CommercialDisclosurePage() {
  return (
    <>
    <PageHeader />
    <div className="min-h-screen bg-slate-50 py-12 px-6 sm:px-12 lg:px-24 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 text-xs text-slate-400 uppercase tracking-wider"
        >
          <Link
            href="/en"
            className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
          >
            Home
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            Commercial Disclosure
          </span>
        </nav>
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-16 border border-slate-100">
          <div className="mb-6 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            This page contains disclosures required under the Japanese law (特定商取引法に基づく表記).
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="text-slate-800 w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight">
              Commercial Disclosure
              <span className="block text-lg font-normal text-slate-500 mt-1">（特定商取引法に基づく表記）</span>
            </h1>
          </div>

          <p className="mb-10 text-sm text-slate-500 italic border-b pb-6">
            Legal disclosure for digital transactions on Shotrip.
          </p>

          {/* 1. Basic Info */}
          <section className="mb-12 overflow-x-auto">
            <table className="w-full text-sm border-collapse table-fixed">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-4 font-bold w-40 md:w-1/3 align-top">
                    Legal Name / Service Provider
                    <span className="block text-xs font-normal text-slate-400">（販売業者）</span>
                  </td>
                  <td className="py-4 text-slate-600 tracking-wider">
                    Shotrip
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Head of Operations
                    <span className="block text-xs font-normal text-slate-400">（運営責任者）</span>
                  </td>
                  <td className="py-4 text-slate-600">Shota Harita</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Address
                    <span className="block text-xs font-normal text-slate-400">（所在地）</span>
                  </td>
                  <td className="py-4 text-slate-600">[Address Here]</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Phone Number
                    <span className="block text-xs font-normal text-slate-400">（電話番号）</span>
                  </td>
                  <td className="py-4 text-slate-600">
                    [Phone Number Here]
                    <br />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Email Address
                    <span className="block text-xs font-normal text-slate-400">（メールアドレス）</span>
                  </td>
                  <td className="py-4 text-slate-600">
                    contact@shotrip.jp
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Price
                    <span className="block text-xs font-normal text-slate-400">（販売価格）</span>
                  </td>
                  <td className="py-4 text-slate-600 leading-relaxed space-y-2">
                    <ul className="list-disc list-inside space-y-1">
                      <li>30 tokens : $3</li>
                      <li>100 tokens : $6</li>
                      <li>1 mo unlimited : $7</li>
                      <li>Request a field report : $50 (through Buy Me A Coffee)</li>
                    </ul>
                    <p className="text-xs text-slate-400 pt-1">
                      For more detailed product descriptions, please refer to the{" "}
                      <Link href="/lens#token" className="text-blue-600 underline hover:text-blue-800 transition-colors">
                        Product Details Section
                      </Link>
                      {" "}or
                      <Link href="/en/support" className="text-blue-600 underline hover:text-blue-800 transition-colors">
                      {" "}Support Us Section
                      </Link>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Additional Fees
                    <span className="block text-xs font-normal text-slate-400">（商品代金以外の必要料金）</span>
                  </td>
                  <td className="py-4 text-slate-600 leading-relaxed">
                    No additional fees apply other than standard internet connection fees. Foreign transaction or exchange fees may be applied by your card issuer.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Payment Period
                    <span className="block text-xs font-normal text-slate-400">（代金の支払時期）</span>
                  </td>
                  <td className="py-4 text-slate-600 leading-relaxed">
                    Payments are processed immediately at the time of purchase.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Delivery Times
                    <span className="block text-xs font-normal text-slate-400">（商品の引渡時期）</span>
                  </td>
                  <td className="py-4 text-slate-600 leading-relaxed">
                    Tokens or digital services are provisioned and credited to your account immediately after the payment transaction is completed.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">
                    Exchanges & Returns Policy
                    <span className="block text-xs font-normal text-slate-400">（返品・交換について）</span>
                  </td>
                  <td className="py-4 text-slate-600 leading-relaxed space-y-3">
                    <div>
                      <strong className="block text-slate-800 text-xs uppercase tracking-wider mb-0.5">&lt;Customer-requested Returns/Exchanges&gt;</strong>
                      <p>Due to the nature of digital goods, cancellations, returns, or exchanges after purchase are generally not accepted.</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <strong className="block text-slate-800 text-xs uppercase tracking-wider mb-0.5">&lt;Defective Goods or Service Malfunctions&gt;</strong>
                      <p>If there is a technical defect or system error with the digital service, please contact us via our support email. We will investigate and process a refund or correct the token balance without delay.</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 2. Payment & Currency */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              Accepted Payment Methods & Currency
            </h2>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-blue-900 leading-relaxed font-medium text-base">
                  All transactions are processed in{" "}
                  <span className="underline decoration-blue-400">
                    USD (United States Dollar)
                  </span>
                  .
                </p>
              </div>
              <p className="text-blue-800 ml-8 leading-relaxed">
                We accept major credit cards, Google Pay, and other payment options processed securely through Stripe. Please note that exchange rates and foreign transaction fees may be applied by your bank or credit card provider.
              </p>
              <div className="bg-white p-4 rounded border border-blue-200 text-slate-600">
                <p className="font-bold mb-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Secure Payment via Stripe
                </p>
                <p className="text-xs">
                  We use Stripe for all payment transactions.{" "}
                  <strong>
                    Shotrip does not store or process your credit card information
                  </strong>{" "}
                  on our servers. All sensitive data is handled securely by Stripe.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Refund Policy & Fraud Support */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <RefreshCcw className="w-5 h-5 mr-2 text-indigo-600" />
              Refund Policy & Support
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Service Delivery:</strong> Tokens are credited to your
                account immediately after the payment is confirmed.
              </p>
              <div className="bg-slate-50 p-5 border-l-4 border-slate-300 space-y-3">
                <div>
                  <p className="font-bold text-slate-800 mb-1">Refund Conditions</p>
                  <p>Due to the nature of digital tokens, all sales are generally final.</p>
                </div>
                
                <div className="pt-2 border-t border-slate-200">
                  <p className="flex items-center gap-2 text-slate-800 font-medium mb-1">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    Suspicion of Unauthorized Charges
                    <span className="text-xs font-normal text-slate-400">（不正利用が疑われる場合）</span>
                  </p>
                  <p className="text-slate-700 bg-white p-3 rounded border border-slate-200 text-xs leading-relaxed">
                    If you notice any unauthorized charges on your account, please contact us immediately at <strong>contact@shotrip.jp</strong> with your transaction ID. We will investigate the issue and take appropriate measures.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer info */}
          <div className="mt-16 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">
              Compliant with the Japanese Specified Commercial Transaction Act.
            </p>
          </div>
        </div>
        <nav
          aria-label="Breadcrumb"
          className="mt-12 flex justify-end text-xs text-slate-400 uppercase tracking-wider"
        >
          <Link
            href="/en"
            className="after:content-['/'] after:mx-2 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            Commercial Disclosure
          </span>
        </nav>
      </div>
    </div>
    </>
  );
}
