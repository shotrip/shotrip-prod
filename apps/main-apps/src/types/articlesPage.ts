import { Region, Prefecture, Locale, Categories } from "./params"

export type RegionalArticlePageProps = {
    params: {
        locale: Locale,
        region: Region,
        prefecture: Prefecture,
        slug: string,
    }
}

export type EssentialslArticlePageProps = {
    params: {
        locale: Locale,
        category: Categories,
        slug: string,
    }
}