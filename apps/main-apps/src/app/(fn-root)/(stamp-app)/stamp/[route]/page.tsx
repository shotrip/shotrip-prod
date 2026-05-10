import StampClient from "@/components/stamp/stampClient";
import { Metadata } from "next";
import { TokenProvider } from "@/components/lens/tokenContext";
import ChatbotWidget from "@/components/lens/chatbotwidget";
import { VALID_STAMP_SLUGS } from "@/lib/data/routes";
import { FnPageHeader } from "@/components/en_only/FnPageHeader";
import { ENV } from "@/config/env";

export function generateStaticParams() {
  return VALID_STAMP_SLUGS.map((slug) => ({
    route: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ route: string }>;
}): Promise<Metadata> {
  const { route } = await params;

  const routeName = route
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const title = `Digital Stamp Rally: ${routeName} | Shotrip`;
  const description = `Join the free digital stamp rally for ${routeName} in Japan! Collect stamps at stations and landmarks while exploring with Shotrip.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${ENV.PROD_URL}/stamp/${route}`,
    },
    openGraph: {
      title,
      description,
      url: `${ENV.PROD_URL}/stamp/${route}`,
      type: "website",
      images: [
        {
          url: `/images/common/placeholder.jpg`,
          width: 1200,
          height: 630,
          alt: `${routeName} Stamp Rally`,
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

export default async function StampRallyPage({
  params,
}: {
  params: { route: string };
}) {
  const { route } = await params;

  return (
    <>
      <FnPageHeader />
      <TokenProvider>
        <div className="flex flex-col h-full w-full">
          <main className="flex-1 relative">
            <ChatbotWidget />
            <StampClient routeKey={route} />
          </main>
        </div>
      </TokenProvider>
    </>
  );
}
