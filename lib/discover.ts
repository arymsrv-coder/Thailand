/*
 * Editorial content for the two discovery pages (/things-to-do and /cruises).
 *
 * Both pages share one section skeleton, so both share these shapes. Every
 * image below is a local file under /public/Content and every href points at a
 * route this site actually serves — nothing here reaches a third party, and
 * there are no placeholder strings, contact details or credentials in this
 * file. Copy is editorial: it describes what the catalogue already contains
 * rather than making claims (prices, availability, discounts) nothing can back.
 */

export type FeatureCard = {
  kicker: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
};

export type PromoCard = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
};

export type AdviceCard = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
};

export type BandTile = {
  caption: string;
  image: string;
  imageAlt: string;
  href: string;
};

export type Band = {
  kicker: string;
  title: string;
  description: string;
  tiles: BandTile[];
};

export type BrowseTile = {
  label: string;
  image: string;
  imageAlt: string;
  href: string;
};

export type ProseEntry = { question: string; answer: string };

export type DiscoverContent = {
  feature: FeatureCard;
  promos: PromoCard[];
  advice: AdviceCard[];
  band: Band;
  browseHeading: string;
  browse: BrowseTile[];
  proseHeading: string;
  prose: ProseEntry[];
};

export const thingsToDoContent: DiscoverContent = {
  feature: {
    kicker: 'Featured tour',
    title: 'A morning with the herd in Chiang Mai',
    description:
      'No riding, no shows — half a day feeding and walking with rescued elephants at a sanctuary that keeps its groups small.',
    image: '/Content/elephant-nature-park-700-6.jpg',
    imageAlt: 'Elephants bathing at a sanctuary near Chiang Mai',
    href: '/things-to-do?where=chiang-mai',
  },
  promos: [
    {
      title: 'Bangkok after dark',
      description: 'Night markets, riverside temples and the Yaowarat food streets.',
      image: '/Content/bangkok-night-market-700-1.jpg',
      imageAlt: 'Lantern-lit stalls at a Bangkok night market',
      href: '/things-to-do?where=bangkok',
    },
    {
      title: 'Planning around the monsoon',
      description: 'When the Andaman boats pause, and where the north stays dry.',
      image: '/Content/khao-sok-national-park-700-1.jpg',
      imageAlt: 'Mist over the lake at Khao Sok National Park',
      href: '/#faq',
    },
  ],
  advice: [
    {
      title: 'A weekend of temples in Bangkok',
      description:
        'Wat Pho, Wat Arun and the Grand Palace in two unhurried days, with the quiet hours to aim for.',
      image: '/Content/wat-arun-thai-eiffel-tower-700-1.jpg',
      imageAlt: 'Wat Arun on the Chao Phraya river at dusk',
      href: '/things-to-do?where=bangkok',
    },
    {
      title: 'Nine island days on the Andaman coast',
      description:
        'Limestone stacks, longtail boats and the bays worth an early start to reach before the crowds.',
      image: '/Content/maya-bay-phi-phi-leh-700-2.jpg',
      imageAlt: 'Maya Bay framed by limestone cliffs',
      href: '/things-to-do?where=krabi',
    },
    {
      title: 'Markets worth setting an alarm for',
      description:
        'Floating markets south of Bangkok and the railway market that packs up as the train passes.',
      image: '/Content/maeklong-railway-market-700-3.jpg',
      imageAlt: 'Awnings folding back as a train passes Maeklong railway market',
      href: '/things-to-do?where=bangkok',
    },
  ],
  band: {
    kicker: 'Andaman coast',
    title: 'Three ways to spend a day on the water',
    description: 'The bays our island tours run to, and what each one is actually like.',
    tiles: [
      {
        caption: 'Phi Phi Islands',
        image: '/Content/phi-phi-island-tour-700-2.jpg',
        imageAlt: 'Longtail boats moored off the Phi Phi Islands',
        href: '/things-to-do?where=krabi',
      },
      {
        caption: 'Phang Nga Bay',
        image: '/Content/10-Best-Attractions-Thailand-Phang-Nga-Bay.webp',
        imageAlt: 'Limestone karsts rising from Phang Nga Bay',
        href: '/things-to-do?where=phuket',
      },
      {
        caption: 'Railay Beach',
        image: '/Content/krabi-Railay-700-2.jpg',
        imageAlt: 'Railay Beach beneath its limestone headland',
        href: '/things-to-do?where=krabi',
      },
    ],
  },
  browseHeading: 'Browse by destination',
  browse: [
    {
      label: 'Bangkok',
      image: '/Content/bangkok-grand-palace-700-2.jpg',
      imageAlt: 'The Grand Palace in Bangkok',
      href: '/things-to-do?where=bangkok',
    },
    {
      label: 'Phuket',
      image: '/Content/phuket-old-town-700-1.jpg',
      imageAlt: 'Sino-Portuguese shopfronts in Phuket Old Town',
      href: '/things-to-do?where=phuket',
    },
    {
      label: 'Chiang Mai',
      image: '/Content/chiangmai-doi-national-park-700-1.jpg',
      imageAlt: 'Gardens at Doi Inthanon national park',
      href: '/things-to-do?where=chiang-mai',
    },
    {
      label: 'Krabi',
      image: '/Content/krabi-Railay-700-2.jpg',
      imageAlt: 'Railay Beach in Krabi',
      href: '/things-to-do?where=krabi',
    },
    {
      label: 'Koh Samui',
      image: '/Content/thailand-koh-samui-700-4.jpg',
      imageAlt: 'The coastline of Koh Samui',
      href: '/things-to-do?where=koh-samui',
    },
    {
      label: 'Chiang Rai',
      image: '/Content/chiang-rai-white-temple-700-1.jpg',
      imageAlt: 'The White Temple in Chiang Rai',
      href: '/things-to-do?where=chiang-rai',
    },
    {
      label: 'Ayutthaya',
      image: '/Content/ayutthaya-historic-city-700-4.jpg',
      imageAlt: 'Ruined stupas in the historic city of Ayutthaya',
      href: '/things-to-do?where=ayutthaya',
    },
    {
      label: 'Kanchanaburi',
      image: '/Content/kanchanaburi-bridge-over-the-river-kwai-700-2.jpg',
      imageAlt: 'The bridge over the River Kwai at Kanchanaburi',
      href: '/things-to-do?where=kanchanaburi',
    },
  ],
  proseHeading: 'Planning things to do in Thailand',
  prose: [
    {
      question: 'What should I book before I arrive?',
      answer:
        'Anything with a boat or a small group cap — island day trips and the elephant sanctuary fill first. Temples, markets and city walks can wait until you are there.',
    },
    {
      question: 'When do the island tours run?',
      answer:
        'Andaman boat trips pause through the southwest monsoon, roughly May to October, when the sea gets rough. The Gulf side and the north run year round.',
    },
    {
      question: 'How far ahead should I plan a day trip?',
      answer:
        'A week is comfortable in low season and a month in December and January. Every tour here lists its group cap, so you can see how much room is left.',
    },
    {
      question: 'What does a tour price include?',
      answer:
        'The guide, entry fees and transport from the meeting point. Meals are listed per tour, and anything not listed is not included — there are no extras added later.',
    },
    {
      question: 'Are the tours suitable for children?',
      answer:
        'Most are. Each tour lists its largest group size and its itinerary hour by hour, so you can judge the pace before you book. Ask us if you are unsure.',
    },
    {
      question: 'What if the weather turns?',
      answer:
        'Boat operators cancel rather than sail in poor conditions. If that happens the trip moves to another day or is refunded in full.',
    },
    {
      question: 'Can I combine a tour with a flight and hotel?',
      answer:
        'Yes — the packages page bundles flights and a stay into one booking, and several bundles already include a guided day out.',
    },
    {
      question: 'How do I get between regions?',
      answer:
        'Domestic flights connect the main hubs in under two hours. Overnight trains and ferries cover the shorter hops and are easy to book ahead.',
    },
  ],
};

