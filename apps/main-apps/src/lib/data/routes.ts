import { RouteKey } from "@/types/route";

export const STAMP_ROUTES = [
  {
    region: "Hokkaido",
    routes: [
      { key: "hokkaido-central-leisure", label: "Hokkaido Central Leisure" },
    ],
  },
  {
    region: "Tohoku",
    routes: [
      { key: "fukushima-railway-excursion", label: "Fukushima Railway Excursion" },
    ],
  },
  {
    region: "Kanto",
    routes: [
      { key: "chiba-resort-tour", label: "Chiba Resort Tour" },
    ],
  },
  {
    region: "Hokuriku",
    routes: [
      { key: "niigata-specialties-tour", label: "Niigata Specialties Tour" },
    ],
  },
  {
    region: "Chubu",
    routes: [
      { key: "aichi-peninsula-excursion", label: "Aichi Peninsula Excursion" },
    ],
  },
  {
    region: "Kansai",
    routes: [
      { key: "kyoto-deep-excursion", label: "Kyoto Deep Excursion" }
    ],
  },
  {
    region: "Chugoku",
    routes: [
      { key: "okayama-kojima-sightseeing", label: "Okayama Kojima Sightseeing" },
    ],
  },
  {
    region: "Shikoku",
    routes: [
      { key: "kochi-oldjapan-tour", label: "Kochi Old Japan Tour" },
    ],
  },
  {
    region: "Kyushu",
    routes: [
      { key: "kumamoto-local-tour", label: "Kumamoto Local Tour" },
    ],
  },
  {
    region: "Okinawa",
    routes: [
      { key: "okinawa-bridges-tour", label: "Okinawa Bridges Tour" },
    ],
  },
] as const;

export const VALID_STAMP_SLUGS: readonly RouteKey[] = STAMP_ROUTES.flatMap((r) =>
  r.routes.map((route) => route.key)
);
