import "./globals.css";
import getLocaleFromHeaders from "@/lib/utils/getLocaleFromHeaders";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocaleFromHeaders();

  return (
    <html lang={locale}>
      <body>
        {children}
      </body>
    </html>
  );
}
