import { Footer } from "@/components/global/Footer";
import { Navbar } from "@/components/global/Navbar";
import ToTopButton from "@/components/global/ToTopButton";
import { Header } from "@/components/global/Header";
import getLocaleFromHeaders from "@/lib/utils/getLocaleFromHeaders";

export default async function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocaleFromHeaders();

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-0 left-0 w-full z-50">
        <Header locale={locale} />
        <Navbar locale={locale} />
      </div>
      <main className="w-full">{children}</main>
      <ToTopButton />
      <Footer locale={locale} />
    </div>
  );
}
