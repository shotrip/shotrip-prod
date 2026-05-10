import { EnFooter } from "@/components/en_only/enFooter";
import { EnNavbar } from "@/components/en_only/enNavbar";
import ToTopButton from "@/components/global/ToTopButton";
import getLocaleFromHeaders from "@/lib/utils/getLocaleFromHeaders";
import { TokenProvider } from "@/components/lens/tokenContext";
import ChatbotWidget from "@/components/lens/chatbotwidget";
import AmplifyConfigure from "@/components/en_only/amplifyConfigure";
import { FavoriteProvider } from "@/components/en_only/favoriteSpotContext";
import SpotModal from "@/components/en_only/spotModal";
import { EnHeader } from "@/components/en_only/enHeader";
import { ProfileRegistrationModal } from "@/components/en_only/profileRegstrationModal";

export default async function StampHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocaleFromHeaders();
  return (
    <div className="flex flex-col h-dvh">
      <AmplifyConfigure />
      <FavoriteProvider>
        <SpotModal />
        <ProfileRegistrationModal />
        <div className="flex-1 relative">
          <div className="flex flex-col min-h-full">
            <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
              <div className="pointer-events-auto">
                <EnHeader locale={locale} />
                <EnNavbar locale={locale} />
              </div>
            </div>
            <main className="flex-1 overflow-y-auto">
              <div className="mx-auto w-full">{children}</div>
            </main>
            <TokenProvider>
              <ChatbotWidget />
            </TokenProvider>
            <ToTopButton />
            <EnFooter locale={locale} />
          </div>
        </div>
      </FavoriteProvider>
    </div>
  );
}
