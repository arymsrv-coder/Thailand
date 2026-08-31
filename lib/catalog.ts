import { destinations } from './destinations';
import { tours } from './tours';
import type { Destination, SearchQuery, Tour } from './types';

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
