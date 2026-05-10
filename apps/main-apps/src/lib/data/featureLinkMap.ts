import { FeatureKey } from "@/types/featureKey";
import { Locale } from "@/types/params";

export const FEATURE_LINK_MAP: Record<FeatureKey, (locale: Locale) => string> = {
    articles: (locale) => `/${locale}/blog`,
    lens: () => `/lens`,
    stamp: () => `/stamp`,
    videos: () => "https://www.youtube.com/",
}