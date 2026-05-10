export interface SearchIndexItem {
  slug: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  date: string;
  type: "regional" | "essentials";
  region?: string;
  prefecture?: string;
  category?: string;
}