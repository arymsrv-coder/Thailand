'use client';

import { useCallback, useState } from 'react';
import type { Car } from '@/lib/types';
import CarCard from './CarCard';
import InquiryModal, { type InquiryItem } from './InquiryModal';

/** How many cars show before "Show more", as the reference pages a long list. */
const PAGE_SIZE = 6;

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
  const [shown, setShown] = useState(PAGE_SIZE);
  const close = useCallback(() => setActive(null), []);

  if (cars.length === 0) {
    return (
      <p className="empty-note">
        No cars match that search. Try a different pick-up point or car type,
        or clear the search to see everything we cover.
      </p>
    );
  }

  const visible = cars.slice(0, shown);

  return (
    <>
      <div className="car-list">
        {visible.map((car) => (
          <CarCard key={car.id} car={car} onSelect={setActive} />
        ))}
      </div>

      {shown < cars.length && (
        <button
          type="button"
          className="results-showmore"
          onClick={() => setShown((count) => count + PAGE_SIZE)}
        >
          Show more
        </button>
      )}

      <InquiryModal
        item={active}
        defaultDate={defaultDate}
        defaultTravelers={defaultTravelers}
        onClose={close}
      />
    </>
  );
}
