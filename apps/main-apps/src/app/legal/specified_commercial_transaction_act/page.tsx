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
  const title = "Specified Commercial Transaction Act | Shotrip";
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

export default function SpecifiedCommercialTransactionActPage() {
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
            Specified Commercial Transaction Act
          </span>
        </nav>
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-16 border border-slate-100">
          <div className="mb-6 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            This page is available in English only to avoid misunderstandings.
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <ShoppingBag className="text-slate-800 w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight">
              Specified Commercial Transaction Act
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
                    Service Provider
                  </td>
                  <td className="py-4 text-slate-600 tracking-wider">
                    Shotrip
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">Representative</td>
                  <td className="py-4 text-slate-600">Shota Harita</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">Address</td>
                  <td className="py-4 text-slate-600">[Address Here]</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">Phone Number</td>
                  <td className="py-4 text-slate-600">[Phone Number Here]</td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">Contact</td>
                  <td className="py-4 text-slate-600">
                    Please reach us via the Contact Form or
                    <br />
                    &quot;contact@shotrip.com&quot;
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-bold align-top">Service Fee</td>
                  <td className="py-4 text-slate-600 leading-relaxed">
                    Refer to the pricing displayed on the Chatbot Top-up page.
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 2. Payment & Currency (Payment Services Act integrated) */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
              Payment Methods & Currency
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
                We do not accept JPY or other local currencies. Please note that
                exchange rates and foreign transaction fees may be applied by
                your bank or credit card provider.
              </p>
              <div className="bg-white p-4 rounded border border-blue-200 text-slate-600">
                <p className="font-bold mb-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Secure Payment via Stripe
                </p>
                <p className="text-xs">
                  We use Stripe for all credit card transactions.{" "}
                  <strong>
                    Shotrip does not store or process your credit card
                    information
                  </strong>{" "}
                  on our servers. All sensitive data is handled securely by
                  Stripe.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Delivery & Returns */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <RefreshCcw className="w-5 h-5 mr-2 text-indigo-600" />
              Refund Policy & Digital Delivery
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>Service Delivery:</strong> Tokens are credited to your
                account immediately after the payment is confirmed via Stripe.
              </p>
              <div className="bg-slate-50 p-4 border-l-4 border-slate-300">
                <p className="font-bold text-slate-800 mb-2">
                  Refund Conditions
                </p>
                <p className="mb-2">
                  Due to the nature of digital tokens, all sales are generally
                  final.
                </p>
                <p className="flex items-center gap-2 text-slate-800 font-medium">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Exception for Unauthorized Charges:
                </p>
                <p className="mt-1 ml-6">
                  If you find a charge that you do not recognize, please contact
                  us through our <strong>Contact Form</strong> with the
                  transaction ID. We will investigate the request and determine
                  the refund eligibility.
                </p>
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
          <span className="mx-2">/</span>
          <span aria-current="page" className="text-gray-900 font-medium">
            Specified Commercial Transaction Act
          </span>
        </nav>
      </div>
    </div>
    </>
  );
}
