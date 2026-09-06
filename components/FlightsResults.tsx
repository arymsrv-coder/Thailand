'use client';

import { Fragment, useCallback, useState } from 'react';
import type { Flight } from '@/lib/types';
import FlightRow from './FlightRow';
import FlightsPromoBanner from './FlightsPromoBanner';
import InquiryModal, { type InquiryItem } from './InquiryModal';

export default function FlightsResults({
  flights,
  defaultDate,
  defaultTravelers,
  /** Index (0-based) after which the flight+hotel promo banner is inserted. */
  promoAfterIndex,
}: {
  flights: Flight[];
  defaultDate?: string;
  defaultTravelers?: number;
  promoAfterIndex?: number;
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
        {flights.map((flight, index) => (
          <Fragment key={flight.id}>
            <FlightRow flight={flight} onSelect={setActive} />
            {promoAfterIndex === index && <FlightsPromoBanner />}
          </Fragment>
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
