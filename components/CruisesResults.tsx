'use client';

import { useCallback, useState } from 'react';
import type { Cruise } from '@/lib/types';
import CruiseCard from './CruiseCard';
import InquiryModal, { type InquiryItem } from './InquiryModal';

export default function CruisesResults({
  cruises,
  defaultDate,
  defaultTravelers,
}: {
  cruises: Cruise[];
  defaultDate?: string;
  defaultTravelers?: number;
}) {
  const [active, setActive] = useState<InquiryItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  if (cruises.length === 0) {
    return (
      <p className="empty-note">
        No sailings match that region. Try a different destination, or clear
        the search to see every route we sail.
      </p>
    );
  }

  return (
    <>
      <div className="tour-grid">
        {cruises.map((cruise) => (
          <CruiseCard key={cruise.id} cruise={cruise} onSelect={setActive} />
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
