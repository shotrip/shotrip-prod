import { BookOpen, Bot, Map, Video } from "lucide-react";

export const FEATURES_LIST = [
    { key: "articles" },
    { key: "lens" },
    { key: "stamp" },
    { key: "videos" },
] as const;

export const ICON_MAP = {
  articles: BookOpen,
  lens: Bot,
  stamp: Map,
  videos: Video,
};
