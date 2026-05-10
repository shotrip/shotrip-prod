import { Navbar } from "@/components/global/Navbar";
import ToTopButton from "@/components/global/ToTopButton";
import { Footer } from "@/components/global/Footer";
import { Header } from "@/components/global/Header";
import { FavoriteProvider } from "@/components/en_only/favoriteSpotContext";
import SpotModal from "@/components/en_only/spotModal";
import { TokenProvider } from "@/components/lens/tokenContext";
import ChatbotWidget from "@/components/lens/chatbotwidget";
import { Locale } from "@/types/params";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale as Locale;

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 left-0 w-full z-50">
        <Header locale={currentLocale} />
        <Navbar locale={currentLocale} />
      </div>

      <FavoriteProvider>
        <main className="w-full">{children}</main>
        <SpotModal />
        <TokenProvider>
          <ChatbotWidget />
        </TokenProvider>
      </FavoriteProvider>

      <ToTopButton />
      <Footer locale={currentLocale} />
    </div>
  );
}
