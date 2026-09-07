'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import type { PackageSection } from '@/lib/catalog';
import InquiryModal, { type InquiryItem } from './InquiryModal';
import PackageDealRow from './PackageDealRow';
import PackageSectionFilters from './PackageSectionFilters';

type RawQuery = Record<string, string | string[] | undefined>;

/**
 * The deal sections, one per destination — each with its own heading, filter
 * pills and "View all trips" footer, as the reference lays them out. The
 * inquiry modal lives here so a single instance serves every row on the page.
 */
export default function PackagesResults({
  sections,
  query,
  defaultDate,
  defaultTravelers,
}: {
  sections: PackageSection[];
  query: RawQuery;
  defaultDate?: string;
  defaultTravelers?: number;
}) {
  const [active, setActive] = useState<InquiryItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  if (sections.length === 0) {
    return (
      <p className="empty-note">
        No packages go there yet. Try a different destination, or clear the
        search to see every package we offer.
      </p>
    );
  }

  return (
    <>
      {sections.map((section) => (
        <section key={section.slug} className="deal-section">
          <h2>{section.heading}</h2>
          <p className="deal-section-sub">
            Prices are per person, based on two sharing. From {section.fromPrice}.
          </p>

          <PackageSectionFilters
            selects={section.selects}
            filtered={section.filtered}
            query={query}
          />

          {section.deals.length === 0 ? (
            <p className="empty-note">
              Nothing in {section.name} matches those filters. Remove them to see all{' '}
              {section.name} packages.
            </p>
          ) : (
            <div className="deal-list">
              {section.deals.map((pkg) => (
                <PackageDealRow key={pkg.id} pkg={pkg} onSelect={setActive} />
              ))}
            </div>
          )}

          <p className="deal-section-more">
            Don&rsquo;t see what you&rsquo;re looking for?{' '}
            <Link href={`/things-to-do?where=${section.slug}`}>View all trips</Link>
          </p>
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
