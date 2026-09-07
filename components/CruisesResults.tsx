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

  // Group by water, so the three coasts read as separate runs rather than one
  // undifferentiated grid. Order follows the catalogue, not the alphabet.
  const regions: { region: string; sailings: Cruise[] }[] = [];
  for (const cruise of cruises) {
    const existing = regions.find((entry) => entry.region === cruise.region);
    if (existing) existing.sailings.push(cruise);
    else regions.push({ region: cruise.region, sailings: [cruise] });
  }

  return (
    <>
      {regions.map(({ region, sailings }) => (
        <section key={region} className="act-section">
          <h2>
            {region}
            <span className="cruise-region-count">
              {sailings.length} {sailings.length === 1 ? 'sailing' : 'sailings'}
            </span>
          </h2>
          <div className="cruise-grid">
            {sailings.map((cruise) => (
              <CruiseCard key={cruise.id} cruise={cruise} onSelect={setActive} />
            ))}
          </div>
        </section>
      ))}

      <InquiryModal
        item={active}
        defaultDate={defaultDate}
        defaultTravelers={defaultTravelers}
        onClose={close}
      />
    </>
  );
}
