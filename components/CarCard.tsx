'use client';

import type { Car } from '@/lib/types';
import { CarIcon } from './icons';
import type { InquiryItem } from './InquiryModal';

export default function CarCard({
  car,
  onSelect,
}: {
  car: Car;
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
    <article className="car-card">
      <div className="car-card-icon">
        <CarIcon width={28} height={28} />
      </div>
      <div className="car-card-body">
        <span className="car-category-badge">{car.category}</span>
        <h3>{car.model}</h3>
        <p className="car-card-meta">
          {car.transmission} · {car.seats} seats · {car.supplier}
        </p>
        <p className="car-card-location">{car.location}</p>
        <div className="tour-footer">
          <span className="tour-price price-pill">
            {car.pricePerDay} <small>/ day</small>
          </span>
          <button className="btn btn-primary btn-book" type="button" onClick={handleSelect}>
            Select
          </button>
        </div>
      </div>
    </article>
  );
}
