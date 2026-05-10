import { Categories, Locale, Prefecture, Region } from "./params";

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  date: string;
  tags: string[];
}

export type ArticleInfiniteGridForEssentialsProps = {
  articles: Article[];
  locale: Locale;
  category: Categories;
}

export type ArticleInfiniteGridForPrefecturesProps = {
  articles: Article[];
  locale: Locale;
  region: Region;
  prefecture: Prefecture;
}