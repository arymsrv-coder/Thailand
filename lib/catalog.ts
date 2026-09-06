import { cars } from './cars';
import { cruises } from './cruises';
import { destinations } from './destinations';
import { flights } from './flights';
import { packages } from './packages';
import { tours } from './tours';
import type { Car, Cruise, Destination, Flight, PackageDeal, SearchQuery, Tour } from './types';
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

/** One entry per stop count that actually occurs, cheapest-first, for the sidebar filter. */
export function flightStopsSummary(): { key: string; label: string; fromPrice: string }[] {
  const cheapest = new Map<string, number>();
  for (const flight of flights) {
    const key = stopsKey(flight.stops);
    const value = flightPriceValue(flight.price);
    const current = cheapest.get(key);
    if (current === undefined || value < current) cheapest.set(key, value);
  }
  return STOPS_ORDER.filter((key) => cheapest.has(key)).map((key) => ({
    key,
    label: STOPS_LABEL[key],
    fromPrice: `$${cheapest.get(key)}`,
  }));
}

/** One entry per airline, cheapest-first, for the sidebar filter. */
export function flightAirlineSummary(): { airline: string; fromPrice: string }[] {
  const cheapest = new Map<string, number>();
  for (const flight of flights) {
    const value = flightPriceValue(flight.price);
    const current = cheapest.get(flight.airline);
    if (current === undefined || value < current) cheapest.set(flight.airline, value);
  }
  return Array.from(cheapest.entries())
    .sort(([, a], [, b]) => a - b)
    .map(([airline, value]) => ({ airline, fromPrice: `$${value}` }));
}

export function searchFlights(query: RawQuery): Flight[] {
  const from = first(query.from);
  const to = first(query.to);
  const stopsFilter = new Set(values(query.stops));
  const airlineFilter = new Set(values(query.airline));
  const sort = first(query.sort);

  const filtered = flights.filter((flight) => {
    if (from && !includesText(`${flight.fromCity} ${flight.fromCode}`, from)) return false;
    if (to && !includesText(`${flight.toCity} ${flight.toCode}`, to)) return false;
    if (stopsFilter.size > 0 && !stopsFilter.has(stopsKey(flight.stops))) return false;
    if (airlineFilter.size > 0 && !airlineFilter.has(flight.airline)) return false;
    return true;
  });

  if (sort === 'price-asc') {
    return [...filtered].sort((a, b) => flightPriceValue(a.price) - flightPriceValue(b.price));
  }
  if (sort === 'price-desc') {
    return [...filtered].sort((a, b) => flightPriceValue(b.price) - flightPriceValue(a.price));
  }
  return filtered;
}

/**
 * A 7-day fare calendar around a center date, matching how a real flight
 * search shows nearby days' prices. There's no per-date inventory behind
 * this — each day is the cheapest currently-matching flight's price, nudged
 * by a small deterministic amount so the strip doesn't repeat one number
 * seven times. Same route search always produces the same calendar; it
 * doesn't drift on reload.
 */
export function flightDateStrip(
  query: RawQuery,
  centerDate: string
): { date: string; price: number }[] {
  const base = searchFlights(query).reduce(
    (min, flight) => Math.min(min, flightPriceValue(flight.price)),
    Infinity
  );
  if (!Number.isFinite(base)) return [];

  const center = new Date(`${centerDate}T00:00:00Z`);
  if (Number.isNaN(center.getTime())) return [];

  const days: { date: string; price: number }[] = [];
  for (let offset = -3; offset <= 3; offset += 1) {
    const day = new Date(center);
    day.setUTCDate(day.getUTCDate() + offset);
    const dayOfYear = Math.floor(
      (day.getTime() - Date.UTC(day.getUTCFullYear(), 0, 0)) / 86_400_000
    );
    const jitter = ((dayOfYear * 37) % 21) - 10; // deterministic, -10..+10
    days.push({
      date: day.toISOString().slice(0, 10),
      price: Math.max(Math.round(base + jitter), Math.round(base * 0.85)),
    });
  }
  return days;
}

export function findCar(id: string): Car | undefined {
  return cars.find((car) => car.id === id);
}

/** "$18" -> 18. Shared by sorting and the "cheapest in category" filter prices. */
export function carPriceValue(price: string): number {
  return Number.parseFloat(price.replace(/[^0-9.]/g, '')) || Infinity;
}

/** One entry per car category, cheapest-first, for the sidebar filter. */
export function carCategorySummary(): { category: string; fromPrice: string }[] {
  const cheapest = new Map<string, number>();
  for (const car of cars) {
    const value = carPriceValue(car.pricePerDay);
    const current = cheapest.get(car.category);
    if (current === undefined || value < current) cheapest.set(car.category, value);
  }
  return Array.from(cheapest.entries())
    .sort(([, a], [, b]) => a - b)
    .map(([category, value]) => ({ category, fromPrice: `$${value}` }));
}

function values(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
  return typeof value === 'string' && value ? [value] : [];
}

export function searchCars(query: RawQuery): Car[] {
  const location = first(query.pickupLocation);
  const types = new Set(values(query.carType));
  const sort = first(query.sort);

  const filtered = cars.filter((car) => {
    if (location && !includesText(car.location, location)) return false;
    if (types.size > 0 && !types.has(car.category)) return false;
    return true;
  });

  if (sort === 'price-asc') {
    return [...filtered].sort((a, b) => carPriceValue(a.pricePerDay) - carPriceValue(b.pricePerDay));
  }
  if (sort === 'price-desc') {
    return [...filtered].sort((a, b) => carPriceValue(b.pricePerDay) - carPriceValue(a.pricePerDay));
  }
  return filtered;
}

export function findPackage(id: string): PackageDeal | undefined {
  return packages.find((pkg) => pkg.id === id);
}

export function searchPackages(query: RawQuery): PackageDeal[] {
  const to = first(query.to);
  if (!to) return packages;

  return packages.filter((pkg) => {
    const destinationName = findDestination(pkg.destinationSlug)?.name ?? '';
    return includesText(pkg.title, to) || includesText(destinationName, to);
  });
}

export function findCruise(id: string): Cruise | undefined {
  return cruises.find((cruise) => cruise.id === id);
}

export function searchCruises(query: RawQuery): Cruise[] {
  const destination = first(query.destination);
  if (!destination) return cruises;

  return cruises.filter(
    (cruise) =>
      includesText(cruise.region, destination) ||
      cruise.ports.some((port) => includesText(port, destination))
  );
}
