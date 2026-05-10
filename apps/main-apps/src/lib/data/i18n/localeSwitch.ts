import { Locale } from "@/types/params"
import * as Flags from "country-flag-icons/react/3x2";

export const LABEL: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  th: "ไทย",
  vi: "Tiếng Việt",
};

export const FLAG_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  en: Flags.GB, fr: Flags.FR, de: Flags.DE, es: Flags.ES, it: Flags.IT, th: Flags.TH, vi: Flags.VN,
};