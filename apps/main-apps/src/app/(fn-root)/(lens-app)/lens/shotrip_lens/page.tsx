import { Metadata } from "next";
import Shotrip_Lens_Client from "@/components/lens/shotrip_lens_client";
import getLocaleFromHeaders from "@/lib/utils/getLocaleFromHeaders";
import SideLinks from "@/components/global/sideLinks";
import { RemainingTokenClient } from "@/components/lens/remainingTokenClient";
import { TokenProvider } from "@/components/lens/tokenContext";
import { FnPageHeader } from "@/components/en_only/FnPageHeader";
import { ENV } from "@/config/env";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Shotrip Lens | AI Travel Concierge";
  const description =
    "Ask Shotrip Lens anything about your Japan trip. Our AI-powered concierge provides real-time answers and travel tips.";

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/lens/shotrip_lens`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/lens/shotrip_lens`,
      siteName: "Shotrip",
      type: "website",
      images: [
        {
          url: "/images/common/placeholder.jpg",
          width: 1200,
          height: 630,
          alt: "Shotrip Lens - AI Concierge",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function Shotrip_Lens_Page() {
  const locale = await getLocaleFromHeaders();
  const containerHeight = "h-[calc(100vh-56px)]";

  return (
    <>
    <FnPageHeader />
    
    <TokenProvider>
      <div className={`flex w-full ${containerHeight} overflow-hidden`}>
        <aside className="shrink-0 h-full">
        <SideLinks locale={locale}>
          <div className="w-full">
            <RemainingTokenClient />
          </div>
        </SideLinks>
        </aside>
        <main className="flex-1 relative overflow-y-auto">
          <Shotrip_Lens_Client
            lensContext={{
              tenantId: ENV.LENS_CONTEXT.tenantId,
              namespace: ENV.LENS_CONTEXT.namespace,
              token: ENV.LENS_CONTEXT.token,
            }}
          />
        </main>
      </div>
    </TokenProvider>
    </>
  );
}
