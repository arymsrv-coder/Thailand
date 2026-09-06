'use client';

import { useCallback, useState } from 'react';
import type { Car } from '@/lib/types';
import CarCard from './CarCard';
import InquiryModal, { type InquiryItem } from './InquiryModal';

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
      <div className="car-grid">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} onSelect={setActive} />
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
