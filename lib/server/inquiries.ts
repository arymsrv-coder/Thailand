import 'server-only';
import type { InquiryRequest } from '../types';
import type { ValidInquiry } from '../validation';
import { newReference } from './reference';
import { createStore } from './store';

/**
 * Booking requests for Flights/Cars/Packages/Cruises — the same "recorded,
 * not charged" shape as lib/server/bookings.ts, kept in its own collection
 * since these four verticals share no catalog with tours.
 */
const store = createStore<InquiryRequest>('inquiries');

export async function createInquiry(input: ValidInquiry): Promise<InquiryRequest> {
  let created: InquiryRequest | null = null;

  await store.update((rows) => {
    const taken = new Set(rows.map((row) => row.reference));
    let reference = newReference();
    while (taken.has(reference)) reference = newReference();

    created = {
      id: `iq_${Date.now().toString(36)}_${reference.slice(3).toLowerCase()}`,
      reference,
      kind: input.kind,
      itemId: input.itemId,
      itemLabel: input.itemLabel,
      name: input.name,
      email: input.email,
      date: input.date,
      travelers: input.travelers,
      createdAt: new Date().toISOString(),
    };

    return [...rows, created];
  });

  const inquiry = created as InquiryRequest | null;
  if (!inquiry) throw new Error('inquiry was not created');

  console.log(
    `[inquiry] ${inquiry.reference} — ${inquiry.kind}:${inquiry.itemLabel}, ` +
      `${inquiry.date}, ${inquiry.travelers} traveler(s), ${inquiry.email}`
  );

  return inquiry;
}

export function listInquiries(): Promise<InquiryRequest[]> {
  return store.all();
}
