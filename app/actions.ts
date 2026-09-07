'use server';

import type { ActionResult } from '@/lib/types';
import { validateBooking, validateContact, validateInquiry } from '@/lib/validation';
import { findDestination } from '@/lib/catalog';
import { createBooking } from '@/lib/server/bookings';
import { createInquiry } from '@/lib/server/inquiries';
import { createMessage } from '@/lib/server/messages';
import { getFavorites, toggleFavorite } from '@/lib/server/favorites';
import { currentVisitorId, ensureVisitorId } from '@/lib/server/session';

/*
 * Every mutation on the site.
 *
 * Server Actions are reachable by direct POST, not only through the UI, so each
 * one re-validates its input here regardless of what the browser checked. The
 * actions never throw at the caller: they return a field-keyed error map that
 * the forms render inline, and log the underlying cause server-side.
 */

const GENERIC_FAILURE = {
  form: 'Something went wrong on our end. Please try again in a moment.',
};

export type BookingSuccess = { reference: string };

export async function submitBooking(
  _previous: ActionResult<BookingSuccess> | null,
  formData: FormData
): Promise<ActionResult<BookingSuccess>> {
  const parsed = validateBooking({
    tourId: formData.get('tourId'),
    name: formData.get('name'),
    email: formData.get('email'),
    date: formData.get('date'),
    guests: formData.get('guests'),
  });

  if (!parsed.ok) return parsed;

  try {
    const booking = await createBooking(parsed.value);
    return { ok: true, value: { reference: booking.reference } };
  } catch (error) {
    console.error('[submitBooking] failed to store booking', error);
    return { ok: false, errors: GENERIC_FAILURE };
  }
}

export type InquirySuccess = { reference: string };

export async function submitInquiry(
  _previous: ActionResult<InquirySuccess> | null,
  formData: FormData
): Promise<ActionResult<InquirySuccess>> {
  const parsed = validateInquiry({
    kind: formData.get('kind'),
    itemId: formData.get('itemId'),
    itemLabel: formData.get('itemLabel'),
    name: formData.get('name'),
    email: formData.get('email'),
    date: formData.get('date'),
    travelers: formData.get('travelers'),
  });

  if (!parsed.ok) return parsed;

  try {
    const inquiry = await createInquiry(parsed.value);
    return { ok: true, value: { reference: inquiry.reference } };
  } catch (error) {
    console.error('[submitInquiry] failed to store inquiry', error);
    return { ok: false, errors: GENERIC_FAILURE };
  }
}

export async function submitContact(
  _previous: ActionResult<void> | null,
  formData: FormData
): Promise<ActionResult<void>> {
  const parsed = validateContact({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!parsed.ok) return parsed;

  try {
    await createMessage(parsed.value);
    return { ok: true, value: undefined };
  } catch (error) {
    console.error('[submitContact] failed to store message', error);
    return { ok: false, errors: GENERIC_FAILURE };
  }
}

/**
 * Saves or unsaves a destination, returning the visitor's whole list so the
 * client can reconcile its optimistic state against the truth.
 */
export async function toggleSavedDestination(
  slug: string
): Promise<ActionResult<string[]>> {
  if (!findDestination(slug)) {
    return { ok: false, errors: { form: 'Unknown destination.' } };
  }

  try {
    // Mints the visitor cookie on the first save.
    const visitorId = await ensureVisitorId();
    const saved = await toggleFavorite(visitorId, slug);
    /*
     * Deliberately no revalidatePath here. The page reads the cookie, so it is
     * already dynamic and nothing is cached to invalidate — and refreshing the
     * route on every heart click would re-render the whole page underneath the
     * visitor. The client holds the returned list; the next load re-reads it.
     */
    return { ok: true, value: saved };
  } catch (error) {
    console.error('[toggleSavedDestination] failed', error);
    return { ok: false, errors: GENERIC_FAILURE };
  }
}

/** Read side, used by the page's server render. */
export async function readSavedDestinations(): Promise<string[]> {
  try {
    return await getFavorites(await currentVisitorId());
  } catch (error) {
    console.error('[readSavedDestinations] failed', error);
    return [];
  }
}
