'use client';

import { useCallback, useState } from 'react';
import type { Flight } from '@/lib/types';
import FlightRow from './FlightRow';
import InquiryModal, { type InquiryItem } from './InquiryModal';

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
  const close = useCallback(() => setActive(null), []);

  if (flights.length === 0) {
    return (
      <p className="empty-note">
        No flights match that route. Try a different city, or clear the search
        to see everything we fly.
      </p>
    );
  }

  return (
    <>
      <div className="flight-list">
        {flights.map((flight) => (
          <FlightRow key={flight.id} flight={flight} onSelect={setActive} />
        ))}
      </div>
      <InquiryModal
        item={active}
        defaultDate={defaultDate}
        defaultTravelers={defaultTravelers}
        onClose={close}
      />
    </>
  );
}
