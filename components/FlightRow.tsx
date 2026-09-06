'use client';

import type { Flight } from '@/lib/types';
import { PlaneIcon } from './icons';
import type { InquiryItem } from './InquiryModal';

export default function FlightRow({
  flight,
  onSelect,
}: {
  flight: Flight;
  onSelect: (item: InquiryItem) => void;
}) {
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
        <PlaneIcon />
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

      <div className="flight-row-cabin">{flight.cabin}</div>

      <div className="flight-row-price">
        <span className="price-pill">
          {flight.price} <small>/ traveler</small>
        </span>
        <button className="btn btn-primary btn-book" type="button" onClick={handleSelect}>
          Select
        </button>
      </div>
    </article>
  );
}
