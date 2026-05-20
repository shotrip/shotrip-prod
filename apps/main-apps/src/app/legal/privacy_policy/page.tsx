import { Metadata } from "next";
import {
  ShieldCheck,
  MapPin,
  MicOff,
  Lock,
  Mail,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/global/PageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Privacy Policy | Shotrip";
  const description =
    "Shotrip's privacy policy, outlining how we collect, use, and protect your personal data and travel preferences for a secure experience.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/legal/privacy_policy`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/legal/privacy_policy`,
      type: "website",
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </span>
        </nav>
        <div className="bg-white shadow-sm rounded-lg p-8 md:p-16 border border-slate-100">
          <div className="mb-6 flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-50 w-fit px-3 py-1 rounded-full border border-amber-100">
            <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
            This page is available in English only to avoid misunderstandings.
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="text-slate-800 w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-tight">
              Privacy Policy
            </h1>
          </div>

          <p className="mb-10 text-sm text-slate-500 italic border-b pb-6" />

          {/* Section 1: Data Usage (Mail & Token) */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              1. Personal Information & Third-Party Authentication
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>
                When you sign in using Google Authentication via AWS Cognito, we handle specific account details for the following purposes:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <strong>Authentication & Email:</strong> We collect and use your <strong>email address</strong> to link with your JWT (JSON Web Token), ensuring secure access to your account and responding to your inquiries.
                </li>
                <li>
                  <strong>Identity Provider (IdP) Metadata:</strong> Although the authentication interface may request access to your <strong>profile name and picture</strong> as part of standard Google OAuth requirements, <strong>Shotrip does not utilize, store, or track this profile data</strong> on our servers. It is handled exclusively within the stateless authentication lifecycle.
                </li>
              </ul>
              <p className="bg-slate-50 p-3 rounded text-xs italic">
                * Your authentication tokens are stored in your browser&apos;s
                LocalStorage. Cookies will not be used in any cases in our
                service.
              </p>
            </div>
          </section>

          {/* Section 2: AI & Analytics (The "Counter-Overtourism" Analysis) */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <MessageSquare className="w-5 h-5 mr-2 text-indigo-600" />
              2. Chatbot Interactions & Analysis
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
              <p>
                To improve our &quot;Counter-Overtourism&quot; initiatives, we
                analyze the prompts and interactions within our chatbot.
              </p>
              <div className="flex gap-4 items-center bg-indigo-50 p-4 rounded-md border border-indigo-100">
                <BarChart3 className="w-8 h-8 text-indigo-500 shrink-0" />
                <p className="text-indigo-900 font-medium">
                  We never process raw personal data for analysis. All
                  interaction logs are anonymized and aggregated into
                  statistical data to understand travel trends and improve our
                  AI&apos;s accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Client-Side Sensor Data */}
          <section className="mb-12 p-6 bg-green-50 border border-green-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-green-900 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-green-700" />
              3. Client-Side Sensor Data
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded shadow-sm">
                <MapPin className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-bold text-sm text-green-900">
                    GPS / Location
                  </p>
                  <p className="text-xs text-green-700">
                    Processed locally for real-time features. We do not store
                    your location history on our servers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded shadow-sm">
                <MicOff className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p className="font-bold text-sm text-green-900">
                    Microphone Access
                  </p>
                  <p className="text-xs text-green-700">
                    Audio is processed in-browser for interaction and is never
                    recorded or uploaded.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Data Security & System Integrity */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center text-slate-800">
              <ShieldCheck className="w-5 h-5 mr-2 text-slate-800" />
              4. Data Security & System Integrity
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                We implement multi-layered security measures to ensure your data
                remains confidential and protected:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <li className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1 underline decoration-slate-300">
                    End-to-End Encryption
                  </span>
                  All communications between your device and our servers are
                  encrypted using SSL/TLS protocols.
                </li>
                <li className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1 underline decoration-slate-300">
                    Stateless Auth
                  </span>
                  By using JWT and LocalStorage, we eliminate session-side
                  vulnerabilities common in traditional cookie-based systems.
                </li>
                <li className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1 underline decoration-slate-300">
                    Minimized Storage
                  </span>
                  We adhere to the principle of &quot;Data Minimization.&quot;
                  If we don&apos;t need it to provide our service, we don&apos;t
                  collect it.
                </li>
                <li className="bg-slate-50 p-3 rounded border border-slate-100">
                  <span className="font-bold text-slate-800 block mb-1 underline decoration-slate-300">
                    Secure AI Processing
                  </span>
                  Interaction logs are sanitized of PII (Personally Identifiable
                  Information) before being used for any analytical purposes.
                </li>
              </ul>
            </div>
          </section>

          {/* Footer info */}
          <div className="mt-16 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">
              Shotrip — Dedicated to privacy-first, sustainable travel in Japan.
            </p>
          </div>
        </div>
        <nav
          aria-label="Breadcrumb"
          className="mt-12 flex justify-end text-xs text-slate-400 uppercase tracking-wider"
        >
          <Link
            href="/en"
            className="after:content-['/'] after:mx-2 hover:text-slate-900 transition-colors"
          >
            Home
          </Link>
          <span aria-current="page" className="text-gray-900 font-medium">
            Privacy Policy
          </span>
        </nav>
      </div>
    </div>
    </>
  );
}
