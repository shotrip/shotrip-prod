import { PREFECTURES_LIST } from "@/lib/data/prefectruesLabels";

export type PrefecturesKey = typeof PREFECTURES_LIST[keyof typeof PREFECTURES_LIST][number]["key"];