import { cars } from './cars';
import { cruises } from './cruises';
import { destinations } from './destinations';
import { flights } from './flights';
import { packages } from './packages';
import { tours } from './tours';
import type {
  ActivityCategorySlug,
  Car,
  Cruise,
  Destination,
  Flight,
  PackageDeal,
  SearchQuery,
  Tour,
} from './types';
import { first } from './validation';

/*
 * The read side of the site: pure functions over the tour and destination
 * catalogue. No I/O, no framework — so the page can call these during a server
 * render, the suggest route can call them per keystroke, and the tests can call
 * them directly.
 */

const SUGGEST_LIMIT = 6;

export function findTour(id: string): Tour | undefined {
  return tours.find((tour) => tour.id === id);
}

/**
 * "Guest favorite" / "Popular pick" on a tour card. Destinations carry this as
 * editorial data; tours have no such field, so it's derived straight from the
 * rating instead — high bars, and most tours carry no badge at all.
 */
export function tourQualityBadge(rating: string): { label: string; alt: boolean } | null {
  const value = Number.parseFloat(rating);
  if (Number.isNaN(value)) return null;
  if (value >= 4.9) return { label: 'Guest favorite', alt: false };
  if (value >= 4.7) return { label: 'Popular pick', alt: true };
  return null;
}

export function findDestination(slug: string): Destination | undefined {
  return destinations.find((destination) => destination.slug === slug);
}

/**
 * Every calendar month a date range touches, in travel order.
 *
 * A tour is "available" if it runs in any month the traveller is here, so a
 * trip spanning late April into May still matches a tour that closes in May.
 * A range longer than a year is capped at twelve months rather than looping.
 */
export function monthsInRange(from?: string, to?: string): number[] {
  if (!from) return [];

  const start = new Date(`${from}T00:00:00Z`);
  const end = to ? new Date(`${to}T00:00:00Z`) : start;
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];

  const months: number[] = [];
  const cursor = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1)
  );

  while (cursor <= end && months.length < 12) {
    months.push(cursor.getUTCMonth() + 1);
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  return months;
}

export function searchTours(query: SearchQuery): Tour[] {
  const months = monthsInRange(query.from, query.to);

  return tours.filter((tour) => {
    if (query.where && tour.destinationSlug !== query.where) return false;
    if (query.guests && tour.maxGroupSize < query.guests) return false;
    if (months.length > 0 && !months.some((m) => tour.openMonths.includes(m))) {
      return false;
    }
    return true;
  });
}

/*
 * The Things to do results page: activity categories, the sidebar filters and
 * the sort order. These sit on top of searchTours — that handles where, when
 * and party size; these narrow what is left.
 */

export const ACTIVITY_CATEGORIES: { slug: ActivityCategorySlug; label: string }[] = [
  { slug: 'island-boat-trips', label: 'Island & boat trips' },
  { slug: 'temples-culture', label: 'Temples & culture' },
  { slug: 'food-markets', label: 'Food & markets' },
  { slug: 'outdoor-adventure', label: 'Outdoor & adventure' },
  { slug: 'wildlife-nature', label: 'Wildlife & nature' },
  { slug: 'evening-cruises', label: 'Evening & sunset cruises' },
  { slug: 'wellness-spa', label: 'Wellness & spa' },
  { slug: 'workshops-classes', label: 'Workshops & classes' },
];

const CATEGORY_LABELS = new Map(ACTIVITY_CATEGORIES.map((c) => [c.slug, c.label]));

export function activityCategoryLabel(slug: string): string {
  return CATEGORY_LABELS.get(slug as ActivityCategorySlug) ?? slug;
}

/** The recommendation checkboxes, and what each one actually tests. */
const RECOMMENDATION_TESTS: Record<string, (tour: Tour) => boolean> = {
  'free-cancellation': (tour) => tour.freeCancellation,
  'local-expert': (tour) => tour.localExpertPick,
  'family-friendly': (tour) => tour.familyFriendly,
  'hotel-pickup': (tour) => tour.hotelPickup,
};

export const RECOMMENDATION_OPTIONS: { key: string; label: string }[] = [
  { key: 'free-cancellation', label: 'Free cancellation' },
  { key: 'local-expert', label: 'Local expert picks' },
  { key: 'family-friendly', label: 'Family friendly' },
  { key: 'hotel-pickup', label: 'Hotel pickup' },
];

/** Start-time bands, as [inclusive, exclusive) hours on a 24h clock. */
const START_TIME_BANDS: Record<string, [number, number]> = {
  morning: [6, 12],
  afternoon: [12, 17],
  evening: [17, 24],
};

export const START_TIME_OPTIONS: { key: string; label: string }[] = [
  { key: 'morning', label: '6:00am - 12:00pm (morning)' },
  { key: 'afternoon', label: '12:00pm - 5:00pm (afternoon)' },
  { key: 'evening', label: '5:00pm - 12:00am (evening)' },
];

/** Duration bands in minutes, as [inclusive, exclusive). */
const DURATION_BANDS: Record<string, [number, number]> = {
  'lt-1h': [0, 60],
  '1-4h': [60, 240],
  '4h-1d': [240, 1440],
  'gt-1d': [1440, Number.MAX_SAFE_INTEGER],
};

