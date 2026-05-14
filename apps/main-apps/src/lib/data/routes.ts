import { RouteKey } from "@/types/route";

export const STAMP_ROUTES = [
  {
    region: "Hokkaido",
    routes: [
      { key: "hokkaido-hidden-spot", label: "Hidden Spot" },
      { key: "hokkaido-drive-plan", label: "Drive Plan" },
    ],
  },
  {
    region: "Tohoku",
    routes: [
      { key: "aomori-local-walk", label: "Aomori Local Walk" },
      { key: "akita-random-route", label: "Akita Random Route" },
      { key: "iwate-town-explore", label: "Iwate Town Explore" },
      { key: "miyagi-food-trip", label: "Miyagi Food Trip" },
      { key: "yamagata-night-view", label: "Yamagata Night View" },
      { key: "fukushima-drive-course", label: "Fukushima Drive Course" },
    ],
  },
  {
    region: "Kanto",
    routes: [
      { key: "kanto-hidden-spot", label: "Kanto Hidden Spot" },
    ],
  },
  {
    region: "Hokuriku",
    routes: [
      { key: "hokuriku-hidden-spot", label: "Hokuriku Hidden Spot" },
    ],
  },
  {
    region: "Kansai",
    routes: [
      { key: "Kansai-historic-trip", label: "Kansai Historic Trip" }
    ],
  },
  {
    region: "Kyushu",
    routes: [
      { key: "kyushu-drive-plan", label: "Kyushu Drive Plan" },
    ],
  },
  {
    region: "Shikoku",
    routes: [
      { key: "shikoku-riverside-hiking", label: "RiverSide Hiking" },
    ],
  },
] as const;

export const VALID_STAMP_SLUGS: readonly RouteKey[] = STAMP_ROUTES.flatMap((r) =>
  r.routes.map((route) => route.key)
);
