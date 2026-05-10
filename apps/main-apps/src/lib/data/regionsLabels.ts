export const REGIONS_LIST = [
  { key: "hokkaido", label: "Hokkaido" },
  { key: "tohoku", label: "Tohoku" },
  { key: "kanto", label: "Kanto" },
  { key: "hokuriku", label: "Hokuriku" },
  { key: "chubu", label: "Chubu" },
  { key: "kansai", label: "Kansai" },
  { key: "chugoku", label: "Chugoku" },
  { key: "shikoku", label: "Shikoku" },
  { key: "kyushu", label: "Kyushu" },
  { key: "okinawa", label: "Okinawa" },
] as const;

export const REGIONS_KEY = [
  { key: "hokkaido" },
  { key: "tohoku" },
  { key: "kanto" },
  { key: "hokuriku" },
  { key: "chubu" },
  { key: "kansai" },
  { key: "chugoku" },
  { key: "shikoku" },
  { key: "kyushu" },
  { key: "okinawa" },
] as const;

export const REGION_MAP_CONFIG: Record<string, { lat: number; lng: number; zoom: number }> = {
  hokkaido: { lat: 43.5, lng: 142.8, zoom: 7 },
  tohoku:   { lat: 39.0, lng: 140.7, zoom: 7 },
  kanto:    { lat: 36.0, lng: 139.7, zoom: 8 },
  hokuriku: { lat: 36.7, lng: 137.0, zoom: 8 },
  chubu:    { lat: 35.5, lng: 137.3, zoom: 8 },
  kansai:    { lat: 34.6, lng: 135.5, zoom: 8 },
  chugoku:  { lat: 35.0, lng: 133.5, zoom: 8 },
  shikoku:  { lat: 33.7, lng: 133.5, zoom: 8 },
  kyushu:   { lat: 32.5, lng: 130.8, zoom: 8 },
  okinawa:  { lat: 26.3, lng: 127.8, zoom: 7 },
};