// import { CheckPoint } from "@/types/checkPoint";

// export const CHECK_POINTS: readonly CheckPoint[] = [
//   // ---------------- Hokkaido ---------------
//   {
//     id: "hh-1",
//     routeKey: "hokkaido-hidden-spot",
//     name: "Blue Lake",
//     excerpt: "Hidden blue lake in Hokkaido",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 43.4902, lng: 142.6125, // 美瑛
//   },
//   {
//     id: "hh-2",
//     routeKey: "hokkaido-hidden-spot",
//     name: "Snow Forest",
//     excerpt: "Quiet snowy forest path",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 43.5350, lng: 142.4635,
//   },

//   {
//     id: "hd-1",
//     routeKey: "hokkaido-drive-plan",
//     name: "Coastal Drive",
//     excerpt: "Scenic coastline road",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 43.1907, lng: 140.5910, // 積丹
//   },
//   {
//     id: "hd-2",
//     routeKey: "hokkaido-drive-plan",
//     name: "Mountain Pass",
//     excerpt: "Beautiful mountain route",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 43.6540, lng: 142.8550,
//   },

//   // ---------------- Tohoku ----------------
//   {
//     id: "alw-1",
//     routeKey: "aomori-local-walk",
//     name: "Morning Market",
//     excerpt: "Traditional Aomori market",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 40.8290, lng: 140.7490,
//   },
//   {
//     id: "alw-2",
//     routeKey: "aomori-local-walk",
//     name: "Harbor View",
//     excerpt: "Quiet seaside harbor",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 40.8350, lng: 140.7550,
//   },

//   {
//     id: "arr-1",
//     routeKey: "akita-random-route",
//     name: "Hot Spring Town",
//     excerpt: "Local onsen experience",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 39.9480, lng: 140.7950, // 乳頭温泉付近
//   },
//   {
//     id: "arr-2",
//     routeKey: "akita-random-route",
//     name: "Forest Shrine",
//     excerpt: "Hidden shrine in forest",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 39.9550, lng: 140.8050,
//   },

//   {
//     id: "ite-1",
//     routeKey: "iwate-town-explore",
//     name: "Historic Street",
//     excerpt: "Old town walking street",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 39.7020, lng: 141.1540, // 盛岡
//   },
//   {
//     id: "ite-2",
//     routeKey: "iwate-town-explore",
//     name: "Local Cafe",
//     excerpt: "Cozy countryside cafe",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 39.7100, lng: 141.1600,
//   },

//   {
//     id: "mft-1",
//     routeKey: "miyagi-food-trip",
//     name: "Seafood Market",
//     excerpt: "Fresh seafood experience",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 38.3180, lng: 141.0610, // 塩釜
//   },
//   {
//     id: "mft-2",
//     routeKey: "miyagi-food-trip",
//     name: "Beef Grill",
//     excerpt: "Local wagyu restaurant",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 38.2610, lng: 140.8820,
//   },

//   {
//     id: "ynv-1",
//     routeKey: "yamagata-night-view",
//     name: "Mountain Viewpoint",
//     excerpt: "Famous night skyline",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 38.2404, lng: 140.3633,
//   },
//   {
//     id: "ynv-2",
//     routeKey: "yamagata-night-view",
//     name: "City Hill",
//     excerpt: "Romantic evening spot",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 38.2500, lng: 140.3700,
//   },

//   {
//     id: "fdc-1",
//     routeKey: "fukushima-drive-course",
//     name: "Lake Route",
//     excerpt: "Scenic lakeside drive",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 37.6320, lng: 140.0620, // 猪苗代湖
//   },
//   {
//     id: "fdc-2",
//     routeKey: "fukushima-drive-course",
//     name: "Hilltop Road",
//     excerpt: "Panoramic driving course",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 37.6450, lng: 140.0800,
//   },

//   // ---------------- Kanto ----------------
//   {
//     id: "khs-1",
//     routeKey: "kanto-hidden-spot",
//     name: "Secret Garden",
//     excerpt: "Quiet hidden park",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 35.6812, lng: 139.7671, // 東京駅周辺
//   },
//   {
//     id: "khs-2",
//     routeKey: "kanto-hidden-spot",
//     name: "Riverside Walk",
//     excerpt: "Peaceful riverside path",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 35.7100, lng: 139.7960, // 隅田川
//   },
//   {
//     id: "khs-3",
//     routeKey: "kanto-hidden-spot",
//     name: "Old Shrine Path",
//     excerpt: "Historic torii gate walkway",
//     thumbnail_url: "/dummy.jpg",
//     order: 3,
//     lat: 35.7140, lng: 139.7730, // 上野
//   },
//   {
//     id: "khs-4",
//     routeKey: "kanto-hidden-spot",
//     name: "Sunset Viewpoint",
//     excerpt: "Panoramic city skyline spot",
//     thumbnail_url: "/dummy.jpg",
//     order: 4,
//     lat: 35.6586, lng: 139.7454, // 東京タワー付近
//   },

//   // ---------------- Hokuriku ----------------
//   {
//     id: "hhs-1",
//     routeKey: "hokuriku-hidden-spot",
//     name: "Old Town Alley",
//     excerpt: "Traditional street view",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 36.5710, lng: 136.6660, // 金沢
//   },
//   {
//     id: "hhs-2",
//     routeKey: "hokuriku-hidden-spot",
//     name: "Sea Cliff",
//     excerpt: "Dramatic ocean cliff",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 36.2370, lng: 136.1260, // 東尋坊
//   },

//   // ---------------- Kinki ----------------
//   {
//     id: "abc-1",
//     routeKey: "aaa-bbb-ccc",
//     name: "Mystery Spot",
//     excerpt: "Unique local landmark",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 34.6870, lng: 135.5260, // 大阪城
//   },
//   {
//     id: "abc-2",
//     routeKey: "aaa-bbb-ccc",
//     name: "Historic Temple",
//     excerpt: "Ancient temple visit",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 34.9940, lng: 135.7850, // 清水寺
//   },

//   // ---------------- Kyushu ----------------
//   {
//     id: "kdp-1",
//     routeKey: "kyushu-drive-plan",
//     name: "Volcano Road",
//     excerpt: "Drive near active volcano",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 32.8844, lng: 131.0849, // 阿蘇
//   },
//   {
//     id: "kdp-2",
//     routeKey: "kyushu-drive-plan",
//     name: "Hot Spring Valley",
//     excerpt: "Steam rising valley",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 33.2848, lng: 131.4907, // 別府
//   },

//   // ---------------- Shikoku ----------------
//   {
//     id: "srh-1",
//     routeKey: "shikoku-riverside-hiking",
//     name: "River Trail",
//     excerpt: "Beautiful riverside hike",
//     thumbnail_url: "/dummy.jpg",
//     order: 1,
//     lat: 33.8700, lng: 133.1000, // 石鎚山付近
//   },
//   {
//     id: "srh-2",
//     routeKey: "shikoku-riverside-hiking",
//     name: "Mountain Bridge",
//     excerpt: "Suspension bridge crossing",
//     thumbnail_url: "/dummy.jpg",
//     order: 2,
//     lat: 33.8850, lng: 133.1150,
//   },
// ] as const;