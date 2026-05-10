import { EnHeader } from "@/components/en_only/enHeader";
import getLocaleFromHeaders from "@/lib/utils/getLocaleFromHeaders";
import AmplifyConfigure from "@/components/en_only/amplifyConfigure";
import { ProfileRegistrationModal } from "@/components/en_only/profileRegstrationModal";
import SpotModal from "@/components/en_only/spotModal";
import { FavoriteProvider } from "@/components/en_only/favoriteSpotContext";

export default async function FnRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocaleFromHeaders();

  return (
    <div className="flex flex-col h-dvh">
      <AmplifyConfigure />
      <FavoriteProvider>
        <SpotModal />
        <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <EnHeader locale={locale} />
          </div>
        </div>
        <ProfileRegistrationModal />
          <div className="flex-1 relative">{children}</div>
      </FavoriteProvider>
    </div>
  );
}