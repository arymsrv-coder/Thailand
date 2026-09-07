export type Destination = {
  slug: string;
  name: string;
  sub: string;
  facts: string;
  price: string;
  rating: number;
  ratingCount: number;
  badge: string;
  /** Renders the badge in the alternate ("Popular pick") colourway. */
  badgeAlt: boolean;
  /** "lat, lng" — drives both the embedded map and the directions link. */
  coords: string;
  thumbAlt: string;
  about: string;
  images: string[];
};

export type TourItineraryStep = {
  time: string;
  title: string;
  description: string;
};

/** The activity categories the results page groups tours into. */
export type ActivityCategorySlug =
  | 'island-boat-trips'
  | 'temples-culture'
  | 'food-markets'
  | 'outdoor-adventure'
  | 'wildlife-nature'
  | 'evening-cruises'
  | 'wellness-spa'
  | 'workshops-classes';

export type Tour = {
  id: string;
  /** The destination this tour is filed under, so search can match exactly. */
  destinationSlug: string;
  /** Which themed section of the results page this tour appears under. */
  categorySlug: ActivityCategorySlug;
  /** Largest party the tour will take — the guests filter compares against it. */
  maxGroupSize: number;
  /** Months (1–12) the tour operates. Andaman boat trips stop for the monsoon. */
  openMonths: number[];
  title: string;
  location: string;
  duration: string;
  /** The same span in whole minutes, for the Duration filter and the "6h" label. */
  durationMinutes: number;
  /** 24h departure time, for the Start time filter. */
  startTime: string;
  price: string;
  /** Who the price is quoted per, as the card's small print reads. */
  priceUnit: 'adult' | 'traveler';
  /** Traveler score out of 10, which is how the results cards report it. */
  score: number;
  reviewCount: number;
  freeCancellation: boolean;
  familyFriendly: boolean;
  /** Picked out by our own guides rather than by rating alone. */
  localExpertPick: boolean;
  hotelPickup: boolean;
  /** Star rating out of 5, kept for the card badge and homepage listings. */
  rating: string;
  image: string;
  imageAlt: string;
  /** Long-form copy for the tour's own detail page; the card only ever shows the title. */
  description: string;
  /** Shown as a timeline on the detail page, in order. */
  itinerary: TourItineraryStep[];
};

export type Flight = {
  id: string;
  airline: string;
  /** Two-letter carrier code — the monogram on the row's logo tile. */
  airlineCode: string;
  flightNumber: string;
  /** "Airbus A320neo or similar" — indicative, like a rental car's model. */
  aircraft: string;
  fromCode: string;
  fromCity: string;
  fromAirport: string;
  toCode: string;
  toCity: string;
  toAirport: string;
  terminal: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  /** The same span in whole minutes, so filters and sorting never re-parse the label. */
  durationMinutes: number;
  stops: number;
  cabin: string;
  /** Cabin baggage the fare includes, e.g. "1 carry-on". */
  carryOn: string;
  checkedBag: boolean;
  wifi: boolean;
  meal: boolean;
  onlineCheckIn: boolean;
  /** Fare is payable now (and cheaper for it) rather than at the airport. */
  payNow: boolean;
  refundable: boolean;
  /** Share of travelers rating the airline positively, and how many rated it. */
  ratingPercent: number;
  reviewCount: number;
  /** Headline fare, per traveler. */
  price: string;
  /** What the itinerary comes to including taxes and fees. */
  totalPrice: string;
  /** Pre-sale total — set only on discounted fares, which show as "Sale". */
  wasPrice?: string;
  /** A photo of where this flight lands, shown on the row and in the request modal. */
  image: string;
  imageAlt: string;
};

