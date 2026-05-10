import { Locale, Region, Prefecture } from "./params"

export type PrefPageProps = {
    params: {
        locale: Locale,
        region: Region,
        prefecture: Prefecture,
    }
}