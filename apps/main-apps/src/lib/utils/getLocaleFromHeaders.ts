import { Locale } from "@/types/params";

export default async function getLocaleFromHeaders(): Promise<Locale> {
  return "en";
}