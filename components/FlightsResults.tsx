'use client';

import { useCallback, useState } from 'react';
import type { Flight } from '@/lib/types';
import FlightRow from './FlightRow';
import InquiryModal, { type InquiryItem } from './InquiryModal';

/** How many fares show before "Show more", as the reference pages a long list. */
const PAGE_SIZE = 6;

export default function FlightsResults({
  flights,
  defaultDate,
  defaultTravelers,
}: {
  flights: Flight[];
  defaultDate?: string;
  defaultTravelers?: number;
}) {
  const [active, setActive] = useState<InquiryItem | null>(null);
  const [shown, setShown] = useState(PAGE_SIZE);
  const close = useCallback(() => setActive(null), []);

  if (flights.length === 0) {
    return (
      <p className="empty-note">
        No flights match that route. Try a different city, or clear the search
        to see everything we fly.
      </p>
    );
  }

  const visible = flights.slice(0, shown);

  return (
    <>
      <div className="car-list flight-list">
        {visible.map((flight) => (
          <FlightRow key={flight.id} flight={flight} onSelect={setActive} />
        ))}
      </div>

      {shown < flights.length && (
        <button
          type="button"
          className="results-showmore"
          onClick={() => setShown((count) => count + PAGE_SIZE)}
        >
          Show more
        </button>
      )}

      <InquiryModal
        item={active}
        defaultDate={defaultDate}
        defaultTravelers={defaultTravelers}
        onClose={close}
      />
    </>
  );
}