export const ACTIVITY_DURATION_OPTIONS: { key: string; label: string }[] = [
  { key: 'lt-1h', label: 'Less than 1 hour' },
  { key: '1-4h', label: '1 to 4 hours' },
  { key: '4h-1d', label: '4 hours to 1 day' },
  { key: 'gt-1d', label: 'More than 1 day' },
];

export const TRAVELER_RATING_OPTIONS: { key: string; label: string }[] = [
  { key: '', label: 'Any' },
  { key: '9', label: 'Wonderful 9+' },
  { key: '8', label: 'Very good 8+' },
  { key: '7', label: 'Good 7+' },
];

export type ActivityFilters = {
  /** Minimum traveler score out of 10, or 0 for "Any". */
  minScore: number;
  recommendations: string[];
  startTimes: string[];
  durations: string[];
  keyword: string;
  category: string;
  sort: string;
};

const ACTIVITY_SORTS = new Set(['recommended', 'price-asc', 'price-desc', 'rating']);

/**
 * Read the sidebar's state off the URL, keeping only values we recognise. A
 * hand-edited parameter is dropped rather than echoed back into the page.
 */
export function validateActivityFilters(query: RawQuery): ActivityFilters {
  const rating = Number.parseInt(first(query.rating), 10);
  const sort = first(query.sort);
  const category = first(query.category);

  return {
    minScore: [7, 8, 9].includes(rating) ? rating : 0,
    recommendations: values(query.rec).filter((key) => key in RECOMMENDATION_TESTS),
    startTimes: values(query.start).filter((key) => key in START_TIME_BANDS),
    durations: values(query.length).filter((key) => key in DURATION_BANDS),
    // Trim before capping, so leading spaces do not eat into the 80-char limit.
    keyword: first(query.q).trim().slice(0, 80),
    category: CATEGORY_LABELS.has(category as ActivityCategorySlug) ? category : '',
    sort: ACTIVITY_SORTS.has(sort) ? sort : 'recommended',
  };
}

/** True when anything in the sidebar is set — drives the "clear" affordance. */
export function hasActivityFilters(filters: ActivityFilters): boolean {
  return Boolean(
    filters.minScore ||
      filters.recommendations.length ||
      filters.startTimes.length ||
      filters.durations.length ||
      filters.keyword ||
      filters.category
  );
}

export function applyActivityFilters(list: Tour[], filters: ActivityFilters): Tour[] {
  const needle = filters.keyword.toLowerCase();

  const filtered = list.filter((tour) => {
    if (filters.minScore && tour.score < filters.minScore) return false;
    if (filters.category && tour.categorySlug !== filters.category) return false;

    if (
      needle &&
      !`${tour.title} ${tour.location} ${activityCategoryLabel(tour.categorySlug)}`
        .toLowerCase()
        .includes(needle)
    ) {
      return false;
    }

    // Within a group the options are OR-ed; across groups they are AND-ed.
    if (
      filters.recommendations.length > 0 &&
      !filters.recommendations.some((key) => RECOMMENDATION_TESTS[key](tour))
    ) {
      return false;
    }

    if (filters.startTimes.length > 0) {
      const hour = Number.parseInt(tour.startTime.slice(0, 2), 10);
      const inBand = filters.startTimes.some((key) => {
        const [from, to] = START_TIME_BANDS[key];
        return hour >= from && hour < to;
      });
      if (!inBand) return false;
    }

    if (filters.durations.length > 0) {
      const inBand = filters.durations.some((key) => {
        const [from, to] = DURATION_BANDS[key];
        return tour.durationMinutes >= from && tour.durationMinutes < to;
      });
      if (!inBand) return false;
    }

    return true;
  });

  if (filters.sort === 'price-asc') {
    return [...filtered].sort((a, b) => tourPriceValue(a.price) - tourPriceValue(b.price));
  }
  if (filters.sort === 'price-desc') {
    return [...filtered].sort((a, b) => tourPriceValue(b.price) - tourPriceValue(a.price));
  }
  if (filters.sort === 'rating') {
    return [...filtered].sort((a, b) => b.score - a.score);
  }
  return filtered;
}

/** "$65" -> 65. */
export function tourPriceValue(price: string): number {
  return Number.parseFloat(price.replace(/[^0-9.]/g, '')) || Infinity;
}

/** Category chips with the count of matching activities behind each. */
export function activityCategoryCounts(
  list: Tour[]
): { slug: ActivityCategorySlug; label: string; count: number }[] {
  return ACTIVITY_CATEGORIES.map(({ slug, label }) => ({
    slug,
    label,
    count: list.filter((tour) => tour.categorySlug === slug).length,
  })).filter((entry) => entry.count > 0);
}

/** The themed sections below "Top things to do", largest group first. */
export function activitySections(
  list: Tour[]
): { slug: ActivityCategorySlug; label: string; tours: Tour[] }[] {
  return ACTIVITY_CATEGORIES.map(({ slug, label }) => ({
    slug,
    label,
    tours: list.filter((tour) => tour.categorySlug === slug),
  }))
    .filter((section) => section.tours.length > 0)
    .sort((a, b) => b.tours.length - a.tours.length);
}

