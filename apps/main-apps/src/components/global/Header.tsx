import Link from "next/link";
import ArticleSearch from "./ArticleSearch";
import LocaleSwitcher from "./LocaleSwitcher";
import { HeaderProps } from "@/types/hearder";
import { UI_TEXT } from "@/lib/data/i18n/globalUi";
import Image from "next/image";

export async function Header({ locale }: HeaderProps) {
  const text = UI_TEXT[locale];

  return (
    <header className="z-50 w-full bg-transparent text-white overflow-visible">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 overflow-visible">
        <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo/logo13.png"
              alt="Shotrip Logo"
              width={200}
              height={109}
              className="h-14 w-auto object-contain py-1"
              priority
            />
          </Link>
        <div className="flex items-center gap-5">
          <ArticleSearch placeholder={text.header.searchPlaceholder} locale={locale} />
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
