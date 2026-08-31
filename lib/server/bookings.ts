import 'server-only';
import type { BookingRequest } from '../types';
import type { ValidBooking } from '../validation';
import { findTour } from '../catalog';
import { newReference } from './reference';
import { createStore } from './store';

/*
 * Booking requests. Nothing is charged and no email is sent — a request is
 * recorded and logged, and a coordinator follows it up. When email is added
 * later it belongs behind this function, not in the action that calls it.
 */

const store = createStore<BookingRequest>('bookings');

export async function createBooking(input: ValidBooking): Promise<BookingRequest> {
  // Validation already established the tour exists; this is for its title.
  const tour = findTour(input.tourId);

  let created: BookingRequest | null = null;

  await store.update((rows) => {
    // Codes are short enough to be readable, so collisions are checked rather
    // than assumed away. The check runs inside the write queue, so two
    // simultaneous bookings cannot be handed the same code.
    const taken = new Set(rows.map((row) => row.reference));
    let reference = newReference();
    while (taken.has(reference)) reference = newReference();

    created = {
      id: `bk_${Date.now().toString(36)}_${reference.slice(3).toLowerCase()}`,
      reference,
      tourId: input.tourId,
      tourTitle: tour?.title ?? input.tourId,
      name: input.name,
      email: input.email,
      date: input.date,
      guests: input.guests,
      createdAt: new Date().toISOString(),
    };

    return [...rows, created];
  });

  const booking = created as BookingRequest | null;
  if (!booking) throw new Error('booking was not created');

  console.log(
    `[booking] ${booking.reference} — ${booking.tourTitle}, ` +
      `${booking.date}, ${booking.guests} guest(s), ${booking.email}`
  );

  return booking;
}

export function listBookings(): Promise<BookingRequest[]> {
  return store.all();
}
