import { CATEGORIES, LOCALES, REGIONS } from "@/lib/data/paramsData";

export type Locale = typeof LOCALES[number];
export type Region = keyof typeof REGIONS;
export type Prefecture<R extends Region = Region> = (typeof REGIONS)[R][number]
export type Categories = typeof CATEGORIES[number];

export const SLUG_REGEX = /^[a-z]+(?:-[a-z]+){2}$/;