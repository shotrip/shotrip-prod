import Link from "next/link";
import ArticleSearch from "../global/ArticleSearch";
import { HeaderProps } from "@/types/hearder";
import Auth_MenuButton from "./auth_MenuButton";
import Image from "next/image";

export async function EnHeader({ locale }: HeaderProps) {
  return (
    <>
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
            <ArticleSearch placeholder="Search articles (in English)" locale={locale}/>
            <Auth_MenuButton />
          </div>
        </div>
      </header>
    </>
  );
}
