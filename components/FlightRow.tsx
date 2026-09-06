'use client';

import { useState } from 'react';
import type { Flight } from '@/lib/types';
import type { InquiryItem } from './InquiryModal';

/** A small set of brand-neutral colours, picked deterministically per
 *  airline name so the same airline always gets the same colour. */
const LOGO_COLORS = ['#0E6E86', '#C0511F', '#6B6459', '#0A4F60', '#8A5A2B'];

function logoColor(airline: string): string {
  let hash = 0;
  for (let i = 0; i < airline.length; i += 1) hash = (hash * 31 + airline.charCodeAt(i)) >>> 0;
  return LOGO_COLORS[hash % LOGO_COLORS.length];
}

export default function FlightRow({
  flight,
  onSelect,
}: {
  flight: Flight;
  onSelect: (item: InquiryItem) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  function handleSelect() {
    onSelect({
      kind: 'flight',
      id: flight.id,
      label: `${flight.airline} ${flight.flightNumber}`,
      subtitle: `${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode}) · ${flight.cabin}`,
      price: `${flight.price} / traveler`,
    });
  }

  return (
    <article className="flight-row">
      <div className="flight-row-airline">
        <span className="flight-row-logo" style={{ background: logoColor(flight.airline) }}>
          {flight.airline.charAt(0)}
        </span>
        <div>
          <strong>{flight.airline}</strong>
          <span>{flight.flightNumber}</span>
        </div>
      </div>

      <div className="flight-row-route">
        <div className="flight-row-time">
          <strong>{flight.departTime}</strong>
          <span>{flight.fromCode}</span>
        </div>
        <div className="flight-row-duration">
          <span>{flight.duration}</span>
          <div className="flight-row-line" />
          <span>{flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop`}</span>
        </div>
        <div className="flight-row-time">
          <strong>{flight.arriveTime}</strong>
          <span>{flight.toCode}</span>
        </div>
      </div>

      <div className="flight-row-price">
        <span className="price-pill">
          {flight.price} <small>/ traveler</small>
        </span>
        <button className="btn btn-primary btn-book" type="button" onClick={handleSelect}>
          Select
        </button>
      </div>

      <button
        type="button"
        className="flight-row-details-toggle"
        aria-expanded={showDetails}
        onClick={() => setShowDetails((open) => !open)}
      >
        {showDetails ? 'Hide details' : 'Flight details'}
      </button>

      {showDetails && (
        <div className="flight-row-details">
          <p>Cabin: {flight.cabin}</p>
          <p>Flight {flight.flightNumber}</p>
        </div>
      )}
    </article>
  );
}