export type Car = {
  id: string;
  /** The "Car type" the sidebar files this under, e.g. "Economy", "SUV". */
  category: string;
  model: string;
  transmission: 'Automatic' | 'Manual';
  seats: number;
  fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  unlimitedMileage: boolean;
  allWheelDrive: boolean;
  supplier: string;
  /** Share of travelers rating the supplier positively, and how many rated it. */
  supplierRatingPercent: number;
  supplierReviewCount: number;
  locationType: 'Airport' | 'Non-airport';
  freeShuttle: boolean;
  /** The pick-up point, in the reference's three lines: city, distance, address. */
  city: string;
  distanceMiles: number;
  address: string;
  /** The search-bar's pick-up field matches against this, e.g. an airport name. */
  location: string;
  onlineCheckIn: boolean;
  /** Fare is payable now (and cheaper for it) rather than at pick-up. */
  payNow: boolean;
  refundable: boolean;
  pricePerDay: string;
  /** What the whole rental comes to including taxes and fees. */
  totalPrice: string;
  /** Pre-sale total — set only on discounted rates, which show as "Sale". */
  wasPrice?: string;
  image: string;
  imageAlt: string;
  /** Required by the photos' CC BY-SA license — shown as a small credit line. */
  photoCredit: string;
};

export type PackageDeal = {
  id: string;
  title: string;
  /** Ties the package to an existing Destination for its image, coords and name. */
  destinationSlug: string;
  nights: number;
  fromCity: string;
  fromCode: string;
  toCode: string;
  /** Whether the bundled flight is direct — shown on the row's flight line. */
  nonstop: boolean;
  /** Cabin the bundled flight is priced in; drives the "Flight class" filter. */
  flightClass: 'Economy' | 'Business';
  /** Hotel tier, 1-5 in half steps, rendered as the row's star row. */
  starRating: number;
  /** Headline price, per person. */
  price: string;
  /** Pre-sale price per person — set only on discounted bundles. */
  wasPrice?: string;
  /** The sample departure window this price is quoted for, e.g. "Oct 10 - Oct 13". */
  dateRange: string;
  /** Green pill on the deal row, e.g. "Save 100% on your flight". */
  saveBadge?: string;
  /** Which of the destination's images this row uses, so a section varies. */
  imageIndex: number;
  includes: string[];
};

export type Cruise = {
  id: string;
  line: string;
  ship: string;
  region: string;
  nights: number;
  departurePort: string;
  ports: string[];
  /** Berths on board — these are small ships, and the number is the point. */
  capacity: number;
  /** Cabin grades this sailing offers, cheapest first. */
  cabins: string[];
  /** Days of the week it departs, e.g. ["Mon", "Thu"]. */
  departureDays: string[];
  /** What the fare covers, listed on the card. */
  includes: string[];
  /** The two or three things this route is actually known for. */
  highlights: string[];
  /** Traveler score out of 10, with the number of reviews behind it. */
  score: number;
  reviewCount: number;
  freeCancellation: boolean;
  /** Best months to sail this water, as month numbers (1–12). */
  bestMonths: number[];
  price: string;
  image: string;
  imageAlt: string;
};

export type FaqEntry = {
  question: string;
  answer: string;
};

/** A search read off the URL. Every field is optional — absent means "any". */
export type SearchQuery = {
  where?: string;
  from?: string;
  to?: string;
  guests?: number;
};

/**
 * What a Server Action hands back to a form. `errors` is keyed by field name,
 * plus a "form" key for failures that belong to no single field.
 */
export type ActionResult<T = void> =
  | { ok: true; value: T }
  | { ok: false; errors: Record<string, string> };

export type BookingRequest = {
  id: string;
  /** Human-facing confirmation code, e.g. "AS-7F3K2Q". */
  reference: string;
  tourId: string;
  tourTitle: string;
  name: string;
  email: string;
  date: string;
  guests: number;
  createdAt: string;
};

export type InquiryKind = 'flight' | 'car' | 'package' | 'cruise';

/**
 * A booking request for the verticals that have no catalog of their own
 * (flights/cars/packages/cruises are all mock listings) — generic where
 * `BookingRequest` is tour-specific, so one flow serves all four.
 */
export type InquiryRequest = {
  id: string;
  reference: string;
  kind: InquiryKind;
  itemId: string;
  itemLabel: string;
  name: string;
  email: string;
  date: string;
  travelers: number;
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};
