import { Locale, Categories } from "./params";

export type CategoryPageProps = {
    params: {
        locale: Locale;
        category: Categories;
    }
};