/** 360 -> "6h", 90 -> "1h 30m", 2880 -> "2d" — the card's compact duration. */
export function formatActivityDuration(minutes: number): string {
  if (minutes >= 1440) {
    const days = Math.round(minutes / 1440);
    return `${days}d`;
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

/** The reference's wording for a score out of 10. */
export function activityScoreLabel(score: number): string {
  if (score >= 9.5) return 'Exceptional';
  if (score >= 9) return 'Wonderful';
  if (score >= 8.5) return 'Excellent';
  if (score >= 8) return 'Very Good';
  if (score >= 7) return 'Good';
  return '';
}

/**
 * Destinations matching a search.
 *
 * When the traveller named a place, that place is always shown — telling
 * someone who asked for Sukhothai that Sukhothai does not exist would be
 * absurd; the tour list below simply comes up empty. Otherwise a destination
 * earns its place by still having at least one bookable tour.
 */
export function searchDestinations(query: SearchQuery): Destination[] {
  if (query.where) {
    const named = findDestination(query.where);
    return named ? [named] : [];
  }

  const hasDateOrGuestFilter = Boolean(query.from || query.guests);
  if (!hasDateOrGuestFilter) return destinations;

  const slugsWithTours = new Set(
    searchTours(query).map((tour) => tour.destinationSlug)
  );
  return destinations.filter((destination) => slugsWithTours.has(destination.slug));
}

/**
 * Typeahead for the "Where to" field. Prefix matches rank above mid-word ones,
 * so typing "ka" offers Kanchanaburi before Khao Yai.
 */
export function suggestDestinations(
  term: string,
  limit: number = SUGGEST_LIMIT
): Destination[] {
  const needle = term.trim().toLowerCase();
  if (!needle) return [];

  const scored: { destination: Destination; rank: number }[] = [];

  for (const destination of destinations) {
    const haystack = destination.name.toLowerCase();
    const position = haystack.indexOf(needle);
    if (position === 0) scored.push({ destination, rank: 0 });
    else if (position > 0) scored.push({ destination, rank: 1 });
  }

  return scored
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((entry) => entry.destination);
}

export function isSearchActive(query: SearchQuery): boolean {
  return Boolean(query.where || query.from || query.to || query.guests);
}

/** A query as URL params, omitting anything unset, for links and router pushes. */
export function toSearchParams(query: SearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.where) params.set('where', query.where);
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.guests) params.set('guests', String(query.guests));
  return params;
}

/*
 * Flights, Cars, Packages and Cruises have no real inventory behind them —
 * each is a small, fixed mock catalogue. Search over them is a plain
 * case-insensitive substring match against whatever place name a visitor
 * typed, rather than the exact slug match the tour/destination catalogue
 * uses. Dates and traveler counts are collected on the search form and shown
 * back in the results summary, but nothing here has real availability to
 * filter by, so they are not applied as filters.
 */

type RawQuery = Record<string, string | string[] | undefined>;

