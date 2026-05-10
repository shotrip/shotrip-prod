export const LOCALES = ["en", "fr", "es", "de", "it", "th", "vi"] as const;

export const REGIONS = {
    hokkaido: ['central_hokkaido', 'southern_hokkaido', 'northern_hokkaido', 'eastern_hokkaido'],
    tohoku: ['aomori', 'akita', 'iwate', 'miyagi', 'yamagata', 'fukushima'],
    kanto: ['tokyo', 'kanagawa', 'chiba', 'saitama', 'ibaraki', 'tochigi', 'gunma'],
    hokuriku: ['toyama', 'ishikawa', 'fukui', 'nigata'],
    chubu: ['yamanashi', 'shizuoka', 'nagano', 'aichi', 'gifu'],
    kansai: ['osaka', 'kyoto', 'hyogo', 'shiga', 'mie', 'nara', 'wakayama'],
    chugoku: ['okayama', 'hiroshima', 'yamaguchi', 'tottori', 'shimane'],
    shikoku: ['kagawa', 'ehime', 'kochi', 'tokushima'],
    kyushu: ['fukuoka', 'oita', 'miyazaki', 'saga', 'nagasaki', 'kumamoto', 'kagoshima'],
    okinawa: ['main_island', 'remote_islands'],
} as const;

export const CATEGORIES = ["food", "culture", "transportation", "manner"] as const;