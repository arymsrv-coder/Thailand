'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { activitySections } from '@/lib/catalog';
import type { ActivityCategorySlug, SearchQuery, Tour } from '@/lib/types';
import BookingModal from '../BookingModal';
import ActivityCard from './ActivityCard';

/** How many cards a section shows before its "See all" link. */
const SECTION_SIZE = 6;

/**
 * Everything below the toolbar: the numbered "Top things to do" grid, then one
 * grid per activity category, an interstitial link, and a final catch-all
 * section — the same run of blocks the reference lays out.
 *
 * A single booking modal serves every card on the page.
 */
export default function ActivityResults({
  tours,
  query,
  categoryFilter,
  categoryHrefs,
}: {
  tours: Tour[];
  query: SearchQuery;
  /** Set when the sidebar has narrowed to one category, which collapses the page to a single grid. */
  categoryFilter: string;
  /** Category slug -> the href that narrows the page to it. Built on the server,
   *  because a function cannot cross into a Client Component. */
  categoryHrefs: Record<ActivityCategorySlug, string>;
}) {
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [topShown, setTopShown] = useState(SECTION_SIZE);
  const closeModal = useCallback(() => setActiveTour(null), []);

  if (tours.length === 0) {
    return (
      <p className="empty-note">
        Nothing matches those filters. Some island trips also pause for the
        monsoon between May and October — widen the dates, or clear the filters
        to see everything we run.
      </p>
    );
  }

  const sections = activitySections(tours);

  // One category selected: show that single grid rather than repeating it.
  if (categoryFilter) {
    return (
      <>
        <section className="act-section">
          <h2>{sections[0]?.label ?? 'Things to do'}</h2>
          <div className="act-grid">
            {tours.map((tour) => (
              <ActivityCard key={tour.id} tour={tour} onBook={setActiveTour} />
            ))}
          </div>
        </section>
        <BookingModal tour={activeTour} query={query} onClose={closeModal} />
      </>
    );
  }

  const top = tours.slice(0, topShown);
  // The tail section picks up whatever the themed grids did not already show.
  const shownInSections = new Set(
    sections.flatMap((section) => section.tours.slice(0, SECTION_SIZE).map((tour) => tour.id))
  );
  const remaining = tours.filter((tour) => !shownInSections.has(tour.id));

  return (
    <>
      <section className="act-section">
        <h2>Top things to do</h2>
        <div className="act-grid">
          {top.map((tour, index) => (
            <ActivityCard key={tour.id} tour={tour} rank={index + 1} onBook={setActiveTour} />
          ))}
        </div>
        {topShown < tours.length && (
          <div className="act-section-more">
            <button
              type="button"
              className="act-see-more"
              onClick={() => setTopShown((count) => count + SECTION_SIZE)}
            >
              See more
            </button>
          </div>
        )}
      </section>

      {sections.map((section, index) => (
        <div key={section.slug}>
          <section className="act-section">
            <h2>{section.label}</h2>
            <div className="act-grid">
              {section.tours.slice(0, SECTION_SIZE).map((tour) => (
                <ActivityCard key={tour.id} tour={tour} onBook={setActiveTour} />
              ))}
            </div>
            {section.tours.length > SECTION_SIZE && (
              <div className="act-section-more">
                <Link className="act-see-more" href={categoryHrefs[section.slug]}>
                  See all {section.tours.length} {section.label.toLowerCase()} activities
                </Link>
              </div>
            )}
          </section>

          {/* The reference drops a service link in after the first themed block. */}
          {index === 0 && (
            <aside className="act-interstitial">
              <p>Need a car between the airport and your hotel?</p>
              <Link href="/cars">Browse car rental</Link>
            </aside>
          )}
        </div>
      ))}

      {remaining.length > 0 && (
        <section className="act-section">
          <h2>Continue exploring Thailand</h2>
          <div className="act-grid">
            {remaining.slice(0, SECTION_SIZE).map((tour) => (
              <ActivityCard key={tour.id} tour={tour} onBook={setActiveTour} />
            ))}
          </div>
        </section>
      )}

      {/* Dates and party size already chosen carry into the booking form. */}
      <BookingModal tour={activeTour} query={query} onClose={closeModal} />
    </>
  );
}
