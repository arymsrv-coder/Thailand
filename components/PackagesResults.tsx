'use client';

import { useCallback, useState } from 'react';
import type { PackageDeal } from '@/lib/types';
import InquiryModal, { type InquiryItem } from './InquiryModal';
import PackageCard from './PackageCard';

export default function PackagesResults({
  packages,
  defaultDate,
  defaultTravelers,
}: {
  packages: PackageDeal[];
  defaultDate?: string;
  defaultTravelers?: number;
}) {
  const [active, setActive] = useState<InquiryItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  if (packages.length === 0) {
    return (
      <p className="empty-note">
        No packages go there yet. Try a different destination, or clear the
        search to see every package we offer.
      </p>
    );
  }

  return (
    <>
      <div className="tour-grid">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} onSelect={setActive} />
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
