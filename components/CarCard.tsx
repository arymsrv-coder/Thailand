'use client';

import type { Car } from '@/lib/types';
import { CarIcon, GuestsIcon, PinIcon, ShieldCheckIcon } from './icons';
import type { InquiryItem } from './InquiryModal';

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
      <div className="car-row-icon">
        <CarIcon width={30} height={30} />
      </div>

      <div className="car-row-body">
        <span className="car-category-badge">{car.category}</span>
        <h3>{car.model}</h3>
        <ul className="car-row-meta">
          <li>
            <GuestsIcon width={15} height={15} /> {car.seats} seats
          </li>
          <li>{car.transmission}</li>
          <li>{car.supplier}</li>
        </ul>
        <p className="car-row-location">
          <PinIcon width={14} height={14} /> {car.location}
        </p>
      </div>

      <div className="car-row-perks">
        <p>
          <ShieldCheckIcon width={16} height={16} /> Free cancellation
        </p>
        <p>
          <ShieldCheckIcon width={16} height={16} /> Pay at pick-up
        </p>
      </div>

      <div className="car-row-price">
        {isBestValue && <span className="deal-badge">Best value</span>}
        <span className="price-pill">
          {car.pricePerDay} <small>/ day</small>
        </span>
        <button className="btn btn-primary btn-book" type="button" onClick={handleSelect}>
          Select
        </button>
      </div>
    </article>
  );
}
