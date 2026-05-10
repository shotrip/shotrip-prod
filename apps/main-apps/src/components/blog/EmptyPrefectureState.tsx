import { EmptyPrefectureStatePageProps } from "@/types/emptyStatePage";
import { INTERNAL_UI_TEXT } from "@/lib/data/i18n/internalUi";

export default function EmptyPrefectureState({
    prefectureLabel,
    locale,
}: EmptyPrefectureStatePageProps) {

    const text = INTERNAL_UI_TEXT[locale];

    return (
        <div className="rounded-xl border border-dashed p-12 text-cetner text-gray-600">
            <h3 className="text-xl font-seibold mb-4">
                🚧 {text.empty_pref_state.comment_1}
            </h3>
            <p className="mb-2">
                {text.empty_pref_state.comment_2} <strong>{prefectureLabel}</strong>

            </p>
            <p className="mb-6">
                {text.empty_pref_state.comment_3}<br/>
                {text.empty_pref_state.comment_4}
            </p>
            <p className="text-sm text-gray-500">
                {text.empty_pref_state.comment_5}🌱
            </p>
        </div>
    );
}