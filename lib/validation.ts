import { destinations } from './destinations';
import { tours } from './tours';
import type { ActionResult, SearchQuery } from './types';

/*
 * Pure validation. Shared by every form and search entry point so
 * the rules exist in exactly one place, and importable by tests without pulling
 * in any server-only module.
 *
 * Nothing here throws: every entry point returns either a parsed value or a
 * map of field name -> message, which the forms render inline.
 */

const NAME_MIN = 2;
const NAME_MAX = 80;
const EMAIL_MAX = 254;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;
export const GUESTS_MIN = 1;
export const GUESTS_MAX = 12;

const tourIds = new Set(tours.map((tour) => tour.id));
const destinationSlugs = new Set(destinations.map((d) => d.slug));

/** Query values arrive as `string | string[] | undefined`; take the first. */
export function first(value: unknown): string {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
}

function text(value: unknown): string {
  return first(value).trim();
}

/**
 * Deliberately stricter than the RFC and looser than a full parser: one "@",
 * a dotted domain, no whitespace. Anything that passes here is still only a
 * plausible address — delivery is the real test.
 */
export function isValidEmail(value: string): boolean {
  if (!value || value.length > EMAIL_MAX) return false;
  if (/\s/.test(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!domain.includes('.')) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (domain.includes('..')) return false;
  return true;
}

/**
 * True only for a real calendar date in ISO form. `new Date()` alone would
 * accept "2027-02-29" by rolling it into March, so the parsed parts are
 * compared back against the input.
 */
export function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** Today in the site's own terms, as an ISO date string. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** ISO date strings compare correctly as plain strings, so no parsing needed. */
function isPast(value: string, from: string): boolean {
  return value < from;
}

function parseGuests(value: unknown): number | null {
  const raw = text(value);
  if (!/^\d+$/.test(raw)) return null;
  return Number(raw);
}

export type BookingInput = {
  tourId: unknown;
  name: unknown;
  email: unknown;
  date: unknown;
  guests: unknown;
};

export type ValidBooking = {
  tourId: string;
  name: string;
  email: string;
  date: string;
  guests: number;
};

export function validateBooking(
  input: BookingInput,
  now: string = today()
): ActionResult<ValidBooking> {
  const errors: Record<string, string> = {};

  const tourId = text(input.tourId);
  if (!tourIds.has(tourId)) {
    errors.tourId = 'That tour is no longer available.';
  }

  const name = text(input.name);
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = `Please give a name between ${NAME_MIN} and ${NAME_MAX} characters.`;
  }

  const email = text(input.email);
  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const date = text(input.date);
  if (!isValidIsoDate(date)) {
    errors.date = 'Please choose a travel date.';
  } else if (isPast(date, now)) {
    errors.date = 'Please choose a date that has not already passed.';
  }

  const guests = parseGuests(input.guests);
  if (guests === null || guests < GUESTS_MIN || guests > GUESTS_MAX) {
    errors.guests = `Please enter between ${GUESTS_MIN} and ${GUESTS_MAX} guests.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: { tourId, name, email, date, guests: guests as number },
  };
}

export type ContactInput = { name: unknown; email: unknown; message: unknown };
export type ValidContact = { name: string; email: string; message: string };

export function validateContact(input: ContactInput): ActionResult<ValidContact> {
  const errors: Record<string, string> = {};

  const name = text(input.name);
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = `Please give a name between ${NAME_MIN} and ${NAME_MAX} characters.`;
  }

  const email = text(input.email);
  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const message = text(input.message);
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    errors.message = `Please write between ${MESSAGE_MIN} and ${MESSAGE_MAX} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { name, email, message } };
}

const INQUIRY_KINDS = new Set(['flight', 'car', 'package', 'cruise']);

export type InquiryInput = {
  kind: unknown;
  itemId: unknown;
  itemLabel: unknown;
  name: unknown;
  email: unknown;
  date: unknown;
  travelers: unknown;
};

export type ValidInquiry = {
  kind: 'flight' | 'car' | 'package' | 'cruise';
  itemId: string;
  itemLabel: string;
  name: string;
  email: string;
  date: string;
  travelers: number;
};

/**
 * Shared validation for the Flights/Cars/Packages/Cruises "request to book"
 * flow — one generic form standing in for four verticals that have no real
 * catalog (and so no per-item constraint like a tour's max group size).
 */
export function validateInquiry(
  input: InquiryInput,
  now: string = today()
): ActionResult<ValidInquiry> {
  const errors: Record<string, string> = {};

  const kind = text(input.kind);
  if (!INQUIRY_KINDS.has(kind)) {
    errors.kind = 'That request type is not recognised.';
  }

  const itemId = text(input.itemId);
  if (!itemId) {
    errors.itemId = 'That listing is no longer available.';
  }

  const itemLabel = text(input.itemLabel) || itemId;

  const name = text(input.name);
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = `Please give a name between ${NAME_MIN} and ${NAME_MAX} characters.`;
  }

  const email = text(input.email);
  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const date = text(input.date);
  if (!isValidIsoDate(date)) {
    errors.date = 'Please choose a date.';
  } else if (isPast(date, now)) {
    errors.date = 'Please choose a date that has not already passed.';
  }

  const travelers = parseGuests(input.travelers);
  if (travelers === null || travelers < GUESTS_MIN || travelers > GUESTS_MAX) {
    errors.travelers = `Please enter between ${GUESTS_MIN} and ${GUESTS_MAX} travelers.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      kind: kind as ValidInquiry['kind'],
      itemId,
      itemLabel,
      name,
      email,
      date,
      travelers: travelers as number,
    },
  };
}

/**
 * Search is forgiving where a form is strict: a nonsense filter is dropped
 * rather than rejected, because a hand-edited URL should still render a page
 * instead of an error.
 */
export function validateSearch(
  params: Record<string, unknown>,
  now: string = today()
): SearchQuery {
  const query: SearchQuery = {};

  const where = text(params.where);
  if (destinationSlugs.has(where)) query.where = where;

  const from = text(params.from);
  if (isValidIsoDate(from) && !isPast(from, now)) query.from = from;

  const to = text(params.to);
  // A range needs a start, and must actually span time.
  if (isValidIsoDate(to) && !isPast(to, now) && query.from && to > query.from) {
    query.to = to;
  }

  const guests = parseGuests(params.guests);
  if (guests !== null) {
    query.guests = Math.min(GUESTS_MAX, Math.max(GUESTS_MIN, guests));
  }

  return query;
}
