'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Car } from '@/lib/types';
import CarCard from './CarCard';
import InquiryModal, { type InquiryItem } from './InquiryModal';

/** "$18" -> 18, for finding the cheapest car to flag as the best value. */
function priceValue(price: string): number {
  return Number.parseFloat(price.replace(/[^0-9.]/g, '')) || Infinity;
}

export default function CarsResults({
  cars,
  defaultDate,
  defaultTravelers,
}: {
  cars: Car[];
  defaultDate?: string;
  defaultTravelers?: number;
}) {
  const [active, setActive] = useState<InquiryItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  const bestValueId = useMemo(() => {
    if (cars.length < 2) return null;
    return cars.reduce((cheapest, car) =>
      priceValue(car.pricePerDay) < priceValue(cheapest.pricePerDay) ? car : cheapest
    ).id;
  }, [cars]);

  if (cars.length === 0) {
    return (
      <p className="empty-note">
        No cars at that location. Try a different pick-up point, or clear the
        search to see every location we cover.
      </p>
    );
  }

  return (
    <>
      <div className="car-list">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} isBestValue={car.id === bestValueId} onSelect={setActive} />
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
