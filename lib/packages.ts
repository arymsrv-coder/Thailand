import type { PackageDeal } from './types';

/** Mock flight + stay bundles. No live inventory. */
export const packages: PackageDeal[] = [
  {
    id: "phuket-beach-getaway-5n",
    title: "5-Night Phuket Beach Getaway",
    destinationSlug: "phuket",
    nights: 5,
    fromCity: "Bangkok",
    price: "$489",
    includes: ["Round-trip flights", "4-star beachfront hotel", "Daily breakfast"],
  },
  {
    id: "chiang-mai-mountain-escape-4n",
    title: "4-Night Chiang Mai Mountain Escape",
    destinationSlug: "chiang-mai",
    nights: 4,
    fromCity: "Bangkok",
    price: "$365",
    includes: ["Round-trip flights", "Boutique old-town hotel", "Half-day cooking class"],
  },
  {
    id: "krabi-island-hopper-6n",
    title: "6-Night Krabi Island Hopper",
    destinationSlug: "krabi",
    nights: 6,
    fromCity: "Bangkok",
    price: "$598",
    includes: ["Round-trip flights", "Railay beachfront resort", "Full-day island tour"],
  },
  {
    id: "koh-samui-island-life-5n",
    title: "5-Night Koh Samui Island Life",
    destinationSlug: "koh-samui",
    nights: 5,
    fromCity: "Bangkok",
    price: "$545",
    includes: ["Round-trip flights", "Beachfront resort", "Daily breakfast", "Airport transfers"],
  },
  {
    id: "bangkok-city-explorer-3n",
    title: "3-Night Bangkok City Explorer",
    destinationSlug: "bangkok",
    nights: 3,
    fromCity: "Chiang Mai",
    price: "$275",
    includes: ["Round-trip flights", "4-star riverside hotel", "Grand Palace tour"],
  },
  {
    id: "chiang-rai-golden-triangle-4n",
    title: "4-Night Chiang Rai & Golden Triangle",
    destinationSlug: "chiang-rai",
    nights: 4,
    fromCity: "Bangkok",
    price: "$410",
    includes: ["Round-trip flights", "Riverside hotel", "White Temple day tour"],
  },
];