export const cruisesContent: DiscoverContent = {
  feature: {
    kicker: 'Featured sailing',
    title: 'Three nights from Phuket to the Phi Phi Islands',
    description:
      'A small ship on the Andaman Sea, anchoring off Phi Phi and Krabi with time ashore at each stop.',
    image: '/Content/phi-phi-island-tour-700-2.jpg',
    imageAlt: 'Boats anchored in a bay off the Phi Phi Islands',
    href: '/cruises?destination=Andaman%20Sea',
  },
  promos: [
    {
      title: 'Dinner on the Chao Phraya',
      description: 'An evening sailing past Wat Arun and the Grand Palace, back by midnight.',
      image: '/Content/bangkok-night-market-700-1.jpg',
      imageAlt: 'The Bangkok riverside lit up at night',
      href: '/cruises?destination=Chao%20Phraya',
    },
    {
      title: 'Island-hopping in the Gulf',
      description: 'Samui, Phangan and Koh Tao on one loop, with the calm-water months explained.',
      image: '/Content/bophut-fisherman-village.jpg',
      imageAlt: 'Bophut Fisherman’s Village on Koh Samui',
      href: '/cruises?destination=Gulf%20of%20Thailand',
    },
  ],
  advice: [
    {
      title: 'How to pick a cabin on a small ship',
      description:
        'Deck height, which side faces the islands, and why the quietest cabins are not always the dearest.',
      image: '/Content/thailand-koh-samui-700-2.jpg',
      imageAlt: 'The Big Buddha at Wat Phra Yai, Koh Samui',
      href: '/cruises',
    },
    {
      title: 'Five routes worth the extra night',
      description:
        'Where a three-night sailing beats a two — Phang Nga, Koh Tao and the far side of Phi Phi.',
      image: '/Content/phuket-phang-nga-bay-tour-700-2.jpg',
      imageAlt: 'Karst islands scattered across Phang Nga Bay',
      href: '/cruises?destination=Andaman%20Sea',
    },
    {
      title: 'Ten things to do on a river sailing',
      description:
        'What to look for from the deck between the Grand Palace and the Rama VIII bridge.',
      image: '/Content/wat-arun-thai-eiffel-tower-700-1.jpg',
      imageAlt: 'Wat Arun seen from the Chao Phraya river',
      href: '/cruises?destination=Chao%20Phraya',
    },
  ],
  band: {
    kicker: 'Gulf of Thailand',
    title: 'Three islands on one loop',
    description: 'The stops our Gulf sailings call at, and what each is known for.',
    tiles: [
      {
        caption: 'Koh Samui',
        image: '/Content/thailand-koh-samui-700-4.jpg',
        imageAlt: 'The coastline of Koh Samui',
        href: '/cruises?destination=Gulf%20of%20Thailand',
      },
      {
        caption: 'Koh Larn',
        image: '/Content/thailand-pattaya-koh-larn-700-1.jpg',
        imageAlt: 'The beach at Koh Larn near Pattaya',
        href: '/cruises?destination=Gulf%20of%20Thailand',
      },
      {
        caption: 'Andaman beaches',
        image: '/Content/10-Best-Attractions-Thailand-Beaches.webp',
        imageAlt: 'An empty stretch of Thai beach at low tide',
        href: '/cruises?destination=Andaman%20Sea',
      },
    ],
  },
  browseHeading: 'Browse by water',
  browse: [
    {
      label: 'Andaman Sea',
      image: '/Content/maya-bay-phi-phi-leh-700-2.jpg',
      imageAlt: 'Maya Bay on Phi Phi Leh',
      href: '/cruises?destination=Andaman%20Sea',
    },
    {
      label: 'Gulf of Thailand',
      image: '/Content/thailand-koh-samui-700-2.jpg',
      imageAlt: 'The Big Buddha at Wat Phra Yai, Koh Samui',
      href: '/cruises?destination=Gulf%20of%20Thailand',
    },
    {
      label: 'Chao Phraya River',
      image: '/Content/wat-arun-thai-eiffel-tower-700-1.jpg',
      imageAlt: 'Wat Arun on the Chao Phraya river',
      href: '/cruises?destination=Chao%20Phraya',
    },
    {
      label: 'Phang Nga Bay',
      image: '/Content/canoeing-to-cave-james-bond-island-tour-700-2.jpg',
      imageAlt: 'A canoe entering a sea cave in Phang Nga Bay',
      href: '/cruises?destination=Phang%20Nga',
    },
    {
      label: 'Phi Phi Islands',
      image: '/Content/phi-phi-island-tour-700-2.jpg',
      imageAlt: 'The Phi Phi Islands from the water',
      href: '/cruises?destination=Phi%20Phi',
    },
    {
      label: 'Pattaya',
      image: '/Content/thailand-pattaya-koh-larn-700-1.jpg',
      imageAlt: 'The bay at Koh Larn off Pattaya',
      href: '/cruises?destination=Pattaya',
    },
  ],
  proseHeading: 'Finding the right sailing for you',
  prose: [
    {
      question: 'What kind of ships are these?',
      answer:
        'Small ones. Every sailing here carries tens of passengers rather than thousands, which is what lets them anchor in the bays the larger ships cannot reach.',
    },
    {
      question: 'Andaman Sea or Gulf of Thailand?',
      answer:
        'The Andaman side has the limestone scenery and the sharper contrast between bays; the Gulf is calmer and works through more of the year. The two coasts have opposite rainy seasons.',
    },
    {
      question: 'How long should a first sailing be?',
      answer:
        'Two or three nights covers a coast without the days blurring together. The Chao Phraya dinner sailings are a single evening if you only want a taste of it.',
    },
    {
      question: 'What is included in the fare?',
      answer:
        'The cabin, meals on board and the shore stops listed on the sailing. Drinks and anything ashore beyond the listed stops are not included.',
    },
    {
      question: 'When is the best time to sail?',
      answer:
        'November to April on the Andaman side, and roughly February to September in the Gulf. The river sailings in Bangkok run all year.',
    },
    {
      question: 'How do I book?',
      answer:
        'Choose a sailing and send a request with your dates and party size. Nothing is charged at that point — we come back with a confirmed price and availability first.',
    },
  ],
};
