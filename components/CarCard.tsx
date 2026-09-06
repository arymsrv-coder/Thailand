'use client';

import Image from 'next/image';
import { CheckCircleIcon, GuestsIcon, HeartIcon, InfoIcon, PinIcon } from './icons';
import type { InquiryItem } from './InquiryModal';
import type { Car } from '@/lib/types';

export default function CarCard({
  car,
  isBestValue,
  onSelect,
}: {
  car: Car;
  isBestValue: boolean;
  onSelect: (item: InquiryItem) => void;
}) {
  function handleSelect() {
    onSelect({
      kind: 'car',
      id: car.id,
      label: car.model,
      subtitle: `${car.category} · ${car.transmission} · ${car.seats} seats · ${car.location}`,
      price: `${car.pricePerDay} / day`,
    });
  }

  return (
    <article className="car-row">
      <div className="car-row-photo">
        <Image src={car.image} alt={car.imageAlt} fill sizes="180px" style={{ objectFit: 'cover' }} />
        {/* Decorative only — this site has no saved-cars feature to back a real toggle. */}
        <span className="car-row-heart">
          <HeartIcon width={16} height={16} />
        </span>
      </div>

      <div className="car-row-body">
        {isBestValue && <span className="deal-badge">Great deal</span>}
        <h3>{car.category}</h3>
        <p className="car-row-model">{car.model}</p>
        <ul className="car-row-meta">
          <li>
            <GuestsIcon width={15} height={15} /> {car.seats}
          </li>
          <li>{car.transmission}</li>
        </ul>
        <p className="car-row-mileage">
          <InfoIcon width={14} height={14} /> Unlimited mileage
        </p>
        <p className="car-row-location">
          <PinIcon width={14} height={14} /> {car.location}
        </p>
      </div>

      <div className="car-row-perks">
        <p className="car-row-perk-primary">
          <CheckCircleIcon width={15} height={15} /> Free cancellation
        </p>
        <p>Online check-in</p>
        <p>Pay at pick-up</p>
        <p className="car-row-supplier">{car.supplier}</p>
      </div>

      <div className="car-row-price">
        <span className="car-row-price-value">{car.pricePerDay}</span>
        <span className="car-row-price-unit">per day</span>
        <span className="car-row-price-total">{car.pricePerDay} total</span>
        <button className="btn btn-primary" type="button" onClick={handleSelect}>
          Reserve
        </button>
      </div>
    </article>
  );
}
