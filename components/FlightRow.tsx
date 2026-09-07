'use client';

import Image from 'next/image';
import { flightDiscountPercent, isFlightGreatDeal, ratingLabel } from '@/lib/catalog';
import type { Flight } from '@/lib/types';
import { CheckCircleIcon, GuestsIcon, HeartIcon, InfoIcon, PinIcon } from './icons';
import type { InquiryItem } from './InquiryModal';

/** A small set of brand-neutral colours, picked deterministically per airline
 *  name so the same airline always carries the same chip over its photo. */
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
  const discount = flightDiscountPercent(flight);
  const bags = flight.checkedBag
    ? `${flight.carryOn} + 1 checked bag included`
    : `${flight.carryOn} included`;

  function handleSelect() {
    onSelect({
      kind: 'flight',
      id: flight.id,
      label: `${flight.airline} ${flight.flightNumber}`,
      subtitle: `${flight.fromCity} (${flight.fromCode}) → ${flight.toCity} (${flight.toCode}) · ${flight.cabin}`,
      price: `${flight.price} / traveler`,
      image: flight.image,
    });
  }

  return (
    <article className="car-row flight-row">
      <div className="car-row-photo flight-row-photo">
        {/* The destination this flight lands at, not the aircraft — it is the
            part of the trip the traveller is actually choosing between. */}
        <Image
          src={flight.image}
          alt={flight.imageAlt}
          fill
          sizes="180px"
          style={{ objectFit: 'cover' }}
        />
        <span
          className="flight-row-carrier"
          style={{ background: logoColor(flight.airline) }}
          title={flight.airline}
        >
          {flight.airlineCode}
        </span>
        {/* Decorative only — this site has no saved-flights feature to back a real toggle. */}
        <span className="car-row-heart">
          <HeartIcon width={16} height={16} />
        </span>
      </div>

      <div className="car-row-body">
        {(isFlightGreatDeal(flight) || flight.wasPrice) && (
          <p className="car-row-badges">
            {isFlightGreatDeal(flight) && <span className="deal-badge">Great Deal</span>}
            {flight.wasPrice && <span className="deal-badge deal-badge-sale">Sale</span>}
          </p>
        )}
        {flight.stops === 0 && <p className="car-row-eyebrow">Nonstop</p>}
        <h3>
          {flight.departTime} – {flight.arriveTime}
        </h3>
        <p className="car-row-model">
          {flight.airline} {flight.flightNumber} · {flight.aircraft}
        </p>
        <ul className="car-row-meta">
          <li>
            <GuestsIcon width={15} height={15} /> {flight.cabin}
          </li>
          <li>
            {flight.duration} · {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop`}
          </li>
        </ul>
        <p className="car-row-mileage">
          <InfoIcon width={14} height={14} /> {bags}
        </p>
        <p className="car-row-location">
          <PinIcon width={14} height={14} />
          <span>
            {flight.fromCity} ({flight.fromCode})
            <br />
            {flight.fromAirport}, {flight.terminal}
            <br />
            Arrives {flight.toAirport} ({flight.toCode})
          </span>
        </p>
      </div>

      <div className="car-row-perks">
        {flight.refundable && (
          <p className="car-row-perk-primary">
            <CheckCircleIcon width={15} height={15} /> Free cancellation
          </p>
        )}
        {flight.onlineCheckIn && <p>Online check-in</p>}
        <p>{flight.payNow ? 'Pay now and save' : 'Pay at the airport'}</p>
        <div className="car-row-rating">
          <span className="car-row-rating-supplier">{flight.airline}</span>
          <span
            className={`car-row-rating-score${flight.ratingPercent < 70 ? ' is-muted' : ''}`}
          >
            {flight.ratingPercent}%
          </span>
          <span className="car-row-rating-words">
            <strong>{ratingLabel(flight.ratingPercent)}</strong>
            {flight.reviewCount} reviews
          </span>
        </div>
      </div>

      <div className="car-row-price">
        {discount !== null && <span className="car-row-price-off">{discount}% off</span>}
        <span className="car-row-price-value">{flight.price}</span>
        <span className="car-row-price-unit">per traveler</span>
        <span className="car-row-price-total">
          {flight.wasPrice && <s>{flight.wasPrice}</s>} {flight.totalPrice} total
        </span>
        <button className="btn btn-primary" type="button" onClick={handleSelect}>
          Reserve
        </button>
      </div>
    </article>
  );
}
