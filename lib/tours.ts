import type { Tour } from './types';

/**
 * Bookable tours. The badge shown on the photo is the first half of `duration`
 * ("Full day · 6 hrs" → "Full day"), derived in <TourCard>.
 */
export const tours: Tour[] = [
  {
    id: "grand-palace-wat-pho-heritage-walk",
    destinationSlug: "bangkok",
    maxGroupSize: 16,
    openMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    title: "Grand Palace & Wat Pho Heritage Walk",
    location: "Bangkok",
    duration: "Full day · 6 hrs",
    price: "$65",
    rating: "4.9",
    image: "/Content/wat-pho-bangkok-700-7.jpg",
    imageAlt: "Wat Pho temple, Bangkok",
    description:
      "A guided walk through Bangkok's ceremonial heart: the glittering Grand Palace, the reclining Buddha at Wat Pho, and the riverside streets between them. Small groups only, with a local guide who knows which courtyards to see before the tour buses arrive.",
    itinerary: [
      {
        time: "08:00",
        title: "Hotel pickup",
        description: "Air-conditioned van collects your group from central Bangkok hotels.",
      },
      {
        time: "09:00",
        title: "Grand Palace & Wat Phra Kaew",
        description: "Guided walk through the palace grounds and the Temple of the Emerald Buddha.",
      },
      {
        time: "11:30",
        title: "Wat Pho",
        description: "See the 46-metre reclining Buddha and the temple's original Thai massage school.",
      },
      {
        time: "13:00",
        title: "Riverside lunch",
        description: "A included lunch at a restaurant overlooking the Chao Phraya.",
      },
      {
        time: "14:30",
        title: "Return",
        description: "Drop-off back at your hotel by mid-afternoon.",
      },
    ],
  },
  {
    id: "maya-bay-phi-phi-islands-speedboat",
    destinationSlug: "krabi",
    maxGroupSize: 12,
    openMonths: [11, 12, 1, 2, 3, 4],
    title: "Maya Bay & Phi Phi Islands Speedboat",
    location: "Krabi",
    duration: "Full day · 8 hrs",
    price: "$89",
    rating: "4.8",
    image: "/Content/maya-bay-phi-phi-leh-700-2.jpg",
    imageAlt: "Maya Bay, Phi Phi Leh",
    description:
      "A full day by speedboat through the Andaman's most photographed water: the cliff-ringed cove of Maya Bay, the monkey-lined shores of Phi Phi Leh, and a snorkel stop over coral reef. Lunch and snorkel gear included.",
    itinerary: [
      {
        time: "07:30",
        title: "Pier pickup",
        description: "Transfer from your Krabi hotel to the pier for departure.",
      },
      {
        time: "08:30",
        title: "Speedboat to Phi Phi Leh",
        description: "Cruise past limestone cliffs into Maya Bay's protected cove.",
      },
      {
        time: "10:30",
        title: "Snorkeling stop",
        description: "Snorkel over coral reef at a sheltered bay with reef fish.",
      },
      {
        time: "12:30",
        title: "Lunch on Phi Phi Don",
        description: "Included buffet lunch on the main island, with free time on the beach.",
      },
      {
        time: "15:00",
        title: "Return by speedboat",
        description: "Back to the pier and transfer to your hotel by late afternoon.",
      },
    ],
  },
  {
    id: "james-bond-island-canoe-adventure",
    destinationSlug: "phuket",
    maxGroupSize: 10,
    openMonths: [11, 12, 1, 2, 3, 4],
    title: "James Bond Island Canoe Adventure",
    location: "Phang Nga",
    duration: "Full day · 7 hrs",
    price: "$74",
    rating: "4.9",
    image: "/Content/canoeing-to-cave-james-bond-island-tour-700-2.jpg",
    imageAlt: "Canoeing near James Bond Island",
    description:
      "Paddle a two-person canoe through hidden sea caves and mangrove tunnels in Phang Nga Bay, then cruise past the karst spire made famous by The Man with the Golden Gun. A quieter, more hands-on way to see the bay than the big tour boats.",
    itinerary: [
      {
        time: "07:00",
        title: "Hotel pickup",
        description: "Transfer from Phuket hotels to the pier at Phang Nga Bay.",
      },
      {
        time: "08:30",
        title: "Longtail boat to the bay",
        description: "Cruise out among the limestone karsts of Phang Nga Bay.",
      },
      {
        time: "09:30",
        title: "Canoe through sea caves",
        description: "Paddle into hidden lagoons and mangrove tunnels with a local guide.",
      },
      {
        time: "12:00",
        title: "James Bond Island & lunch",
        description: "Photo stop at Khao Phing Kan, followed by an included Thai lunch.",
      },
      {
        time: "15:30",
        title: "Return to Phuket",
        description: "Boat back to the pier and transfer to your hotel.",
      },
    ],
  },
  {
    id: "chiang-mai-ethical-elephant-sanctuary",
    destinationSlug: "chiang-mai",
    maxGroupSize: 8,
    openMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    title: "Chiang Mai Ethical Elephant Sanctuary",
    location: "Chiang Mai",
    duration: "Full day · 6 hrs",
    price: "$58",
    rating: "5.0",
    image: "/Content/elephant-nature-park-700-6.jpg",
    imageAlt: "Elephant Nature Park, Chiang Mai",
    description:
      "Spend a day at a no-riding, no-chains sanctuary in the hills outside Chiang Mai, feeding and walking alongside rescued elephants in their own river valley. Small groups, and every visit funds the sanctuary's rescue program.",
    itinerary: [
      {
        time: "08:00",
        title: "Hotel pickup",
        description: "Van transfer from Chiang Mai's old town into the hills.",
      },
      {
        time: "09:00",
        title: "Meet the herd",
        description: "Introduction to the sanctuary's rescued elephants and their keepers.",
      },
      {
        time: "10:00",
        title: "Feeding & walking",
        description: "Prepare food and walk alongside the elephants through the valley.",
      },
      {
        time: "12:00",
        title: "Riverside lunch",
        description: "Included vegetarian lunch overlooking the river.",
      },
      {
        time: "13:30",
        title: "Mud bath & river bathing",
        description: "Join the elephants for a mud wallow and a splash in the river.",
      },
      {
        time: "15:30",
        title: "Return",
        description: "Transfer back to your Chiang Mai hotel.",
      },
    ],
  },
  {
    id: "ayutthaya-ancient-capital-day-trip",
    destinationSlug: "ayutthaya",
    maxGroupSize: 14,
    openMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    title: "Ayutthaya Ancient Capital Day Trip",
    location: "Ayutthaya",
    duration: "Full day · 6 hrs",
    price: "$52",
    rating: "4.7",
    image: "/Content/ayutthaya-chao-sam-phraya-national-museum-700-2.jpg",
    imageAlt: "Ayutthaya historic ruins",
    description:
      "A day trip north from Bangkok to Siam's former capital, now a quiet field of brick temple ruins and headless Buddha statues. Includes a river cruise back into the city as the sun sets over the water.",
    itinerary: [
      {
        time: "08:00",
        title: "Hotel pickup",
        description: "Van transfer north out of Bangkok to Ayutthaya.",
      },
      {
        time: "09:30",
        title: "Wat Mahathat",
        description: "See the famous Buddha head entwined in tree roots.",
      },
      {
        time: "11:00",
        title: "Wat Chaiwatthanaram",
        description: "Explore the riverside temple built in the style of Angkor Wat.",
      },
      {
        time: "12:30",
        title: "Lunch",
        description: "Included Thai lunch near the historic park.",
      },
      {
        time: "14:00",
        title: "Chao Sam Phraya Museum",
        description: "A short visit to see treasures recovered from the ruined temples.",
      },
      {
        time: "16:00",
        title: "River cruise back to Bangkok",
        description: "Return by boat along the Chao Phraya as the sun sets.",
      },
    ],
  },
  {
    id: "river-kwai-kanchanaburi-explorer",
    destinationSlug: "kanchanaburi",
    maxGroupSize: 12,
    openMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    title: "River Kwai & Kanchanaburi Explorer",
    location: "Kanchanaburi",
    duration: "Full day · 7 hrs",
    price: "$60",
    rating: "4.6",
    image: "/Content/kanchanaburi-bridge-over-the-river-kwai-700-2.jpg",
    imageAlt: "Bridge over the River Kwai",
    description:
      "A full day pairing the sobering wartime history of the bridge over the River Kwai with the turquoise, seven-tiered pools of Erawan National Park — two hours from Bangkok but a world apart.",
    itinerary: [
      {
        time: "07:00",
        title: "Hotel pickup",
        description: "Van transfer west from Bangkok to Kanchanaburi.",
      },
      {
        time: "09:30",
        title: "Bridge over the River Kwai",
        description: "Walk the bridge and visit the nearby war cemetery and museum.",
      },
      {
        time: "11:00",
        title: "Erawan National Park",
        description: "Hike the seven-tiered waterfall trail and swim in the pools.",
      },
      {
        time: "13:00",
        title: "Lunch",
        description: "Included riverside lunch near the park.",
      },
      {
        time: "15:00",
        title: "Return to Bangkok",
        description: "Drive back, arriving in the early evening.",
      },
    ],
  },
  {
    id: "golden-triangle-white-temple-tour",
    destinationSlug: "chiang-rai",
    maxGroupSize: 10,
    openMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    title: "Golden Triangle & White Temple Tour",
    location: "Chiang Rai",
    duration: "2 days · 1 night",
    price: "$145",
    rating: "4.8",
    image: "/Content/thailand-golden-triangle-700-1.jpg",
    imageAlt: "Golden Triangle, Chiang Rai",
    description:
      "An overnight trip from Chiang Mai through Chiang Rai's contemporary temples — the dazzling White Temple and the stark Black House — out to the Golden Triangle where Thailand, Laos and Myanmar meet along the Mekong.",
    itinerary: [
      {
        time: "Day 1, 07:00",
        title: "Depart Chiang Mai",
        description: "Van transfer north to Chiang Rai.",
      },
      {
        time: "Day 1, 10:00",
        title: "White Temple (Wat Rong Khun)",
        description: "Explore the dazzling contemporary temple complex.",
      },
      {
        time: "Day 1, 13:00",
        title: "Black House (Baan Dam)",
        description: "Visit the dark counterpart museum built by the same artist.",
      },
      {
        time: "Day 1, evening",
        title: "Overnight in Chiang Rai",
        description: "Check in to a hotel in town; dinner on your own.",
      },
      {
        time: "Day 2, 08:00",
        title: "Golden Triangle",
        description: "See where Thailand, Laos, and Myanmar meet along the Mekong.",
      },
      {
        time: "Day 2, 14:00",
        title: "Return to Chiang Mai",
        description: "Afternoon drive back, arriving in the early evening.",
      },
    ],
  },
  {
    id: "koh-samui-island-escape",
    destinationSlug: "koh-samui",
    maxGroupSize: 8,
    openMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    title: "Koh Samui Island Escape",
    location: "Koh Samui",
    duration: "3 days · 2 nights",
    price: "$210",
    rating: "4.9",
    image: "/Content/thailand-koh-samui-700-2.jpg",
    imageAlt: "Koh Samui coastline",
    description:
      "Three unhurried days on Koh Samui: palm-lined coastline, the low-key charm of Bophut's Fisherman's Village, and enough free time to actually feel like a vacation instead of a checklist.",
    itinerary: [
      {
        time: "Day 1",
        title: "Arrival & Fisherman's Village",
        description: "Settle in, then explore Bophut's restored wooden shophouses at sunset.",
      },
      {
        time: "Day 2",
        title: "Island coastline & viewpoints",
        description: "Guided half-day around the island's beaches and coastal viewpoints; afternoon free.",
      },
      {
        time: "Day 3",
        title: "Free morning & departure",
        description: "A free morning to swim or relax before transfer to the airport or pier.",
      },
    ],
  },
];
