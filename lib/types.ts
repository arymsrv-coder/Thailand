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

export type Tour = {
  id: string;
  /** The destination this tour is filed under, so search can match exactly. */
  destinationSlug: string;
  /** Largest party the tour will take — the guests filter compares against it. */
  maxGroupSize: number;
  /** Months (1–12) the tour operates. Andaman boat trips stop for the monsoon. */
  openMonths: number[];
  title: string;
  location: string;
  duration: string;
  price: string;
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
  flightNumber: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  cabin: string;
  price: string;
};

export type Car = {
  id: string;
  category: string;
  model: string;
  transmission: string;
  seats: number;
  supplier: string;
  location: string;
  pricePerDay: string;
};

export type PackageDeal = {
  id: string;
  title: string;
  /** Ties the package to an existing Destination for its image, coords and name. */
  destinationSlug: string;
  nights: number;
  fromCity: string;
  price: string;
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