function includesText(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

export function findFlight(id: string): Flight | undefined {
  return flights.find((flight) => flight.id === id);
}

/** "$58" -> 58. Shared by sorting and the sidebar filters' "from" prices. */
export function flightPriceValue(price: string): number {
  return Number.parseFloat(price.replace(/[^0-9.]/g, '')) || Infinity;
}

/** "0" / "1" / "2+" — the three buckets the Stops filter groups by. */
export function stopsKey(stops: number): string {
  if (stops === 0) return '0';
  if (stops === 1) return '1';
  return '2+';
}

const STOPS_LABEL: Record<string, string> = { '0': 'Nonstop', '1': '1 stop', '2+': '2+ stops' };
const STOPS_ORDER = ['0', '1', '2+'];

/** "morning" / "afternoon" / "evening", off the 24h departure time. */
export function departTimeKey(departTime: string): string {
  const hour = Number.parseInt(departTime.slice(0, 2), 10);
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

/** The reference's rating wording, off the positive-review percentage. */
export function ratingLabel(percent: number): string {
  if (percent >= 80) return 'Excellent';
  if (percent >= 70) return 'Good';
  if (percent >= 50) return 'Okay';
  return 'Fair';
}

/** How far below its pre-sale total a discounted fare sits, e.g. 12 for "12% off". */
export function flightDiscountPercent(flight: Flight): number | null {
  if (!flight.wasPrice) return null;
  const was = flightPriceValue(flight.wasPrice);
  const now = flightPriceValue(flight.totalPrice);
  if (!Number.isFinite(was) || !Number.isFinite(now) || was <= now) return null;
  return Math.round(((was - now) / was) * 100);
}

/**
 * The cheapest fare in each cabin, which is what earns the "Great Deal" badge —
 * the same rule the reference states: the lowest priced option per category.
 */
const greatDealIds: Set<string> = (() => {
  const cheapest = new Map<string, Flight>();
  for (const flight of flights) {
    const current = cheapest.get(flight.cabin);
    if (!current || flightPriceValue(flight.totalPrice) < flightPriceValue(current.totalPrice)) {
      cheapest.set(flight.cabin, flight);
    }
  }
  return new Set(Array.from(cheapest.values(), (flight) => flight.id));
})();

export function isFlightGreatDeal(flight: Flight): boolean {
  return greatDealIds.has(flight.id);
}

/** Total-price bands, matching the reference's seven. `key` is "min-max", max exclusive. */
const PRICE_BUCKETS: { key: string; label: string; min: number; max: number }[] = [
  { key: '0-75', label: 'Less than $75', min: 0, max: 75 },
  { key: '75-100', label: '$75 to $100', min: 75, max: 100 },
  { key: '100-200', label: '$100 to $200', min: 100, max: 200 },
  { key: '200-300', label: '$200 to $300', min: 200, max: 300 },
  { key: '300-400', label: '$300 to $400', min: 300, max: 400 },
  { key: '400-500', label: '$400 to $500', min: 400, max: 500 },
  { key: '500-', label: '$500 or more', min: 500, max: Infinity },
];

/** Cumulative duration caps, in minutes — the reference's "Search nearby" radii. */
const DURATION_CAPS: { key: string; label: string }[] = [
  { key: '90', label: 'Under 1h 30m' },
  { key: '120', label: 'Under 2h' },
  { key: '180', label: 'Under 3h' },
  { key: '300', label: 'Under 5h' },
  { key: '480', label: 'Under 8h' },
];

function hasAmenity(flight: Flight, key: string): boolean {
  if (key === 'carry-on') return Boolean(flight.carryOn);
  if (key === 'checked-bag') return flight.checkedBag;
  if (key === 'wifi') return flight.wifi;
  if (key === 'meal') return flight.meal;
  return false;
}

/**
 * One predicate per sidebar filter group, keyed by the query parameter the
 * group writes to. Checking a box narrows within a group and across groups:
 * options inside a group are OR-ed, groups are AND-ed together.
 */
const FLIGHT_FILTERS: Record<string, (flight: Flight, key: string) => boolean> = {
  offer: (flight, key) =>
    key === 'sale' ? Boolean(flight.wasPrice) : isFlightGreatDeal(flight),
  stops: (flight, key) => stopsKey(flight.stops) === key,
  airline: (flight, key) => flight.airline === key,
  cabin: (flight, key) => flight.cabin === key,
  departTime: (flight, key) => departTimeKey(flight.departTime) === key,
  checkin: (flight) => flight.onlineCheckIn,
  rating: (flight, key) => flight.ratingPercent >= Number(key),
  payment: (flight, key) => (key === 'now' ? flight.payNow : !flight.payNow),
  price: (flight, key) => {
    const bucket = PRICE_BUCKETS.find((b) => b.key === key);
    if (!bucket) return true;
    const total = flightPriceValue(flight.totalPrice);
    return total >= bucket.min && total < bucket.max;
  },
  airport: (flight, key) => flight.fromCode === key,
  arrival: (flight, key) => flight.toCode === key,
  duration: (flight, key) => flight.durationMinutes <= Number(key),
  amenity: hasAmenity,
};

export type ResultsFilterOption = {
  key: string;
  label: string;
  /** Cheapest total among items matching this option; absent on "From"-less groups. */
  fromPrice?: string;
  /** A small explanatory line under the option, as the reference shows for "Great Deal". */
  note?: string;
};

export type ResultsFilterGroup = {
  /** The query parameter this group's checkboxes write to. */
  param: string;
  label: string;
  /** Whether the group header carries the right-hand "From" column. */
  showFrom: boolean;
  /** How many options show before the group collapses behind "Show more". */
  initialVisible: number;
  options: ResultsFilterOption[];
};

/*
 * Both results sidebars are built the same way: for each option, find the
 * cheapest total behind it and label the row with it, dropping options that
 * nothing matches. These two helpers do that over any catalogue.
 */

function withFromPrices<T>(
  items: T[],
  total: (item: T) => number,
  predicate: (item: T, key: string) => boolean,
  options: { key: string; label: string; note?: string }[]
): ResultsFilterOption[] {
  return options
    .map((option) => {
      let cheapest = Infinity;
      for (const item of items) {
        if (predicate(item, option.key)) cheapest = Math.min(cheapest, total(item));
      }
      return { ...option, fromPrice: Number.isFinite(cheapest) ? `$${cheapest}` : undefined };
    })
    .filter((option) => option.fromPrice !== undefined);
}

/** Distinct values of a field, in cheapest-total-first order. */
function byCheapest<T, V extends string>(
  items: T[],
  total: (item: T) => number,
  read: (item: T) => V
): V[] {
  const cheapest = new Map<V, number>();
  for (const item of items) {
    const value = read(item);
    const current = cheapest.get(value);
    const price = total(item);
    if (current === undefined || price < current) cheapest.set(value, price);
  }
  return Array.from(cheapest.entries())
    .sort(([, a], [, b]) => a - b)
    .map(([value]) => value);
}

/** Cheapest total across every flight matching `param`/`key`. */
function flightOptions(param: string, options: { key: string; label: string; note?: string }[]) {
  return withFromPrices(
    flights,
    (flight) => flightPriceValue(flight.totalPrice),
    FLIGHT_FILTERS[param],
    options
  );
}

function flightsByCheapest<V extends string>(read: (flight: Flight) => V): V[] {
  return byCheapest(flights, (flight) => flightPriceValue(flight.totalPrice), read);
}

/**
 * The whole "Filter by" sidebar, in the reference's order: offers, then the
 * ways to narrow the itinerary, then price, airports, duration and amenities.
 * Options with nothing behind them are dropped rather than shown greyed out.
 */
export function flightFilterGroups(): ResultsFilterGroup[] {
  const groups: ResultsFilterGroup[] = [
    {
      param: 'offer',
      label: 'Exclusive offers',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions('offer', [
        { key: 'sale', label: 'Sale fares' },
        {
          key: 'greatdeal',
          label: 'Great Deal',
          note: 'Great Deal shows you the lowest priced fare on our website for each cabin',
        },
      ]),
    },
    {
      param: 'stops',
      label: 'Stops',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions(
        'stops',
        STOPS_ORDER.map((key) => ({ key, label: STOPS_LABEL[key] }))
      ),
    },
    {
      param: 'airline',
      label: 'Airline',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions(
        'airline',
        flightsByCheapest((flight) => flight.airline).map((airline) => ({ key: airline, label: airline }))
      ),
    },
    {
      param: 'cabin',
      label: 'Cabin class',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions(
        'cabin',
        flightsByCheapest((flight) => flight.cabin).map((cabin) => ({ key: cabin, label: cabin }))
      ),
    },
    {
      param: 'departTime',
      label: 'Departure time',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions('departTime', [
        { key: 'morning', label: 'Morning (before 12:00)' },
        { key: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
        { key: 'evening', label: 'Evening (after 18:00)' },
      ]),
    },
    {
      param: 'checkin',
      label: 'Save time at the airport',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions('checkin', [{ key: 'online', label: 'Online check-in' }]),
    },
    {
      param: 'rating',
      label: 'Traveler ratings',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions('rating', [
        { key: '70', label: '70% positive & up' },
        { key: '40', label: '40% positive & up' },
      ]),
    },
    {
      param: 'payment',
      label: 'Payment option',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions('payment', [
        { key: 'now', label: 'Pay now' },
        { key: 'later', label: 'Pay later' },
      ]),
    },
    {
      param: 'price',
      label: 'Total price',
      showFrom: false,
      initialVisible: 6,
      options: PRICE_BUCKETS.map(({ key, label }) => ({ key, label })),
    },
    {
      param: 'airport',
      label: 'Departure airport',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions(
        'airport',
        flightsByCheapest((flight) => flight.fromCode).map((code) => {
          const flight = flights.find((f) => f.fromCode === code)!;
          return { key: code, label: `${flight.fromAirport} (${code})` };
        })
      ),
    },
    {
      param: 'arrival',
      label: 'Arriving in',
      showFrom: false,
      initialVisible: 6,
      options: flightsByCheapest((flight) => flight.toCode).map((code) => {
        const flight = flights.find((f) => f.toCode === code)!;
        return { key: code, label: `${flight.toCity}, Thailand` };
      }),
    },
    {
      param: 'duration',
      label: 'Flight duration',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions('duration', DURATION_CAPS),
    },
    {
      param: 'amenity',
      label: 'Amenities',
      showFrom: true,
      initialVisible: 6,
      options: flightOptions('amenity', [
        { key: 'carry-on', label: 'Carry-on included' },
        { key: 'checked-bag', label: 'Checked bag included' },
        { key: 'wifi', label: 'Wi-Fi on board' },
        { key: 'meal', label: 'Meal service' },
      ]),
    },
  ];

  return groups.filter((group) => group.options.length > 0);
}

/** Every filter parameter the sidebar owns — the set the page reads back off the URL. */
export const FLIGHT_FILTER_PARAMS = Object.keys(FLIGHT_FILTERS);

export function searchFlights(query: RawQuery): Flight[] {
  const from = first(query.from);
  const to = first(query.to);
  const cabinField = first(query.cabinClass);
  const sort = first(query.sort);

  const filtered = flights.filter((flight) => {
    if (from && !includesText(`${flight.fromCity} ${flight.fromCode} ${flight.fromAirport}`, from)) {
      return false;
    }
    if (to && !includesText(`${flight.toCity} ${flight.toCode} ${flight.toAirport}`, to)) {
      return false;
    }
    // The search bar's cabin field, separate from the sidebar's `cabin` filter.
    if (cabinField && flight.cabin !== cabinField) return false;

    for (const [param, predicate] of Object.entries(FLIGHT_FILTERS)) {
      const selected = values(query[param]);
      if (selected.length === 0) continue;
      if (!selected.some((key) => predicate(flight, key))) return false;
    }
    return true;
  });

  if (sort === 'price') {
    return [...filtered].sort(
      (a, b) => flightPriceValue(a.totalPrice) - flightPriceValue(b.totalPrice)
    );
  }
  if (sort === 'duration') {
    return [...filtered].sort((a, b) => a.durationMinutes - b.durationMinutes);
  }
  if (sort === 'rating') {
    return [...filtered].sort((a, b) => b.ratingPercent - a.ratingPercent);
  }
  return filtered;
}

export function findCar(id: string): Car | undefined {
  return cars.find((car) => car.id === id);
}

/** "$18" -> 18. Shared by sorting and the sidebar filters' "from" prices. */
export function carPriceValue(price: string): number {
  return Number.parseFloat(price.replace(/[^0-9.]/g, '')) || Infinity;
}

/** How far below its pre-sale total a discounted rate sits, e.g. 12 for "12% off". */
export function carDiscountPercent(car: Car): number | null {
  if (!car.wasPrice) return null;
  const was = carPriceValue(car.wasPrice);
  const now = carPriceValue(car.totalPrice);
  if (!Number.isFinite(was) || !Number.isFinite(now) || was <= now) return null;
  return Math.round(((was - now) / was) * 100);
}

/**
 * The cheapest car in each category, which is what earns the "Great Deal"
 * badge — the rule the reference states: the lowest priced car for each
 * category.
 */
const carGreatDealIds: Set<string> = (() => {
  const cheapest = new Map<string, Car>();
  for (const car of cars) {
    const current = cheapest.get(car.category);
    if (!current || carPriceValue(car.totalPrice) < carPriceValue(current.totalPrice)) {
      cheapest.set(car.category, car);
    }
  }
  return new Set(Array.from(cheapest.values(), (car) => car.id));
})();

export function isCarGreatDeal(car: Car): boolean {
  return carGreatDealIds.has(car.id);
}

/** Cumulative distance radii, in miles — the reference's "Search nearby". */
const NEARBY_RADII: { key: string; label: string }[] = [
  { key: '1', label: '1 mile' },
  { key: '2', label: '2 miles' },
  { key: '5', label: '5 miles' },
  { key: '10', label: '10 miles' },
  { key: '25', label: '25 miles' },
];

function carSpecification(car: Car, key: string): boolean {
  if (key === 'Automatic' || key === 'Manual') return car.transmission === key;
  if (key === 'unlimited') return car.unlimitedMileage;
  if (key === 'awd') return car.allWheelDrive;
  return false;
}

/**
 * One predicate per sidebar filter group, keyed by the query parameter the
 * group writes to. Options inside a group are OR-ed, groups are AND-ed.
 */
const CAR_FILTERS: Record<string, (car: Car, key: string) => boolean> = {
  offer: (car, key) => (key === 'sale' ? Boolean(car.wasPrice) : isCarGreatDeal(car)),
  locationType: (car, key) => car.locationType === key,
  carType: (car, key) => car.category === key,
  capacity: (car, key) => (key === 'small' ? car.seats <= 5 : car.seats >= 6),
  fuel: (car, key) => car.fuel === key,
  checkin: (car) => car.onlineCheckIn,
  rating: (car, key) => car.supplierRatingPercent >= Number(key),
  payment: (car, key) => (key === 'now' ? car.payNow : !car.payNow),
  price: (car, key) => {
    const bucket = PRICE_BUCKETS.find((b) => b.key === key);
    if (!bucket) return true;
    const total = carPriceValue(car.totalPrice);
    return total >= bucket.min && total < bucket.max;
  },
  supplier: (car, key) => car.supplier === key,
  shuttle: (car) => car.freeShuttle,
  neighborhood: (car, key) => car.city === key,
  nearby: (car, key) => car.distanceMiles <= Number(key),
  spec: carSpecification,
};

function carOptions(param: string, options: { key: string; label: string; note?: string }[]) {
  return withFromPrices(cars, (car) => carPriceValue(car.totalPrice), CAR_FILTERS[param], options);
}

function carsByCheapest<V extends string>(read: (car: Car) => V): V[] {
  return byCheapest(cars, (car) => carPriceValue(car.totalPrice), read);
}

/**
 * The whole "Filter by" sidebar for Cars, in the reference's order: offers,
 * where you pick the car up, what kind of car it is, then price, supplier,
 * neighbourhood, radius and specifications. Options with nothing behind them
 * are dropped rather than shown greyed out.
 */
export function carFilterGroups(): ResultsFilterGroup[] {
  const groups: ResultsFilterGroup[] = [
    {
      param: 'offer',
      label: 'Exclusive offers',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('offer', [
        { key: 'sale', label: 'Sale' },
        {
          key: 'greatdeal',
          label: 'Great Deal',
          note: 'Great Deal shows you the lowest priced car on our website for each category',
        },
      ]),
    },
    {
      param: 'locationType',
      label: 'Location type',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('locationType', [
        { key: 'Airport', label: 'Airport' },
        { key: 'Non-airport', label: 'Non-airport' },
      ]),
    },
    {
      param: 'carType',
      label: 'Car type',
      showFrom: true,
      initialVisible: 6,
      options: carOptions(
        'carType',
        carsByCheapest((car) => car.category).map((category) => ({
          key: category,
          label: category,
        }))
      ),
    },
    {
      param: 'capacity',
      label: 'Capacity',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('capacity', [
        { key: 'small', label: '2-5 passengers' },
        { key: 'large', label: '6 or more passengers' },
      ]),
    },
    {
      param: 'fuel',
      label: 'Electric cars',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('fuel', [
        { key: 'Electric', label: 'Electric' },
        { key: 'Hybrid', label: 'Hybrid' },
      ]),
    },
    {
      param: 'checkin',
      label: 'Save time during pick-up',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('checkin', [{ key: 'online', label: 'Online check-in' }]),
    },
    {
      param: 'rating',
      label: 'Traveler ratings',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('rating', [
        { key: '70', label: '70% positive & up' },
        { key: '40', label: '40% positive & up' },
      ]),
    },
    {
      param: 'payment',
      label: 'Payment option',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('payment', [
        { key: 'now', label: 'Pay now' },
        { key: 'later', label: 'Pay later' },
      ]),
    },
    {
      param: 'price',
      label: 'Total price',
      showFrom: false,
      initialVisible: 6,
      options: PRICE_BUCKETS.map(({ key, label }) => ({ key, label })),
    },
    {
      param: 'supplier',
      label: 'Rental car company',
      showFrom: true,
      initialVisible: 6,
      options: carOptions(
        'supplier',
        carsByCheapest((car) => car.supplier).map((supplier) => ({
          key: supplier,
          label: supplier,
        }))
      ),
    },
    {
      param: 'shuttle',
      label: 'Airport pick-up',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('shuttle', [{ key: 'free', label: 'Free shuttle' }]),
    },
    {
      param: 'neighborhood',
      label: 'Neighborhood',
      showFrom: false,
      initialVisible: 6,
      options: carsByCheapest((car) => car.city).map((city) => ({ key: city, label: city })),
    },
    {
      param: 'nearby',
      label: 'Search nearby',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('nearby', NEARBY_RADII),
    },
    {
      param: 'spec',
      label: 'Specifications',
      showFrom: true,
      initialVisible: 6,
      options: carOptions('spec', [
        { key: 'Automatic', label: 'Automatic' },
        { key: 'Manual', label: 'Manual' },
        { key: 'unlimited', label: 'Unlimited Mileage' },
        { key: 'awd', label: 'All-wheel drive/4X4' },
      ]),
    },
  ];

  return groups.filter((group) => group.options.length > 0);
}

/** Every filter parameter the sidebar owns — the set the page reads back off the URL. */
export const CAR_FILTER_PARAMS = Object.keys(CAR_FILTERS);

function values(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  return typeof value === 'string' && value ? [value] : [];
}

export function searchCars(query: RawQuery): Car[] {
  const location = first(query.pickupLocation);
  const sort = first(query.sort);

  const filtered = cars.filter((car) => {
    if (location && !includesText(`${car.location} ${car.city} ${car.address}`, location)) {
      return false;
    }

    for (const [param, predicate] of Object.entries(CAR_FILTERS)) {
      const selected = values(query[param]);
      if (selected.length === 0) continue;
      if (!selected.some((key) => predicate(car, key))) return false;
    }
    return true;
  });

  if (sort === 'price') {
    return [...filtered].sort((a, b) => carPriceValue(a.totalPrice) - carPriceValue(b.totalPrice));
  }
  if (sort === 'distance') {
    return [...filtered].sort((a, b) => a.distanceMiles - b.distanceMiles);
  }
  if (sort === 'rating') {
    return [...filtered].sort((a, b) => b.supplierRatingPercent - a.supplierRatingPercent);
  }
  return filtered;
}

export function findPackage(id: string): PackageDeal | undefined {
  return packages.find((pkg) => pkg.id === id);
}

/** "$1,145" -> 1145. Shared by sorting and the "from" price in a section heading. */
export function packagePriceValue(price: string): number {
  return Number.parseFloat(price.replace(/[^0-9.]/g, '')) || Infinity;
}

/** How far below its pre-sale price a discounted bundle sits, e.g. 20 for "20% off". */
export function packageDiscountPercent(pkg: PackageDeal): number | null {
  if (!pkg.wasPrice) return null;
  const was = packagePriceValue(pkg.wasPrice);
  const now = packagePriceValue(pkg.price);
  if (!Number.isFinite(was) || !Number.isFinite(now) || was <= now) return null;
  return Math.round(((was - now) / was) * 100);
}

/**
 * The three dropdowns above each destination's deals, matching the reference's
 * "Trip length / Star rating / Flight class". Each is scoped to its own
 * section, so narrowing Phuket leaves the other sections alone — the section
 * slug prefixes the query parameter (e.g. `phuket-length=5`).
 */
export const PACKAGE_FILTER_DIMENSIONS = ['length', 'stars', 'class'] as const;

export type PackageFilterDimension = (typeof PACKAGE_FILTER_DIMENSIONS)[number];

export function packageFilterParam(slug: string, dimension: PackageFilterDimension): string {
  return `${slug}-${dimension}`;
}

const TRIP_LENGTHS: { key: string; label: string; min: number; max: number }[] = [
  { key: '1-3', label: '1-3 nights', min: 1, max: 3 },
  { key: '4-5', label: '4-5 nights', min: 4, max: 5 },
  { key: '6-7', label: '6-7 nights', min: 6, max: 7 },
  { key: '8', label: '8+ nights', min: 8, max: Infinity },
];

const STAR_TIERS: { key: string; label: string }[] = [
  { key: '5', label: '5 stars' },
  { key: '4', label: '4 stars & up' },
  { key: '3', label: '3 stars & up' },
];

function matchesPackageFilter(
  pkg: PackageDeal,
  dimension: PackageFilterDimension,
  value: string
): boolean {
  if (dimension === 'length') {
    const band = TRIP_LENGTHS.find((entry) => entry.key === value);
    return band ? pkg.nights >= band.min && pkg.nights <= band.max : true;
  }
  if (dimension === 'stars') return pkg.starRating >= Number(value);
  return pkg.flightClass === value;
}

export type PackageFilterSelect = {
  param: string;
  label: string;
  value: string;
  options: { key: string; label: string }[];
};

export type PackageSection = {
  slug: string;
  /** The destination's display name, e.g. "Phuket". */
  name: string;
  heading: string;
  /** Cheapest bundle in the section before any filtering, for the intro line. */
  fromPrice: string;
  deals: PackageDeal[];
  selects: PackageFilterSelect[];
  /** True when any of this section's three dropdowns is set. */
  filtered: boolean;
};

/**
 * Every destination that has bundles, cheapest-first, with its deals already
 * narrowed by that section's own dropdowns. Sections whose filters exclude
 * everything still render, so the traveller can see and clear them.
 */
export function packageSections(query: RawQuery): PackageSection[] {
  const to = first(query.to);

  const bySlug = new Map<string, PackageDeal[]>();
  for (const pkg of packages) {
    const destinationName = findDestination(pkg.destinationSlug)?.name ?? '';
    if (to && !includesText(pkg.title, to) && !includesText(destinationName, to)) continue;
    const list = bySlug.get(pkg.destinationSlug) ?? [];
    list.push(pkg);
    bySlug.set(pkg.destinationSlug, list);
  }

  const sections: PackageSection[] = [];

  for (const [slug, all] of bySlug) {
    const name = findDestination(slug)?.name ?? slug;
    const sorted = [...all].sort(
      (a, b) => packagePriceValue(a.price) - packagePriceValue(b.price)
    );

    const selects: PackageFilterSelect[] = [
      {
        param: packageFilterParam(slug, 'length'),
        label: 'Trip length',
        value: first(query[packageFilterParam(slug, 'length')]),
        options: TRIP_LENGTHS.filter((band) =>
          all.some((pkg) => pkg.nights >= band.min && pkg.nights <= band.max)
        ).map(({ key, label }) => ({ key, label })),
      },
      {
        param: packageFilterParam(slug, 'stars'),
        label: 'Star rating',
        value: first(query[packageFilterParam(slug, 'stars')]),
        options: STAR_TIERS.filter((tier) =>
          all.some((pkg) => pkg.starRating >= Number(tier.key))
        ),
      },
      {
        param: packageFilterParam(slug, 'class'),
        label: 'Flight class',
        value: first(query[packageFilterParam(slug, 'class')]),
        options: byCheapest(all, (pkg) => packagePriceValue(pkg.price), (pkg) => pkg.flightClass).map(
          (flightClass) => ({ key: flightClass, label: flightClass })
        ),
      },
    ];

    const deals = sorted.filter((pkg) =>
      PACKAGE_FILTER_DIMENSIONS.every((dimension) => {
        const value = first(query[packageFilterParam(slug, dimension)]);
        return !value || matchesPackageFilter(pkg, dimension, value);
      })
    );

    sections.push({
      slug,
      name,
      heading: `${name} Package Deals`,
      fromPrice: sorted[0].price,
      deals,
      selects,
      filtered: selects.some((select) => Boolean(select.value)),
    });
  }

  return sections.sort(
    (a, b) => packagePriceValue(a.fromPrice) - packagePriceValue(b.fromPrice)
  );
}

export function searchPackages(query: RawQuery): PackageDeal[] {
  return packageSections(query).flatMap((section) => section.deals);
}

export function findCruise(id: string): Cruise | undefined {
  return cruises.find((cruise) => cruise.id === id);
}

/**
 * The "Duration" dropdown's bands, as nights. `max` is inclusive; a day
 * sailing is zero nights, so it gets a band of its own.
 */
const CRUISE_DURATIONS: { key: string; label: string; min: number; max: number }[] = [
  { key: 'day', label: 'Day sailing', min: 0, max: 0 },
  { key: '1-2', label: '1 – 2 nights', min: 1, max: 2 },
  { key: '3-4', label: '3 – 4 nights', min: 3, max: 4 },
  { key: '5', label: '5+ nights', min: 5, max: Number.MAX_SAFE_INTEGER },
];

/** Duration options that at least one sailing satisfies, for the search bar. */
export function cruiseDurationOptions(): { key: string; label: string }[] {
  return CRUISE_DURATIONS.filter((band) =>
    cruises.some((cruise) => cruise.nights >= band.min && cruise.nights <= band.max)
  ).map(({ key, label }) => ({ key, label }));
}

/** Every distinct region and port, for the "Going to" dropdown. */
export function cruiseDestinationOptions(): string[] {
  const seen = new Set<string>();
  for (const cruise of cruises) {
    seen.add(cruise.region);
    for (const port of cruise.ports) seen.add(port);
  }
  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}

export function searchCruises(query: RawQuery): Cruise[] {
  const destination = first(query.destination);
  const duration = first(query.duration);
  const band = CRUISE_DURATIONS.find((entry) => entry.key === duration);

  return cruises.filter((cruise) => {
    if (
      destination &&
      !includesText(cruise.region, destination) &&
      !cruise.ports.some((port) => includesText(port, destination))
    ) {
      return false;
    }
    if (band && (cruise.nights < band.min || cruise.nights > band.max)) return false;
    return true;
  });
}
