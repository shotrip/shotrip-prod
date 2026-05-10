import { ENV } from "@/config/env";
import { LOCALES } from "../data/paramsData";
import type { Metadata } from "next";

export function buildHrefLang(
    canonicalPath: string
): Metadata {

    if (!canonicalPath.startsWith("/")) {
        throw new Error(`canonicalPath must start with "/": ${canonicalPath}`);
    }

    if (canonicalPath.includes("undefined")) {
        throw new Error(`canonicalPath contains undefined: ${canonicalPath}`);
    }

    return {
        alternates: {
            canonical: canonicalPath,
            languages: {
                ...Object.fromEntries(
                    LOCALES.map((l) => [l, `${ENV.PROD_URL}/${l}${canonicalPath}`])
                ),
                "x-default": `/en${canonicalPath}`,
            },
        },
    };
}