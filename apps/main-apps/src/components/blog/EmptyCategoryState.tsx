import { EmptyCategoryStatePageProps } from "@/types/emptyStatePage";
// import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";

export default function EmptyCategoryState({
    categoryLabel,
    // locale,
}: EmptyCategoryStatePageProps) {

    // const text = INTERNAL_UI_TEXT[locale];

    return (
        <div className="rounded-xl border border-dashed p-12 text-cetner text-gray-600">
            <h3 className="text-xl font-seibold mb-4">
                🚧 Coming Soon
            </h3>
            <p className="mb-2">
                We&apos;re still collectiong information about <strong>{categoryLabel}</strong>

            </p>
            <p className="mb-6">
                Artciles for this category will be added soon.<br/>
                Thank you for your patience!
            </p>
            <p className="text-sm text-gray-500">
                Shotrip grows step by step🌱
            </p>
        </div>
    );
}